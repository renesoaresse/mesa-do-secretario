import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { installMockElectronApi, removeMockElectronApi } from '../test/electron';
import { makeAtaDraft, makeLegacyAtaDraft } from '../test/factories';
import { seedStorage } from '../test/storage';
import { useAtaState } from './useAtaState';

describe('useAtaState', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('deve retornar o estado inicial com valores padrão', () => {
    const { result } = renderHook(() => useAtaState());

    expect(result.current.sessionType).toBe('economica');
    expect(result.current.sessionConfig.grau).toBe('Aprendiz');
    expect(result.current.visitors).toEqual([]);
    expect(result.current.tronco).toBe(0);
    expect(result.current.ordemDia).toBe('');
  });

  it('deve atualizar o sessionType', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.setSessionType('magna');
    });

    expect(result.current.sessionType).toBe('magna');
  });

  it('deve atualizar officers e persistir via storage', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.updateOfficers({ vm: 'João Silva' });
    });

    expect(result.current.officers.vm).toBe('João Silva');

    const stored = localStorage.getItem('officersConfig');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.vm).toBe('João Silva');
  });

  it('deve atualizar lojaConfig e persistir via storage', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.updateLojaConfig({ nomeLoja: 'Loja Teste' });
    });

    expect(result.current.lojaConfig.nomeLoja).toBe('Loja Teste');

    const stored = localStorage.getItem('lojaConfig');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.nomeLoja).toBe('Loja Teste');
  });

  it('deve restaurar o draft persistido ao iniciar novamente', () => {
    seedStorage(
      'ataDraft',
      makeAtaDraft({
        sessionType: 'magna',
        visitors: ['Visitante Persistido'],
        tronco: 42,
        ordemDia: 'Ordem persistida',
      }),
    );

    const { result } = renderHook(() => useAtaState());

    expect(result.current.sessionType).toBe('magna');
    expect(result.current.visitors).toEqual(['Visitante Persistido']);
    expect(result.current.tronco).toBe(42);
    expect(result.current.ordemDia).toBe('Ordem persistida');
  });

  it('deve persistir officers pela API segura do Electron quando disponivel', () => {
    const electronStorage = installMockElectronApi();
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.updateOfficers({ vm: 'Veneravel Seguro' });
    });

    expect(result.current.officers.vm).toBe('Veneravel Seguro');
    expect(electronStorage.load('officersConfig')).toEqual(
      expect.objectContaining({ vm: 'Veneravel Seguro' }),
    );
    expect(localStorage.getItem('officersConfig')).toBeNull();
  });

  it('deve carregar lojaConfig pela API segura do Electron quando disponivel', () => {
    installMockElectronApi({
      lojaConfig: {
        logoDataUrl: null,
        nomeLoja: 'Loja Desktop',
        numeroLoja: '29',
        dataFundacaoISO: '',
        temploNome: '',
        enderecoTemplo: '',
        cidadeEstado: '',
      },
    });

    const { result } = renderHook(() => useAtaState());

    expect(result.current.lojaConfig.nomeLoja).toBe('Loja Desktop');
  });

  it('deve persistir os campos principais restantes no draft canonico', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.setSessionType('conjunta');
      result.current.updateSessionConfig({ numSessao: 7 });
      result.current.updateMagnaFields({ tema: 'Tema Persistido' });
      result.current.updateOfficers({ vm: 'Veneravel Persistido' });
      result.current.updateLojaConfig({ nomeLoja: 'Loja Persistida' });
      result.current.addVisitor('Visitante Persistido');
      result.current.setOrdemDia('Ordem Persistida');
      result.current.setBalaustreTexto('Balaustre Persistido');
    });

    const stored = JSON.parse(localStorage.getItem('ataDraft') ?? '{}');

    expect(stored.sessionType).toBe('conjunta');
    expect(stored.sessionConfig.numSessao).toBe(7);
    expect(stored.magnaFields.tema).toBe('Tema Persistido');
    expect(stored.officers.vm).toBe('Veneravel Persistido');
    expect(stored.lojaConfig.nomeLoja).toBe('Loja Persistida');
    expect(stored.visitors).toContain('Visitante Persistido');
    expect(stored.ordemDia).toBe('Ordem Persistida');
    expect(stored.balaustreTexto).toBe('Balaustre Persistido');
  });

  it('deve adicionar e remover visitantes', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.addVisitor('Visitante 1');
    });

    expect(result.current.visitors).toEqual(['Visitante 1']);

    act(() => {
      result.current.removeVisitor(0);
    });

    expect(result.current.visitors).toEqual([]);
  });

  it('deve ignorar residuos legados de documentos ao restaurar estado', () => {
    seedStorage('ataDraft', makeLegacyAtaDraft());

    const { result } = renderHook(() => useAtaState());

    expect(result.current).not.toHaveProperty('documents');
    expect(result.current).not.toHaveProperty('docStatus');
    expect(result.current.visitors).toEqual(['Visitante 1']);
  });
});
