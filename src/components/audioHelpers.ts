/**
 * Converts a Float32 audio buffer to a 16-bit linear PCM (Int16Array).
 */
export function Float32ToInt16(buffer: Float32Array): Int16Array {
  const l = buffer.length;
  const buf = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clip audio signal to avoid wrapping distortion
    const s = Math.max(-1, Math.min(1, buffer[i]));
    buf[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return buf;
}

/**
 * Encodes an ArrayBuffer (or view) to a base64 string.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Resamples an audio buffer from the browser's input sample rate (e.g., 44100 or 48000)
 * to the model's required output sample rate (16000).
 */
export function downsampleBuffer(
  buffer: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number
): Float32Array {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }
  
  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  
  return result;
}

/**
 * High-performance player that queues and schedules incoming 24kHz PCM audio chunks
 * to play back seamlessly without gaps or popping.
 */
export class AudioQueuePlayer {
  private audioContext: AudioContext | null = null;
  private nextPlayTime: number = 0;
  private isPlaying: boolean = false;
  private sourceNodes: AudioBufferSourceNode[] = [];
  
  constructor() {}
  
  /**
   * Initializes the AudioContext if not already created.
   */
  private initContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.nextPlayTime = this.audioContext.currentTime;
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Queues an base64-encoded 24kHz Int16 PCM chunk for playback.
   */
  public playChunk(base64Data: string) {
    this.initContext();
    if (!this.audioContext) return;

    // 1. Decode base64 to raw bytes
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Interpret as Int16 (16-bit linear PCM)
    const int16Buffer = new Int16Array(bytes.buffer);
    const float32Buffer = new Float32Array(int16Buffer.length);
    
    // Convert Int16 back to Float32 [-1.0, 1.0]
    for (let i = 0; i < int16Buffer.length; i++) {
      float32Buffer[i] = int16Buffer[i] / 32768.0;
    }

    // 3. Create audio buffer (1 channel, 24000Hz sampling rate from Gemini output)
    const audioBuffer = this.audioContext.createBuffer(1, float32Buffer.length, 24000);
    audioBuffer.getChannelData(0).set(float32Buffer);

    // 4. Create source node and connect to speakers
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.audioContext.destination);

    // 5. Schedule playback
    const currentTime = this.audioContext.currentTime;
    // If we've drifted behind, reset the timeline to current time
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime + 0.05; // 50ms safety buffer
    }

    sourceNode.start(this.nextPlayTime);
    this.sourceNodes.push(sourceNode);

    // Increment next play position by the exact duration of the buffer
    this.nextPlayTime += audioBuffer.duration;
    this.isPlaying = true;
    
    // Clean up node references once played to avoid memory leakage
    sourceNode.onended = () => {
      const index = this.sourceNodes.indexOf(sourceNode);
      if (index > -1) {
        this.sourceNodes.splice(index, 1);
      }
      if (this.sourceNodes.length === 0) {
        this.isPlaying = false;
      }
    };
  }

  /**
   * Immediately stops all active playing buffers and resets scheduling.
   * Crucial for user "barge-in".
   */
  public stop() {
    // Cancel and stop all scheduled buffer sources
    this.sourceNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // Source node might not have started yet, catch error silently
      }
    });
    this.sourceNodes = [];
    
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    this.isPlaying = false;
  }

  /**
   * Closes the entire audio output channel.
   */
  public destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
