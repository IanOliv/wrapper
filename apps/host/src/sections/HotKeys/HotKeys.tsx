import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import KeyCap from '@/components/KeyCap';
import { FlexBox } from '@/components/styled';
import { isTypingTarget } from '@/sections/CommandPalette/utils';
import useHotKeysDialog from '@/store/hotkeys';
import useCommandPalette from '@/store/palette';
import useRail from '@/store/rail';
import useTheme from '@/store/theme';
import { altKeyLabel, metaKeyLabel } from '@/utils/platform';

// The existing global shortcuts fold into ⌘K — the keys stay, discovery moves
// there, and ⌥/ remains the direct route to this list.
function HotKeys() {
  const [, themeActions] = useTheme();
  const [, railActions] = useRail();
  const [isHotKeysDialogOpen, hotKeysDialogActions] = useHotKeysDialog();
  const [, paletteActions] = useCommandPalette();

  // I would love to define all hotkeys in the config and loop it here and avoid this repetitive code.
  // But the `react-hotkeys-hook` library, which we use to handle hotkeys provides only hook (`useHotkeys`).
  // And as you know we can't use hooks inside loops (read "Rules of Hooks" - https://reactjs.org/docs/hooks-rules.html).
  // There is always a workaround, but sometimes it's better to avoid premature and unnecessary optimizations :)
  useHotkeys('alt+s', railActions.toggle);
  useHotkeys('alt+t', themeActions.toggle);
  useHotkeys('alt+/', hotKeysDialogActions.toggle);

  // ⌘K / Ctrl-K opens the palette anywhere *except* inside a text field — which
  // is why this one is a plain listener rather than a `useHotkeys` binding.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      paletteActions.toggle();
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paletteActions]);

  const shortcuts = [
    { label: 'Jump to…', keys: [metaKeyLabel, 'K'], run: paletteActions.open },
    { label: 'Toggle appearance', keys: [altKeyLabel, 'T'], run: themeActions.toggle },
    { label: 'Toggle navigation rail', keys: [altKeyLabel, 'S'], run: railActions.toggle },
    { label: 'This list', keys: [altKeyLabel, '/'], run: hotKeysDialogActions.toggle },
  ];

  return (
    <Dialog fullWidth maxWidth="xs" onClose={hotKeysDialogActions.close} open={isHotKeysDialogOpen}>
      <DialogTitle sx={{ typography: 'h3' }}>Keyboard shortcuts</DialogTitle>
      <DialogContent>
        {shortcuts.map(({ label, keys, run }) => (
          <FlexBox
            key={label}
            alignItems="center"
            height={44}
            justifyContent="space-between"
            onClick={run}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="body1">{label}</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {keys.map((key) => (
                <KeyCap key={key}>{key}</KeyCap>
              ))}
            </Box>
          </FlexBox>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default HotKeys;
