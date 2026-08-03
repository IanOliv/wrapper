import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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
function Detail({ card, onClose }: DetailProps) {
  const theme = useTheme();

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: (t) => t.zIndex.modal - 1,
          backgroundColor: 'rgba(10,11,16,.62)',
          backdropFilter: 'blur(6px)',
        }}
      />

      <Box
        component={motion.article}
        layoutId={`card-${card.id}`}
        transition={theme.shell.motion.spring.layout}
        sx={{
          position: 'fixed',
          zIndex: (t) => t.zIndex.modal,
          top: { xs: 0, md: '8vh' },
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '100%', md: 720 },
          maxWidth: '100%',
          maxHeight: { xs: '100%', md: '84vh' },
          overflowY: 'auto',
          borderRadius: { xs: 0, md: '14px' },
          backgroundColor: (t) => t.shell.surface.level3,
          boxShadow: (t) => t.shell.ring[3],
        }}
      >
        <Box
          component={motion.div}
          layoutId={`card-cover-${card.id}`}
          sx={{
            height: 220,
            background: `linear-gradient(140deg, ${card.accent}, ${card.accent}55)`,
          }}
        />

        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(15,17,25,.5)' }}
        >
          <X size={18} />
        </IconButton>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {card.category} · {card.readingTime}
          </Typography>
          <Typography component={motion.h1} layoutId={`card-title-${card.id}`} variant="h1">
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
    </>
  );
}

export default Detail;
