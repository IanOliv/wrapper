import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { MagnifyingGlass } from '@phosphor-icons/react';

import Mark from '@/components/Mark';
import { title } from '@/config';
import { useActiveRoute } from '@/routes/utils';
import useCommandPalette from '@/store/palette';
import { metaKeyLabel } from '@/utils/platform';

import AccountMenu from './AccountMenu';
import { JumpToButton, JumpToIconButton } from './styled';

// 56px on mobile (plus the safe-area inset), 60px on desktop. Elevation 1, opaque.
// The mark, the module name, "Jump to…", the avatar. Nothing else — the GitHub
// link moved into the account sheet.
function Header() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const activeRoute = useActiveRoute();
  const [, paletteActions] = useCommandPalette();

  const moduleName = activeRoute?.title ?? title;

  return (
    <AppBar position="static" sx={{ flexShrink: 0, pt: 'env(safe-area-inset-top)' }}>
      <Toolbar sx={{ gap: 2, px: { xs: 2, md: 3 } }}>
        {/* Mobile drops the wordmark to the mark; the module name stays. */}
        <Mark size={24} wordmark={isDesktop} />

        <Box
          sx={{ height: 20, width: '1px', flexShrink: 0, bgcolor: (t) => t.shell.border.card }}
        />

        <Typography
          variant="h4"
          noWrap
          title={moduleName}
          sx={{ flexGrow: 1, minWidth: 0, color: 'text.primary' }}
        >
          {moduleName}
        </Typography>

        {isDesktop ? (
          <JumpToButton onClick={paletteActions.open} aria-label="Jump to a module or action">
            <MagnifyingGlass size={16} />
            <span>Jump to…</span>
            <Box component="kbd" className="jump-to-cap">
              {metaKeyLabel}K
            </Box>
          </JumpToButton>
        ) : (
          <Tooltip title="Jump to…" arrow>
            <JumpToIconButton onClick={paletteActions.open} aria-label="Jump to a module or action">
              <MagnifyingGlass size={20} />
            </JumpToIconButton>
          </Tooltip>
        )}

        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
