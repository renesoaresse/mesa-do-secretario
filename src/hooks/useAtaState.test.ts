import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { installMockElectronApi, removeMockElectronApi } from '../test/electron';
import {
  makeAtaDraft,
  makeBolsaProposta,
  makeBolsaPropostas,
  makeLegacyAtaDraft,
  makeVisitor,
} from '../test/factories';
import { seedStorage } from '../test/storage';
import { storage } from '../services/storage';
import { DEFAULT_LOJA_CONFIG } from './useAtaState';
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
        visitors: [makeVisitor({ nome: 'Visitante Persistido' })],
        tronco: 42,
        ordemDia: 'Ordem persistida',
      }),
    );

    const { result } = renderHook(() => useAtaState());

    expect(result.current.sessionType).toBe('magna');
    expect(result.current.visitors).toEqual([makeVisitor({ nome: 'Visitante Persistido' })]);
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
      result.current.setSessionType('magna');
      result.current.updateSessionConfig({ numSessao: 7, conjunta: true });
      result.current.updateMagnaFields({ tema: 'Tema Persistido' });
      result.current.updateOfficers({ vm: 'Veneravel Persistido' });
      result.current.updateLojaConfig({ nomeLoja: 'Loja Persistida' });
      result.current.addVisitor(makeVisitor({ nome: 'Visitante Persistido' }));
      result.current.setOrdemDia('Ordem Persistida');
      result.current.setBalaustreTexto('Balaustre Persistido');
    });

    const stored = JSON.parse(localStorage.getItem('ataDraft') ?? '{}');

    expect(stored.sessionType).toBe('magna');
    expect(stored.sessionConfig.numSessao).toBe(7);
    expect(stored.sessionConfig.conjunta).toBe(true);
    expect(stored.magnaFields.tema).toBe('Tema Persistido');
    expect(stored.officers.vm).toBe('Veneravel Persistido');
    expect(stored.lojaConfig.nomeLoja).toBe('Loja Persistida');
    expect(stored.visitors).toContainEqual(
      expect.objectContaining({ nome: 'Visitante Persistido' }),
    );
    expect(stored.ordemDia).toBe('Ordem Persistida');
    expect(stored.balaustreTexto).toBe('Balaustre Persistido');
  });

  it('deve persistir os registros da bolsa de propostas no draft canonico', () => {
    const { result } = renderHook(() => useAtaState());
    const registro = makeBolsaProposta({ id: 'b1', obreiroNome: 'Ir Persistido' });

    act(() => {
      result.current.updateBolsaPropostas({ totalColunas: 3, texto: 'Acréscimo persistido' });
      result.current.addBolsaProposta(registro);
    });

    const stored = JSON.parse(localStorage.getItem('ataDraft') ?? '{}');

    expect(stored.bolsaPropostas.totalColunas).toBe(3);
    expect(stored.bolsaPropostas.texto).toBe('Acréscimo persistido');
    expect(stored.bolsaPropostas.itens).toEqual([registro]);
  });

  it('deve restaurar e remover registros da bolsa de propostas entre sessoes', () => {
    const registro = makeBolsaProposta({ id: 'b1', obreiroNome: 'Ir Persistido' });
    seedStorage(
      'ataDraft',
      makeAtaDraft({
        bolsaPropostas: makeBolsaPropostas({
          totalColunas: 2,
          itens: [registro],
          texto: 'Acréscimo persistido',
          suprimida: true,
        }),
      }),
    );

    const { result } = renderHook(() => useAtaState());

    expect(result.current.bolsaPropostas.totalColunas).toBe(2);
    expect(result.current.bolsaPropostas.suprimida).toBe(true);
    expect(result.current.bolsaPropostas.itens).toEqual([registro]);
    expect(result.current.previewData.bolsaPropostas.texto).toBe('Acréscimo persistido');

    act(() => {
      result.current.removeBolsaProposta('b1');
    });

    expect(JSON.parse(localStorage.getItem('ataDraft') ?? '{}').bolsaPropostas.itens).toEqual([]);
  });

  it('deve adicionar e remover visitantes', () => {
    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.addVisitor(makeVisitor({ nome: 'Visitante 1' }));
    });

    expect(result.current.visitors).toEqual([makeVisitor({ nome: 'Visitante 1' })]);

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
    expect(result.current.visitors).toEqual([makeVisitor({ nome: 'Visitante 1' })]);
  });
});

describe('useAtaState - oficiais da gestão vigente', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  function seedGestaoVigente() {
    storage.saveLojaConfig({
      ...DEFAULT_LOJA_CONFIG,
      rito: 'Rito Escocês Antigo e Aceito',
    });
    storage.saveObreiros([
      { id: 'a', nome: 'ABEL SANTOS', cim: '1', grau: 'M∴M∴' },
      { id: 'b', nome: 'BRUNO LIMA', cim: '2', grau: 'M∴M∴' },
    ]);
    storage.saveGestoes([
      {
        id: 'g1',
        ano: String(new Date().getFullYear()),
        vigente: true,
        atribuicoes: [
          { obreiroId: 'a', cargo: 'V∴M∴' },
          { obreiroId: 'b', cargo: 'Secr∴' },
        ],
      },
    ]);
  }

  it('preenche os oficiais com os titulares da gestão vigente', () => {
    seedGestaoVigente();

    const { result } = renderHook(() => useAtaState());

    expect(result.current.officers.vm).toBe('ABEL SANTOS');
    expect(result.current.officers.sec).toBe('BRUNO LIMA');
    expect(result.current.officers.vig1).toBe('');
  });

  it('não marca o titular como ad hoc na ata', () => {
    seedGestaoVigente();

    const { result } = renderHook(() => useAtaState());

    expect(result.current.previewData.officers.vm).toBe('ABEL SANTOS');
  });

  it('marca com ADHOC quem ocupa o cargo no lugar do titular', () => {
    seedGestaoVigente();

    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.updateOfficers({ vm: 'BRUNO LIMA' });
    });

    expect(result.current.officers.vm).toBe('BRUNO LIMA');
    expect(result.current.previewData.officers.vm).toBe('BRUNO LIMA - ADHOC');
  });

  it('preenche os cargos vazios mesmo com outro oficial já digitado', () => {
    seedGestaoVigente();
    seedStorage('ataDraft', {
      ...makeAtaDraft(),
      officers: { vm: 'ALGUEM DE FORA', vig1: '', vig2: '', or: '', sec: '' },
    });

    const { result } = renderHook(() => useAtaState());

    expect(result.current.officers.vm).toBe('ALGUEM DE FORA');
    expect(result.current.officers.sec).toBe('BRUNO LIMA');
    expect(result.current.previewData.officers.vm).toBe('ALGUEM DE FORA - ADHOC');
  });

  it('não marca cargo sem titular na gestão', () => {
    seedGestaoVigente();

    const { result } = renderHook(() => useAtaState());

    act(() => {
      result.current.updateOfficers({ vig1: 'QUALQUER IRMAO' });
    });

    expect(result.current.previewData.officers.vig1).toBe('QUALQUER IRMAO');
  });
});
