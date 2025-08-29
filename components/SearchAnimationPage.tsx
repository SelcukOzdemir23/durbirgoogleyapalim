import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTypewriter from '../hooks/useTypewriter';
import Logo from './Logo';
import { SearchIcon } from './icons/SearchIcon';
import trTranslations from '../src/i18n/tr.json';
import enTranslations from '../src/i18n/en.json';
// Removed framer-motion import; using Tailwind CSS for animations

// Load translations
const translations = {
  tr: trTranslations,
  en: enTranslations
};

// Witty messages for different tones
const WITTY_MESSAGES = {
  polite: {
    tr: [
      "Önce arama kutusuna yazıyoruz...",
      "Şimdi harfleri tek tek yazalım...",
      "Bak, ne kadar kolay!",
      "Ve sonunda butona tıklıyoruz...",
      "Sonuçlar geliyor..."
    ],
    en: [
      "First, we type in the search box...",
      "Now let's type the letters one by one...",
      "Look, how easy it is!",
      "And finally, we click the button...",
      "Results are coming..."
    ]
  },
  classic: {
    tr: [
      "Gerçekten mi aramayı bilmiyorsun?",
      "Tamam, ben yapayım o zaman...",
      "Bak nasıl yapılıyor...",
      "Kolay değil mi?",
      "Sonuçlar burada!"
    ],
    en: [
      "Do you really not know how to search?",
      "Alright, I'll do it then...",
      "Watch how it's done...",
      "Isn't it easy?",
      "Results are here!"
    ]
  }
};

enum AnimationStep {
  START,
  CURSOR_MOVE_TO_INPUT,
  TYPING,
  CURSOR_MOVE_TO_BUTTON,
  CURSOR_CLICK,
  COUNTDOWN,
  REDIRECTING
}

const SearchAnimationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang') || 'tr';
  const defaultQueries: Record<string, string> = {
    en: "I don't even know how to search this",
    tr: "Bunu nasıl arayacağımı bile bilmiyorum"
  };
  const query = searchParams.get('q') || defaultQueries[lang];
  const tone = searchParams.get('tone') || 'polite';
  const delay = parseInt(searchParams.get('delay') || '3500');
  const engine = searchParams.get('engine') || 'google';
  
  // Get translated text based on selected language
  const t = useCallback((key: string) => translations[lang as keyof typeof translations][key] || key, [lang]);
  
  const [step, setStep] = useState<AnimationStep>(AnimationStep.START);
  const [wittyMessage, setWittyMessage] = useState('');
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0, opacity: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check for prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Adjust typewriter speed for more human-like typing
  const getTypingSpeed = useCallback(() => {
    // Random speed between 40-120ms per character with slight pauses after punctuation
  // Slower typing: 80-200ms per character
  return 80 + Math.random() * 120;
  }, []);

  const { displayText, isDoneTyping } = useTypewriter(query, getTypingSpeed, step >= AnimationStep.TYPING);
  
  // Move caret to end on each text update
  useEffect(() => {
    if (searchInputRef.current) {
      const input = searchInputRef.current;
      const len = displayText.length;
      input.setSelectionRange(len, len);
    }
  }, [displayText]);

  // Step 1: Animate content in, then move cursor to input
  useEffect(() => {
    if (step === AnimationStep.START) {
  const entryTimer = setTimeout(() => setIsContentVisible(true), 200);
      
      // If prefers-reduced-motion is enabled, skip cursor animation
      if (prefersReducedMotion) {
        const startTypingTimer = setTimeout(() => {
          setStep(AnimationStep.TYPING);
        }, 1000);
        
        return () => {
          clearTimeout(entryTimer);
          clearTimeout(startTypingTimer);
        };
      }
      
      // Set initial witty message
      setWittyMessage(WITTY_MESSAGES[tone as keyof typeof WITTY_MESSAGES][lang as keyof (typeof WITTY_MESSAGES)[keyof typeof WITTY_MESSAGES]][0]);
      
      // Move cursor to input after a short delay
      const moveCursorTimer = setTimeout(() => {
        setStep(AnimationStep.CURSOR_MOVE_TO_INPUT);
      }, 1500);
      
      return () => {
        clearTimeout(entryTimer);
        clearTimeout(moveCursorTimer);
      };
    }
  }, [step, prefersReducedMotion, tone, lang]);

  // Step 2: Move cursor to input
  useEffect(() => {
    if (step !== AnimationStep.CURSOR_MOVE_TO_INPUT) return;
    if (!searchInputRef.current) return;

    const inputRect = searchInputRef.current.getBoundingClientRect();
    
    // Start cursor from a default position (center of screen)
    const startTop = window.innerHeight / 2;
    const startLeft = window.innerWidth / 2;
    
    // Make cursor appear
    setCursorPos({ top: startTop, left: startLeft, opacity: 1 });
    
    // Animate to input after a short delay
  const moveTimer = setTimeout(() => {
      // Position cursor at the end of the input text
      setCursorPos({
        top: inputRect.top + inputRect.height / 2,
        left: inputRect.left + inputRect.width - 20, // approximate end of text
        opacity: 1
      });
    }, 300);

    // After move animation, transition to next step
    const stepTimer = setTimeout(() => {
      setStep(AnimationStep.TYPING);
    }, 2000); // slower transition

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(stepTimer);
    };
  }, [step]);

  // Step 3: Handle witty messages during typing
  useEffect(() => {
    if (step !== AnimationStep.TYPING) return;

    // Focus input to show native caret
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const messages = WITTY_MESSAGES[tone as keyof typeof WITTY_MESSAGES][lang as keyof (typeof WITTY_MESSAGES)[keyof typeof WITTY_MESSAGES]];
    let messageIndex = 1; // Start from the second message
    
    // Set the second message immediately
    setWittyMessage(messages[1]);
    
    const showNextMessage = () => {
        if (messageIndex < messages.length - 1) { // Don't show the last message yet
            setWittyMessage(messages[messageIndex]);
            messageIndex++;
        }
    };

  const messageInterval = setInterval(showNextMessage, 3000);

    return () => clearInterval(messageInterval);
  }, [step, tone, lang]);

  // Step 4: Transition after typing is finished
  useEffect(() => {
    if (step === AnimationStep.TYPING && isDoneTyping) {
      const messages = WITTY_MESSAGES[tone as keyof typeof WITTY_MESSAGES][lang as keyof (typeof WITTY_MESSAGES)[keyof typeof WITTY_MESSAGES]];
      setWittyMessage(messages[messages.length - 1]); // Show the last message
      
  const timer = setTimeout(() => {
        // If prefers-reduced-motion is enabled, skip cursor movement and click
        if (prefersReducedMotion) {
          setStep(AnimationStep.COUNTDOWN);
        } else {
          setStep(AnimationStep.CURSOR_MOVE_TO_BUTTON);
        }
  }, 1000); // allow more time to read last phrase
      return () => clearTimeout(timer);
    }
  }, [step, isDoneTyping, tone, lang, prefersReducedMotion]);

  // Step 5: Move cursor to button
  useEffect(() => {
    if (step !== AnimationStep.CURSOR_MOVE_TO_BUTTON) return;
    if (!searchButtonRef.current) return;

    setWittyMessage(''); // Clear witty message during button movement
    
    const buttonRect = searchButtonRef.current.getBoundingClientRect();

    // Animate to button after a short delay
  const moveTimer = setTimeout(() => {
      setCursorPos(prev => ({
        ...prev,
        top: buttonRect.top + buttonRect.height / 2,
        left: buttonRect.left + buttonRect.width / 2,
      }));
    }, 300);

    // After move animation, transition to next step
  const stepTimer = setTimeout(() => setStep(AnimationStep.CURSOR_CLICK), 2000); // slower transition

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(stepTimer);
    };
  }, [step]);

  // Step 6: Simulate click with animation
  useEffect(() => {
    if (step === AnimationStep.CURSOR_CLICK) {
      if (!searchButtonRef.current) return;
      
      // Add click effect classes
      searchButtonRef.current.classList.add('bg-gray-200', 'transform', 'scale-95', 'transition-transform', 'duration-200');

      // Remove click effect classes after a short delay
  const clickTimer = setTimeout(() => {
        searchButtonRef.current?.classList.remove('bg-gray-200', 'transform', 'scale-95');
        setStep(AnimationStep.COUNTDOWN);
  }, 400); // slower click effect

      return () => clearTimeout(clickTimer);
    }
  }, [step]);

  // Step 7: Countdown before redirect
  useEffect(() => {
    if (step === AnimationStep.COUNTDOWN) {
      setWittyMessage(`${countdown}...`);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval);
            setStep(AnimationStep.REDIRECTING);
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [step, countdown]);

  // Step 8: Animate content out, show redirecting message, then perform redirect
  useEffect(() => {
    if (step === AnimationStep.REDIRECTING) {
      setIsContentVisible(false); // Fades out main content
      setCursorPos(prev => ({...prev, opacity: 0})); // Hide cursor

      const redirectTimer = setTimeout(() => {
        // Construct Google search URL with hl parameter for language
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=${lang}`;
      }, 700); // Wait for fade out animation
      return () => clearTimeout(redirectTimer);
    }
  }, [step, query, lang]);

  // Function to manually trigger redirect
  const handleSkip = useCallback(() => {
    setStep(AnimationStep.REDIRECTING);
  }, []);

  return (
  <div className="flex flex-col items-center justify-start pt-24 sm:pt-32 md:pt-40 min-h-screen p-4 overflow-hidden bg-white dark:bg-google-dark-bg dark:text-google-dark-text">
      {/* <div
        className="fixed w-4 h-6 pointer-events-none z-50 transition-all duration-300 ease-in-out"
        style={{
          top: `${cursorPos.top}px`,
          left: `${cursorPos.left}px`,
          opacity: cursorPos.opacity,
          display: prefersReducedMotion ? 'none' : 'block'
        }}
      >
        {/* Inline SVG cursor icon */}
        {/* <svg
          className="w-full h-full text-black dark:text-white"
          viewBox="0 0 16 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 0,24 6,18 12,24 12,0" />
        </svg>
      </div> */}
  {/* Custom cursor removed: using native system cursor for realism */}

      {/* Animation content container */}
      <div
        className={`w-full max-w-2xl text-center space-y-6 transition-all duration-500 ease-in-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
          {/* Google Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="relative w-full mt-5">
            <input
              ref={searchInputRef}
              type="text"
              value={displayText}
              readOnly
              className="w-full pl-10 pr-4 py-3 text-lg font-sans border border-gray-300 rounded-full bg-white dark:bg-google-dark-input dark:border-google-dark-input dark:text-google-dark-text focus:outline-none placeholder-gray-500 caret-black dark:caret-white transition"
              placeholder=""
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

        {/* Google Search and I'm Feeling Lucky Buttons */}
        <div className="flex justify-center gap-4">
          <button
            ref={searchButtonRef}
            className="px-4 py-2 bg-gray-100 dark:bg-google-dark-button text-gray-800 dark:text-google-dark-text text-sm rounded border border-transparent hover:border-gray-300 hover:shadow-sm transition transform active:scale-95 duration-150 focus:outline-none"
          >
            Google Search
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 dark:bg-google-dark-button text-gray-800 dark:text-google-dark-text text-sm rounded border border-transparent hover:border-gray-300 hover:shadow-sm transition-colors duration-150 focus:outline-none"
          >
            I'm Feeling Lucky
          </button>
        </div>

        {/* Witty Message or Countdown */}
        <div className="h-10 text-center relative">
          {step === AnimationStep.COUNTDOWN ? (
            <span className="text-4xl font-bold text-red-500 animate-bounce">{countdown}</span>
          ) : (
            <p 
              className="text-gray-600 dark:text-google-dark-text text-lg transition-opacity duration-300"
              aria-live="polite"
            >
              {wittyMessage}
            </p>
          )}
        </div>
        
        {/* Skip button for manual redirect */}
        <div className="mt-4">
          <button 
            onClick={handleSkip}
            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
          >
            {t('button_skip')}
          </button>
        </div>
      </div>
      
      {step === AnimationStep.REDIRECTING && (
        <div className="fixed inset-0 bg-white dark:bg-google-dark-bg bg-opacity-80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <p className="text-2xl font-semibold dark:text-google-dark-text">{t('redirecting_message')}</p>
        </div>
      )}
    </div>
  );
};

export default memo(SearchAnimationPage);