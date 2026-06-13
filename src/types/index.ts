export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface User {
  id: string;
  telegramId: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
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
  user?: Pick<User, "id" | "firstName" | "username">;
}

export interface Comment {
  id: string;
  predictionId: string;
  content: string;
  createdAt: string;
  user: Pick<User, "id" | "firstName" | "username" | "photoUrl">;
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
  user?: Pick<User, "id" | "firstName" | "lastName" | "username" | "photoUrl">;
  match?: Match;
  reactions?: Reaction[];
  comments?: Comment[];
  myReaction?: string | null;
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
