import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { ArrowsClockwise } from '@phosphor-icons/react';

import SensorRow from './SensorRow';
import StatTile from './StatTile';
import type { Sensor } from './types';
import { placeholderSensors, summarise } from './utils';

// NOTE: still the module's own hardcoded endpoint — see `utils/micro/api` for
// where new calls should go.
const getSensors = async (): Promise<Sensor[]> => {
  const response = await fetch('http://localhost:3000/sensors');

  if (!response.ok) throw new Error('Failed to fetch sensors');

  return response.json();
};

// The densest screen in the app: a stat tile row, then the sensor list.
function Item() {
  const [sensors, setSensors] = useState<Sensor[]>(placeholderSensors);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const data = await getSensors();

      if (Array.isArray(data) && data.length) {
        setSensors(data);
        setIsLive(true);
      }
    } catch {
      // The gateway is a local process that is often not running. Keeping the
      // last layout on screen beats an empty panel.
      setIsLive(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const tiles = summarise(sensors);
  const needsAttention = sensors.filter((sensor) => sensor.outOfRange).length;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h1">Sensor network</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {sensors.length} devices · {needsAttention || 'none'}{' '}
            {needsAttention === 1 ? 'needs' : 'need'} attention ·{' '}
            {isLive ? 'live gateway' : 'sample readings'}
          </Typography>
        </Box>
        <Button
          color="primary"
          startIcon={<ArrowsClockwise size={16} />}
          onClick={refresh}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      </Box>

      {/* Existing content never disappears for a refresh: it dims to 50% and
          keeps its layout. */}
      <Box
        sx={{
          opacity: isRefreshing ? 0.5 : 1,
          transition: (theme) =>
            `opacity ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {tiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </Box>

        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mt: 4 }}>
          All sensors
        </Typography>

        <Box
          sx={{
            mt: 1,
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            boxShadow: (theme) => theme.shell.ring[1],
          }}
        >
          {sensors.map((sensor, index) => (
            <SensorRow
              key={sensor.name ?? index}
              sensor={sensor}
              last={index === sensors.length - 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Item;
