import type { ComponentType } from 'react';

import type { Theme } from '@mui/material/styles';

// `nav.group` is a raw string here, not `NavGroup` — this is untrusted JSON,
// not something the compiler ever checked. src/remotes/toRoute.ts narrows it
// to a real `NavGroup`, falling back for anything unrecognized.
type RemoteManifestEntry = {
  id: string;
  name: string;
  type: 'module';
  entry: string;
  module: string;
  nav: {
    title: string;
    icon?: string;
    group: string;
    description?: string;
    aliases?: string[];
  };
};

type RemoteManifest = {
  version: number;
  remotes: RemoteManifestEntry[];
};

// The one contract every federated remote is expected to honor. Verified at
// runtime by whoever renders the component (see src/pages/DynamicModule), not
// by the compiler — there is no per-remote ambient type anymore now that
// remotes are discovered from a manifest instead of declared in vite.config.ts.
type HostRemoteProps = {
  theme?: Theme;
  userProfile?: { role: string; tenantName: string };
  // The signed-in user's session token, so a remote can call its own backend
  // on their behalf (e.g. chat_remote calling wrapper-api's ai worker for
  // sessions/messages). Same rule as theme/userProfile: crosses the
  // federation boundary as a plain prop, never through a shared store.
  token?: string;
};
type HostRemoteComponentType = ComponentType<HostRemoteProps>;
type HostRemoteModule = { default: HostRemoteComponentType };

export type {
  RemoteManifest,
  RemoteManifestEntry,
  HostRemoteProps,
  HostRemoteComponentType,
  HostRemoteModule,
};
