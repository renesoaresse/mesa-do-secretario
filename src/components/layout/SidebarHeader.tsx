import React from 'react';

type Props = {
  title: string;
  badgeText?: React.ReactNode;
  counterText?: string;
};

export function SidebarHeader({ title, badgeText, counterText }: Props) {
  return (
    <header className="sidebar-header">
      <div className="sidebar-header__top">
        <h1 className="sidebar-title">{title}</h1>

        {badgeText ?? null}
      </div>

      {counterText ? (
        <div className="sidebar-header__meta">
          {counterText ? <div className="sidebar-header__metaLine">{counterText}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
