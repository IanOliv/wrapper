import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import {
  GithubLogo,
  Keyboard,
  MoonStars,
  SignIn,
  SignOut,
  Sun,
  UserCircle,
} from '@phosphor-icons/react';

import KeyCap from '@/components/KeyCap';
import { repository } from '@/config';
import routes from '@/routes';
import { Pages } from '@/routes/types';
import useHotKeysDialog from '@/store/hotkeys';
import { useWrapperSessionState } from '@/store/session';
import useTheme from '@/store/theme';
import { Themes } from '@/theme/types';
import { altKeyLabel } from '@/utils/platform';

const ICON = 17;

// Profile, Appearance, Shortcuts and Sign out belong to the avatar, not the
// module list. The repo link is a footer item here, not a header icon.
function AccountMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [themeMode, themeActions] = useTheme();
  const [, hotKeysDialogActions] = useHotKeysDialog();
  const [session, sessionActions] = useWrapperSessionState();
  const navigate = useNavigate();

  const isSignedIn = Boolean(session.token);
  const close = () => setAnchor(null);

  function go(path: string) {
    close();
    navigate(path);
  }

  return (
    <>
      <Tooltip title="Account" arrow>
        <IconButton
          onClick={(event) => setAnchor(event.currentTarget)}
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          sx={{ p: 0.5 }}
        >
          <Avatar sx={{ width: 28, height: 28 }}>
            {isSignedIn ? <UserCircle size={18} weight="fill" /> : <UserCircle size={18} />}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 232, mt: 1 } } }}
      >
        {isSignedIn
          ? [
              <MenuItem key="profile" onClick={() => go(routes[Pages.Profile].path)}>
                <ListItemIcon>
                  <UserCircle size={ICON} />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>,
            ]
          : [
              // Signed out: one "Sign in" item. Register is a link inside it.
              <MenuItem key="signin" onClick={() => go(routes[Pages.Login].path)}>
                <ListItemIcon>
                  <SignIn size={ICON} />
                </ListItemIcon>
                <ListItemText>Sign in</ListItemText>
              </MenuItem>,
            ]}

        <MenuItem
          onClick={() => {
            themeActions.toggle();
            close();
          }}
        >
          <ListItemIcon>
            {themeMode === Themes.DARK ? <Sun size={ICON} /> : <MoonStars size={ICON} />}
          </ListItemIcon>
          <ListItemText>Appearance</ListItemText>
          <KeyCap sx={{ ml: 2 }}>{altKeyLabel}T</KeyCap>
        </MenuItem>

        <MenuItem
          onClick={() => {
            hotKeysDialogActions.open();
            close();
          }}
        >
          <ListItemIcon>
            <Keyboard size={ICON} />
          </ListItemIcon>
          <ListItemText>Shortcuts</ListItemText>
          <KeyCap sx={{ ml: 2 }}>{altKeyLabel}/</KeyCap>
        </MenuItem>

        {isSignedIn && (
          <MenuItem
            onClick={() => {
              sessionActions.clearSession();
              close();
              navigate(routes[Pages.Login].path);
            }}
          >
            <ListItemIcon>
              <SignOut size={ICON} />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        <Box sx={{ px: 0.5 }}>
          <MenuItem
            component="a"
            href={repository}
            target="_blank"
            rel="noreferrer"
            onClick={close}
          >
            <ListItemIcon>
              <GithubLogo size={ICON} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              sx={{ my: 0 }}
            >
              Source on GitHub
            </ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default AccountMenu;
