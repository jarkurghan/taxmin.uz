"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/miniapp", icon: "⚽", label: "O'yinlar", exact: true },
  { href: "/miniapp/leaderboard", icon: "🏆", label: "Reyting" },
  { href: "/miniapp/profile", icon: "👤", label: "Profil" },
];

export function MiniAppNavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50"
      style={{
        background: "rgba(5, 6, 10, 0.97)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.07)",
      }}
    >
      <div className="max-w-2xl mx-auto flex h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
                isActive ? "text-green-400" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <span className={cn("text-xl leading-none transition-transform duration-200", isActive && "scale-110")}>
                {item.icon}
              </span>
              <span
                className={cn(
                  "text-[9px] font-bold tracking-widest uppercase mt-0.5",
                  isActive ? "text-green-400" : "text-zinc-600"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
