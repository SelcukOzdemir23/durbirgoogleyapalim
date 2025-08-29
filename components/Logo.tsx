
import React from 'react';

const Logo: React.FC = () => {
  const logoText = "Dur Bi' Google Yapalım";
  const colors = ['#4285F4', '#DB4437', '#F4B400', '#4285F4', '#0F9D58', '#DB4437'];
  
  const coloredChars = logoText.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} className="mr-2">
      {word.split('').map((char, charIndex) => (
        <span
          key={charIndex}
          style={{ color: colors[(wordIndex * 3 + charIndex) % colors.length] }}
        >
          {char}
        </span>
      ))}
    </span>
  ));

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
      {coloredChars}
    </h1>
  );
};

export default Logo;