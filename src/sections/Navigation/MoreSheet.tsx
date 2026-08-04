import { Link, useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { Circle, GithubLogo, Keyboard, MoonStars, SignOut, Sun } from '@phosphor-icons/react';

import KeyCap from '@/components/KeyCap';
import { repository } from '@/config';
import routes from '@/routes';
import { NavGroup, Pages } from '@/routes/types';
import { isRouteActive, routesInGroup } from '@/routes/utils';
import useHotKeysDialog from '@/store/hotkeys';
import { useWrapperSessionState } from '@/store/session';
import useTheme from '@/store/theme';
import { Themes } from '@/theme/types';
import { altKeyLabel } from '@/utils/platform';

import type { MoreSheetProps } from './types';

const ICON = 17;

// Labs and the account menu, as a bottom sheet — 14px radius on the top corners.
function MoreSheet({ open, onClose }: MoreSheetProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [themeMode, themeActions] = useTheme();
  const [, hotKeysDialogActions] = useHotKeysDialog();
  const [session, sessionActions] = useWrapperSessionState();

  const labs = routesInGroup(NavGroup.Labs);
  const account = routesInGroup(NavGroup.Account).filter((route) =>
    session.token
      ? route.path !== routes[Pages.Login].path
      : route.path !== routes[Pages.Profile].path,
  );

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          pb: 'env(safe-area-inset-bottom)',
          maxHeight: '80vh',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5 }}>
        <Box
          sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: (t) => t.shell.border.control }}
        />
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Labs
        </Typography>
        <List sx={{ py: 0.5 }}>
          {labs.map((route) => {
            const Icon = route.icon ?? Circle;
            const active = isRouteActive(route, pathname);

            return (
              <ListItemButton
                key={route.path}
                component={Link}
                to={route.path}
                selected={active}
                onClick={onClose}
              >
                <ListItemIcon>
                  <Icon size={ICON} weight={active ? 'fill' : 'regular'} />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: '0.9375rem' }}>
                  {route.title}
                </ListItemText>
                {route.experimental && (
                  <Chip label="experimental" variant="outlined" size="small" />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Account
        </Typography>
        <List sx={{ py: 0.5 }}>
          {account.map((route) => {
            const Icon = route.icon ?? Circle;
            const active = isRouteActive(route, pathname);

            return (
              <ListItemButton
                key={route.path}
                component={Link}
                to={route.path}
                selected={active}
                onClick={onClose}
              >
                <ListItemIcon>
                  <Icon size={ICON} weight={active ? 'fill' : 'regular'} />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: '0.9375rem' }}>
                  {route.title}
                </ListItemText>
              </ListItemButton>
            );
          })}

          <ListItemButton
            onClick={() => {
              themeActions.toggle();
              onClose();
            }}
          >
            <ListItemIcon>
              {themeMode === Themes.DARK ? <Sun size={ICON} /> : <MoonStars size={ICON} />}
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.9375rem' }}>
              Appearance
            </ListItemText>
            <KeyCap>{altKeyLabel}T</KeyCap>
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              hotKeysDialogActions.open();
              onClose();
            }}
          >
            <ListItemIcon>
              <Keyboard size={ICON} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.9375rem' }}>
              Shortcuts
            </ListItemText>
            <KeyCap>{altKeyLabel}/</KeyCap>
          </ListItemButton>

          {Boolean(session.token) && (
            <ListItemButton
              onClick={() => {
                sessionActions.clearSession();
                onClose();
                navigate(routes[Pages.Login].path);
              }}
            >
              <ListItemIcon>
                <SignOut size={ICON} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: '0.9375rem' }}>
                Sign out
              </ListItemText>
            </ListItemButton>
          )}
        </List>

        <Divider sx={{ my: 1.5 }} />

        {/* The repo link is a footer item in the account sheet, not header chrome. */}
        <ListItemButton component="a" href={repository} target="_blank" rel="noreferrer">
          <ListItemIcon>
            <GithubLogo size={ICON} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}>
            Source on GitHub
          </ListItemText>
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

export default MoreSheet;
