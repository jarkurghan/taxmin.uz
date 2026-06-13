"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { reactionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, formatRelativeTime, getPointsLabel, cn } from "@/lib/utils";
import type { Prediction, Reaction } from "@/types";

const EMOJIS = ["🔥", "❤️", "😲", "👏", "😢"];

interface PredictionCardProps {
  prediction: Prediction;
  showMatch?: boolean;
}

export function PredictionCard({ prediction, showMatch = false }: PredictionCardProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(prediction.reactions ?? []);
  const [myReaction, setMyReaction] = useState<string | null>(prediction.myReaction ?? null);
  const [showReactionBar, setShowReactionBar] = useState(false);

  const grouped = EMOJIS.map((emoji) => ({
    emoji,
    count: reactions.filter((r) => r.emoji === emoji).length,
  })).filter((g) => g.count > 0);

  const handleReaction = async (emoji: string) => {
    if (!user) return;
    setShowReactionBar(false);

    const prev = myReaction;
    const prevReactions = reactions;

    if (myReaction === emoji) {
      setMyReaction(null);
      setReactions((r) => r.filter((rx) => !(rx.userId === user.id && rx.emoji === emoji)));
    } else {
      if (myReaction) {
        setReactions((r) => r.filter((rx) => !(rx.userId === user.id)));
      }
      setMyReaction(emoji);
      setReactions((r) => [...r.filter((rx) => rx.userId !== user.id), { id: "temp", predictionId: prediction.id, userId: user.id, emoji, createdAt: new Date().toISOString() }]);
    }

    try {
      await reactionsAPI.toggle(prediction.id, emoji);
    } catch {
      setMyReaction(prev);
      setReactions(prevReactions);
    }
  };

  const pred = prediction;
  const { label: pointsLabel, color: pointsColor } = getPointsLabel(pred.points);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      {/* User row */}
      <div className="flex items-center justify-between">
        <Link href={`/profile/${pred.user?.id}`} className="flex items-center gap-2 min-w-0">
          {pred.user?.photoUrl ? (
            <Image src={pred.user.photoUrl} alt="" width={32} height={32} className="rounded-full flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-sm flex items-center justify-center font-bold flex-shrink-0">
              {pred.user?.firstName[0]}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {pred.user ? getUserDisplayName(pred.user) : "Foydalanuvchi"}
            </p>
            <p className="text-xs text-gray-400">{formatRelativeTime(pred.createdAt)}</p>
          </div>
        </Link>

        {pred.points !== null && (
          <span className={cn("text-xs font-bold shrink-0", pointsColor)}>
            +{pred.points} • {pointsLabel}
          </span>
        )}
      </div>

      {/* Score prediction */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-center gap-4">
        <span className="text-2xl font-bold text-gray-900">{pred.homeScore}</span>
        <span className="text-gray-400 font-bold text-lg">:</span>
        <span className="text-2xl font-bold text-gray-900">{pred.awayScore}</span>
      </div>

      {/* Reactions row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {grouped.map(({ emoji, count }) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-sm border transition-all",
                myReaction === emoji
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <span>{emoji}</span>
              <span className="text-xs font-medium">{count}</span>
            </button>
          ))}

          {user && user.id !== pred.userId && (
            <div className="relative">
              <button
                onClick={() => setShowReactionBar(!showReactionBar)}
                className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-200 transition-colors text-sm flex items-center justify-center"
              >
                {myReaction ?? "+"}
              </button>
              {showReactionBar && (
                <div className="absolute bottom-9 left-0 bg-white border border-gray-200 rounded-2xl px-2 py-1.5 flex gap-1 shadow-lg z-10">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => handleReaction(e)}
                      className={cn("text-xl p-1 rounded-xl hover:bg-gray-100 transition-colors", myReaction === e && "bg-blue-50")}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
