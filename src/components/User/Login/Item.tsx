import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { WarningCircle } from '@phosphor-icons/react';

import Mark from '@/components/Mark';
import routes from '@/routes';
import { Pages } from '@/routes/types';
import { useWrapperSessionState } from '@/store/session';
import { WrapperSession } from '@/store/session/types';
import { doLogin } from '@/utils/micro/api';

// The most ordinary screen, and the only one where the shell shows nothing but
// itself — so the brand gets its one moment, then gets out of the way.
function Item() {
  const [wrapperSession, { addSession }] = useWrapperSessionState();
  const navigate = useNavigate();

  const [login, setLogin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigating during render is a side effect; it belongs in an effect.
  useEffect(() => {
    if (wrapperSession.token) navigate(routes[Pages.Profile].path);
  }, [wrapperSession.token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login.username || !login.password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // NOTE: `doLogin` still posts this as `email` — unchanged here on purpose.
      const token = await doLogin(login.username, login.password);
      addSession({ token } as WrapperSession);
      setError('');
    } catch {
      setError('Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', py: { xs: 2, md: 6 } }}>
      {/* no nav, no module chrome — the mark at full size, once */}
      <Mark size={32} wordmark />

      <Typography sx={{ fontSize: 23, fontWeight: 600, lineHeight: 1.25, mt: 3 }}>
        One shell.
        <br />
        Every module.
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
        Sign in to sync your modules, sensors and cards across devices.
      </Typography>

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}
      >
        <TextField
          id="username"
          name="username"
          label="Username or email"
          value={login.username}
          onChange={handleChange}
          autoComplete="username"
          size="small"
          fullWidth
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={login.password}
          onChange={handleChange}
          autoComplete="current-password"
          size="small"
          fullWidth
        />

        {/* semantic color as a text color and a mark, never a filled bar */}
        {error && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <WarningCircle size={16} />
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {error}
            </Typography>
          </Box>
        )}

        <Button type="submit" color="primary" disabled={isSubmitting} fullWidth sx={{ mt: 1 }}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </Box>

      {/* Register is a text link below, not a peer button. */}
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
        No account yet?{' '}
        <Link component={RouterLink} to={routes[Pages.Register].path}>
          Create one
        </Link>
        .
      </Typography>
    </Box>
  );
}

export default Item;
