import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../Authcontext/AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();

  const [theme, setTheme] = useState(() => {
    // Priority: user preference from database > localStorage > default
    if (user?.theme) {
      return user.theme;
    }
    const savedTheme = localStorage.getItem('medcare-theme');
    return savedTheme || 'light';
  });

  const [elderlyMode, setElderlyMode] = useState(() => {
    return localStorage.getItem('medcare-elderly-mode') === 'true';
  });

  // Update theme when user data changes (e.g., after login)
  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [user?.theme]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply Theme
    const applyTheme = (themeValue) => {
      if (themeValue === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      const handleChange = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(theme);
    }

    localStorage.setItem('medcare-theme', theme);
  }, [theme]);

  // Apply Elderly Mode
  useEffect(() => {
    const root = document.documentElement;
    if (elderlyMode) {
      root.classList.add('elderly-mode');
    } else {
      root.classList.remove('elderly-mode');
    }
    localStorage.setItem('medcare-elderly-mode', elderlyMode);
  }, [elderlyMode]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleElderlyMode = () => {
    setElderlyMode(prev => !prev);
  };

  const getEffectiveTheme = () => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    elderlyMode,
    toggleElderlyMode,
    isDark: getEffectiveTheme() === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
