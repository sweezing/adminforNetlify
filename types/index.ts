export type Role = 'ADMIN' | 'CLIENT';

export interface User {
  id: number;
  login: string;
  email: string;
  avatarUrl?: string | null;
  role: Role;
  createdAt?: string;
}

export interface WaterBodyPassport {
  id?: number;
  waterBodyId?: number;
  surfaceArea?: number | null;
  maxDepth?: number | null;
  avgDepth?: number | null;
  volume?: number | null;
  catchmentArea?: number | null;
  salinity?: number | null;
  altitude?: number | null;
  inflow?: string | null;
  outflow?: string | null;
}

export interface Measurement {
  id: number;
  waterBodyId: number;
  date: string;
  waterLevel?: number | null;
  temperature?: number | null;
  pH?: number | null;
  oxygen?: number | null;
  transparency?: number | null;
  turbidity?: number | null;
  notes?: string | null;
}

export interface WaterBody {
  id: number;
  name: string;
  type: string;
  region: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  createdAt?: string;
  passport?: WaterBodyPassport | null;
  measurements?: Measurement[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalUsers: number;
  adminCount: number;
  clientCount: number;
  waterBodyCount: number;
  measurementCount: number;
}
