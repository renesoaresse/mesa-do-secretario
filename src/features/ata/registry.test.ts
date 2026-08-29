import { describe, expect, it } from 'vitest';
import type { Rito } from '../../types/ata';
import { MODULOS_ATA, MODULOS_ATA_LISTA, moduloAtaDoRito, moduloAtaPorSlug } from './registry';
import { DocumentoEscoces } from './ritos/escoces/DocumentoEscoces';

const RITOS: Rito[] = [
  'Rito Escocês Antigo e Aceito',
  'Rito Adonhiramita',
  'Rito de York',
  'Rito de Emulação',
];

describe('registry dos modulos de ata', () => {
  it('tem um modulo para cada rito, com o rito e o slug batendo com a chave', () => {
    expect(MODULOS_ATA_LISTA).toHaveLength(RITOS.length);

    for (const rito of RITOS) {
      const modulo = MODULOS_ATA[rito];
      expect(modulo.rito).toBe(rito);
      expect(modulo.slug).toMatch(/^[a-z]+$/);
    }
  });

  it('nao repete slug entre os ritos', () => {
    const slugs = MODULOS_ATA_LISTA.map((modulo) => modulo.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('resolve o modulo pelo rito da loja e pelo slug da URL', () => {
    expect(moduloAtaDoRito('Rito de York')).toBe(MODULOS_ATA['Rito de York']);
    expect(moduloAtaPorSlug('york')).toBe(MODULOS_ATA['Rito de York']);
  });

  it('nao resolve modulo sem rito escolhido nem para slug desconhecido', () => {
    expect(moduloAtaDoRito('')).toBeNull();
    expect(moduloAtaPorSlug('nao-existe')).toBeNull();
  });

  // Enquanto cada ritual não for especificado, os ritos restantes lavram a ata
  // na forma do Escocês, que é o modelo padrão.
  it.each(['Rito Adonhiramita', 'Rito de Emulação'] as const)(
    'usa o documento do Escoces como modelo padrao do %s',
    (rito) => {
      expect(MODULOS_ATA[rito].Documento).toBe(DocumentoEscoces);
      expect(MODULOS_ATA[rito].secoes).toEqual(MODULOS_ATA['Rito Escocês Antigo e Aceito'].secoes);
    },
  );

  it('da ao Rito de York documento, secoes e oficiais proprios', () => {
    const york = MODULOS_ATA['Rito de York'];

    expect(york.Documento).not.toBe(DocumentoEscoces);
    // O York não tem Orador; quem é nomeado na direção dos trabalhos é o Tesoureiro.
    expect(york.oficiais).toEqual(['vm', 'vig1', 'vig2', 'tes', 'sec']);
    expect(york.secoes).toContain('pranchas');
    expect(york.secoes).toContain('pboLivre');
    expect(york.secoes).not.toContain('balaustre');
    expect(york.secoes).not.toContain('bolsaPropostas');
  });
});
