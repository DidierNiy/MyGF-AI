
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { RecordingIcon } from './icons/RecordingIcon';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isBlocked?: boolean;
  placeholder?: string;
  isListening?: boolean;
  onToggleListening?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isBlocked = false, placeholder, isListening, onToggleListening }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150); // Max height ~6 lines
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = isLoading || isBlocked || isListening;

  const getPlaceholderText = () => {
    if (isListening) return "Listening...";
    if (placeholder) return placeholder;
    if (isBlocked) return "Please sign in to continue your conversation";
    return "Ask about properties, or click the mic to talk...";
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent backdrop-blur-sm animate-fade-in">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          {/* Container with glassmorphism effect */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">

            {/* Microphone Button */}
            <button
              type="button"
              onClick={onToggleListening}
              className={`absolute left-4 md:left-5 top-4 md:top-5 z-10 p-2 rounded-full transition-all duration-300 ${isListening
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse'
                  : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-110'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              title={isListening ? "Stop voice input" : "Start voice input (Beta)"}
              disabled={isLoading || isBlocked}
            >
              {isListening ? <RecordingIcon /> : <MicrophoneIcon />}
            </button>

            {/* Expandable Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderText()}
              rows={1}
              className="w-full pl-16 md:pl-[4.5rem] pr-16 md:pr-20 py-4 md:py-5 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '56px', maxHeight: '150px' }}
              disabled={isDisabled}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isDisabled || !text.trim()}
              className={`absolute right-3 md:right-4 bottom-3 md:bottom-4 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${text.trim() && !isDisabled
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-indigo-500/50 hover:scale-110 active:scale-95'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              <SendIcon className={text.trim() && !isDisabled ? 'animate-pulse' : ''} />
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-2 px-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className={`transition-opacity ${text.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
              {text.length} characters
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
