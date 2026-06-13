"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { reactionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, formatAbsoluteTime, formatMatchTime, getTeamFlag, getPointsLabel, cn } from "@/lib/utils";
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
            <p className="text-xs text-zinc-600">{formatAbsoluteTime(prediction.createdAt)}</p>
          </div>
        </Link>

        {prediction.points !== null && (
          <span className={cn("text-xs font-bold shrink-0 ml-2", pointsColor)}>
            +{prediction.points} · {pointsLabel}
          </span>
        )}
      </div>

      {/* Match header */}
      {showMatch && prediction.match && (
        <Link
          href={`/matches/${prediction.match.id}`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-white/[0.03]"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-base leading-none">{getTeamFlag(prediction.match.homeTeamCode)}</span>
            <span className="text-xs font-semibold text-zinc-300 truncate">{prediction.match.homeTeam}</span>
          </div>
          <div className="shrink-0 text-center px-1">
            {prediction.match.homeScore !== null ? (
              <p className="text-xs font-bold text-zinc-200 tabular-nums">
                {prediction.match.homeScore} : {prediction.match.awayScore}
              </p>
            ) : (
              <p className="text-[10px] text-zinc-500 whitespace-nowrap">
                {formatMatchTime(prediction.match.scheduledAt)}
              </p>
            )}
            <p className="text-[9px] text-zinc-700 uppercase tracking-wide mt-0.5">{prediction.match.stage}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="text-xs font-semibold text-zinc-300 truncate">{prediction.match.awayTeam}</span>
            <span className="text-base leading-none">{getTeamFlag(prediction.match.awayTeamCode)}</span>
          </div>
        </Link>
      )}

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

        {/* Last 3 reactors */}
        {reactions.length > 0 && (
          <div className="flex items-center ml-auto">
            <div className="flex">
              {reactions.slice(0, 3).map((r, i) =>
                r.user?.photoUrl ? (
                  <img
                    key={r.id}
                    src={r.user.photoUrl}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                    style={{
                      border: "1.5px solid rgba(7,8,13,1)",
                      marginLeft: i === 0 ? 0 : -6,
                      zIndex: 3 - i,
                      position: "relative",
                    }}
                  />
                ) : (
                  <div
                    key={r.id}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      fontSize: 8,
                      background: "linear-gradient(135deg, #22c55e, #15803d)",
                      border: "1.5px solid rgba(7,8,13,1)",
                      marginLeft: i === 0 ? 0 : -6,
                      zIndex: 3 - i,
                      position: "relative",
                    }}
                  >
                    {r.user?.firstName?.[0] ?? "?"}
                  </div>
                )
              )}
            </div>
            {reactions.length > 3 && (
              <span className="text-[10px] text-zinc-700 ml-1.5">+{reactions.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
      <CommentSection
        predictionId={prediction.id}
        initialCount={prediction.commentCount ?? prediction.comments?.length ?? 0}
      />
    </div>
  );
}
