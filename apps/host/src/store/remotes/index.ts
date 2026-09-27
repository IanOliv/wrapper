import { atom, useRecoilValue } from 'recoil';

import { fetchRemoteManifest } from '@/remotes/manifest';
import { registerManifestRemotes } from '@/remotes/registry';

import type { AtomEffectParams } from '../types';
import type { RemoteManifestState } from './types';

const remoteManifestState = atom<RemoteManifestState>({
  key: 'remote-manifest-state',
  default: { status: 'loading', entries: [] },
  effects: [loadManifestOnce],
});

// Registration with the federation runtime happens inside the same effect as
// the fetch, before `setSelf` — so nothing can ever read `status: 'ready'`
// while a remote is still unregistered.
function loadManifestOnce({ setSelf }: AtomEffectParams) {
  fetchRemoteManifest()
    .then((entries) => {
      registerManifestRemotes(entries);
      setSelf({ status: 'ready', entries });
    })
    .catch(() => setSelf({ status: 'error', entries: [] }));
}

// Read-only — nothing in the shell mutates the manifest, so there's no
// `[state, actions]` tuple here, unlike the other store slices.
function useRemoteManifest(): RemoteManifestState {
  return useRecoilValue(remoteManifestState);
}

export default useRemoteManifest;
