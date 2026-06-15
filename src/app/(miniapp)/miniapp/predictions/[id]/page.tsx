"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { predictionsAPI, reactionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import {
  getUserDisplayName,
  formatAbsoluteTime,
  formatMatchDate,
  getTeamFlag,
  getPointsLabel,
  cn,
} from "@/lib/utils";
import { CommentSection } from "@/components/comment-section";
import type { Prediction, Reaction } from "@/types";

const EMOJIS = ["🔥", "❤️", "😲", "👏", "😢"];

interface Props {
  params: Promise<{ id: string }>;
}

export default function MiniAppPredictionPage({ params }: Props) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [showReactionBar, setShowReactionBar] = useState(false);

  useEffect(() => {
    predictionsAPI
      .getById(id)
      .then((pred) => {
        setPrediction(pred);
        setReactions(pred.reactions ?? []);
        setMyReaction(pred.myReaction ?? null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleReaction = async (emoji: string) => {
    if (!user || !prediction) return;
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

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-20 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-28 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-48 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-32 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    );
  }

  if (notFound || !prediction) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🔮</p>
        <p className="text-zinc-500">Taxmin topilmadi</p>
      </div>
    );
  }

  const { match } = prediction;
  const { label: pointsLabel, color: pointsColor } = getPointsLabel(prediction.points);
  const grouped = EMOJIS.map((emoji) => ({
    emoji,
    count: reactions.filter((r) => r.emoji === emoji).length,
  })).filter((g) => g.count > 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-4"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Orqaga
      </button>

      {/* Match header */}
      {match && (
        <Link href={`/miniapp/matches/${match.id}`}>
          <div
            className="rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.02]"
            style={{
              background: "linear-gradient(160deg, rgba(5,46,22,0.5) 0%, rgba(7,8,13,0.97) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                <span className="text-3xl leading-none">{getTeamFlag(match.homeTeamCode)}</span>
                <span className="text-xs font-semibold text-zinc-300 text-center leading-snug">{match.homeTeam}</span>
              </div>

              <div className="shrink-0 text-center px-2">
                {match.homeScore !== null ? (
                  <p className="text-xl font-display font-bold text-white tabular-nums">
                    {match.homeScore} : {match.awayScore}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-zinc-600 tracking-widest">VS</p>
                )}
                <p className="text-[10px] text-zinc-700 uppercase tracking-wide mt-1">{match.stage}</p>
                {match.homeScore === null && (
                  <p className="text-[10px] text-zinc-600 mt-0.5">{formatMatchDate(match.scheduledAt)}</p>
                )}
              </div>

              <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                <span className="text-3xl leading-none">{getTeamFlag(match.awayTeamCode)}</span>
                <span className="text-xs font-semibold text-zinc-300 text-center leading-snug">{match.awayTeam}</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Prediction */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* User */}
        <Link href={`/miniapp/profile/${prediction.user?.id}`} className="flex items-center gap-3">
          {prediction.user?.photoUrl ? (
            <Image
              src={prediction.user.photoUrl}
              alt=""
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
            >
              {prediction.user?.firstName[0]}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {prediction.user ? getUserDisplayName(prediction.user) : "Foydalanuvchi"}
            </p>
            <p className="text-xs text-zinc-600">{formatAbsoluteTime(prediction.createdAt)}</p>
          </div>
        </Link>

        {/* Predicted score */}
        <div>
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest mb-2.5 text-center">Taxmin</p>
          <div
            className="rounded-xl px-8 py-5 flex items-center justify-center gap-6"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-5xl font-display font-bold text-white tabular-nums">{prediction.homeScore}</span>
            <span className="text-3xl font-bold text-zinc-700">:</span>
            <span className="text-5xl font-display font-bold text-white tabular-nums">{prediction.awayScore}</span>
          </div>
        </div>

        {/* Points */}
        {prediction.points !== null && (
          <div className="text-center">
            <span className={cn("text-sm font-bold", pointsColor)}>
              +{prediction.points} ball · {pointsLabel}
            </span>
          </div>
        )}

        <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Reactions */}
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

          {reactions.length > 0 && (
            <div className="flex items-center ml-auto">
              <div className="flex">
                {reactions.slice(0, 5).map((r, i) =>
                  r.user?.photoUrl ? (
                    <img
                      key={r.id}
                      src={r.user.photoUrl}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                      style={{
                        border: "1.5px solid rgba(7,8,13,1)",
                        marginLeft: i === 0 ? 0 : -6,
                        zIndex: 5 - i,
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
                        zIndex: 5 - i,
                        position: "relative",
                      }}
                    >
                      {r.user?.firstName?.[0] ?? "?"}
                    </div>
                  )
                )}
              </div>
              {reactions.length > 5 && (
                <span className="text-[10px] text-zinc-700 ml-1.5">+{reactions.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.25em] mb-3">Izohlar</p>
        <CommentSection
          predictionId={id}
          initialCount={prediction.commentCount ?? 0}
          defaultOpen
        />
      </div>
    </div>
  );
}
