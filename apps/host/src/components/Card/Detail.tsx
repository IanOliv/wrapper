import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { X } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

import type { DetailProps } from './types';

// Plausible placeholder body copy. Kept inline rather than generated — the
// generator ships a ~400KB word corpus for three paragraphs of filler.
const body = [
  'The shell owns the header, the navigation, the toasts, the dialogs, the loading and the error surfaces. A module never renders any of them, and never reaches outside its content area.',
  'A module may theme inside itself — its own hue, its own motion, its own density — as long as the surrounding chrome is untouched. Type, radius and spacing tokens belong to the shell; modules use the scale, they do not add steps.',
  'Semantic color is a text color and a 2px mark. No filled semantic bars anywhere, because a filled red bar next to a loud module reads as part of the module rather than as a warning from the app.',
];

// Card detail was not designed; it is built from the tokens and the module
// contract. The shared-element expand reuses the shell's layout spring.
//
// Centring is done by the Modal's flexbox, never by `transform`: framer-motion
// owns `transform` on a `layoutId` element, and a `translateX(-50%)` here was
// being dropped in production, leaving the panel hanging off `left: 50%`.
// Free space can't be overwritten by an animation; a transform can.
//
// The Modal also brings the escape key, the focus trap and `aria-modal` — the
// scroll lock is ours, because MUI only knows how to freeze `document.body`
// and this shell scrolls an inner `<main>` (see `useScrollLock`).
function Detail({ card, onClose }: DetailProps) {
  const theme = useTheme();

  return (
    <Modal
      open
      onClose={onClose}
      disableScrollLock
      aria-labelledby={`card-title-${card.id}`}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        component={motion.article}
        layoutId={`card-${card.id}`}
        transition={theme.shell.motion.spring.layout}
        sx={{
          position: 'relative',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: 720 },
          maxWidth: '100%',
          // mobile is a full-screen sheet that reaches the base; desktop is a
          // centred card capped so it always fits, and therefore always centres
          height: { xs: '100%', md: 'auto' },
          maxHeight: { xs: '100%', md: '84vh' },
          borderRadius: { xs: 0, md: '14px' },
          overflow: 'hidden',
          backgroundColor: (t) => t.shell.surface.level3,
          boxShadow: (t) => t.shell.ring[3],
        }}
      >
        {/* outside the scrolling area, so it stays reachable on long content */}
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            backgroundColor: 'rgba(15,17,25,.5)',
          }}
        >
          <X size={18} />
        </IconButton>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Box
            component={motion.div}
            layoutId={`card-cover-${card.id}`}
            sx={{
              height: 220,
              flexShrink: 0,
              background: `linear-gradient(140deg, ${card.accent}, ${card.accent}55)`,
            }}
          />

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              {card.category} · {card.readingTime}
            </Typography>
            <Typography
              id={`card-title-${card.id}`}
              component={motion.h1}
              layoutId={`card-title-${card.id}`}
              variant="h1"
            >
              {card.title}
            </Typography>
            <Box sx={{ mt: 3 }}>
              {body.map((paragraph) => (
                <Typography key={paragraph.slice(0, 24)} sx={{ color: 'text.secondary', mb: 2 }}>
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default Detail;
