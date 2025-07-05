import React, { useEffect, useState } from 'react';
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    // Check if dark mode is enabled via class on html element
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    // Create a mutation observer to watch for changes to the class
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    // Start observing
    observer.observe(document.documentElement, {
      attributes: true
    });
    // Cleanup
    return () => observer.disconnect();
  }, []);
  return {
    isDarkMode
  };
};