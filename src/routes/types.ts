import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

import type { Icon } from '@phosphor-icons/react';

enum Pages {
  Card,
  SmartToir,
  Chat,
  ARfiti,
  DeckBoard,
  Stage,
  Profile,
  Login,
  Register,
  CardDetail,
  Tokens,
  NotFound,
}

// Eleven routes, four kinds of thing.
enum NavGroup {
  /** Primary destinations — the bottom bar on mobile, top of the rail on desktop */
  Modules = 'modules',
  /** Experimental; behind "More" on mobile, below the rule on desktop */
  Labs = 'labs',
  /** Belongs to the avatar, not the module list */
  Account = 'account',
  /** Reachable, but never a nav item */
  Hidden = 'hidden',
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
  icon?: Icon;
  path: string;
  group?: NavGroup;
  /** carries an "experimental" tag in the nav */
  experimental?: boolean;
  /** matched by ⌘K but never displayed, so "prefs" finds Settings without a second row */
  aliases?: string[];
  /** the ⌘K subtitle */
  description?: string;
  /** overrides which ⌘K group the route lands in; hidden routes have no nav group
   *  to inherit one from */
  paletteGroup?: 'Modules' | 'Labs' | 'Account' | 'Actions';
  /** only mounted in development */
  devOnly?: boolean;
  /** the module asks the shell for its gutter — for a route whose content *is*
   *  the page, like ARfiti's map. The shell still owns header, rail and toasts. */
  fullBleed?: boolean;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;

export type { Routes, PathRouteCustomProps };
export { Pages, NavGroup };
