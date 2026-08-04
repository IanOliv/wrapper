import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { Circle } from '@phosphor-icons/react';

import ActiveRule from './ActiveRule';
import { RailLabel, RailLink } from './styled';
import type { RailItemProps } from './types';

function RailItem({ route, expanded, active }: RailItemProps) {
  const Icon = route.icon ?? Circle;

  const item = (
    <RailLink
      component={Link}
      to={route.path}
      expanded={expanded}
      active={active}
      aria-current={active ? 'page' : undefined}
    >
      {active && <ActiveRule orientation="vertical" layoutId="rail-active-rule" />}
      {/* fill for active — a legible state that does not depend on color */}
      <Icon size={17} weight={active ? 'fill' : 'regular'} />
      {expanded && (
        <>
          <RailLabel expanded={expanded}>{route.title}</RailLabel>
          {route.experimental && (
            <Box
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                border: (theme) => `1px solid ${theme.shell.border.control}`,
                borderRadius: '4px',
                px: 0.5,
                py: '1px',
                flexShrink: 0,
              }}
            >
              exp
            </Box>
          )}
        </>
      )}
    </RailLink>
  );

  // Collapsed, the icon is the only label there is.
  return expanded ? (
    item
  ) : (
    <Tooltip title={route.title ?? ''} placement="right" arrow>
      {item}
    </Tooltip>
  );
}

export default RailItem;
