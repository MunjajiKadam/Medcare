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

  // Update theme when user data changes (e.g., after login)
  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [user?.theme]);

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (themeValue) => {
      if (themeValue === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'auto') {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Listen for system theme changes
      const handleChange = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup listener
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Apply user-selected theme
      applyTheme(theme);
    }
    
    // Save to localStorage as fallback
    localStorage.setItem('medcare-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
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
