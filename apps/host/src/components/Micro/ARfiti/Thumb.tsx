import Box from '@mui/material/Box';

import { SprayBottle } from '@phosphor-icons/react';

import { border, text } from './tokens';
import type { Piece } from './types';
import { thumbGround } from './utils';

type ThumbProps = {
  piece: Piece;
  /** any CSS size — the row uses 52px, the callout an 86px band */
  width?: number | string;
  height: number | string;
  radius?: number;
  /** a claimed match wears a 2px success ring */
  ring?: string;
};

/**
 * A piece's preview. Until `thumbUrl` is real, a deterministic gradient built
 * from the piece's own accent stands in — a grey box would read as the skeleton
 * it is not.
 */
function Thumb({ piece, width = '100%', height, radius = 8, ring }: ThumbProps) {
  return (
    <Box
      sx={{
        width,
        height,
        flex: 'none',
        borderRadius: `${radius}px`,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        background: thumbGround(piece),
        boxShadow: ring ? `0 0 0 2px ${ring}` : `inset 0 0 0 1px ${border.subtle}`,
      }}
    >
      {piece.thumbUrl ? (
        <Box
          component="img"
          src={piece.thumbUrl}
          alt=""
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <SprayBottle size={18} color={text.meta} aria-hidden />
      )}
    </Box>
  );
}

export default Thumb;
