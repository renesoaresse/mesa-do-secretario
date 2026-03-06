import React from "react";

type SidebarProps = {
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export function Sidebar({ header, children, footer }: SidebarProps) {
  return (
    <aside className="sidebar">
      {header}
      <div>{children}</div>
      {footer}
    </aside>
  );
}
