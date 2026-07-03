import React from 'react';
import type { Loja, LojaConfig, Visitor } from '../../../types/ata';
import { VisitorsInputRow } from './VisitorsInputRow';
import { VisitorList } from './VisitorList';

type Props = {
  items: Visitor[];
  lojas: Loja[];
  lojaConfig: LojaConfig;
  onAdd: (visitor: Visitor) => void;
  onRemove: (index: number) => void;
  onCreateLoja: (input: Omit<Loja, 'id'>) => Loja;
};

export function VisitorsPanel({ items, lojas, lojaConfig, onAdd, onRemove, onCreateLoja }: Props) {
  return (
    <section>
      <VisitorsInputRow
        lojas={lojas}
        lojaConfig={lojaConfig}
        onAdd={onAdd}
        onCreateLoja={onCreateLoja}
      />
      <VisitorList items={items} onRemove={onRemove} />
    </section>
  );
}
