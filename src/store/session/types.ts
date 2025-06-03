interface WrapperSession {
  token: string;
  profile?: WrapperProfile;
}

interface WrapperProfile {
  id: number;
  role: string;
  tenant_name: string;
  permissions: unknown;
}

type Actions = {
  addSession: (wSession: WrapperSession) => void;
};

export type { Actions, WrapperSession };
