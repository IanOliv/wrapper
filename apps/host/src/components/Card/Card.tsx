import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { motion } from 'framer-motion';

import type { CardProps } from './types';

// Cards sit at elevation 1 with an 8px radius on the page ground. Title `h2`,
// metadata `body2` in `text.secondary`. The 24px pillow radii are gone.
function Card({ card }: CardProps) {
  return (
    <Box
      component={motion.article}
      layoutId={`card-${card.id}`}
      sx={{
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        boxShadow: (theme) => theme.shell.ring[1],
      }}
    >
      <Box
        component={motion.div}
        layoutId={`card-cover-${card.id}`}
        sx={{
          height: 132,
          // the module's own hue, inside the module
          background: `linear-gradient(140deg, ${card.accent}, ${card.accent}55)`,
        }}
      />

      <Box sx={{ p: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {card.category}
        </Typography>
        <Typography component={motion.h2} layoutId={`card-title-${card.id}`} variant="h2">
          {card.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {card.readingTime}
        </Typography>
      </Box>

      {/* the whole card is the target — a detail state of the feed */}
      <Box
        component={Link}
        to={`/card/${card.id}`}
        aria-label={card.title}
        sx={{ position: 'absolute', inset: 0 }}
      />
    </Box>
  );
}

export default Card;
