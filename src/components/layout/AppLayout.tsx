import React from 'react';

type AppLayoutProps = {
  sidebar: React.ReactNode;
  main: React.ReactNode;
};

export function AppLayout({ sidebar, main }: AppLayoutProps) {
  return (
    <div className="app-layout">
      {sidebar}
      {main}
    </div>
  );
}
