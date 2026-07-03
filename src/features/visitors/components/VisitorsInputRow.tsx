import React, { useState } from 'react';
import type { Loja, LojaConfig, Visitor } from '../../../types/ata';
import { TextInput } from '../../../components/ui/TextInput';
import { Button } from '../../../components/ui/Button';
import { LojaCombobox } from '../../loja-config';

type Props = {
  lojas: Loja[];
  lojaConfig: LojaConfig;
  onAdd: (visitor: Visitor) => void;
  onCreateLoja: (input: Omit<Loja, 'id'>) => Loja;
};

export function VisitorsInputRow({ lojas, lojaConfig, onAdd, onCreateLoja }: Props) {
  const [nome, setNome] = useState('');
  const [loja, setLoja] = useState<Loja | null>(null);

  const submit = () => {
    const name = nome.trim();
    if (!name) return;
    onAdd({
      nome: name,
      lojaId: loja?.id ?? '',
      lojaNome: loja?.nome ?? '',
      oriente: loja?.oriente ?? '',
      potencia: loja?.potencia ?? '',
    });
    setNome('');
    setLoja(null);
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <TextInput
        placeholder="Nome do visitante"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />

      {loja ? (
        <div className="visitor-loja-chip">
          <span className="visitor-loja-chip__text">{loja.nome}</span>
          <button
            type="button"
            className="mini-btn"
            onClick={() => setLoja(null)}
            aria-label="Remover loja escolhida"
          >
            ✕
          </button>
        </div>
      ) : (
        <LojaCombobox
          lojas={lojas}
          lojaConfig={lojaConfig}
          placeholder="Loja do visitante (mín. 3 letras)..."
          onSelect={setLoja}
          onCreateLoja={onCreateLoja}
        />
      )}

      <Button type="button" variant="primary" onClick={submit} style={{ width: '100%' }}>
        Adicionar
      </Button>
    </div>
  );
}
