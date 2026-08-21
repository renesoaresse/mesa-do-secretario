import { useMemo } from 'react';
import { useObreiros } from './useObreiros';
import { useGestoes } from './useGestoes';
import { gestaoVigente, obreirosComCargo, titularesDosOficiais } from '../data/oficiais';
import type { Rito } from '../../../types/ata';

/** Quadro e titulares da gestão vigente, prontos para os selects de oficiais. */
export function useQuadroDaGestao(rito: Rito | '') {
  const { obreiros } = useObreiros();
  const { gestoes } = useGestoes();

  return useMemo(() => {
    const gestao = gestaoVigente(gestoes);

    return {
      obreiros: obreirosComCargo(gestao, obreiros, rito),
      titulares: titularesDosOficiais(gestao, obreiros, rito),
    };
  }, [gestoes, obreiros, rito]);
}
