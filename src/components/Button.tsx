import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";

const variants: Record<string, string> = {
  primary:
    "bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 shadow-md shadow-orange-200 focus:ring-orange-500/40",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-2.5 focus:ring-slate-400",
  danger:
    "bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 shadow-md shadow-rose-200 focus:ring-rose-500/40",
  ghost:
    "bg-transparent text-orange-600 hover:bg-orange-50 px-4 py-2 focus:ring-orange-500/20",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
