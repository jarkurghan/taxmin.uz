import type {
  AuthResponse, Match, Prediction, User, Comment,
  PaginatedResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tl_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Server xatosi" }));
    throw new Error((err as { error?: string }).error ?? "Xato yuz berdi");
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  loginWidget: (data: object) =>
    request<AuthResponse>("/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ type: "widget", data }),
    }),
  loginMiniApp: (initData: string) =>
    request<AuthResponse>("/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ type: "miniapp", initData }),
    }),
};

// ─── Matches ──────────────────────────────────────────────────────────────────

export const matchesAPI = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    return request<PaginatedResponse<Match>>(`/matches?${query}`);
  },
  getById: (id: string) => request<Match>(`/matches/${id}`),
  getPredictions: (id: string, page = 1) =>
    request<PaginatedResponse<Prediction>>(`/matches/${id}/predictions?page=${page}`),
};

// ─── Predictions ──────────────────────────────────────────────────────────────

export const predictionsAPI = {
  create: (data: { matchId: string; homeScore: number; awayScore: number }) =>
    request<Prediction>("/predictions", { method: "POST", body: JSON.stringify(data) }),
  getMine: (page = 1) =>
    request<PaginatedResponse<Prediction>>(`/predictions/me?page=${page}`),
  getById: (id: string) => request<Prediction>(`/predictions/${id}`),
};

// ─── Reactions ────────────────────────────────────────────────────────────────

export const reactionsAPI = {
  toggle: (predictionId: string, emoji: string) =>
    request<{ removed?: boolean } | { id: string; emoji: string }>(
      `/predictions/${predictionId}/reactions`,
      { method: "POST", body: JSON.stringify({ emoji }) }
    ),
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const commentsAPI = {
  getAll: (predictionId: string) =>
    request<{ data: Comment[] }>(`/predictions/${predictionId}/comments`),
  create: (predictionId: string, content: string, parentId?: string) =>
    request<Comment>(`/predictions/${predictionId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content, ...(parentId && { parentId }) }),
    }),
  update: (predictionId: string, commentId: string, content: string) =>
    request<Comment>(`/predictions/${predictionId}/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),
  delete: (predictionId: string, commentId: string) =>
    request<{ success: boolean }>(`/predictions/${predictionId}/comments/${commentId}`, {
      method: "DELETE",
    }),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersAPI = {
  getMe: () => request<User>("/users/me"),
  getById: (id: string) =>
    request<User & { predictions: Prediction[] }>(`/users/${id}`),
  getLeaderboard: (page = 1) =>
    request<PaginatedResponse<User>>(`/users/leaderboard?page=${page}`),
};
