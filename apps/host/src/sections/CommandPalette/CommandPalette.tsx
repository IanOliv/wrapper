import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { MagnifyingGlass } from '@phosphor-icons/react';

import KeyCap from '@/components/KeyCap';
import useCommandPalette from '@/store/palette';

import Row from './Row';
import { PaletteFooter, PaletteInput } from './styled';
import useItems from './useItems';
import { flatten, groupItems } from './utils';

// ⌘K is not *the* navigation — it is the fastest one. 640px wide, max 480px
// tall, centred at 18vh. On mobile it is a sheet: the keyboard owns the bottom
// half, so "Cancel" sits in the top right.
function CommandPalette() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, paletteActions] = useCommandPalette();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => paletteActions.close(), [paletteActions]);
  const items = useItems(close);

  const sections = useMemo(() => groupItems(items, query), [items, query]);
  const flat = useMemo(() => flatten(sections), [sections]);

  // A fresh open is a fresh query.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      // arrow keys walk across groups, not within them
      setSelected((index) => (flat.length ? (index + 1) % flat.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected((index) => (flat.length ? (index - 1 + flat.length) % flat.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      flat[selected]?.item.run();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      // Escape on a non-empty query clears first.
      if (query) setQuery('');
      else close();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      fullScreen={!isDesktop}
      // enter 140ms (scale .97→1 + fade); leave 80ms, fade only
      transitionDuration={{ enter: 140, exit: 80 }}
      // the input never loses focus
      TransitionProps={{ onEntered: () => inputRef.current?.focus() }}
      PaperProps={{
        elevation: 3,
        sx: isDesktop
          ? {
              m: 0,
              width: 640,
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 480,
              display: 'flex',
              flexDirection: 'column',
            }
          : {
              borderRadius: 0,
              display: 'flex',
              flexDirection: 'column',
              pt: 'env(safe-area-inset-top)',
            },
      }}
      // centred at 18vh
      sx={
        isDesktop
          ? { '& .MuiDialog-container': { alignItems: 'flex-start', pt: '18vh' } }
          : undefined
      }
      aria-label="Command palette"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderBottom: (t) => `1px solid ${t.shell.border.subtle}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', color: 'text.secondary' }}>
          <MagnifyingGlass size={18} />
        </Box>
        <PaletteInput
          inputRef={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Jump to a module, or type an action…"
          autoFocus
          inputProps={{ 'aria-label': 'Search modules and actions', role: 'combobox' }}
        />
        {!isDesktop && (
          <Button variant="text" size="small" onClick={close} sx={{ flexShrink: 0 }}>
            Cancel
          </Button>
        )}
      </Box>

      <Box role="listbox" sx={{ flexGrow: 1, overflowY: 'auto', px: 1, py: 1 }}>
        {sections.map((section) => (
          <Box key={section.group} sx={{ mb: 1 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', px: 1.5 }}>
              {section.group}
            </Typography>
            {section.items.map((scored) => {
              const index = flat.indexOf(scored);

              return (
                <Row
                  key={scored.item.id}
                  scored={scored}
                  selected={index === selected}
                  onSelect={scored.item.run}
                  onHover={() => setSelected(index)}
                />
              );
            })}
          </Box>
        ))}

        {sections.length === 0 && (
          <Box sx={{ px: 2, py: 5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500 }}>
              Nothing matches “{query}”.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Not every sensor is musical. Try a room, a card name, or “add”.
            </Typography>
          </Box>
        )}
      </Box>

      {isDesktop && (
        <PaletteFooter>
          <KeyCap>↑</KeyCap>
          <KeyCap>↓</KeyCap>
          <span>navigate</span>
          <Box sx={{ mx: 0.5 }}>·</Box>
          <KeyCap>↵</KeyCap>
          <span>open</span>
          <Box sx={{ mx: 0.5 }}>·</Box>
          <KeyCap>esc</KeyCap>
          <span>close</span>
        </PaletteFooter>
      )}
    </Dialog>
  );
}

export default CommandPalette;
