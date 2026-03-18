import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAtaState } from './useAtaState';

describe('useAtaState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve retornar o estado inicial com valores padrão', () => {
    const { result } = renderHook(() => useAtaState());

    expect(result.current.sessionType).toBe('economica');
    expect(result.current.sessionConfig.grau).toBe('Aprendiz');
    expect(result.current.documents).toEqual([]);
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

  it('deve carregar officers do localStorage na inicialização', () => {
    localStorage.setItem(
      'officersConfig',
      JSON.stringify({ vm: 'Mestre', vig1: '', vig2: '', or: '', sec: '' }),
    );

    const { result } = renderHook(() => useAtaState());
    expect(result.current.officers.vm).toBe('Mestre');
  });

  it('deve carregar lojaConfig do localStorage na inicialização', () => {
    localStorage.setItem(
      'lojaConfig',
      JSON.stringify({
        logoDataUrl: null,
        nomeLoja: 'Loja Persisted',
        numeroLoja: '29',
        dataFundacaoISO: '',
        temploNome: '',
        enderecoTemplo: '',
        cidadeEstado: '',
      }),
    );

    const { result } = renderHook(() => useAtaState());
    expect(result.current.lojaConfig.nomeLoja).toBe('Loja Persisted');
  });

  it('deve adicionar e remover documentos', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.addDocument({
        type: 'Prancha/Edital',
        number: '001',
        origin: 'GLMESE',
        subject: 'Convocação',
      });
    });

    expect(result.current.documents).toHaveLength(1);
    expect(result.current.documents[0].number).toBe('001');

    const docId = result.current.documents[0].id;

    act(() => {
      result.current.removeDocument(docId);
    });

    expect(result.current.documents).toHaveLength(0);
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
});
