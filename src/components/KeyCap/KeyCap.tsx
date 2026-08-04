import Box from '@mui/material/Box';

import type { KeyCapProps } from './types';

// Mono, 4px radius, control edge. Key caps are one of the three places the
// monospace role is allowed (readings, IDs, key caps).
function KeyCap({ children, sx }: KeyCapProps) {
  return (
    <Box
      component="kbd"
      sx={{
        fontFamily: (theme) => theme.shell.fontFamilyMono,
        fontSize: 11,
        fontWeight: 500,
        lineHeight: 1,
        color: 'text.secondary',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
        height: 20,
        px: 0.5,
        borderRadius: '4px',
        border: (theme) => `1px solid ${theme.shell.border.control}`,
        backgroundColor: (theme) => theme.shell.surface.sunken,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default KeyCap;
