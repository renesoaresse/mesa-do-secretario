import { describe, it, expect, beforeEach } from 'vitest';
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
