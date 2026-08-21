import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { removeMockElectronApi } from '../../../test/electron';
import { storage } from '../../../services/storage';
import { useObreiros } from './useObreiros';

describe('useObreiros', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('persiste o obreiro cadastrado', () => {
    const { result } = renderHook(() => useObreiros());

    act(() => {
      result.current.addObreiro({ nome: 'JOAO DA SILVA', cim: '123', grau: 'M∴M∴' });
    });

    expect(storage.loadObreiros()).toMatchObject([
      { nome: 'JOAO DA SILVA', cim: '123', grau: 'M∴M∴' },
    ]);
  });

  it('mantem a listagem em ordem alfabetica', () => {
    const { result } = renderHook(() => useObreiros());

    act(() => {
      result.current.addObreiro({ nome: 'CARLOS', cim: '3', grau: 'AP∴M∴' });
    });
    act(() => {
      result.current.addObreiro({ nome: 'ANDRE', cim: '1', grau: 'CP∴M∴' });
    });
    act(() => {
      result.current.addObreiro({ nome: 'BRUNO', cim: '2', grau: 'M∴M∴I∴' });
    });

    expect(result.current.obreiros.map((o) => o.nome)).toEqual(['ANDRE', 'BRUNO', 'CARLOS']);
  });

  it('atualiza um obreiro existente sem duplicar', () => {
    const { result } = renderHook(() => useObreiros());

    let id = '';
    act(() => {
      id = result.current.addObreiro({ nome: 'JOAO', cim: '1', grau: 'AP∴M∴' }).id;
    });
    act(() => {
      result.current.updateObreiro(id, { nome: 'JOAO ALTERADO', cim: '9', grau: 'M∴M∴' });
    });

    expect(result.current.obreiros).toHaveLength(1);
    expect(result.current.obreiros[0]).toMatchObject({
      id,
      nome: 'JOAO ALTERADO',
      cim: '9',
      grau: 'M∴M∴',
    });
    expect(storage.loadObreiros()[0].nome).toBe('JOAO ALTERADO');
  });

  it('carrega os obreiros ja salvos em ordem alfabetica', () => {
    storage.saveObreiros([
      { id: 'b', nome: 'ZEZE', cim: '2', grau: 'M∴M∴' },
      { id: 'a', nome: 'ABEL', cim: '1', grau: 'AP∴M∴' },
    ]);

    const { result } = renderHook(() => useObreiros());

    expect(result.current.obreiros.map((o) => o.nome)).toEqual(['ABEL', 'ZEZE']);
  });
});
