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

// The wrapper-api auth worker has no tenant concept, only role-like `profiles`
// (e.g. "Admin", "User") — tenantName has nothing real to come from, so it
// stays a placeholder until the backend models one.
const FALLBACK_ROLE = 'guest';
const FALLBACK_TENANT_NAME = 'Acme Plant 4';

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

  const role = session.profiles?.[0]?.name ?? FALLBACK_ROLE;

  return (
    <>
      <Meta title={entry.nav.title} />
      <ErrorBoundary FallbackComponent={RemoteModuleErrorFallback} resetKeys={[entry.id]}>
        <Suspense fallback={<Loading />}>
          <RemoteComponent theme={theme} userProfile={{ role, tenantName: FALLBACK_TENANT_NAME }} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default DynamicModule;
