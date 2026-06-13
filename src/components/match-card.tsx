import Link from "next/link";
import { cn, formatMatchDate, getTeamFlag, getPointsLabel } from "@/lib/utils";
import type { Match } from "@/types";

interface MatchCardProps {
    match: Match;
    linkBase?: string;
}

export function MatchCard({ match, linkBase = "/matches" }: MatchCardProps) {
    const isFinished = match.status === "finished";
    const isLive = match.status === "live";
    const hasMyPrediction = !!match.myPrediction;

    return (
        <Link href={`${linkBase}/${match.id}`}>
            <div
                className={cn(
                    "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] mb-1",
                    isLive && "shadow-[0_0_30px_rgba(239,68,68,0.12)]",
                )}
                style={{
                    background: isLive ? "rgba(30,6,6,0.7)" : "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    border: isLive ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* Live gradient overlay */}
                {isLive && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 70%)",
                        }}
                    />
                )}

                {/* Top bar */}
                <div className="px-4 pt-3.5 pb-0 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 font-medium tracking-wide uppercase">
                        {match.stage}
                        {match.groupName ? ` · ${match.groupName}` : ""}
                    </span>
                    {isLive ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-live-pulse" />
                            Jonli
                        </span>
                    ) : (
                        <span className={cn("text-[10px] font-semibold tracking-wide", isFinished ? "text-zinc-600" : "text-green-400")}>
                            {isFinished ? "Tugagan" : formatMatchDate(match.scheduledAt)}
                        </span>
                    )}
                </div>

                {/* Main: Teams + Score */}
                <div className="px-4 py-4 flex items-center gap-2">
                    {/* Home team */}
                    <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <span className="text-[42px] leading-none">{getTeamFlag(match.homeTeamCode)}</span>
                        <span className="text-[11px] font-bold text-zinc-300 truncate w-full text-center uppercase tracking-wide">{match.homeTeam}</span>
                    </div>

                    {/* Score / VS */}
                    <div className="flex flex-col items-center shrink-0 mx-1">
                        {isFinished || isLive ? (
                            <div
                                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl"
                                style={{
                                    background: "rgba(0,0,0,0.5)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <span className="text-3xl font-display font-bold text-white tabular-nums leading-none">{match.homeScore ?? 0}</span>
                                <span className="text-zinc-700 font-bold text-2xl leading-none">:</span>
                                <span className="text-3xl font-display font-bold text-white tabular-nums leading-none">{match.awayScore ?? 0}</span>
                            </div>
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl min-w-[80px]"
                                style={{
                                    background: "rgba(0,0,0,0.3)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <span className="text-xs font-display font-bold text-zinc-700 tracking-widest uppercase">vs</span>
                                <span className="text-[9px] text-zinc-700 mt-0.5">{formatMatchDate(match.scheduledAt).split(",")[1]?.trim()}</span>
                            </div>
                        )}
                    </div>

                    {/* Away team */}
                    <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <span className="text-[42px] leading-none">{getTeamFlag(match.awayTeamCode)}</span>
                        <span className="text-[11px] font-bold text-zinc-300 truncate w-full text-center uppercase tracking-wide">{match.awayTeam}</span>
                    </div>
                </div>

                {/* Prediction strip */}
                {hasMyPrediction && (
                    <div
                        className="mx-4 mb-4 px-3.5 py-2.5 rounded-xl flex items-center justify-between"
                        style={{
                            background: "rgba(0,0,0,0.35)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm">🔮</span>
                            <span className="text-xs text-zinc-500">
                                Taxminim:{" "}
                                <strong className="text-zinc-300 font-display">
                                    {match.myPrediction!.homeScore} : {match.myPrediction!.awayScore}
                                </strong>
                            </span>
                        </div>
                        {match.myPrediction!.points !== null && (
                            <span className={cn("text-xs font-bold", getPointsLabel(match.myPrediction!.points).color)}>
                                +{match.myPrediction!.points} ball
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
