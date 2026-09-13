import { Suspense, lazy } from 'react';

import { useTheme } from '@mui/material/styles';

import Meta from '@/components/Meta';
import { useWrapperSessionState } from '@/store/session';

// Federated instead of imported locally — see apps/chat-remote and
// vite.config.ts's `federation({ remotes: { chat_remote: ... } })`.
const RemoteChat = lazy(() => import('chat_remote/Chat'));

// `session.profile` is never actually populated — Login only ever calls
// `addSession({ token })` (see CLAUDE.md's known rough edges). Mocked here
// only to demonstrate passing host app state into a federated remote as a
// prop; swap for the real `session.profile` once login sets one.
const MOCK_PROFILE = { role: 'operator', tenant_name: 'Acme Plant 4' };

function Chat() {
  const theme = useTheme();
  const [session] = useWrapperSessionState();
  const profile = session.profile ?? MOCK_PROFILE;

  return (
    <>
      <Meta title="Chat" />
      <Suspense fallback={null}>
        <RemoteChat
          theme={theme}
          userProfile={{ role: profile.role, tenantName: profile.tenant_name }}
        />
      </Suspense>
    </>
  );
}

export default Chat;
