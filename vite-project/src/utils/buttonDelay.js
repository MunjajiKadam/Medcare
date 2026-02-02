/**
 * Utility for adding delay and preventing rapid button clicks
 */

export const withDelay = async (callback, delayMs = 1000) => {
  await callback();
  return new Promise(resolve => setTimeout(resolve, delayMs));
};

export const useButtonDelay = (initialState = false) => {
  const [isDelayed, setIsDelayed] = require('react').useState(initialState);

  const executeWithDelay = async (callback, delayMs = 1500) => {
    setIsDelayed(true);
    try {
      await callback();
    } finally {
      setTimeout(() => setIsDelayed(false), delayMs);
    }
  };

  return [isDelayed, executeWithDelay];
};
