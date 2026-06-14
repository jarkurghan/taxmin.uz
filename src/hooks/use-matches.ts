"use client";

import { useState, useEffect, useCallback } from "react";
import { matchesAPI, predictionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { Match, Prediction } from "@/types";

// Polling intervallari: live=15s, scheduled=30s, finished=60s
const POLL_INTERVALS: Record<string, number> = {
  live: 15_000,
  scheduled: 30_000,
  finished: 60_000,
};

export function useMatches(status?: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await matchesAPI.getAll({ status });
      setMatches(res.data);
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
    const pollMs = POLL_INTERVALS[status ?? ""] ?? 30_000;
    const timer = setInterval(() => load(true), pollMs);
    return () => clearInterval(timer);
  }, [load, status]);

  return { matches, isLoading, error, reload: () => load(false) };
}

export function useMatch(id: string) {
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    matchesAPI.getById(id).then(setMatch).catch((e) => setError(e.message)).finally(() => setIsLoading(false));
  }, [id]);

  return { match, isLoading, error, setMatch };
}

export function useMatchPredictions(matchId: string) {
  const user = useAuth((s) => s.user);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    matchesAPI
      .getPredictions(matchId)
      .then((res) => setPredictions(res.data))
      .finally(() => setIsLoading(false));
  }, [matchId, user]);

  const add = (pred: Prediction) => {
    setPredictions((prev) => [pred, ...prev]);
  };

  const remove = (predictionId: string) => {
    setPredictions((prev) => prev.filter((p) => p.id !== predictionId));
  };

  return { predictions, isLoading, unauthorized: !user, add, remove };
}
