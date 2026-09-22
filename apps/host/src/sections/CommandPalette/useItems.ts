import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowCounterClockwise,
  Circle,
  GithubLogo,
  Keyboard,
  MoonStars,
  SignOut,
  Sun,
} from '@phosphor-icons/react';

import { repository } from '@/config';
import routes from '@/routes';
import { NavGroup, Pages } from '@/routes/types';
import { useNavigableRoutes } from '@/routes/utils';
import useHotKeysDialog from '@/store/hotkeys';
import useRecents from '@/store/recents';
import { useWrapperSessionState } from '@/store/session';
import useTheme from '@/store/theme';
import { Themes } from '@/theme/types';
import { altKeyLabel } from '@/utils/platform';
import resetApp from '@/utils/reset-app';

import type { PaletteGroup, PaletteItem } from './types';

const GROUP_FOR: Record<string, PaletteGroup> = {
  [NavGroup.Modules]: 'Modules',
  [NavGroup.Labs]: 'Labs',
  [NavGroup.Account]: 'Account',
  // hidden routes have no nav group to inherit from; `paletteGroup` names one
  [NavGroup.Hidden]: 'Account',
};

/**
 * Every destination the nav shows, every route it doesn't, and the shell actions
 * — the palette is the one place all of them are listed.
 */
function useItems(close: () => void): PaletteItem[] {
  const navigate = useNavigate();
  const [themeMode, themeActions] = useTheme();
  const [, hotKeysDialogActions] = useHotKeysDialog();
  const [session, sessionActions] = useWrapperSessionState();
  const [recents] = useRecents();
  const navigable = useNavigableRoutes();

  const isSignedIn = Boolean(session.token);

  return useMemo(() => {
    const go = (path: string) => () => {
      close();
      navigate(path);
    };

    const routeItems: PaletteItem[] = navigable.map((route) => ({
      id: `route:${route.path}`,
      label: route.title as string,
      description: route.description,
      icon: route.icon ?? Circle,
      group: route.paletteGroup ?? GROUP_FOR[route.group ?? NavGroup.Hidden] ?? 'Modules',
      aliases: route.aliases,
      run: go(route.path),
    }));

    // Recents come first, and never appear twice — they are lifted out of their
    // own group, not copied into a second one.
    const recentItems: PaletteItem[] = recents
      .map((path) => navigable.find((route) => route.path === path))
      .filter((route): route is NonNullable<typeof route> => Boolean(route))
      .map((route) => ({
        id: `recent:${route.path}`,
        label: route.title as string,
        description: route.description,
        icon: route.icon ?? Circle,
        group: 'Recent' as const,
        aliases: route.aliases,
        run: go(route.path),
      }));

    const recentPaths = new Set(recentItems.map((item) => item.id.replace('recent:', '')));

    const actionItems: PaletteItem[] = [
      {
        id: 'action:appearance',
        label: themeMode === Themes.DARK ? 'Switch to light' : 'Switch to dark',
        description: 'Appearance',
        icon: themeMode === Themes.DARK ? Sun : MoonStars,
        group: 'Actions',
        aliases: ['theme', 'appearance', 'dark mode', 'light mode', 'prefs', 'settings'],
        keys: [altKeyLabel, 'T'],
        run: () => {
          themeActions.toggle();
          close();
        },
      },
      {
        id: 'action:shortcuts',
        label: 'Keyboard shortcuts',
        description: 'Every key the shell listens for',
        icon: Keyboard,
        group: 'Actions',
        aliases: ['hotkeys', 'keys', 'help', 'prefs'],
        keys: [altKeyLabel, '/'],
        run: () => {
          hotKeysDialogActions.open();
          close();
        },
      },
      {
        id: 'action:github',
        label: 'Source on GitHub',
        description: repository.replace('https://', ''),
        icon: GithubLogo,
        group: 'Actions',
        aliases: ['repo', 'repository', 'code', 'open source'],
        run: () => {
          close();
          window.open(repository, '_blank', 'noreferrer');
        },
      },
      {
        id: 'action:reset',
        label: 'Reset the application',
        description: 'Clears local state and reloads',
        icon: ArrowCounterClockwise,
        group: 'Actions',
        aliases: ['clear', 'wipe', 'restart', 'hard reload'],
        run: resetApp,
      },
    ];

    if (isSignedIn) {
      actionItems.splice(2, 0, {
        id: 'action:signout',
        label: 'Sign out',
        icon: SignOut,
        group: 'Actions',
        aliases: ['log out', 'logout', 'leave'],
        run: () => {
          sessionActions.clearSession();
          close();
          navigate(routes[Pages.Login].path);
        },
      });
    }

    return [
      ...recentItems,
      ...routeItems.filter((item) => !recentPaths.has(item.id.replace('route:', ''))),
      ...actionItems,
    ];
  }, [
    close,
    navigate,
    navigable,
    recents,
    themeMode,
    themeActions,
    hotKeysDialogActions,
    isSignedIn,
    sessionActions,
  ]);
}

export default useItems;
