import { useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type Props = {
  items: TabItem[];
  /** Aba aberta ao montar; por padrão, a primeira. Ignorado no modo controlado. */
  defaultTabId?: string;
  /** Informe junto com onTabChange para controlar a aba ativa de fora. */
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  /** Rótulo do conjunto de abas para leitores de tela. */
  ariaLabel: string;
};

export function Tabs({ items, defaultTabId, activeTabId, onTabChange, ariaLabel }: Props) {
  const baseId = useId();
  const [internalId, setInternalId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeId = activeTabId ?? internalId;

  function selectTab(tabId: string) {
    setInternalId(tabId);
    onTabChange?.(tabId);
  }

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = items[activeIndex] ?? items[0];

  // Setas navegam entre as abas, como esperado por leitores de tela.
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    const nextIndex = (activeIndex + step + items.length) % items.length;
    const nextId = items[nextIndex].id;
    selectTab(nextId);
    tabRefs.current[nextId]?.focus();
  }

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label={ariaLabel}>
        {items.map((item) => {
          const selected = item.id === activeItem?.id;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              className={`tabs__tab${selected ? ' tabs__tab--active' : ''}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(item.id)}
              onKeyDown={handleKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.id}`}
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          className="tabs__panel"
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}
