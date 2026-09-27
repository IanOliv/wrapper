import type { RemoteManifest, RemoteManifestEntry } from './types';

// Unset in dev: falls back to a local copy served by the host itself
// (apps/host/public/remotes.manifest.json), for offline/fast iteration. Set in
// production to a manifest hosted entirely outside the host's own deploy —
// changing the remote list then never touches the host, not even a redeploy.
const MANIFEST_URL = import.meta.env.VITE_REMOTES_MANIFEST_URL ?? '/remotes.manifest.json';

function isRemoteManifest(value: unknown): value is RemoteManifest {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return Array.isArray(candidate.remotes);
}

async function fetchRemoteManifest(): Promise<RemoteManifestEntry[]> {
  const response = await fetch(MANIFEST_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch remotes manifest (${response.status}): ${MANIFEST_URL}`);
  }

  const data: unknown = await response.json();
  if (!isRemoteManifest(data)) {
    throw new Error(`Malformed remotes manifest at ${MANIFEST_URL}`);
  }

  return data.remotes;
}

export { fetchRemoteManifest };
