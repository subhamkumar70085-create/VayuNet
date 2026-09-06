'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { LanguageCode, translations } from '@/lib/translations';

// Declare Web Speech API globals for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface VoiceInputProps {
  language: LanguageCode;
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  language,
  onTranscript,
  className = '',
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindow) : null;
    const SpeechRecognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recog.onstart = () => {
        setIsListening(true);
        setErrorNotice(null);
      };

      recog.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const text = event.results[0][0].transcript;
          if (text) {
            onTranscript(text);
          }
        }
      };

      recog.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorNotice(language === 'hi' ? 'माइक्रोफ़ोन अनुमति आवश्यक है' : 'Microphone access denied');
        } else if (event.error === 'no-speech') {
          setErrorNotice(language === 'hi' ? 'कोई आवाज नहीं सुनी गई' : 'No speech detected');
        }
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    } catch (e) {
      console.warn('Failed to initialize SpeechRecognition:', e);
      setIsSupported(false);
    }
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.start();
      } catch (err) {
        console.warn('Recognition start exception:', err);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-[11px] text-slate-400 italic flex items-center gap-1 ${className}`}>
        <MicOff className="w-3.5 h-3.5 text-slate-400" />
        <span>Voice dictation not supported in this browser.</span>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
          isListening
            ? 'bg-rose-600 text-white shadow-md ring-4 ring-rose-200 animate-pulse'
            : 'bg-slate-100 hover:bg-slate-200 text-[#0a2540] border border-slate-300'
        }`}
        title={isListening ? 'Stop voice recording' : t.speakPrompt}
        aria-pressed={isListening}
      >
        <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce' : 'text-[#0a2540]'}`} />
        <span>{isListening ? t.listening : t.voiceButton}</span>
        <span className="text-[10px] font-mono opacity-75">
          ({language === 'hi' ? 'हिंदी' : 'EN'})
        </span>
      </button>

      {errorNotice && (
        <p className="text-[11px] text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{errorNotice}</span>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
