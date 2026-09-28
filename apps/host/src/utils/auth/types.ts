interface AuthUser {
  id: string;
  username: string;
  email: string | null;
}

// The `permissions`/`profiles` arrays on the login response are the raw D1
// rows (see wrapper-api's getUserPermissions/getUserProfiles) — NOT the
// flattened `"resource:action"` strings the JWT payload itself carries.
interface AuthPermission {
  resource: string;
  action: string;
  profile: string;
}

interface AuthProfile {
  id: string;
  name: string;
  description: string | null;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
  permissions: AuthPermission[];
  profiles: AuthProfile[];
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
  AuthPermission,
  AuthProfile,
  AuthUser,
  LoginResponse,
  ProfileResponse,
  RefreshResponse,
  SignupInput,
  SignupResponse,
};
