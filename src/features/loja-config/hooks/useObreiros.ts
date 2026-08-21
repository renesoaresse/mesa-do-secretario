import { useCallback, useState } from 'react';
import { storage } from '../../../services/storage';
import type { Obreiro } from '../../../types/ata';

export type ObreiroInput = Omit<Obreiro, 'id'>;

// A listagem é sempre alfabética pelo nome, respeitando acentos do português.
function sortByNome(obreiros: Obreiro[]): Obreiro[] {
  return [...obreiros].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export function useObreiros() {
  const [obreiros, setObreiros] = useState<Obreiro[]>(() => sortByNome(storage.loadObreiros()));

  const persist = useCallback((next: Obreiro[]) => {
    const ordenados = sortByNome(next);
    storage.saveObreiros(ordenados);
    setObreiros(ordenados);
  }, []);

  const addObreiro = useCallback(
    (input: ObreiroInput) => {
      const obreiro: Obreiro = { id: crypto.randomUUID(), ...input };
      persist([...obreiros, obreiro]);
      return obreiro;
    },
    [obreiros, persist],
  );

  const updateObreiro = useCallback(
    (id: string, input: ObreiroInput) => {
      persist(obreiros.map((obreiro) => (obreiro.id === id ? { ...obreiro, ...input } : obreiro)));
    },
    [obreiros, persist],
  );

  return { obreiros, addObreiro, updateObreiro };
}
