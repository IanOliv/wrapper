import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  EnvelopeSimple,
  ShieldCheck,
  ShieldWarning,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react';

import routes from '@/routes';
import { Pages } from '@/routes/types';
import { useWrapperSessionState } from '@/store/session';
import { fetchProfile } from '@/utils/auth/api';
import type { ProfileResponse } from '@/utils/auth/types';

// The RBAC error a freshly-signed-up user gets from GET /profile (no
// permissions assigned by default) — worth a friendlier message than the
// raw "Missing required permission: api:access".
const PERMISSION_ERROR_HINT =
  "Your account doesn't have API access yet — ask an admin to grant it.";

function Item() {
  const [session, { clearSession }] = useWrapperSessionState();
  const navigate = useNavigate();

  const [serverProfile, setServerProfile] = useState<ProfileResponse['profile'] | null>(null);
  const [profileError, setProfileError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session.token) return;

    let cancelled = false;
    setIsLoading(true);
    setProfileError('');

    fetchProfile(session.token)
      .then(({ profile }) => {
        if (!cancelled) setServerProfile(profile);
      })
      .catch((err) => {
        if (!cancelled)
          setProfileError(err instanceof Error ? err.message : 'Failed to fetch profile');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session.token]);

  if (!session.token) {
    return (
      <Box sx={{ maxWidth: 360, mx: 'auto', py: { xs: 2, md: 6 }, textAlign: 'center' }}>
        <UserCircle size={40} />
        <Typography sx={{ fontSize: 20, fontWeight: 600, mt: 2 }}>
          You&apos;re not signed in.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Sign in to see your profile.
        </Typography>
        <Button
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate(routes[Pages.Login].path)}
        >
          Sign in
        </Button>
      </Box>
    );
  }

  const handleSignOut = () => {
    clearSession();
    navigate(routes[Pages.Login].path);
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', py: { xs: 2, md: 6 } }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ width: 56, height: 56 }}>
          <UserCircle size={32} weight="fill" />
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{session.user?.username}</Typography>
          {session.user?.email && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ color: 'text.secondary' }}
            >
              <EnvelopeSimple size={14} />
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {session.user.email}
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
        {session.profiles?.length ? (
          session.profiles.map((profile) => (
            <Chip key={profile.id} label={profile.name} size="small" />
          ))
        ) : (
          <Chip label="No role assigned" size="small" variant="outlined" />
        )}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Session
      </Typography>

      {session.expiresAt && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Expires {new Date(session.expiresAt).toLocaleString()}
        </Typography>
      )}

      {isLoading && <CircularProgress size={20} sx={{ display: 'block', mt: 1.5 }} />}

      {serverProfile && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 1.5, color: 'success.main' }}
        >
          <ShieldCheck size={18} />
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            Verified by the server just now
          </Typography>
        </Stack>
      )}

      {profileError && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ mt: 1.5, color: 'warning.main' }}
        >
          <ShieldWarning size={18} />
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {profileError.toLowerCase().includes('permission')
              ? PERMISSION_ERROR_HINT
              : profileError}
          </Typography>
        </Stack>
      )}

      <Button
        color="inherit"
        startIcon={<SignOut size={16} />}
        onClick={handleSignOut}
        sx={{ mt: 4 }}
      >
        Sign out
      </Button>
    </Box>
  );
}

export default Item;
