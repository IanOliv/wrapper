import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Mono } from '@/components/styled';

import type { StatTileProps } from './types';

// Elevation 1, 8px radius, 13/15px padding. The label is `overline` 11px in
// `text.secondary`; the reading is mono with tabular figures.
function StatTile({ label, reading, unit, outOfRange }: StatTileProps) {
  return (
    <Box
      sx={{
        px: '15px',
        py: '13px',
        borderRadius: 1,
        backgroundColor: 'background.paper',
        boxShadow: (theme) => theme.shell.ring[1],
        borderLeft: outOfRange ? (theme) => `2px solid ${theme.palette.warning.main}` : undefined,
      }}
    >
      <Typography variant="overline" component="div" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
        <Mono
          style={{ fontSize: 22, lineHeight: 1.2 }}
          sx={{ color: outOfRange ? 'warning.main' : 'text.primary' }}
        >
          {reading}
        </Mono>
        {unit && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {unit}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default StatTile;
