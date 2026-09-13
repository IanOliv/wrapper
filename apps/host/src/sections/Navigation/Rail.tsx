import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { CaretLineLeft, CaretLineRight } from '@phosphor-icons/react';

import { NavGroup } from '@/routes/types';
import { isRouteActive, routesInGroup } from '@/routes/utils';
import useRail from '@/store/rail';

import RailItem from './RailItem';
import { RailSurface, RailToggle } from './styled';

// Desktop ≥ 900px: a 72px icon rail, expandable to 232px and pinnable.
// Never a modal drawer — a host app should not dim itself to let you navigate.
function Rail() {
  const [isExpanded, railActions] = useRail();
  const { pathname } = useLocation();

  const modules = routesInGroup(NavGroup.Modules);
  const labs = routesInGroup(NavGroup.Labs);

  return (
    <RailSurface component="nav" aria-label="Modules" expanded={isExpanded}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 1.5, pt: 2 }}>
        {modules.map((route) => (
          <RailItem
            key={route.path}
            route={route}
            expanded={isExpanded}
            active={isRouteActive(route, pathname)}
          />
        ))}
      </Box>

      <Divider sx={{ mx: 1.5, my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 1.5 }}>
        {isExpanded && (
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', px: 1.5, pb: 0.5, whiteSpace: 'nowrap' }}
          >
            Labs
          </Typography>
        )}
        {labs.map((route) => (
          <RailItem
            key={route.path}
            route={route}
            expanded={isExpanded}
            active={isRouteActive(route, pathname)}
          />
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 1.5, pb: 2 }}>
        <Tooltip title={isExpanded ? 'Collapse' : 'Expand'} placement="right" arrow>
          <RailToggle
            onClick={railActions.toggle}
            aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
            aria-pressed={isExpanded}
          >
            {isExpanded ? <CaretLineLeft size={17} /> : <CaretLineRight size={17} />}
          </RailToggle>
        </Tooltip>
      </Box>
    </RailSurface>
  );
}

export default Rail;
