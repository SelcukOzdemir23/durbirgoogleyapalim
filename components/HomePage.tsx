import React, { useState, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { SearchIcon } from './icons/SearchIcon';
import trTranslations from '../src/i18n/tr.json';
import enTranslations from '../src/i18n/en.json';

const translations = {
  tr: trTranslations,
  en: enTranslations
};

const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState('tr');
  const [tone, setTone] = useState('polite');
  const [delay, setDelay] = useState(3500);
  const [engine, setEngine] = useState('google');
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('system');
  const navigate = useNavigate();
  
  // Get translated text based on selected language
  const t = useCallback((key: string) => translations[lang as keyof typeof translations][key] || key, [lang]);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    const savedTone = localStorage.getItem('tone');
    const savedDelay = localStorage.getItem('delay');
    const savedEngine = localStorage.getItem('engine');
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    if (savedLang) setLang(savedLang);
    if (savedTone) setTone(savedTone);
    if (savedDelay) setDelay(parseInt(savedDelay));
    if (savedEngine) setEngine(savedEngine);
    setTheme(savedTheme);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('lang', lang);
    localStorage.setItem('tone', tone);
    localStorage.setItem('delay', delay.toString());
    localStorage.setItem('engine', engine);
  }, [lang, tone, delay, engine]);

  const handleAnimateSearch = useCallback(() => {
    if (!query.trim()) {
      alert(t('warning_empty_query'));
      return;
    }
    if (query.length > 2000) {
      alert(t('warning_query_too_long'));
      return;
    }
    
    const encodedQuery = encodeURIComponent(query);
    navigate(`/search?q=${encodedQuery}&lang=${lang}&tone=${tone}&delay=${delay}&engine=${engine}`);
  }, [query, lang, tone, delay, engine, navigate, t]);

  const copyToClipboard = useCallback(() => {
    const url = `${window.location.origin}/#/search?q=${encodeURIComponent(query)}&lang=${lang}&tone=${tone}&delay=${delay}&engine=${engine}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [query, lang, tone, delay, engine]);

  // Function to toggle theme
  const toggleTheme = useCallback(() => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Dispatch a custom event to notify App component of theme change
    window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
  }, [theme]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 bg-white dark:bg-google-dark-bg">
      <div className="text-center space-y-4">
        <Logo />
        <p className="text-gray-600 text-lg dark:text-google-dark-text">{t('subtitle')}</p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <SearchIcon className="h-5 w-5 text-gray-400 dark:text-google-dark-text" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnimateSearch()}
            placeholder={t('placeholder')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-google-dark-input dark:border-google-dark-input dark:text-google-dark-text"
            aria-label={t('placeholder')}
          />
        </div>
        
        {/* Settings Panel */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 dark:bg-google-dark-input">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-google-dark-text">{t('settings_language')}</label>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-google-dark-input dark:border-google-dark-input dark:text-google-dark-text"
              >
                <option value="tr">{t('language_tr')}</option>
                <option value="en">{t('language_en')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-google-dark-text">{t('settings_tone')}</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-google-dark-input dark:border-google-dark-input dark:text-google-dark-text"
              >
                <option value="polite">{t('tone_polite')}</option>
                <option value="classic">{t('tone_classic')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-google-dark-text">{t('settings_delay')}</label>
              <input 
                type="number" 
                value={delay} 
                onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                min="1000"
                max="10000"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-google-dark-input dark:border-google-dark-input dark:text-google-dark-text"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-google-dark-text">{t('settings_engine')}</label>
              <select 
                value={engine} 
                onChange={(e) => setEngine(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-google-dark-input dark:border-google-dark-input dark:text-google-dark-text"
              >
                <option value="google">{t('engine_google')}</option>
              </select>
            </div>
          </div>
          
          {/* Theme Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300 dark:bg-google-dark-button dark:text-google-dark-text"
            >
              {theme === 'light' ? '☀️ Light' : theme === 'dark' ? '🌙 Dark' : '🌓 System'}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAnimateSearch}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            {t('button_create_link')}
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            {copied ? '✓ Kopyalandı' : t('button_copy')}
          </button>
        </div>
      </div>
    </main>
  );
};

export default memo(HomePage);