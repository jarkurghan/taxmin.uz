"use client";

import { use } from "react";
import { useMatch, useMatchPredictions } from "@/hooks/use-matches";
import { PredictionForm } from "@/components/prediction-form";
import { PredictionCard } from "@/components/prediction-card";
import { getTeamFlag, formatMatchDate, getMatchStatusLabel, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function MatchPage({ params }: Props) {
  const { id } = use(params);
  const { match, isLoading: matchLoading, setMatch } = useMatch(id);
  const { predictions, isLoading: predsLoading, hasMore, loadMore, addOrUpdate } = useMatchPredictions(id);

  if (matchLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl h-48 animate-pulse" />
        <div className="bg-white rounded-2xl h-32 animate-pulse" />
      </div>
    );
  }

  if (!match) {
    return <div className="text-center text-gray-400 py-12">O'yin topilmadi</div>;
  }

  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <div className="space-y-4">
      {/* Match header */}
      <div className={cn(
        "bg-white rounded-2xl border p-6 text-center",
        isLive ? "border-red-200" : "border-gray-100"
      )}>
        <div className="text-xs font-medium text-gray-500 mb-1">
          {match.stage}{match.groupName ? ` · ${match.groupName}` : ""}
        </div>
        <div className={cn("text-xs font-semibold mb-4", isLive ? "text-red-500" : "text-gray-400")}>
          {isLive ? "🔴 Jonli efir" : isFinished ? "Tugagan" : formatMatchDate(match.scheduledAt)}
        </div>

        <div className="flex items-center justify-center gap-6">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-5xl">{getTeamFlag(match.homeTeamCode)}</span>
            <span className="font-bold text-gray-900">{match.homeTeam}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            {isFinished || isLive ? (
              <div className="text-4xl font-bold text-gray-900">
                {match.homeScore} : {match.awayScore}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-300">VS</div>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-5xl">{getTeamFlag(match.awayTeamCode)}</span>
            <span className="font-bold text-gray-900">{match.awayTeam}</span>
          </div>
        </div>

        {match.venue && (
          <p className="text-xs text-gray-400 mt-3">📍 {match.venue}</p>
        )}
      </div>

      {/* Prediction form */}
      <PredictionForm
        match={match}
        onSaved={(pred: Prediction) => {
          addOrUpdate(pred);
          setMatch({ ...match, myPrediction: { homeScore: pred.homeScore, awayScore: pred.awayScore, points: pred.points } });
        }}
      />

      {/* Predictions list */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-700">
          Taxminlar {predictions.length > 0 ? `(${predictions.length})` : ""}
        </h2>

        {predsLoading && predictions.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
          ))
        ) : predictions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-3xl mb-2">🔮</p>
            <p className="text-sm">Hali taxmin yo'q. Birinchi bo'ling!</p>
          </div>
        ) : (
          <>
            {predictions.map((pred) => (
              <PredictionCard key={pred.id} prediction={pred} />
            ))}
            {hasMore && (
              <Button variant="secondary" className="w-full" onClick={loadMore} loading={predsLoading}>
                Ko'proq ko'rsatish
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
