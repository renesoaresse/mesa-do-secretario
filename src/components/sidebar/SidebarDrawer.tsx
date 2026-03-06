import { useState, ReactNode } from "react";

type SidebarDrawerProps = {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function SidebarDrawer({
  title,
  icon,
  defaultOpen = true,
  children,
}: SidebarDrawerProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`sidebar-drawer ${open ? "is-open" : ""}`}>
      <header
        className="sidebar-drawer__header"
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-expanded={open}
      >
        <div className="sidebar-drawer__title">
          {icon && <span className="sidebar-drawer__icon">{icon}</span>}
          <span>{title}</span>
        </div>

        <span className="sidebar-drawer__chevron">
          {open ? "▾" : "▸"}
        </span>
      </header>

      <div className="sidebar-drawer__content">
        {children}
      </div>
    </section>
  );
}
