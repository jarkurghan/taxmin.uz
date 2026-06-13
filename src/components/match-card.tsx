import Link from "next/link";
import { cn, formatMatchDate, getTeamFlag, getMatchStatusLabel, getPointsLabel } from "@/lib/utils";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  const hasMyPrediction = !!match.myPrediction;

  return (
    <Link href={`/matches/${match.id}`}>
      <div className={cn(
        "bg-white rounded-2xl border transition-all hover:shadow-md hover:border-blue-200 cursor-pointer",
        isLive ? "border-red-200 bg-red-50/30" : "border-gray-100"
      )}>
        {/* Stage + Status */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">{match.stage}{match.groupName ? ` · ${match.groupName}` : ""}</span>
          <span className={cn("text-xs font-semibold", isLive ? "text-red-500" : "text-gray-400")}>
            {isLive ? "🔴 Jonli" : isFinished ? "Tugagan" : formatMatchDate(match.scheduledAt)}
          </span>
        </div>

        {/* Teams + Score */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-3xl">{getTeamFlag(match.homeTeamCode)}</span>
            <span className="text-xs font-semibold text-gray-700 truncate w-full text-center">{match.homeTeam}</span>
            <span className="text-[10px] text-gray-400 font-mono">{match.homeTeamCode}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-0.5 min-w-[80px]">
            {isFinished || isLive ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{match.homeScore ?? 0}</span>
                <span className="text-gray-400 font-bold">:</span>
                <span className="text-2xl font-bold text-gray-900">{match.awayScore ?? 0}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-300">VS</span>
            )}
            {!isFinished && !isLive && (
              <span className="text-xs text-gray-400">{formatMatchDate(match.scheduledAt).split(",")[1]?.trim()}</span>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <span className="text-3xl">{getTeamFlag(match.awayTeamCode)}</span>
            <span className="text-xs font-semibold text-gray-700 truncate w-full text-center">{match.awayTeam}</span>
            <span className="text-[10px] text-gray-400 font-mono">{match.awayTeamCode}</span>
          </div>
        </div>

        {/* My prediction */}
        {hasMyPrediction && (
          <div className={cn(
            "mx-4 mb-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between",
            match.myPrediction!.points !== null ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-600"
          )}>
            <span>
              Mening taxminim: <strong>{match.myPrediction!.homeScore} : {match.myPrediction!.awayScore}</strong>
            </span>
            {match.myPrediction!.points !== null && (
              <span className={cn("font-semibold", getPointsLabel(match.myPrediction!.points).color)}>
                +{match.myPrediction!.points} ball
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
