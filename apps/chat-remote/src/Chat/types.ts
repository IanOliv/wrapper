type ChatMessage = {
  id: number;
  own: boolean;
  text: string;
};

// Deliberately narrow and camelCase — this is the contract the host promises
// to fill, decoupled from however it models a "profile" internally (the
// host's own type is snake_case, sourced from a REST payload).
type UserProfile = {
  role: string;
  tenantName: string;
};

export type { ChatMessage, UserProfile };
