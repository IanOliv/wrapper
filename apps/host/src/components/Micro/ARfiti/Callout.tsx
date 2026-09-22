import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { Scan } from '@phosphor-icons/react';

import Thumb from './Thumb';
import { accent, border, success, surface, text } from './tokens';
import type { Piece } from './types';
import { formatDistance, isMine } from './utils';

type CalloutProps = {
  piece: Piece;
  x: number;
  y: number;
  onScan: () => void;
};

const WIDTH = 186;

/**
 * The selected pin's card. On desktop this holds the one filled accent element
 * on screen — the action of the moment — so the panel row's Scan stays outlined.
 */
function Callout({ piece, x, y, onScan }: CalloutProps) {
  const claimed = isMine(piece);
  const outOfRange = piece.state === 'out-of-range';

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: WIDTH,
        // clear of the pin's tip and its halo
        transform: `translate(calc(-50% + ${x}px), calc(-100% + ${y - 26}px))`,
        transition: (theme) =>
          `transform ${theme.shell.motion.duration.layout}ms ${theme.shell.motion.easing.state}`,
        backgroundColor: surface.card,
        borderRadius: '10px',
        boxShadow: `0 0 0 1px ${border.card}, 0 18px 46px rgba(0,0,0,.6)`,
        overflow: 'hidden',
        zIndex: 4,
      }}
    >
      <Thumb piece={piece} height={86} radius={0} />

      <Box sx={{ p: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {piece.title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: text.secondary, mt: '2px' }}>
            {piece.author}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Box
            sx={{
              px: '7px',
              height: 20,
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              fontSize: 11,
              backgroundColor: claimed ? 'transparent' : accent.chip,
              color: claimed ? success.main : accent.light,
              boxShadow: claimed ? `inset 0 0 0 1px ${success.border}` : 'none',
            }}
          >
            {claimed ? 'Claimed' : 'Unclaimed'}
          </Box>
          <Box
            sx={{
              px: '7px',
              height: 20,
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              fontSize: 11,
              color: text.secondary,
              boxShadow: `inset 0 0 0 1px ${border.card}`,
            }}
          >
            {formatDistance(piece.distanceM)} away
          </Box>
        </Box>

        {!claimed && !outOfRange && (
          <ButtonBase
            onClick={onScan}
            sx={{
              height: 30,
              width: '100%',
              gap: '6px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              backgroundColor: accent.main,
              color: accent.on,
              fontSize: 12,
              fontWeight: 600,
              transition: (theme) =>
                `background-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
              '&:hover': { backgroundColor: accent.light },
              '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
            }}
          >
            <Scan size={14} weight="fill" aria-hidden />
            Scan to claim
          </ButtonBase>
        )}

        {outOfRange && (
          <Typography sx={{ fontSize: 11, color: text.meta }}>
            Too far to scan. Get closer to claim it.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Callout;
