import { useCallback, useEffect, useState } from 'react';
import { storage } from '../../../services/storage';
import type { Loja } from '../../../types/ata';
import { DEFAULT_LOJAS } from '../data/defaultLojas';

export type LojaInput = Omit<Loja, 'id'>;

const SEED_IDS = new Set(DEFAULT_LOJAS.map((loja) => loja.id));

export function isDefaultLoja(id: string): boolean {
  return SEED_IDS.has(id);
}

// Lojas padrão sempre presentes; extras do usuário vêm depois.
function withDefaults(stored: Loja[]): Loja[] {
  const extras = stored.filter((loja) => !SEED_IDS.has(loja.id));
  return [...DEFAULT_LOJAS, ...extras];
}

export function useLojas() {
  const [lojas, setLojas] = useState<Loja[]>(() => withDefaults(storage.loadLojas(DEFAULT_LOJAS)));

  useEffect(() => {
    storage.saveLojas(lojas);
  }, [lojas]);

  const addLoja = useCallback((input: LojaInput) => {
    const loja: Loja = { id: crypto.randomUUID(), ...input };
    setLojas((prev) => [...prev, loja]);
    return loja;
  }, []);

  const removeLoja = useCallback((id: string) => {
    if (SEED_IDS.has(id)) return; // loja padrão não pode ser removida
    setLojas((prev) => prev.filter((loja) => loja.id !== id));
  }, []);

  return { lojas, addLoja, removeLoja };
}
