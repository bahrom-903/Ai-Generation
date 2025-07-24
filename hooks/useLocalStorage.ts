
import { useState, useEffect } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
    } catch (error: any) {
      // Check for quota exceeded error names used by different browsers
      if (
        error.name === 'QuotaExceededError' || // Standard
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
        (error.code && (error.code === 22 || error.code === 1014)) // Legacy
      ) {
        alert('Ошибка: Хранилище переполнено! Не удалось сохранить последние изменения. Пожалуйста, удалите несколько изображений из галереи, чтобы освободить место.');
      } else {
        console.error(`Error writing to localStorage for key “${key}”:`, error);
      }
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
            try {
                setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
            } catch (error) {
                console.error(error);
                setStoredValue(initialValue);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;