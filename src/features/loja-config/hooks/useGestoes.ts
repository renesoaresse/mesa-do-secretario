import { useCallback, useState } from 'react';
import { storage } from '../../../services/storage';
import type { Gestao } from '../../../types/ata';

export type GestaoInput = Omit<Gestao, 'id'>;

// A vigente encabeça a lista; o resto vem das mais recentes para as mais antigas.
function ordenar(gestoes: Gestao[]): Gestao[] {
  return [...gestoes].sort((a, b) => {
    if (a.vigente !== b.vigente) return a.vigente ? -1 : 1;
    return b.ano.localeCompare(a.ano, 'pt-BR', { numeric: true });
  });
}

/** Marcar uma gestão como vigente tira a marca de todas as outras. */
function comVigenteUnica(gestoes: Gestao[], vigenteId: string | null): Gestao[] {
  if (!vigenteId) return gestoes;
  return gestoes.map((gestao) => ({ ...gestao, vigente: gestao.id === vigenteId }));
}

export function useGestoes() {
  const [gestoes, setGestoes] = useState<Gestao[]>(() => ordenar(storage.loadGestoes()));

  const persist = useCallback((next: Gestao[], vigenteId: string | null) => {
    const ordenadas = ordenar(comVigenteUnica(next, vigenteId));
    storage.saveGestoes(ordenadas);
    setGestoes(ordenadas);
  }, []);

  const addGestao = useCallback(
    (input: GestaoInput) => {
      const gestao: Gestao = { id: crypto.randomUUID(), ...input };
      persist([...gestoes, gestao], gestao.vigente ? gestao.id : null);
      return gestao;
    },
    [gestoes, persist],
  );

  const updateGestao = useCallback(
    (id: string, input: GestaoInput) => {
      persist(
        gestoes.map((gestao) => (gestao.id === id ? { ...gestao, ...input } : gestao)),
        input.vigente ? id : null,
      );
    },
    [gestoes, persist],
  );

  return { gestoes, addGestao, updateGestao };
}
