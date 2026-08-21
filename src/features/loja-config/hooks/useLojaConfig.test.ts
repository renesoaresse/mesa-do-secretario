import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { removeMockElectronApi } from '../../../test/electron';
import { storage, STORAGE_KEYS } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';
import { useLojaConfig } from './useLojaConfig';

describe('useLojaConfig', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('nao persiste enquanto o usuario apenas edita', () => {
    const { result } = renderHook(() => useLojaConfig());

    act(() => {
      result.current.updateLojaConfig({ nomeLoja: 'Loja Teste', rito: 'Rito de York' });
    });

    expect(result.current.lojaConfig.nomeLoja).toBe('Loja Teste');
    expect(result.current.isDirty).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.lojaConfig)).toBeNull();
  });

  it('persiste os dados somente ao salvar', () => {
    const { result } = renderHook(() => useLojaConfig());

    act(() => {
      result.current.updateLojaConfig({ nomeLoja: 'Loja Teste', rito: 'Rito de York' });
    });
    act(() => {
      result.current.saveLojaConfig();
    });

    expect(result.current.isDirty).toBe(false);
    expect(storage.loadLojaConfig(DEFAULT_LOJA_CONFIG)).toMatchObject({
      nomeLoja: 'Loja Teste',
      rito: 'Rito de York',
    });
  });

  it('carrega os dados ja salvos ao montar', () => {
    storage.saveLojaConfig({ ...DEFAULT_LOJA_CONFIG, nomeLoja: 'Loja Salva' });

    const { result } = renderHook(() => useLojaConfig());

    expect(result.current.lojaConfig.nomeLoja).toBe('Loja Salva');
    expect(result.current.isDirty).toBe(false);
  });
});
