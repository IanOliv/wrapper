interface WrapperUser {
  id: string;
  username: string;
  email: string | null;
}

interface WrapperSession {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
  user?: WrapperUser;
  permissions?: string[];
  profiles?: string[];
}

type Actions = {
  addSession: (wSession: WrapperSession) => void;
  clearSession: () => void;
};

export type { Actions, WrapperSession, WrapperUser };
