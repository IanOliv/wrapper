import type { RemoteManifestEntry } from '@/remotes/types';

type RemoteManifestStatus = 'loading' | 'ready' | 'error';

type RemoteManifestState = {
  status: RemoteManifestStatus;
  entries: RemoteManifestEntry[];
};

export type { RemoteManifestState, RemoteManifestStatus };
