import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { removeMockElectronApi } from '../../../test/electron';
import { storage } from '../../../services/storage';
import { useGestoes } from './useGestoes';

describe('useGestoes', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('deixa apenas uma gestao vigente ao cadastrar outra', () => {
    const { result } = renderHook(() => useGestoes());

    act(() => {
      result.current.addGestao({ ano: '2025', vigente: true, atribuicoes: [] });
    });
    act(() => {
      result.current.addGestao({ ano: '2026', vigente: true, atribuicoes: [] });
    });

    const vigentes = result.current.gestoes.filter((gestao) => gestao.vigente);
    expect(vigentes).toHaveLength(1);
    expect(vigentes[0].ano).toBe('2026');
    expect(storage.loadGestoes().filter((gestao) => gestao.vigente)).toHaveLength(1);
  });

  it('traz a gestao vigente no topo da lista', () => {
    const { result } = renderHook(() => useGestoes());

    act(() => {
      result.current.addGestao({ ano: '2026', vigente: false, atribuicoes: [] });
    });
    act(() => {
      result.current.addGestao({ ano: '2024', vigente: true, atribuicoes: [] });
    });

    expect(result.current.gestoes.map((gestao) => gestao.ano)).toEqual(['2024', '2026']);
  });

  it('transfere a vigencia ao editar outra gestao', () => {
    const { result } = renderHook(() => useGestoes());

    let antigaId = '';
    act(() => {
      antigaId = result.current.addGestao({ ano: '2024', vigente: true, atribuicoes: [] }).id;
    });
    let novaId = '';
    act(() => {
      novaId = result.current.addGestao({ ano: '2025', vigente: false, atribuicoes: [] }).id;
    });

    act(() => {
      result.current.updateGestao(novaId, { ano: '2025', vigente: true, atribuicoes: [] });
    });

    const porId = Object.fromEntries(result.current.gestoes.map((g) => [g.id, g.vigente]));
    expect(porId[novaId]).toBe(true);
    expect(porId[antigaId]).toBe(false);
  });

  it('mantem as gestoes por ano decrescente quando nenhuma e vigente', () => {
    const { result } = renderHook(() => useGestoes());

    act(() => {
      result.current.addGestao({ ano: '2024', vigente: false, atribuicoes: [] });
    });
    act(() => {
      result.current.addGestao({ ano: '2026', vigente: false, atribuicoes: [] });
    });

    expect(result.current.gestoes.map((gestao) => gestao.ano)).toEqual(['2026', '2024']);
  });
});
