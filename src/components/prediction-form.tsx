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
}

export function PredictionForm({ match, onSaved }: PredictionFormProps) {
  const { user } = useAuth();
  const existing = match.myPrediction;

  const [home, setHome] = useState(existing?.homeScore ?? 0);
  const [away, setAway] = useState(existing?.awayScore ?? 0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locked = isPredictionLocked(match.scheduledAt);
  const isFinished = match.status === "finished";

  const adjust = (setter: (v: number) => void, val: number, delta: number) => {
    const next = Math.max(0, Math.min(30, val + delta));
    setter(next);
    setSaved(false);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const pred = await predictionsAPI.create({ matchId: match.id, homeScore: home, awayScore: away });
      setSaved(true);
      onSaved?.(pred);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-600 mb-3">Taxmin qilish uchun Telegram orqali kiring</p>
        <Link href="/auth/telegram/callback">
          <Button size="sm">Telegram orqali kirish</Button>
        </Link>
      </div>
    );
  }

  if (isFinished) {
    if (!existing) return null;
    return (
      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 mb-1">Mening taxminim</p>
        <p className="text-lg font-bold">{existing.homeScore} : {existing.awayScore}</p>
        {existing.points !== null && (
          <p className="text-sm text-blue-600 font-semibold mt-1">+{existing.points} ball</p>
        )}
      </div>
    );
  }

  if (locked) {
    if (!existing) {
      return (
        <div className="bg-gray-50 rounded-2xl p-4 text-center text-sm text-gray-500">
          Taxmin qilish muddati tugadi
        </div>
      );
    }
    return (
      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-xs text-gray-500 mb-1">Mening taxminim (yakunlangan)</p>
        <p className="text-lg font-bold">{existing.homeScore} : {existing.awayScore}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
        {existing ? "Taxminni yangilash" : "Taxminingizni kiriting"}
      </h3>

      <div className="flex items-center justify-center gap-6">
        {/* Home score */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">{getTeamFlag(match.homeTeamCode)}</span>
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => adjust(setHome, home, 1)} className="w-8 h-8 rounded-full bg-white shadow text-lg font-bold text-blue-600 hover:bg-blue-50 transition-colors">+</button>
            <span className="text-3xl font-bold text-gray-900 w-10 text-center">{home}</span>
            <button onClick={() => adjust(setHome, home, -1)} className="w-8 h-8 rounded-full bg-white shadow text-lg font-bold text-blue-600 hover:bg-blue-50 transition-colors">−</button>
          </div>
        </div>

        <span className="text-2xl font-bold text-gray-300">:</span>

        {/* Away score */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">{getTeamFlag(match.awayTeamCode)}</span>
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => adjust(setAway, away, 1)} className="w-8 h-8 rounded-full bg-white shadow text-lg font-bold text-blue-600 hover:bg-blue-50 transition-colors">+</button>
            <span className="text-3xl font-bold text-gray-900 w-10 text-center">{away}</span>
            <button onClick={() => adjust(setAway, away, -1)} className="w-8 h-8 rounded-full bg-white shadow text-lg font-bold text-blue-600 hover:bg-blue-50 transition-colors">−</button>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 text-center mt-3">{error}</p>}

      <Button
        className="w-full mt-4"
        loading={loading}
        onClick={handleSubmit}
        variant={saved ? "secondary" : "primary"}
      >
        {saved ? "✓ Saqlandi" : existing ? "Yangilash" : "Taxmin qilish"}
      </Button>
    </div>
  );
}
