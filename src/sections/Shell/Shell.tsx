import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import useVisualViewportHeight from '@/hooks/useVisualViewportHeight';
import { useActiveRoute } from '@/routes/utils';
import Header from '@/sections/Header';
import { BottomBar, Rail } from '@/sections/Navigation';

import type { ShellProps } from './types';

// Everything here is chrome. The module never draws any of it, and the shell
// never draws inside the module.
function Shell({ children }: ShellProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const route = useActiveRoute();

  useVisualViewportHeight();

  // A module can ask for the gutter when its content *is* the page — ARfiti's
  // map. That is the only thing the flag changes; the module still never sets
  // the header, the nav or the toasts.
  const fullBleed = Boolean(route?.fullBleed);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // `--app-height` (set by useVisualViewportHeight) tracks the actual
        // visible area, shrinking when the keyboard opens; falls back to the
        // html/body/#root percentage chain (see global.css) before the effect
        // runs or where visualViewport isn't supported.
        height: 'var(--app-height, 100%)',
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
            minHeight: 0,
            overflowY: fullBleed ? 'hidden' : 'auto',
            overflowX: 'hidden',
            px: fullBleed ? 0 : { xs: 2, md: 3 },
            py: fullBleed ? 0 : { xs: 2, md: 6 },
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
