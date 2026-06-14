"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MatchCard } from "@/components/match-card";
import { useMatches } from "@/hooks/use-matches";
import { cn } from "@/lib/utils";

type Filter = "scheduled" | "live" | "finished";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "Kutilmoqda", value: "scheduled" },
  { label: "🔴 Jonli", value: "live" },
  { label: "Tugagan", value: "finished" },
];

const VALID: Filter[] = ["scheduled", "live", "finished"];

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tab");
  const filter: Filter = VALID.includes(raw as Filter) ? (raw as Filter) : "scheduled";
  const setFilter = (value: Filter) => router.replace(`/?tab=${value}`);
  const { matches, isLoading, error } = useMatches(filter);

  const grouped = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    const key = m.stage;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(5,46,22,0.9) 0%, rgba(7,8,13,0.95) 50%, rgba(30,27,75,0.8) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 25% 50%, rgba(34,197,94,0.12) 0%, transparent 60%)",
          }}
        />
        {/* Pitch circle decoration */}
        <div
          className="absolute -right-12 top-1/2 -translate-y-1/2 w-52 h-52 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(255,255,255,0.04)" }}
        />
        <div
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(255,255,255,0.04)" }}
        />

        <div className="relative px-6 py-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-live-pulse" />
            <span className="text-[10px] font-bold text-green-400 tracking-[0.3em] uppercase">
              FIFA World Cup 2026
            </span>
          </div>
          <h1 className="font-display font-bold uppercase leading-none">
            <span className="text-4xl text-gradient-white block">Taxminlar</span>
            <span className="text-4xl text-gradient-green block">Ligasi</span>
          </h1>
          <p className="text-zinc-600 text-xs mt-3 tracking-widest uppercase">
            USA · Canada · Mexico
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #22c55e, #15803d)",
                      boxShadow: "0 0 16px rgba(34, 197, 94, 0.25)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-36 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-10 text-sm">{error}</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏟️</p>
          <p className="text-zinc-500 font-medium">Hozircha o'yin yo'q</p>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {Object.entries(grouped).map(([stage, stageMatches]) => (
            <div key={stage} className="space-y-2.5">
              <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em]">
                  {stage}
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
              {stageMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}
