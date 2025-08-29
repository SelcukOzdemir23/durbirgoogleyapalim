
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SearchAnimationPage from './components/SearchAnimationPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState('system');

  // Apply theme class to document element
  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    
    // Listen for system theme changes if theme is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateTheme();
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  // Listen for theme change events from HomePage
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setTheme(customEvent.detail);
    };
    
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return (
    <div className="bg-white text-gray-800 min-h-screen dark:bg-google-dark-bg dark:text-google-dark-text">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchAnimationPage />} />
      </Routes>
    </div>
  );
};

export default App;