import { type LazyExoticComponent, lazy } from 'react';

import { loadRemote, registerRemotes } from '@module-federation/runtime';

import type { HostRemoteComponentType, HostRemoteModule, RemoteManifestEntry } from './types';

// registerRemotes() warns on the console ("already registered... overriding
// it may cause unexpected errors") if the same container name is registered
// twice — track what's already been handed to the runtime so re-renders (or
// a re-fetched manifest) don't trigger that.
const registeredNames = new Set<string>();

function registerManifestRemotes(entries: RemoteManifestEntry[]): void {
  const unseen = entries.filter((entry) => !registeredNames.has(entry.name));
  if (!unseen.length) return;

  registerRemotes(unseen.map(({ name, type, entry }) => ({ name, type, entry })));
  unseen.forEach((entry) => registeredNames.add(entry.name));
}

function loadRemoteModule(
  remoteName: string,
  moduleName: string,
): LazyExoticComponent<HostRemoteComponentType> {
  return lazy(async () => {
    const remoteModule = await loadRemote<HostRemoteModule>(`${remoteName}/${moduleName}`);

    if (!remoteModule?.default) {
      throw new Error(`Remote "${remoteName}" did not expose a default export at "${moduleName}"`);
    }

    return { default: remoteModule.default };
  });
}

export { registerManifestRemotes, loadRemoteModule };
