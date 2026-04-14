import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearAuth } from './auth';
import type { User, WaterBody, Measurement, AuthResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = getRefreshToken();
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refresh}` },
        });
        saveTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export async function login(login: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', { login, password });
  return data;
}

export async function register(login: string, email: string, password: string, role = 'CLIENT'): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', { login, email, password, role });
  return data;
}

// Users
export async function getUsers(): Promise<User[]> {
  const { data } = await api.get('/users');
  return data;
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function createUser(payload: {
  login: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;
}): Promise<User> {
  const { data } = await api.post('/auth/register', payload);
  return data.user;
}

export async function updateUser(id: number, payload: Partial<User & { password?: string }>): Promise<User> {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

// Water bodies
export async function getWaterBodies(): Promise<WaterBody[]> {
  const { data } = await api.get('/water-bodies');
  return data;
}

export async function getWaterBody(id: number): Promise<WaterBody> {
  const { data } = await api.get(`/water-bodies/${id}`);
  return data;
}

export async function createWaterBody(payload: Partial<WaterBody>): Promise<WaterBody> {
  const { data } = await api.post('/water-bodies', payload);
  return data;
}

export async function updateWaterBody(id: number, payload: Partial<WaterBody>): Promise<WaterBody> {
  const { data } = await api.put(`/water-bodies/${id}`, payload);
  return data;
}

export async function deleteWaterBody(id: number): Promise<void> {
  await api.delete(`/water-bodies/${id}`);
}

// Measurements
export async function getMeasurements(waterBodyId: number): Promise<Measurement[]> {
  const { data } = await api.get(`/water-bodies/${waterBodyId}/measurements`);
  return data;
}

export async function addMeasurement(waterBodyId: number, payload: Partial<Measurement>): Promise<Measurement> {
  const { data } = await api.post(`/water-bodies/${waterBodyId}/measurements`, payload);
  return data;
}

export async function deleteMeasurement(waterBodyId: number, measurementId: number): Promise<void> {
  await api.delete(`/water-bodies/${waterBodyId}/measurements/${measurementId}`);
}
