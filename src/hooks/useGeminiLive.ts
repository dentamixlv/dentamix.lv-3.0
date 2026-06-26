'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import {
  Float32ToInt16,
  arrayBufferToBase64,
  downsampleBuffer,
  AudioQueuePlayer
} from '../components/audioHelpers';

interface UseGeminiLiveProps {
  conversationId: Id<"conversations"> | null;
  onTranscriptSaved?: () => void;
  locale?: string;
}

const NOISE_GATE_THRESHOLD = 0.003; // RMS volume threshold for speech vs silence
const SILENCE_TIMEOUT_MS = 15000;    // 15 seconds of silence before saying goodbye

export function useGeminiLive({ conversationId, onTranscriptSaved, locale = 'lv' }: UseGeminiLiveProps) {
  const isEn = locale.startsWith('en');

  // Convex Action for WebSocket Url
  const getVoiceConfig = useAction(api.assistant.getVoiceConfig);
  const saveMessage = useMutation(api.messages.send);

  // States
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const playerRef = useRef<AudioQueuePlayer | null>(null);
  const isMutedRef = useRef(false);

  // Transcripts accumulation during the live turn
  const currentModelTranscriptRef = useRef('');
  const currentUserTranscriptRef = useRef('');
  const activeConversationIdRef = useRef<Id<"conversations"> | null>(null);
  const lastActiveTimeRef = useRef(Date.now());
  const isGoodbyeTriggeredRef = useRef(false);
  const goodbyeIntervalRef = useRef<any>(null);
  const lastSpeechTimeRef = useRef(Date.now());

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (goodbyeIntervalRef.current) {
      clearInterval(goodbyeIntervalRef.current);
      goodbyeIntervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => { });
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    isGoodbyeTriggeredRef.current = false;
    setIsCallActive(false);
    setIsConnecting(false);
    setVolumeLevel(0);
  };

  const startCall = async (overrideConversationId?: Id<"conversations">) => {
    setIsConnecting(true);
    setError(null);
    const activeId = overrideConversationId || conversationId;
    if (!activeId) {
      setError(isEn ? 'No active conversation session.' : 'Nav aktīvas sarunas sesijas.');
      setIsConnecting(false);
      return;
    }

    activeConversationIdRef.current = activeId;
    lastActiveTimeRef.current = Date.now();
    lastSpeechTimeRef.current = Date.now();
    isGoodbyeTriggeredRef.current = false;

    try {
      const config = await getVoiceConfig({ locale });
      if (!config?.wsUrl) {
        throw new Error(isEn ? 'Voice configuration is empty.' : 'Balss konfigurācija ir tukša.');
      }

      // 1. Get microphone stream permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      micStreamRef.current = stream;

      // 2. Initialize incoming Audio Queue Player
      playerRef.current = new AudioQueuePlayer();

      // 3. Connect to the WebSocket
      const socket = new WebSocket(config.wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnecting(false);
        setIsCallActive(true);

        // 4. Send initial Setup payload
        const setupMessage = {
          setup: {
            model: "models/gemini-2.5-flash-native-audio-latest",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Callirrhoe" // Female voice - easy-going
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{
                text: config.systemInstruction || (isEn
                  ? "You are a professional and polite assistant for Dentamix Dental Clinic. Speak briefly, provide concise answers in the language user speaks."
                  : "Tu esi Dentamix zobārstniecības klīnikas profesionāls asistents. Runā īsi, sniedz kodolīgas atbildes valodā kādā runālietotājs.")
              }]
            }
          }
        };
        socket.send(JSON.stringify(setupMessage));

        // 5a. Send a greeting trigger so the AI speaks first
        //     We use a short delay to let the setup message be processed
        setTimeout(() => {
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const greetingTrigger = {
              clientContent: {
                turns: [{
                  role: "user",
                  parts: [{
                    text: isEn
                      ? "Hello"
                      : "Sveiki"
                  }]
                }],
                turnComplete: true
              }
            };
            socketRef.current.send(JSON.stringify(greetingTrigger));
          }
        }, 300);

        // 5b. Start capturing and downsampling microphone audio
        startRecording(stream);
      };

      socket.onmessage = async (event) => {
        try {
          let data;
          if (event.data instanceof Blob) {
            data = JSON.parse(await event.data.text());
          } else {
            data = JSON.parse(event.data);
          }

          // Handle incoming audio data chunks
          if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              // Play audio chunks
              if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                playerRef.current?.playChunk(part.inlineData.data);
              }
              // Accumulate AI speech transcripts
              if (part.text) {
                currentModelTranscriptRef.current += part.text;
              }
            }
          }

          // Handle server-side user/client input transcription (if sent by Gemini)
          if (data.serverContent?.userTurn?.parts) {
            for (const part of data.serverContent.userTurn.parts) {
              if (part.text) {
                currentUserTranscriptRef.current += part.text;
              }
            }
          }

          // If turn is complete, flush transcripts to Convex
          if (data.serverContent?.turnComplete) {
            const aiText = currentModelTranscriptRef.current.trim();
            const userText = currentUserTranscriptRef.current.trim();

            if (userText) {
              await saveMessage({
                conversationId: activeConversationIdRef.current || conversationId,
                role: 'user',
                content: userText,
                source: 'voice'
              });
              currentUserTranscriptRef.current = '';
            }

            if (aiText) {
              await saveMessage({
                conversationId: activeConversationIdRef.current || conversationId,
                role: 'assistant',
                content: aiText,
                source: 'voice'
              });
              currentModelTranscriptRef.current = '';
            }

            if (onTranscriptSaved) {
              onTranscriptSaved();
            }

            if (isGoodbyeTriggeredRef.current) {
              // Wait for the audio queue to play the goodbye audio before hanging up
              goodbyeIntervalRef.current = setInterval(() => {
                const isPlaying = playerRef.current?.isPlaying || false;
                if (!isPlaying) {
                  if (goodbyeIntervalRef.current) {
                    clearInterval(goodbyeIntervalRef.current);
                    goodbyeIntervalRef.current = null;
                  }
                  endCall();
                }
              }, 200);
            }
          }

          // Handle Server Barge-in (If server detects client speaking over AI model)
          if (data.serverContent?.interrupted) {
            playerRef.current?.stop();
            currentModelTranscriptRef.current = ''; // Discard interrupted text segment
          }

        } catch (err) {
          console.error("Error processing WebSocket message:", err);
        }
      };

      socket.onerror = (e) => {
        console.error("Gemini WebSocket error:", e);
        setError(isEn ? 'Call connection encountered an error.' : 'Sarunas savienojumā radās kļūda.');
        cleanup();
      };

      socket.onclose = (event) => {
        console.warn(`Gemini WebSocket closed: code=${event.code}, reason=${event.reason}`);
        if (event.code !== 1000 && event.code !== 1005) {
          setError(isEn
            ? `Connection closed: ${event.reason || 'Unknown error'} (code ${event.code})`
            : `Savienojums slēgts: ${event.reason || 'Nezināma kļūda'} (kods ${event.code})`
          );
        }
        cleanup();
      };

    } catch (err: any) {
      console.error("Failed to start voice call:", err);
      const errMsg = err.data || err.message || (isEn ? 'Microphone access denied or connection failed.' : 'Piekļuve mikrofonam liegta vai savienojums neizdevās.');
      setError(errMsg);
      cleanup();
    }
  };

  const startRecording = (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);

    // Create processor node (buffer size 2048, 1 input channel, 1 output channel)
    const processor = audioContext.createScriptProcessor(2048, 1, 1);
    micProcessorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (isMutedRef.current || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        setVolumeLevel(0);
        return;
      }

      const inputBuffer = e.inputBuffer.getChannelData(0);

      // Compute input volume levels (RMS) for fluid wave animation
      let sum = 0;
      for (let i = 0; i < inputBuffer.length; i++) {
        sum += inputBuffer[i] * inputBuffer[i];
      }
      const rms = Math.sqrt(sum / inputBuffer.length);
      setVolumeLevel(Math.min(1, rms * 4)); // scale up sensitivity for visual display

      // Noise gate: skip sending audio when silent to save input tokens
      const isSilent = rms < NOISE_GATE_THRESHOLD;

      // Do not count silence while the assistant is speaking or when active user speech is detected
      const isAssistantSpeaking = playerRef.current?.isPlaying || false;
      if (isAssistantSpeaking || !isSilent) {
        lastActiveTimeRef.current = Date.now();
      }

      if (!isSilent) {
        lastSpeechTimeRef.current = Date.now();
      }

      // Check silence timeout (e.g. 15 seconds) to trigger goodbye message
      const silentDuration = Date.now() - lastActiveTimeRef.current;
      if (silentDuration > SILENCE_TIMEOUT_MS && !isGoodbyeTriggeredRef.current) {
        isGoodbyeTriggeredRef.current = true;
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          const goodbyeMessage = {
            clientContent: {
              turns: [{
                role: "user",
                parts: [{
                  text: isEn
                    ? "[The user has been silent for a while. Say a polite goodbye and then end the call.And invite to contact if they have any questions]"
                    : "[Lietotājs kādu laiku ir klusējis. Pieklājīgi pasaki uz redzēšanos un pabeidz sarunu. Un aicini sazināties, ja rodas jautājumi]"
                }]
              }],
              turnComplete: true
            }
          };
          socketRef.current.send(JSON.stringify(goodbyeMessage));
        }
      }

      // If silent, stop sending audio chunks to the server after a 1.0 second trailing silence buffer.
      // This trailing silence buffer is required for the server's Voice Activity Detection (VAD)
      // to identify that the user has stopped speaking and trigger the AI's response immediately.
      if (isSilent) {
        const timeSinceLastSpeech = Date.now() - lastSpeechTimeRef.current;
        if (timeSinceLastSpeech >= 1000) {
          return;
        }
      }

      // Downsample microphone rate (usually 44.1k or 48k) to 16kHz for Gemini
      const resampled = downsampleBuffer(inputBuffer, audioContext.sampleRate, 16000);

      // Convert Float32 resampled audio to 16-bit Int16 PCM
      const int16PCM = Float32ToInt16(resampled);

      // Encode PCM chunk to Base64 and send over WebSocket
      const base64Audio = arrayBufferToBase64(int16PCM.buffer as ArrayBuffer);

      const realtimeInputMessage = {
        realtimeInput: {
          mediaChunks: [
            {
              mimeType: "audio/pcm;rate=16000",
              data: base64Audio
            }
          ]
        }
      };

      socketRef.current.send(JSON.stringify(realtimeInputMessage));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  const endCall = () => {
    cleanup();
    setError(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    isCallActive,
    isConnecting,
    isMuted,
    volumeLevel,
    error,
    startCall,
    endCall,
    toggleMute
  };
}
