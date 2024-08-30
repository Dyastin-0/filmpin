import { useState, useEffect } from 'react';

const lightTheme = {
  '--bg-primary': '#f5f7f8',
  '--bg-secondary': '#eeeeee',
  '--accent': '#ffffff',
  '--highlight': '#508C9B',
  '--text-highlight': '#ffffff',
  '--text-secondary': '#888888',
  '--text-primary': '#686d76',
};

const darkTheme = {
  '--bg-primary': '#1a1a1b',
  '--bg-secondary': '#121213',
  '--accent': '#1f1f20',
  '--highlight': '#508C9B',
  '--text-highlight': '#f2f2f3',
  '--text-secondary': '#a4a4a6',
  '--text-primary': '#ffffff',
};

export const useThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Retrieve the theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeVariables = theme === 'dark' ? darkTheme : lightTheme;

    for (const [key, value] of Object.entries(themeVariables)) {
      root.style.setProperty(key, value);
    }

    // Save the current theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
};
