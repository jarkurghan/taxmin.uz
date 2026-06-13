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

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    predictionsAPI.getMine(1)
      .then((res) => setPredictions(res.data))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">👤</p>
        <p className="text-gray-600 mb-4">Profilingizni ko'rish uchun kiring</p>
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
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        {user.photoUrl ? (
          <Image src={user.photoUrl} alt="" width={72} height={72} className="rounded-full mx-auto mb-3" />
        ) : (
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-2xl flex items-center justify-center font-bold mx-auto mb-3">
            {user.firstName[0]}
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-900">{getUserDisplayName(user)}</h1>
        {user.username && <p className="text-sm text-gray-500">@{user.username}</p>}

        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{user.totalPoints}</p>
            <p className="text-xs text-gray-500">Jami ball</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{exact}</p>
            <p className="text-xs text-gray-500">Aniq 🎯</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{total > 0 ? Math.round((correct / total) * 100) : 0}%</p>
            <p className="text-xs text-gray-500">To'g'ri</p>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="mt-4 text-red-500 hover:text-red-600" onClick={logout}>
          Chiqish
        </Button>
      </div>

      {/* Predictions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-700">Mening taxminlarim</h2>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))
        ) : predictions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-3xl mb-2">🔮</p>
            <p className="text-sm">Hali taxmin yo'q</p>
          </div>
        ) : (
          predictions.map((p) => <PredictionCard key={p.id} prediction={p} showMatch />)
        )}
      </div>
    </div>
  );
}
