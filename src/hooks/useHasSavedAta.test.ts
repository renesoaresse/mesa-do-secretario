import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useHasSavedAta } from './useHasSavedAta';
import * as storage from '../services/storage';

vi.mock('../services/storage', () => ({
  storage: {
    hasSavedAta: vi.fn(),
  },
}));

describe('useHasSavedAta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna true quando existe ata salva', () => {
    vi.mocked(storage.storage.hasSavedAta).mockReturnValue(true);
    const { result } = renderHook(() => useHasSavedAta());
    expect(result.current).toBe(true);
  });

  it('retorna false quando nao existe ata salva', () => {
    vi.mocked(storage.storage.hasSavedAta).mockReturnValue(false);
    const { result } = renderHook(() => useHasSavedAta());
    expect(result.current).toBe(false);
  });
});
