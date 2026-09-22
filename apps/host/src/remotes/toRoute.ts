import { NavGroup } from '@/routes/types';
import type { PathRouteCustomProps } from '@/routes/types';
import asyncComponentLoader from '@/utils/loader';

import { resolveIcon } from './icons';
import type { RemoteManifestEntry } from './types';

// Shared across every manifest entry — one component, not one per remote — so
// navigating between two federated modules doesn't remount the page shell.
const component = asyncComponentLoader(() => import('@/pages/DynamicModule'));

const KNOWN_GROUPS = new Set<string>(Object.values(NavGroup));

function asNavGroup(group: string): NavGroup {
  return KNOWN_GROUPS.has(group) ? (group as NavGroup) : NavGroup.Modules;
}

function entryToRoute(entry: RemoteManifestEntry): PathRouteCustomProps {
  return {
    component,
    path: `/modules/${entry.id}`,
    title: entry.nav.title,
    icon: resolveIcon(entry.nav.icon),
    group: asNavGroup(entry.nav.group),
    description: entry.nav.description,
    aliases: entry.nav.aliases,
  };
}

export { entryToRoute };
