"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { reactionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, formatRelativeTime, getPointsLabel, cn } from "@/lib/utils";
import { CommentSection } from "@/components/comment-section";
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
      if (myReaction) setReactions((r) => r.filter((rx) => rx.userId !== user.id));
      setMyReaction(emoji);
      setReactions((r) => [
        ...r.filter((rx) => rx.userId !== user.id),
        { id: "temp", predictionId: prediction.id, userId: user.id, emoji, createdAt: new Date().toISOString() },
      ]);
    }

    try {
      await reactionsAPI.toggle(prediction.id, emoji);
    } catch {
      setMyReaction(prev);
      setReactions(prevReactions);
    }
  };

  const { label: pointsLabel, color: pointsColor } = getPointsLabel(prediction.points);

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* User row */}
      <div className="flex items-center justify-between">
        <Link href={`/profile/${prediction.user?.id}`} className="flex items-center gap-2.5 min-w-0">
          {prediction.user?.photoUrl ? (
            <Image
              src={prediction.user.photoUrl}
              alt=""
              width={32}
              height={32}
              className="rounded-full flex-shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
            >
              {prediction.user?.firstName[0]}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-200 truncate">
              {prediction.user ? getUserDisplayName(prediction.user) : "Foydalanuvchi"}
            </p>
            <p className="text-xs text-zinc-600">{formatRelativeTime(prediction.createdAt)}</p>
          </div>
        </Link>

        {prediction.points !== null && (
          <span className={cn("text-xs font-bold shrink-0 ml-2", pointsColor)}>
            +{prediction.points} · {pointsLabel}
          </span>
        )}
      </div>

      {/* Score */}
      <div
        className="rounded-xl px-6 py-3 flex items-center justify-center gap-5"
        style={{
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-2xl font-display font-bold text-white tabular-nums">{prediction.homeScore}</span>
        <span className="text-zinc-700 text-xl font-bold">:</span>
        <span className="text-2xl font-display font-bold text-white tabular-nums">{prediction.awayScore}</span>
      </div>

      {/* Reactions + Comments */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {grouped.map(({ emoji, count }) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm transition-all duration-150"
            style={
              myReaction === emoji
                ? { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a" }
            }
          >
            <span>{emoji}</span>
            <span className="text-xs font-medium">{count}</span>
          </button>
        ))}

        {user && user.id !== prediction.userId && (
          <div className="relative">
            <button
              onClick={() => setShowReactionBar(!showReactionBar)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#52525b",
              }}
            >
              {myReaction ?? "+"}
            </button>
            {showReactionBar && (
              <div
                className="absolute bottom-9 left-0 flex gap-1 rounded-2xl px-2 py-2 z-10"
                style={{
                  background: "rgba(15, 16, 22, 0.98)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                }}
              >
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => handleReaction(e)}
                    className={cn(
                      "text-xl p-1.5 rounded-xl transition-all",
                      myReaction === e ? "bg-green-900/40" : "hover:bg-white/5"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {prediction.points !== null && (
        <>
          <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <CommentSection
            predictionId={prediction.id}
            initialCount={prediction.comments?.length ?? 0}
          />
        </>
      )}
    </div>
  );
}
