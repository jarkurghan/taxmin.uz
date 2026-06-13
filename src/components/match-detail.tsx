"use client";

import { useMatch, useMatchPredictions } from "@/hooks/use-matches";
import { PredictionForm } from "@/components/prediction-form";
import { PredictionCard } from "@/components/prediction-card";
import { getTeamFlag, formatMatchDate, cn } from "@/lib/utils";
import Link from "next/link";
import type { Prediction } from "@/types";

interface MatchDetailProps {
  id: string;
  backSlot?: React.ReactNode;
}

export function MatchDetail({ id, backSlot }: MatchDetailProps) {
  const { match, isLoading: matchLoading, setMatch } = useMatch(id);
  const { predictions, isLoading: predsLoading, unauthorized, addOrUpdate } = useMatchPredictions(id);

  if (matchLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl h-56 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="rounded-2xl h-36 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    );
  }

  if (!match) {
    return <div className="text-center text-zinc-500 py-16">O'yin topilmadi</div>;
  }

  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <div className="space-y-4 animate-fade-in">
      {backSlot}

      {/* Match header card */}
      <div
        className="relative rounded-3xl overflow-hidden text-center"
        style={{
          background: isLive
            ? "linear-gradient(160deg, rgba(30,6,6,0.9) 0%, rgba(7,8,13,0.97) 60%)"
            : "linear-gradient(160deg, rgba(5,46,22,0.6) 0%, rgba(7,8,13,0.97) 60%)",
          border: isLive ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Ambient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLive
              ? "radial-gradient(circle at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)",
          }}
        />
        {/* Pitch circle */}
        <div
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-60 h-60 rounded-full pointer-events-none opacity-[0.03]"
          style={{ border: "2px solid white" }}
        />

        <div className="relative px-6 py-8">
          {/* Stage + status */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
              {match.stage}
              {match.groupName ? ` · ${match.groupName}` : ""}
            </span>
            <span className="text-zinc-700">·</span>
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-live-pulse" />
                Jonli
              </span>
            ) : (
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
                {isFinished ? "Tugagan" : formatMatchDate(match.scheduledAt)}
              </span>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center justify-center gap-4">
            {/* Home */}
            <div className="flex-1 flex flex-col items-center gap-2.5">
              <span className="text-[56px] leading-none">{getTeamFlag(match.homeTeamCode)}</span>
              <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{match.homeTeam}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
              {isFinished || isLive ? (
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-display font-bold text-white tabular-nums leading-none">
                    {match.homeScore ?? 0}
                  </span>
                  <span className="text-3xl font-display font-bold text-zinc-700">:</span>
                  <span className="text-6xl font-display font-bold text-white tabular-nums leading-none">
                    {match.awayScore ?? 0}
                  </span>
                </div>
              ) : (
                <div
                  className="px-6 py-3 rounded-2xl"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="text-2xl font-display font-bold text-zinc-700 tracking-widest">VS</span>
                </div>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 flex flex-col items-center gap-2.5">
              <span className="text-[56px] leading-none">{getTeamFlag(match.awayTeamCode)}</span>
              <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{match.awayTeam}</span>
            </div>
          </div>

          {match.venue && (
            <p className="text-xs text-zinc-700 mt-5">📍 {match.venue}</p>
          )}
        </div>
      </div>

      {/* Prediction form */}
      <PredictionForm
        match={match}
        onSaved={(pred: Prediction) => {
          addOrUpdate(pred);
          setMatch({
            ...match,
            myPrediction: {
              homeScore: pred.homeScore,
              awayScore: pred.awayScore,
              points: pred.points,
            },
          });
        }}
      />

      {/* Predictions list */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em] flex-shrink-0">
            Taxminlar
            {predictions.length > 0 && (
              <span className="ml-1.5 text-zinc-700">({predictions.length})</span>
            )}
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {unauthorized ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-sm text-zinc-500 mb-4">Taxminlarni ko'rish uchun tizimga kiring</p>
            <Link
              href="/auth/telegram/callback"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
            >
              Kirish
            </Link>
          </div>
        ) : predsLoading && predictions.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-24 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))
        ) : predictions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-sm text-zinc-500">Hali taxmin yo'q. Birinchi bo'ling!</p>
          </div>
        ) : (
          <>
            {predictions.map((pred) => (
              <PredictionCard key={pred.id} prediction={pred} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
