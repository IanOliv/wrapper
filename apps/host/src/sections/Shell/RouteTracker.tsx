import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useActiveRoute } from '@/routes/utils';
import useRecents from '@/store/recents';

// Feeds the ⌘K "Recent" group. Renders nothing — it only watches the location.
function RouteTracker() {
  const { pathname } = useLocation();
  const activeRoute = useActiveRoute();
  const [, recentsActions] = useRecents();

  useEffect(() => {
    if (activeRoute?.title) recentsActions.visit(activeRoute.path);
  }, [pathname, activeRoute, recentsActions]);

  return null;
}

export default RouteTracker;
