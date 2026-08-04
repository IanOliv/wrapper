import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Mono } from '@/components/styled';

import type { SwatchProps } from './types';

function Swatch({ label, value }: SwatchProps) {
  return (
    <Box sx={{ width: 148 }}>
      <Box
        sx={{
          height: 48,
          borderRadius: 1,
          backgroundColor: value,
          border: (theme) => `1px solid ${theme.shell.border.control}`,
        }}
      />
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
      <Mono style={{ color: 'inherit', opacity: 0.7, fontSize: 12 }}>{value}</Mono>
    </Box>
  );
}

export default Swatch;
