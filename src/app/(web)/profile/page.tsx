"use client";

import { useAuth } from "@/hooks/use-auth";
import { predictionsAPI } from "@/lib/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PredictionCard } from "@/components/prediction-card";
import { Button } from "@/components/ui/button";
import { getUserDisplayName } from "@/lib/utils";
import type { Prediction } from "@/types";
import Link from "next/link";

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div
      className="flex-1 rounded-2xl px-3 py-4 text-center"
      style={{
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p className="text-2xl font-display font-bold text-white leading-none">{value}</p>
      <p className="text-[10px] text-zinc-600 mt-1.5 uppercase tracking-wide">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    predictionsAPI
      .getMine(1)
      .then((res) => setPredictions(res.data))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">👤</p>
        <p className="text-zinc-500 mb-5">Profilingizni ko'rish uchun kiring</p>
        <Link href="/auth/telegram/callback">
          <Button>Telegram orqali kirish</Button>
        </Link>
      </div>
    );
  }

  const exact = predictions.filter((p) => p.points === 5).length;
  const correct = predictions.filter((p) => p.points !== null && p.points > 0).length;
  const total = predictions.filter((p) => p.points !== null).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Profile card */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Banner */}
        <div
          className="h-20 w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(5,46,22,0.9) 0%, rgba(30,27,75,0.6) 50%, rgba(7,8,13,0.8) 100%)",
          }}
        />

        {/* Avatar — overlaps banner */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          {user.photoUrl ? (
            <Image
              src={user.photoUrl}
              alt=""
              width={84}
              height={84}
              className="rounded-full"
              style={{ border: "3px solid rgba(7,8,13,1)" }}
            />
          ) : (
            <div
              className="w-[84px] h-[84px] rounded-full text-white text-3xl flex items-center justify-center font-bold"
              style={{
                background: "linear-gradient(135deg, #22c55e, #15803d)",
                border: "3px solid rgba(7,8,13,1)",
              }}
            >
              {user.firstName[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-[52px] pb-6 px-5 text-center">
          <h1 className="text-xl font-bold text-zinc-100">{getUserDisplayName(user)}</h1>
          {user.username && (
            <p className="text-sm text-zinc-600 mt-0.5">@{user.username}</p>
          )}

          {/* Stats */}
          <div className="flex gap-3 mt-5">
            <StatBox value={user.totalPoints} label="Jami ball" />
            <StatBox value={`🎯 ${exact}`} label="Aniq" />
            <StatBox value={`${total > 0 ? Math.round((correct / total) * 100) : 0}%`} label="To'g'ri" />
          </div>

          <button
            onClick={logout}
            className="mt-4 text-xs text-zinc-700 hover:text-red-400 transition-colors"
          >
            Chiqish
          </button>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em] flex-shrink-0">
            Mening taxminlarim
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl h-28 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))
        ) : predictions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">🔮</p>
            <p className="text-sm text-zinc-500">Hali taxmin yo'q</p>
          </div>
        ) : (
          predictions.map((p) => <PredictionCard key={p.id} prediction={p} showMatch />)
        )}
      </div>
    </div>
  );
}
