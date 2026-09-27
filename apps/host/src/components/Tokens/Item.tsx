import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Broadcast, Cards, ChatTeardropDots } from '@phosphor-icons/react';

import KeyCap from '@/components/KeyCap';
import Mark from '@/components/Mark';
import { Mono } from '@/components/styled';

import Section from './Section';
import Swatch from './Swatch';

// Every token and component state on one page. Build this second (right after
// the theme file) and every screen after it gets cheaper.
function Item() {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1080, mx: 'auto', pb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Mark size={32} />
        <Box>
          <Typography variant="h1">Design tokens</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Mode: <Mono>{theme.palette.mode}</Mono> · every value the shell is allowed to use
          </Typography>
        </Box>
      </Box>

      <Section title="Palette">
        <Swatch label="background.default" value={theme.palette.background.default} />
        <Swatch label="background.paper" value={theme.palette.background.paper} />
        <Swatch label="surface elev 2" value={theme.shell.surface.level2} />
        <Swatch label="surface elev 3" value={theme.shell.surface.level3} />
        <Swatch label="primary.main" value={theme.palette.primary.main} />
        <Swatch label="primary.dark" value={theme.palette.primary.dark} />
        <Swatch label="primary.light" value={theme.palette.primary.light} />
        <Swatch label="primary tint" value={theme.shell.tint} />
        <Swatch label="secondary.main" value={theme.palette.secondary.main} />
        <Swatch label="text.primary" value={theme.palette.text.primary} />
        <Swatch label="text.secondary" value={theme.palette.text.secondary} />
        <Swatch label="text.disabled" value={theme.palette.text.disabled} />
        <Swatch label="success.main" value={theme.palette.success.main} />
        <Swatch label="error.main" value={theme.palette.error.main} />
        <Swatch label="warning.main" value={theme.palette.warning.main} />
        <Swatch label="info.main" value={theme.palette.info.main} />
        <Swatch label="border subtle" value={theme.shell.border.subtle} />
        <Swatch label="border card" value={theme.shell.border.card} />
        <Swatch label="border control" value={theme.shell.border.control} />
      </Section>

      <Section title="Typography">
        <Box sx={{ width: '100%' }}>
          <Typography variant="h1">h1 · 32/600 · Instrument, not application</Typography>
          <Typography variant="h2">h2 · 24/600 · One shell. Every module.</Typography>
          <Typography variant="h3">h3 · 18/600 · Section heading</Typography>
          <Typography variant="body1">
            body1 · 15/400 · The tell that you are in Wrapper and not in a module is never
            &ldquo;everything is purple&rdquo;.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            body2 · 13/400 · Metadata, secondary lines, list subtitles.
          </Typography>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
            overline · 11/500 · .14em
          </Typography>
          <Mono>mono · 13/500 · tabular-nums · 21.4 °C · err·chunk-load-failed</Mono>
        </Box>
      </Section>

      <Section title="Elevation">
        {[0, 1, 2, 3].map((level) => (
          <Paper
            key={level}
            elevation={level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 4 : 12}
            sx={{ p: 2, minWidth: 180 }}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              level {level}
            </Typography>
            <Typography variant="body2">
              {['page ground', 'cards, app bar', 'drawer, menus', 'dialogs, toasts'][level]}
            </Typography>
          </Paper>
        ))}
      </Section>

      <Section title="Radius">
        {[
          ['4px', 'chips, tags, key caps'],
          ['8px', 'buttons, inputs, cards, toasts'],
          ['14px', 'dialogs, bottom sheet'],
          ['999px', 'avatars, status dots only'],
        ].map(([value, use]) => (
          <Box
            key={value}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              width: 160,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 48,
                borderRadius: value,
                border: (t) => `1px solid ${t.palette.primary.main}`,
              }}
            />
            <Mono>{value}</Mono>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {use}
            </Typography>
          </Box>
        ))}
      </Section>

      <Section title="Spacing — base 8">
        {[4, 8, 12, 16, 24, 32, 48].map((step) => (
          <Box key={step} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: step, height: 32, bgcolor: 'primary.main', borderRadius: '2px' }} />
            <Mono>{step}</Mono>
          </Box>
        ))}
      </Section>

      <Section title="Buttons — accent outline, never a fill">
        <Button color="primary">Primary action</Button>
        <Button color="inherit">Secondary</Button>
        <Button variant="text">Text</Button>
        <Button color="primary" disabled>
          Disabled
        </Button>
        <Button color="primary" size="small">
          Small
        </Button>
      </Section>

      <Section title="Inputs & chips">
        <TextField label="Username" size="small" defaultValue="" placeholder="Type here" />
        <TextField label="Focused" size="small" defaultValue="wrapper" autoFocus />
        <Chip label="experimental" variant="outlined" />
        <Chip label="filled" />
        <KeyCap>⌘</KeyCap>
        <KeyCap>K</KeyCap>
      </Section>

      <Section title="Semantic — text and a 2px mark, never a filled banner">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
          <Alert severity="success">App is ready to work offline.</Alert>
          <Alert severity="info">Three sensors reported in the last minute.</Alert>
          <Alert severity="warning">Boiler return is out of range.</Alert>
          <Alert severity="error">Could not reach the sensor gateway.</Alert>
        </Box>
      </Section>

      <Section title="Loading — shimmer for content, spin for indeterminate actions">
        <Box sx={{ width: '100%', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {[0, 1].map((index) => (
            <Paper key={index} sx={{ p: 2, width: 240 }}>
              <Skeleton variant="rectangular" height={96} sx={{ mb: 1.5 }} />
              <Skeleton width="70%" height={20} />
              <Skeleton width="40%" height={16} />
            </Paper>
          ))}
        </Box>
      </Section>

      <Section title="Icons — Phosphor, regular idle / fill active">
        {[Cards, Broadcast, ChatTeardropDots].map((Icon, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Icon size={24} />
            <Icon size={24} weight="fill" color={theme.palette.primary.main} />
          </Box>
        ))}
      </Section>

      <Divider sx={{ mt: 4 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
        This route is mounted in development only.
      </Typography>
    </Box>
  );
}

export default Item;
