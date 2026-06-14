export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface User {
  id: string;
  telegramId: number;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
  totalPoints: number;
  createdAt: string;
}

export interface Match {
  id: string;
  externalId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamCode: string;
  awayTeamCode: string;
  homeScore: number | null;
  awayScore: number | null;
  scheduledAt: string;
  status: MatchStatus;
  stage: string;
  groupName: string | null;
  matchday: number | null;
  venue: string | null;
  myPrediction?: {
    id: string;
    homeScore: number;
    awayScore: number;
    points: number | null;
  } | null;
}

export interface Reaction {
  id: string;
  predictionId: string;
  userId: string;
  emoji: string;
  createdAt: string;
  user?: Pick<User, "id" | "firstName" | "photoUrl">;
}

export interface Comment {
  id: string;
  predictionId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "firstName" | "photoUrl">;
  replies?: Omit<Comment, "replies">[];
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  points: number | null;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "firstName" | "lastName" | "photoUrl">;
  match?: Match;
  reactions?: Reaction[];
  comments?: Comment[];
  myReaction?: string | null;
  commentCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
