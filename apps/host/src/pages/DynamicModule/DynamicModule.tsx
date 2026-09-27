import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';

import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import RemoteModuleErrorFallback from '@/error-handling/fallbacks/RemoteModule';
import { loadRemoteModule } from '@/remotes/registry';
import useRemoteManifest from '@/store/remotes';
import { useWrapperSessionState } from '@/store/session';

// `session.profile` is never actually populated — Login only ever calls
// `addSession({ token })` (see CLAUDE.md's known rough edges). Mocked here
// only to demonstrate passing host state into a federated remote as a prop;
// swap for the real `session.profile` once login sets one.
const MOCK_PROFILE = { role: 'operator', tenant_name: 'Acme Plant 4' };

// The one route every manifest entry resolves to (see src/remotes/toRoute.ts)
// — :remoteId picks the entry, its own Suspense/ErrorBoundary keep one dead
// remote from taking down the rest of the shell.
function DynamicModule() {
  const { remoteId = '' } = useParams<{ remoteId: string }>();
  const { status, entries } = useRemoteManifest();
  const theme = useTheme();
  const [session] = useWrapperSessionState();

  const entry = entries.find((candidate) => candidate.id === remoteId);
  const RemoteComponent = useMemo(
    () => (entry ? loadRemoteModule(entry.name, entry.module) : null),
    [entry],
  );

  if (status === 'loading') return <Loading />;

  if (status === 'error' || !entry || !RemoteComponent) {
    return <RemoteModuleErrorFallback error={new Error(`Unknown module: "${remoteId}"`)} />;
  }

  const profile = session.profile ?? MOCK_PROFILE;

  return (
    <>
      <Meta title={entry.nav.title} />
      <ErrorBoundary FallbackComponent={RemoteModuleErrorFallback} resetKeys={[entry.id]}>
        <Suspense fallback={<Loading />}>
          <RemoteComponent
            theme={theme}
            userProfile={{ role: profile.role, tenantName: profile.tenant_name }}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default DynamicModule;
