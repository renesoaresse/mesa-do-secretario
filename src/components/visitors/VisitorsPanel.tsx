import React from "react";
import { VisitorsInputRow } from "./VisitorsInputRow";
import { VisitorList } from "./VisitorList";

type Props = {
  items: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
};

export function VisitorsPanel({ items, onAdd, onRemove }: Props) {
  return (
    <section>
      <VisitorsInputRow onAdd={onAdd} />
      <VisitorList items={items} onRemove={onRemove} />
    </section>
  );
}
