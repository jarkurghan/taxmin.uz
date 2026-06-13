"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { predictionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { getTeamFlag, isPredictionLocked } from "@/lib/utils";
import type { Match, Prediction } from "@/types";
import Link from "next/link";

interface PredictionFormProps {
  match: Match;
  onSaved?: (prediction: Prediction) => void;
  onDeleted?: (predictionId: string) => void;
}

function ScoreButton({ label, onClick, variant }: { label: string; onClick: () => void; variant: "up" | "down" }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-90"
      style={{
        background: variant === "up" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.08)",
        border: variant === "up" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.15)",
        color: variant === "up" ? "#4ade80" : "#f87171",
      }}
    >
      {label}
    </button>
  );
}

export function PredictionForm({ match, onSaved, onDeleted }: PredictionFormProps) {
  const { user } = useAuth();
  const existing = match.myPrediction;

  const [home, setHome] = useState(existing?.homeScore ?? 0);
  const [away, setAway] = useState(existing?.awayScore ?? 0);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locked = isPredictionLocked(match.scheduledAt);
  const isFinished = match.status === "finished";
  const isScheduled = match.status === "scheduled";

  const adjust = (setter: (v: number) => void, val: number, delta: number) => {
    setter(Math.max(0, Math.min(30, val + delta)));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const pred = await predictionsAPI.create({ matchId: match.id, homeScore: home, awayScore: away });
      onSaved?.(pred);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existing?.id) return;
    setDeleting(true);
    try {
      await predictionsAPI.delete(existing.id);
      onDeleted?.(existing.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (!user) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-3xl mb-3">🔒</p>
        <p className="text-sm text-zinc-400 mb-4">Taxmin qilish uchun kiring</p>
        <Link href="/auth/telegram/callback">
          <Button size="sm">Telegram orqali kirish</Button>
        </Link>
      </div>
    );
  }

  // O'yin tugagan
  if (isFinished) {
    if (!existing) return null;
    return (
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Mening taxminim</p>
        <p className="text-3xl font-display font-bold text-white">{existing.homeScore} : {existing.awayScore}</p>
        {existing.points !== null && (
          <p className="text-sm text-green-400 font-semibold mt-1">+{existing.points} ball</p>
        )}
      </div>
    );
  }

  // Vaqt tugagan yoki o'yin boshlanmoqda
  if (locked || !isScheduled) {
    if (!existing) {
      return (
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm text-zinc-600">Taxmin qilish muddati tugadi</p>
        </div>
      );
    }
    return (
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Mening taxminim · yakunlangan</p>
        <p className="text-3xl font-display font-bold text-white">{existing.homeScore} : {existing.awayScore}</p>
      </div>
    );
  }

  // Taxmin allaqachon yozilgan — faqat ko'rsatish + o'chirish
  if (existing) {
    return (
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Mening taxminim</p>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
              >
                {deleting ? "..." : "Ha, o'chir"}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-zinc-600 hover:text-zinc-400">
                Bekor
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-zinc-700 hover:text-red-400 transition-colors"
            >
              O'chirish
            </button>
          )}
        </div>
        <p className="text-3xl font-display font-bold text-white mt-2">
          {existing.homeScore} : {existing.awayScore}
        </p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
    );
  }

  // Yangi taxmin formasi
  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }}
      />
      <div className="px-6 py-6">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em] text-center mb-6">
          Taxminingizni kiriting
        </p>

        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl leading-none">{getTeamFlag(match.homeTeamCode)}</span>
            <div className="flex flex-col items-center gap-2">
              <ScoreButton label="+" onClick={() => adjust(setHome, home, 1)} variant="up" />
              <span className="text-5xl font-display font-bold text-white tabular-nums w-14 text-center leading-none py-1">{home}</span>
              <ScoreButton label="−" onClick={() => adjust(setHome, home, -1)} variant="down" />
            </div>
          </div>

          <span className="text-4xl font-display font-bold" style={{ color: "rgba(255,255,255,0.08)" }}>:</span>

          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl leading-none">{getTeamFlag(match.awayTeamCode)}</span>
            <div className="flex flex-col items-center gap-2">
              <ScoreButton label="+" onClick={() => adjust(setAway, away, 1)} variant="up" />
              <span className="text-5xl font-display font-bold text-white tabular-nums w-14 text-center leading-none py-1">{away}</span>
              <ScoreButton label="−" onClick={() => adjust(setAway, away, -1)} variant="down" />
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-400 text-center mt-4">{error}</p>}

        <Button className="w-full mt-6" loading={loading} onClick={handleSubmit}>
          Taxmin qilish
        </Button>
      </div>
    </div>
  );
}
