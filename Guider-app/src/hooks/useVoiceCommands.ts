import { useState, useCallback, useRef, useEffect } from 'react';

type CommandCallback = (command: string) => void;

const COMMANDS = ['next', 'previous', 'repeat', 'explain', 'stop', 'exit', 'help'] as const;

export function useVoiceCommands(enabled: boolean, onCommand: CommandCallback) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!enabled || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      const matched = COMMANDS.find((cmd) => transcript.includes(cmd));
      if (matched) {
        onCommand(matched);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [enabled, onCommand]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        console.warn('Voice recognition failed to start');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  return { listening, startListening, stopListening, supported: !!recognitionRef.current };
}
