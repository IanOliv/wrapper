import { matchPath, useLocation } from 'react-router-dom';

import routes from '.';
import { NavGroup, PathRouteCustomProps } from './types';

type Route = PathRouteCustomProps;

const allRoutes = Object.values(routes) as Route[];

/** Routes that actually get mounted — dev-only ones stay out of production. */
function mountedRoutes(): Route[] {
  return allRoutes.filter((route) => !route.devOnly || import.meta.env.DEV);
}

/** Nav items for a group, in declaration order. Untitled routes are never nav items. */
function routesInGroup(group: NavGroup): Route[] {
  return mountedRoutes().filter((route) => route.group === group && route.title);
}

/**
 * Somewhere ⌘K can actually send you. `/card/:id` has a title so the header can
 * read it, but the literal path is not a destination — navigating to it would
 * put `:id` in the address bar.
 */
function isNavigable(route: Route): boolean {
  return Boolean(route.title) && route.path !== '*' && !route.path.includes(':');
}

/** `/card/:id` keeps "Cards" lit — a detail state is still the same room. */
function isRouteActive(route: Route, pathname: string): boolean {
  if (route.path === '*') return false;

  return Boolean(matchPath({ path: route.path, end: false }, pathname));
}

/** The route the shell is currently showing — the header's module name comes from here. */
function useActiveRoute(): Route | undefined {
  const { pathname } = useLocation();

  return mountedRoutes().find(
    (route) => route.path !== '*' && matchPath({ path: route.path, end: true }, pathname),
  );
}

export type { Route };
export { allRoutes, mountedRoutes, routesInGroup, isNavigable, isRouteActive, useActiveRoute };
