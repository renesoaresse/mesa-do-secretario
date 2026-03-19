import type { ReactNode } from 'react';

type HomeLayoutProps = {
  children: ReactNode;
};

export function HomeLayout({ children }: HomeLayoutProps) {
  return <div className="home-layout">{children}</div>;
}
