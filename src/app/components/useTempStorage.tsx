"use client";
import { useEffect, useState } from "react";

export function useTempStorage<T>(
  key: string
): [T | null, (data: T) => void] {
  const [value, setValue] = useState<T | null>(null);

  const setTempValue = (data: T): void => {
    try {
      const storageId = `temp_${Date.now()}`;
      sessionStorage.setItem(storageId, JSON.stringify(data));
      sessionStorage.setItem(key, storageId);
      setValue(data);
    } catch (err) {
      console.warn(`useTempStorage: failed to write key "${key}"`, err);
    }
  };

  useEffect(() => {
    try {
      const storageId = sessionStorage.getItem(key);
      if (storageId) {
        const raw = sessionStorage.getItem(storageId);
        if (raw) {
          const data = JSON.parse(raw) as T;
          setValue(data);
        }
        sessionStorage.removeItem(storageId);
        sessionStorage.removeItem(key);
      }
    } catch (err) {
      console.warn(`useTempStorage: failed to read key "${key}"`, err);
    }
  }, [key]);

  return [value, setTempValue];
}

export default useTempStorage;