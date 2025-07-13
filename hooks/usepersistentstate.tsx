import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function usePersistentState(key: string, defaultValue: string) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    AsyncStorage.getItem(key).then(saved => {
      if (saved !== null) setValue(saved);
    });
  }, [key]);

  useEffect(() => {
    AsyncStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
