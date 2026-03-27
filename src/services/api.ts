/// <reference types="vite/client" />
/**
 * API client for backend (http://localhost:8080/api).
 * - Base URL: VITE_API_URL or http://localhost:8080/api
 * - CORS: backend allows origins localhost:3000, 3001, 127.0.0.1:3000, 3001
 * - Protected routes: send header Authorization: Bearer <token>
 */

import type { ApiErrorBody } from '@/types/api';

const DEFAULT_API_BASE = 'http://localhost:8080/api';
const API_BASE = import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE;

const TOKEN_KEY = 'techhome_token';
const USER_KEY = 'techhome_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): { id: number; name: string; email: string; role?: string } | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { id: number; name: string; email: string; role?: string };
  } catch {
    return null;
  }
}

export function setStoredUser(user: { id: number; name: string; email: string; role?: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: ApiErrorBody
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseErrorResponse(res: Response): Promise<ApiError> {
  let body: ApiErrorBody | undefined;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text) as ApiErrorBody;
    } catch {
      body = { message: text };
    }
  }
  const message = body?.message ?? `Request failed: ${res.status} ${res.statusText}`;
  return new ApiError(message, res.status, body);
}

export interface ApiGetOptions {
  /** Send Authorization: Bearer token (default true when API_BASE is set) */
  auth?: boolean;
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.auth !== false && API_BASE) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw await parseErrorResponse(res);
  return res.json();
}

export interface ApiPostOptions {
  auth?: boolean;
}

export async function apiPost<T>(path: string, body: unknown, options: ApiPostOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth !== false && API_BASE) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseErrorResponse(res);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown, options: ApiPostOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth !== false && API_BASE) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseErrorResponse(res);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown, options: ApiPostOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth !== false && API_BASE) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseErrorResponse(res);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiDelete<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.auth !== false && API_BASE) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  if (!res.ok) throw await parseErrorResponse(res);
  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Check if backend is configured and reachable */
export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}
