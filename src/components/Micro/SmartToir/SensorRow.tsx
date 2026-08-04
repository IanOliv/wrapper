import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Mono } from '@/components/styled';

import type { SensorRowProps } from './types';

// A bordered list of sensor rows at 12px row padding.
function SensorRow({ sensor, last }: SensorRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: '12px',
        borderBottom: last ? 'none' : (theme) => `1px solid ${theme.shell.border.subtle}`,
      }}
    >
      {/* status is a dot plus a text color, never a filled bar */}
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          backgroundColor: sensor.outOfRange ? 'warning.main' : 'success.main',
        }}
      />

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {sensor.name}
        </Typography>
        {sensor.room && (
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {sensor.room}
          </Typography>
        )}
      </Box>

      {sensor.reading && (
        <Mono sx={{ color: sensor.outOfRange ? 'warning.main' : 'text.primary', flexShrink: 0 }}>
          {sensor.reading}
          {sensor.unit ? ` ${sensor.unit}` : ''}
        </Mono>
      )}

      {sensor.lastSeen && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', flexShrink: 0, display: { xs: 'none', sm: 'block' } }}
        >
          {sensor.lastSeen}
        </Typography>
      )}
    </Box>
  );
}

export default SensorRow;
