import React from 'react';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="section-title">
      <div className="section-title__row">
        <h3 className="section-title__text">{title}</h3>
        {subtitle ? <span className="section-title__sub">{subtitle}</span> : null}
      </div>
      <div className="section-title__divider" />
    </div>
  );
}
