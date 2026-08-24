import { useState } from 'react';

import Box from '@mui/material/Box';

import { Readout, StageCard } from './styled';
import type { Pose } from './types';
import { workbench } from './utils';

interface CardProps {
  index: number;
  name: string;
  pose: Pose;
  /** stage magnification, applied on top of the pose's own scale */
  zoom: number;
  three: boolean;
  /** ghosts drawn either side of the playhead sit at 25% */
  ghost?: boolean;
}

/**
 * The thing being judged, so it gets the loudest treatment on the page: 172px,
 * elevation 1, a 108px image area and an identifier that wraps rather than
 * being cut off.
 *
 * It draws a pose, nothing more — no animation of its own. Every frame comes
 * from the document evaluated at the playhead, which is what lets the timeline,
 * the motion path and the onion skin all agree with what is on screen.
 */
function Card({ index, name, pose, zoom, three, ghost = false }: CardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { position, scale, rotate, opacity } = pose;

  const spin = three
    ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)`
    : `rotate(${rotate.z}deg)`;

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        // 172px so the readout below and the leader lines stay pinned to the
        // card's own edges rather than to the widest thing in the stack
        width: 172,
        transform: `scale(${(scale * zoom) / 100}) ${spin}`,
        // The card turns and grows about its own middle. Anchoring the origin
        // to the corner made Tilt, Sway and Flip swing the card around that
        // corner instead of spinning it in place.
        transformOrigin: 'center',
        opacity: ghost ? opacity * 0.25 : opacity,
        pointerEvents: ghost ? 'none' : undefined,
        zIndex: ghost ? 0 : 1,
      }}
    >
      <StageCard>
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
              src="/assets/iso.jpg"
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
            {name}
          </Box>
          <Readout sx={{ display: 'block', mt: 0.75 }}>
            id 0x{(index + 1).toString(16)} · deck
          </Readout>
        </Box>
      </StageCard>
    </Box>
  );
}

export default Card;
