import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "primary" &&
          "text-white hover:opacity-90 active:scale-[0.98]",
        variant === "secondary" &&
          "text-zinc-300 hover:text-zinc-100 active:scale-[0.98]",
        variant === "ghost" &&
          "text-zinc-500 hover:text-zinc-300 active:scale-[0.98]",
        variant === "danger" &&
          "text-red-400 hover:text-red-300 active:scale-[0.98]",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      style={
        variant === "primary"
          ? {
              background: "linear-gradient(135deg, #22c55e, #15803d)",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)",
            }
          : variant === "secondary"
          ? {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }
          : undefined
      }
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
