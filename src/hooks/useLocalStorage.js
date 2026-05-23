import { useState, useCallback } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return getFromLocalStorage(key, initialValue);
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue(value);
      saveToLocalStorage(key, value);
    },
    [key]
  );

  return [storedValue, setValue];
};
