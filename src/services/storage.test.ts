import { describe, it, expect, beforeEach } from 'vitest';
import { makeAtaDraft, makeLegacyAtaDraft } from '../test/factories';
import { readStorage, seedStorage } from '../test/storage';
import { storage } from './storage';

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('save()', () => {
    it('deve salvar um valor serializado no localStorage', () => {
      storage.save('testKey', { name: 'teste' });
      const raw = localStorage.getItem('testKey');
      expect(raw).toBe(JSON.stringify({ name: 'teste' }));
    });

    it('deve sobrescrever valor existente', () => {
      storage.save('testKey', { a: 1 });
      storage.save('testKey', { a: 2 });
      const raw = localStorage.getItem('testKey');
      expect(raw).toBe(JSON.stringify({ a: 2 }));
    });
  });

  describe('load()', () => {
    it('deve carregar e desserializar um valor existente', () => {
      localStorage.setItem('testKey', JSON.stringify({ name: 'teste' }));
      const result = storage.load<{ name: string }>('testKey', { name: '' });
      expect(result).toEqual({ name: 'teste' });
    });

    it('deve retornar o valor padrão quando a chave não existe', () => {
      const result = storage.load<{ name: string }>('inexistente', { name: 'default' });
      expect(result).toEqual({ name: 'default' });
    });

    it('deve retornar o valor padrão quando o JSON é inválido', () => {
      localStorage.setItem('testKey', 'não-é-json');
      const result = storage.load<{ name: string }>('testKey', { name: 'fallback' });
      expect(result).toEqual({ name: 'fallback' });
    });
  });

  describe('ata draft persistence', () => {
    it('deve salvar o draft canonico sem campos de documentos', () => {
      const draft = makeAtaDraft();

      expect(() => storage.saveAtaDraft(draft)).not.toThrow();

      expect(readStorage('ataDraft')).toEqual(draft);
      expect(readStorage('officersConfig')).toEqual(draft.officers);
      expect(readStorage('lojaConfig')).toEqual(draft.lojaConfig);
    });

    it('deve ignorar residuos de documentos ao carregar payload legado', () => {
      seedStorage('ataDraft', makeLegacyAtaDraft());

      const loaded = storage.loadAtaDraft(makeAtaDraft({ visitors: [] }));

      expect(loaded).not.toHaveProperty('documents');
      expect(loaded).not.toHaveProperty('docStatus');
      expect(loaded).not.toHaveProperty('docDraft');
      expect(loaded.visitors).toEqual(['Visitante 1']);
    });

    it('deve usar officersConfig e lojaConfig legados quando o draft canonico ainda nao existir', () => {
      seedStorage('officersConfig', { vm: 'Mestre', vig1: '', vig2: '', or: '', sec: '' });
      seedStorage('lojaConfig', {
        logoDataUrl: null,
        nomeLoja: 'Loja Legada',
        numeroLoja: '29',
        dataFundacaoISO: '',
        temploNome: '',
        enderecoTemplo: '',
        cidadeEstado: '',
      });

      const loaded = storage.loadAtaDraft(makeAtaDraft({ visitors: [] }));

      expect(loaded.officers.vm).toBe('Mestre');
      expect(loaded.lojaConfig.nomeLoja).toBe('Loja Legada');
    });
  });

  describe('remove()', () => {
    it('deve remover uma chave do localStorage', () => {
      localStorage.setItem('testKey', 'valor');
      storage.remove('testKey');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('não deve falhar ao remover chave inexistente', () => {
      expect(() => storage.remove('inexistente')).not.toThrow();
    });
  });

  describe('clear()', () => {
    it('deve limpar todas as chaves do localStorage', () => {
      localStorage.setItem('a', '1');
      localStorage.setItem('b', '2');
      storage.clear();
      expect(localStorage.length).toBe(0);
    });
  });
});
