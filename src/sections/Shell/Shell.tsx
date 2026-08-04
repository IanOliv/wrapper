import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Header from '@/sections/Header';
import { BottomBar, Rail } from '@/sections/Navigation';

import type { ShellProps } from './types';

// Everything here is chrome. The module never draws any of it, and the shell
// never draws inside the module.
function Shell({ children }: ShellProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        backgroundColor: 'background.default',
      }}
    >
      <Header />

      <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
        {isDesktop && <Rail />}

        {/* Where the shell stops. Desktop gutter 24px, mobile 16px;
            page top/bottom 48px on desktop. The module owns everything inside. */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 6 },
          }}
        >
          {children}
        </Box>
      </Box>

      {!isDesktop && <BottomBar />}
    </Box>
  );
}

export default Shell;
