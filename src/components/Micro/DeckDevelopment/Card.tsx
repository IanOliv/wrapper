import { useState } from 'react';

import Box from '@mui/material/Box';

import { keyframesFor } from './animations';
import { Readout, StageCard } from './styled';
import type { CardDetails } from './types';
import { workbench } from './utils';

interface CardProps {
  index: number;
  details: CardDetails;
  /** the animation this card runs, or '' for none */
  animation: string;
  easing: string;
  duration: number;
  /** seconds into the animation — the timeline drives this, playing or scrubbed */
  playhead: number;
  playing: boolean;
}

/**
 * The thing being judged, so it gets the loudest treatment on the page: 172px,
 * elevation 1, a 108px image area and an identifier that wraps rather than
 * being cut off.
 */
function Card({ index, details, animation, easing, duration, playhead, playing }: CardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <StageCard
      sx={(theme) => ({
        // The animation lives on the card itself; position and scale are the
        // wrapper's job, so the two never fight over `transform`.
        ...keyframesFor(theme),
        animation: animation ? `deck-${animation} ${duration}s ${easing} infinite` : 'none',
        // one delay for both jobs: scrubbing seeks, playing tracks elapsed time
        animationDelay: `-${playhead}s`,
        animationPlayState: playing ? 'running' : 'paused',
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      })}
    >
      <Box
        sx={(theme) => ({
          height: 108,
          display: 'grid',
          placeItems: 'center',
          background: workbench(theme).imageArea,
          color: theme.palette.text.disabled,
          fontSize: 11,
        })}
      >
        {imageFailed ? (
          'image'
        ) : (
          <Box
            component="img"
            src={details.cardImage}
            alt=""
            onError={() => setImageFailed(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </Box>

      <Box sx={{ padding: '10px 12px 12px' }}>
        <Box
          sx={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            mb: 0.5,
          }}
        >
          Card
        </Box>
        <Box
          sx={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.25,
            color: 'text.primary',
            // never clip an identifier — it is the thing you came to read
            wordBreak: 'break-word',
          }}
        >
          {details.cardName}
        </Box>
        <Readout sx={{ display: 'block', mt: 0.75 }}>
          id 0x{(index + 1).toString(16)} · deck
        </Readout>
      </Box>
    </StageCard>
  );
}

export default Card;
