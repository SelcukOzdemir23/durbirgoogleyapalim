
import { useState, useEffect, useCallback, useRef } from 'react';

const useTypewriter = (text: string, getSpeed: () => number, start: boolean = false) => {
  const [displayText, setDisplayText] = useState('');
  const [isDoneTyping, setIsDoneTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    let active = true;
    // If not started or empty text, reset
    if (!start || text.length === 0) {
      setDisplayText('');
      setIsDoneTyping(false);
      return;
    }
    setDisplayText('');
    setIsDoneTyping(false);
    // Async typing loop
    (async () => {
      for (const char of text) {
        if (!active) break;
        setDisplayText(prev => prev + char);
        const pause = /[.!?]/.test(char) ? 200 + Math.random() * 300 : 0;
        await new Promise<void>(resolve => {
          timeoutRef.current = setTimeout(resolve, getSpeed() + pause);
        });
      }
      if (active) setIsDoneTyping(true);
    })();
    return () => {
      active = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [start, text, getSpeed]);

  return { displayText, isDoneTyping };
};

export default useTypewriter;