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
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
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

    try {
      const config = await getVoiceConfig();
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
            model: "models/gemini-2.5-flash",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede" // Premium female voice
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{
                text: isEn 
                  ? "You are Ieva, a warm and helpful AI voice assistant for Dentamix Dental Clinic in Latvia. Help patients book appointments, answer pricing queries, and explain treatments in a friendly, conversational tone. Be concise since you speak verbally. If the client speaks in Latvian, answer in Latvian. If they speak in English, answer in English."
                  : "Tu esi Ieva, sirsnīga un zinoša Dentamix zobārstniecības klīnikas mākslīgā intelekta balss asistente. Palīdzi pacientiem pieteikties vizītēm, atbildi uz cenu jautājumiem un izskaidro procedūras draudzīgā un vienkāršā valodā. Runā īsi un kodolīgi, jo saruna notiek mutiski. Vienmēr atbildi tajā pašā valodā, kurā klients uzrunā tevi (Latviski, Angliski vai Krieviski)."
              }]
            }
          }
        };
        socket.send(JSON.stringify(setupMessage));

        // 5. Start capturing and downsampling microphone audio
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
                content: userText
              });
              currentUserTranscriptRef.current = '';
            }
            
            if (aiText) {
              await saveMessage({
                conversationId: activeConversationIdRef.current || conversationId,
                role: 'assistant',
                content: aiText
              });
              currentModelTranscriptRef.current = '';
            }

            if (onTranscriptSaved) {
              onTranscriptSaved();
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

      socket.onclose = () => {
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

      // Downsample microphone rate (usually 44.1k or 48k) to 16kHz for Gemini
      const resampled = downsampleBuffer(inputBuffer, audioContext.sampleRate, 16000);
      
      // Convert Float32 resampled audio to 16-bit Int16 PCM
      const int16PCM = Float32ToInt16(resampled);

      // Encode PCM chunk to Base64 and send over WebSocket
      const base64Audio = arrayBufferToBase64(int16PCM.buffer);

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
