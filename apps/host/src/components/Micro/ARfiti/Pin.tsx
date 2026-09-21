import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { accent, pin as pinColor, surface } from './tokens';
import type { PieceState } from './types';

type PinProps = {
  x: number;
  y: number;
  state: PieceState;
  label: string;
  onClick: () => void;
};

/** the rotated teardrop's tip sits this far below its centre */
const TIP = 0.707;

const SIZE: Record<PieceState, number> = {
  selected: 20,
  default: 16,
  claimed: 16,
  'out-of-range': 16,
  inserting: 16,
};

function faceFor(state: PieceState) {
  if (state === 'selected') {
    return {
      backgroundColor: accent.main,
      border: 'none',
      // 6px halo — the one pin that is louder than the ground
      boxShadow: `0 0 0 6px ${accent.halo}`,
    };
  }

  const borderColor = {
    default: pinColor.available,
    claimed: pinColor.claimed,
    'out-of-range': pinColor.outOfRange,
    inserting: pinColor.inserting,
    selected: pinColor.available,
  }[state];

  return {
    backgroundColor: surface.ground,
    border: `2px solid ${borderColor}`,
    boxShadow: 'none',
  };
}

/**
 * One pin, positioned by its offset from the centre of the map viewport. The
 * teardrop is a square with three round corners rotated -45°, so its square
 * corner points at the place it marks.
 */
function Pin({ x, y, state, label, onClick }: PinProps) {
  const size = SIZE[state];
  const face = faceFor(state);

  return (
    <ButtonBase
      focusRipple={false}
      aria-label={label}
      aria-pressed={state === 'selected'}
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        borderRadius: '50%',
        // the tip, not the centre, lands on the coordinate
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y - TIP * size}px))`,
        transition: (theme) =>
          `transform ${theme.shell.motion.duration.layout}ms ${theme.shell.motion.easing.state}`,
        zIndex: state === 'selected' ? 3 : 2,
        '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          transition: (theme) =>
            `background-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, box-shadow ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
          ...face,
        }}
      />
    </ButtonBase>
  );
}

type YouPinProps = {
  x: number;
  y: number;
};

/** where you are: a 12px dot, a 3px ring off the ground, a 44px accuracy halo */
function YouPin({ x, y }: YouPinProps) {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: 'rgba(127,156,245,.14)',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        transition: (theme) =>
          `transform ${theme.shell.motion.duration.layout}ms ${theme.shell.motion.easing.state}`,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: pinColor.you,
          boxShadow: `0 0 0 3px ${surface.ground}`,
        }}
      />
    </Box>
  );
}

export { YouPin };
export default Pin;
