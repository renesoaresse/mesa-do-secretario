import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "btn";
  const v = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <button
      {...props}
      className={`${base} ${v} ${className}`.trim()}
    />
  );
}
