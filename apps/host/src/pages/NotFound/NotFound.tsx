import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { Compass } from '@phosphor-icons/react';

import ErrorScreen from '@/components/ErrorScreen';
import KeyCap from '@/components/KeyCap';
import Meta from '@/components/Meta';
import { messages } from '@/config';
import { NavGroup } from '@/routes/types';
import { routesInGroup } from '@/routes/utils';
import useCommandPalette from '@/store/palette';
import { metaKeyLabel } from '@/utils/platform';

// 404: "Nothing lives at this address." → route chips + "Or press ⌘K".
function NotFound() {
  const [, paletteActions] = useCommandPalette();

  const destinations = [...routesInGroup(NavGroup.Modules), ...routesInGroup(NavGroup.Labs)];

  return (
    <>
      <Meta title="Not found" />
      <ErrorScreen
        icon={Compass}
        severity="info"
        title={messages[404].title}
        body={messages[404].body}
        code="route-not-found"
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {destinations.map((route) => (
            <Chip
              key={route.path}
              component={Link}
              to={route.path}
              label={route.title}
              variant="outlined"
              clickable
            />
          ))}
        </Box>

        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={paletteActions.open}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Or press
          </Typography>
          <KeyCap>{metaKeyLabel}</KeyCap>
          <KeyCap>K</KeyCap>
        </Box>
      </ErrorScreen>
    </>
  );
}

export default NotFound;
