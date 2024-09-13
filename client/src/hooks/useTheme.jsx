import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export const useThemeToggle = () => {
  const [icon, setIcon] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return <div className='flex items-center justify-center w-[14px] h-[14px]'><FontAwesomeIcon icon={savedTheme === 'dark' ? faMoon : faSun} /></div>
  })
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    setIcon(<div className='flex items-center justify-center w-[14px] h-[14px]'><FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} /></div>);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, icon };
};
