import { useState, useEffect } from 'react';

const lightTheme = {
  '--bg-primary': '#F5F5F5',
  '--bg-secondary': '#EBEBEB',
  '--accent': '#FFFFFF',
  '--highlight': '#3A7BD5',
  '--text-highlight': '#ffffff',
  '--text-secondary': '#888888',
  '--text-primary': '#686d76',
};

const darkTheme = {
  '--bg-primary': '#212830',
  '--bg-secondary': '#1A2028',
  '--accent': '#2B333E',
  '--highlight': '#3A7BD5',
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
