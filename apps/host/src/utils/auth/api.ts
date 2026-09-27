import type {
  LoginResponse,
  ProfileResponse,
  RefreshResponse,
  SignupInput,
  SignupResponse,
} from './types';

// Hosts come from env, never hardcoded — the auth worker (login/signup/refresh)
// and the main API worker (protected resources, e.g. /profile) are two separate
// Cloudflare Workers deployments in the wrapper-api repo.
function requireEnv(name: 'VITE_AUTH_API_URL' | 'VITE_WRAPPER_API_URL'): string {
  const value = import.meta.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

async function parseJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof body?.error === 'string' ? body.error : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

async function postJson<T>(baseUrl: string, path: string, body: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseJson<T>(response);
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  return postJson<LoginResponse>(requireEnv('VITE_AUTH_API_URL'), '/login', { username, password });
}

export async function signup(input: SignupInput): Promise<SignupResponse> {
  return postJson<SignupResponse>(requireEnv('VITE_AUTH_API_URL'), '/signup', input);
}

export async function refreshSession(refreshToken: string): Promise<RefreshResponse> {
  return postJson<RefreshResponse>(requireEnv('VITE_AUTH_API_URL'), '/refresh', {
    refresh_token: refreshToken,
  });
}

export async function fetchProfile(token: string): Promise<ProfileResponse> {
  const response = await fetch(`${requireEnv('VITE_WRAPPER_API_URL')}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<ProfileResponse>(response);
}
