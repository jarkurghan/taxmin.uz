"use client";

import { useState, useEffect, useCallback } from "react";
import { matchesAPI, predictionsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { Match, Prediction } from "@/types";

export function useMatches(status?: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await matchesAPI.getAll({ status });
      setMatches(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xato yuz berdi");
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  return { matches, isLoading, error, reload: load };
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
