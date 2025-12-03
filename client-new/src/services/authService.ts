import axios from 'axios';

export type AuthMode = 'email' | 'phone';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

const LOCAL_KEY = 'brx.auth';

const persist = (data: AuthResponse) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
};

export const loadSession = (): AuthResponse | null => {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(LOCAL_KEY);
};

// In absence of backend, simulate auth locally. Swap with real endpoints later.
const mockAuth = async (payload: { mode: AuthMode; identifier: string; password: string }): Promise<AuthResponse> => {
  const user: AuthUser = {
    id: crypto.randomUUID(),
    email: payload.mode === 'email' ? payload.identifier : undefined,
    phone: payload.mode === 'phone' ? payload.identifier : undefined,
    name: 'Utilisateur BRX',
  };
  return {
    user,
    token: btoa(`${payload.identifier}:${Date.now()}`),
  };
};

export const login = async (mode: AuthMode, identifier: string, password: string): Promise<AuthResponse> => {
  // TODO: replace with axios.post('/api/auth/login', { mode, identifier, password })
  // const { data } = await axios.post<AuthResponse>('/api/auth/login', { mode, identifier, password });
  const data = await mockAuth({ mode, identifier, password });
  persist(data);
  return data;
};

export const register = async (mode: AuthMode, identifier: string, password: string): Promise<AuthResponse> => {
  // TODO: replace with axios.post('/api/auth/register', { mode, identifier, password })
  const data = await mockAuth({ mode, identifier, password });
  persist(data);
  return data;
};
