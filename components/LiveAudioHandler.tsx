import React, { useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface LiveAudioHandlerProps {
  onTranscription: (text: string) => void;
  onError: (error: string) => void;
}

// --- Audio Utility Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const LiveAudioHandler: React.FC<LiveAudioHandlerProps> = ({ onTranscription, onError }) => {
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    let inputAudioContext: AudioContext;
    let stream: MediaStream;

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        sessionPromiseRef.current = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: async () => {
              console.log('Live session opened.');
              stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              // FIX: Cast window to `any` to allow access to the prefixed `webkitAudioContext` for Safari compatibility.
              inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
              
              const source = inputAudioContext.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                
                if (sessionPromiseRef.current) {
                    sessionPromiseRef.current.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                }
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.inputTranscription) {
                const text = message.serverContent.inputTranscription.text;
                if (text) {
                  onTranscription(text);
                }
              }
            },
            onerror: (e: ErrorEvent) => {
              console.error('Live session error:', e);
              onError('An error occurred with the voice session.');
            },
            onclose: (e: CloseEvent) => {
              console.log('Live session closed.');
            },
          },
          config: {
            inputAudioTranscription: {},
          },
        });
      } catch (error) {
        console.error('Failed to start live session:', error);
        onError('Could not start voice session. Please check microphone permissions.');
      }
    };

    startSession();

    return () => {
      // Cleanup function
      if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => {
          if (session) {
            session.close();
          }
        }).catch(err => console.error("Error closing session:", err));
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (inputAudioContext) {
        inputAudioContext.close();
      }
    };
  }, [onTranscription, onError]);

  return null; // This is a non-visual component
};
