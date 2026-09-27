interface AuthUser {
  id: string;
  username: string;
  email: string | null;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
  permissions: string[];
  profiles: string[];
}

interface SignupInput {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface SignupResponse {
  user: AuthUser & { firstName: string | null; lastName: string | null };
}

interface RefreshResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

interface ProfileResponse {
  profile: {
    username: string;
    subject: string;
    authenticated: boolean;
    token_type: string;
    issued_at: string;
    expires_at: string;
  };
}

export type {
  AuthUser,
  LoginResponse,
  ProfileResponse,
  RefreshResponse,
  SignupInput,
  SignupResponse,
};
