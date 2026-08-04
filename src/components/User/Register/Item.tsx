import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  CheckCircle,
  GithubLogo,
  GoogleLogo,
  InstagramLogo,
  WarningCircle,
} from '@phosphor-icons/react';

import Mark from '@/components/Mark';
import routes from '@/routes';
import { Pages } from '@/routes/types';

// NOTE: still UI-only — `doRegister()` in `utils/micro/api` is not wired up, and
// the social buttons still only alert. Restyled to the tokens, behaviour unchanged.
function Register() {
  const [register, setRegister] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!register.username || !register.password) {
      setError('Please enter both username and password.');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('Registration successful! (Simulated)');
    // TODO: Implement registration logic here
  };

  const handleProviderSignUp = (provider: string) => {
    // TODO: Implement provider sign up logic
    alert(`Sign up with ${provider} (not implemented)`);
  };

  const providers = [
    { name: 'Google', icon: GoogleLogo },
    { name: 'GitHub', icon: GithubLogo },
    { name: 'Instagram', icon: InstagramLogo },
  ];

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', py: { xs: 2, md: 6 } }}>
      <Mark size={32} />

      <Typography sx={{ fontSize: 23, fontWeight: 600, lineHeight: 1.25, mt: 3 }}>
        Create an account.
      </Typography>

      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}
      >
        <TextField
          id="register-username"
          name="username"
          label="Username or email"
          value={register.username}
          onChange={handleChange}
          autoComplete="username"
          size="small"
          fullWidth
        />
        <TextField
          id="register-password"
          name="password"
          type="password"
          label="Password"
          value={register.password}
          onChange={handleChange}
          autoComplete="new-password"
          size="small"
          fullWidth
        />

        {error && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <WarningCircle size={16} />
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {error}
            </Typography>
          </Box>
        )}
        {success && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <CheckCircle size={16} />
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {success}
            </Typography>
          </Box>
        )}

        <Button type="submit" color="primary" fullWidth sx={{ mt: 1 }}>
          Sign up
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          or
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {providers.map(({ name, icon: Icon }) => (
          <Button
            key={name}
            color="inherit"
            startIcon={<Icon size={16} />}
            onClick={() => handleProviderSignUp(name)}
            sx={{ flex: 1 }}
          >
            {name}
          </Button>
        ))}
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to={routes[Pages.Login].path}>
          Sign in
        </Link>
        .
      </Typography>
    </Box>
  );
}

export default Register;
