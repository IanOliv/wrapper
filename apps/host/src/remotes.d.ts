// Ambient declarations for federated remotes consumed by the host.
// @module-federation/vite can generate these automatically from a running
// remote's manifest, but a hand-written fallback keeps the host typechecking
// even when the remote isn't running.
declare module 'chat_remote/Chat' {
  import type { Theme } from '@mui/material/styles';
  import type { ComponentType } from 'react';

  type UserProfile = {
    role: string;
    tenantName: string;
  };

  const Chat: ComponentType<{ theme?: Theme; userProfile?: UserProfile }>;
  export default Chat;
}
