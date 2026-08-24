import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Map from './Map';
import { DesktopPanel } from './PiecesPanel';
import ScanFlow from './ScanFlow';
import Sheet, { detentsFor } from './Sheet';
import { surface } from './tokens';
import useARfiti from './useARfiti';
import useMeasure from './useMeasure';

/**
 * ARfiti — geolocated pieces pinned to real places.
 *
 * The map is the page. On desktop it takes the whole column and the pieces panel
 * sits beside it; on mobile the panel becomes a detented sheet floating over the
 * same map. One `selectedId` drives the pin, the row and the sheet, so tapping a
 * pin scrolls its row into view and tapping a row pans the map to the pin —
 * there is no second source of truth to disagree.
 */
function Item() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [frameRef, frame] = useMeasure();
  const [state, actions] = useARfiti();

  // how much of the map the sheet is currently covering — the map lifts its
  // focal point and its controls clear of it
  const detents = detentsFor(frame.height);
  const coveredBottom = isDesktop ? 0 : detents[state.sheetDetent];

  // Exactly one filled accent element, and it belongs to the action of the
  // moment. Desktop leaves it to the callout. On mobile it is the row's "Scan to
  // claim" — unless location is refused, in which case fixing that is the action
  // of the moment and you could not verify you were at the wall anyway.
  const emphasis =
    isDesktop || state.permissions.location === 'denied' ? 'outlined' : ('filled' as const);

  return (
    <Box
      ref={frameRef}
      sx={{
        position: 'relative',
        display: 'flex',
        height: '100%',
        minHeight: 470,
        overflow: 'hidden',
        backgroundColor: surface.ground,
      }}
    >
      <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <Map
          state={state}
          actions={actions}
          withCallout={isDesktop}
          coveredBottom={coveredBottom}
        />

        {/* scan → claim: one flow, two steps, over a map that never unmounts */}
        {state.flow !== 'browse' && state.selected && (
          <ScanFlow
            piece={state.selected}
            flow={state.flow}
            permissions={state.permissions}
            actions={actions}
          />
        )}
      </Box>

      {isDesktop ? (
        <DesktopPanel state={state} actions={actions} emphasis={emphasis} compact />
      ) : (
        frame.height > 0 && (
          <Sheet state={state} actions={actions} height={frame.height} emphasis={emphasis} />
        )
      )}
    </Box>
  );
}

export default Item;
