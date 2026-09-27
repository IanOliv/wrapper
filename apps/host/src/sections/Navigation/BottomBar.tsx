import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Circle, DotsThree } from '@phosphor-icons/react';

import { NavGroup } from '@/routes/types';
import { isRouteActive, useRoutesInGroup } from '@/routes/utils';

import ActiveRule from './ActiveRule';
import MoreSheet from './MoreSheet';
import { BottomBarItem, BottomBarSurface } from './styled';

// The three primary modules + "More". Labs and the account menu live behind
// More as a bottom sheet.
function BottomBar() {
  const { pathname } = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const modules = useRoutesInGroup(NavGroup.Modules);
  const behindMore = [...useRoutesInGroup(NavGroup.Labs), ...useRoutesInGroup(NavGroup.Account)];
  const isMoreActive = behindMore.some((route) => isRouteActive(route, pathname));

  return (
    <>
      <BottomBarSurface component="nav" aria-label="Modules">
        {modules.map((route) => {
          const Icon = route.icon ?? Circle;
          const active = isRouteActive(route, pathname);

          return (
            <BottomBarItem
              key={route.path}
              component={Link}
              to={route.path}
              active={active}
              aria-current={active ? 'page' : undefined}
            >
              {active && <ActiveRule orientation="horizontal" layoutId="bottom-active-rule" />}
              <Icon size={22} weight={active ? 'fill' : 'regular'} />
              <span>{route.title}</span>
            </BottomBarItem>
          );
        })}

        <BottomBarItem
          active={isMoreActive}
          onClick={() => setIsMoreOpen(true)}
          aria-label="More modules and account"
          aria-haspopup="dialog"
        >
          {isMoreActive && <ActiveRule orientation="horizontal" layoutId="bottom-active-rule" />}
          <DotsThree size={22} weight={isMoreActive ? 'fill' : 'regular'} />
          <span>More</span>
        </BottomBarItem>
      </BottomBarSurface>

      <MoreSheet open={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
}

export default BottomBar;
