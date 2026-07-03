import { useState, useEffect } from 'react';
import { storage } from '../services/storage';

export function useHasSavedAta(): boolean {
  const [hasSavedAta, setHasSavedAta] = useState<boolean>(() => storage.hasSavedAta());

  useEffect(() => {
    const handleStorageChange = () => {
      setHasSavedAta(storage.hasSavedAta());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return hasSavedAta;
}
