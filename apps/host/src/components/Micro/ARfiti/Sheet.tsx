import { useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import type { PanInfo } from 'framer-motion';
import { animate, motion, useDragControls, useMotionValue, useReducedMotion } from 'framer-motion';

import PiecesPanel from './PiecesPanel';
import Profile from './Profile';
import { border, mapMinAboveSheet, surface, text } from './tokens';
import type { ARfitiActions, ARfitiState, Detent } from './types';

type SheetProps = {
  state: ARfitiState;
  actions: ARfitiActions;
  /** the module frame's height — the detents are measured off it */
  height: number;
  /** who owns the one filled accent element — decided in `Item` */
  emphasis: 'filled' | 'outlined';
};

const ORDER: Detent[] = ['peek', 'half', 'full'];

/** peek shows one row; half shows the list; full is the profile */
function detentsFor(height: number) {
  const full = Math.max(height - mapMinAboveSheet, 260);
  const half = Math.min(Math.max(height * 0.52, 220), full);
  const peek = Math.min(146, half);

  return { peek, half, full } as Record<Detent, number>;
}

/**
 * The panel, as a bottom sheet. The map keeps ~190px above the widest detent and
 * never unmounts — dragging this thing is the only navigation the module has.
 */
function Sheet({ state, actions, height, emphasis }: SheetProps) {
  const theme = useTheme();
  const controls = useDragControls();
  const reduced = useReducedMotion();

  const detents = useMemo(() => detentsFor(height), [height]);
  const full = detents.full;
  const current = detents[state.sheetDetent];

  // `y` is driven by hand rather than by `animate`, because a drag that ends
  // back on the detent it started from leaves the sheet mid-air otherwise:
  // the declarative target never changed, so nothing would pull it home.
  const y = useMotionValue(full - current);

  const transition = reduced
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: theme.shell.motion.spring.drawer.stiffness,
        damping: theme.shell.motion.spring.drawer.damping,
      };

  useEffect(() => {
    const controls = animate(y, full - current, transition);

    return () => controls.stop();
    // `transition` is rebuilt every render; the detent and the frame are what
    // actually move the sheet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, full, y]);

  const snap = (_: unknown, info: PanInfo) => {
    // where the drag would come to rest, then the nearest detent to that
    const resting = full - current + info.offset.y + info.velocity.y * 0.12;

    const nearest = ORDER.reduce((best, detent) =>
      Math.abs(full - detents[detent] - resting) < Math.abs(full - detents[best] - resting)
        ? detent
        : best,
    );

    actions.setSheetDetent(nearest);
    animate(y, full - detents[nearest], transition);
  };

  const cycle = () => {
    actions.setSheetDetent((detent) => {
      const next = ORDER[Math.min(ORDER.indexOf(detent) + 1, ORDER.length - 1)];

      return next === detent ? 'peek' : next;
    });
  };

  return (
    <motion.div
      drag="y"
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: full - detents.peek }}
      dragElastic={0.04}
      dragMomentum={false}
      onDragEnd={snap}
      style={{
        y,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: full,
        zIndex: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: surface.panel,
        boxShadow: `0 -1px 0 ${border.card}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        aria-label={`Pieces sheet, ${state.sheetDetent}. Drag, or press Enter to expand.`}
        onPointerDown={(event) => controls.start(event)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            cycle();
          }
        }}
        sx={{
          flex: 'none',
          height: 22,
          display: 'grid',
          placeItems: 'center',
          cursor: 'grab',
          touchAction: 'none',
          '&:active': { cursor: 'grabbing' },
          '&:focus-visible': { outline: `2px solid ${text.secondary}`, outlineOffset: -4 },
        }}
      >
        <Box
          sx={{ width: 34, height: 4, borderRadius: '999px', backgroundColor: border.control }}
        />
      </Box>

      {state.sheetDetent === 'full' ? (
        <Profile pieces={state.pieces} actions={actions} />
      ) : (
        <PiecesPanel state={state} actions={actions} emphasis={emphasis} compact={false} />
      )}
    </motion.div>
  );
}

export { detentsFor };
export default Sheet;
