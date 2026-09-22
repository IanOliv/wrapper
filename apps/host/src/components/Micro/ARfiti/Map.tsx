import { useMemo } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';

import { CrosshairSimple, MagnifyingGlass, Minus, Plus } from '@phosphor-icons/react';

import Callout from './Callout';
import Pin, { YouPin } from './Pin';
import { HOME } from './data';
import { accent, border, map as mapToken, pin as pinColor, surface, text } from './tokens';
import type { ARfitiActions, ARfitiState } from './types';
import useMeasure from './useMeasure';
import { project, resolveState } from './utils';

type MapProps = {
  state: ARfitiState;
  actions: ARfitiActions;
  /** desktop shows the callout; on mobile the sheet row is the callout */
  withCallout: boolean;
  /** how much of the map's foot the sheet is sitting on */
  coveredBottom: number;
};

/**
 * The map is the page. No card, no padding, no ground of its own beyond the
 * tiles — everything else in this module is a layer over it, and it never
 * unmounts, not even during the scan.
 */
function Map({ state, actions, withCallout, coveredBottom }: MapProps) {
  const [ref, size] = useMeasure();
  const { view, visible, selectedId, selected, permissions, query, sort } = state;

  // The tile ground pans under the pins by the same offset, so the grid reads as
  // the world moving rather than the pins sliding over wallpaper.
  const centre = useMemo(() => project({ lat: view.lat, lng: view.lng }, view), [view]);
  const streets = 74 * view.zoom;
  const avenues = 226 * view.zoom;

  // The sheet sits on the bottom of the map, so the middle of the *frame* is not
  // the middle of what anyone can see. Everything the map draws is lifted by
  // half the covered strip, which is what puts a selected pin above the sheet
  // instead of behind it.
  const focusY = -coveredBottom / 2;
  const bottomInset = coveredBottom + 14;
  const panX = -centre.x;
  const panY = -centre.y + focusY;

  const positions = useMemo(
    () => visible.map((piece) => ({ piece, at: project(piece, view) })),
    [view, visible],
  );

  // what is actually on screen, not what is on the frame
  const inView = useMemo(() => {
    if (!size.width || !size.height) return positions.length;

    return positions.filter(({ at }) => {
      const screenY = size.height / 2 + at.y + focusY;

      return (
        Math.abs(at.x) < size.width / 2 && screenY > 0 && screenY < size.height - coveredBottom
      );
    }).length;
  }, [coveredBottom, focusY, positions, size]);

  const locationOn = permissions.location === 'granted';
  const locationDenied = permissions.location === 'denied';
  const selectedAt = selected ? project(selected, view) : null;
  // where you are is a place on the map, not a place on the screen — it has to
  // move with the pan like every other pin
  const youAt = project(HOME, view);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height: '100%',
        minWidth: 0,
        overflow: 'hidden',
        backgroundColor: mapToken.ground,
      }}
    >
      {/* ground: two street gradients, an avenue every 226px, one soft glow */}
      <Box
        aria-hidden
        onClick={() => actions.select(null)}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            `radial-gradient(circle at 38% 42%, ${mapToken.glow} 0%, transparent 58%)`,
            `repeating-linear-gradient(90deg, ${mapToken.avenue} 0 2px, transparent 2px ${avenues}px)`,
            `repeating-linear-gradient(0deg, ${mapToken.avenue} 0 2px, transparent 2px ${avenues}px)`,
            `repeating-linear-gradient(90deg, ${mapToken.street} 0 1px, transparent 1px ${streets}px)`,
            `repeating-linear-gradient(0deg, ${mapToken.street} 0 1px, transparent 1px ${streets}px)`,
          ].join(','),
          backgroundPosition: [
            '0 0',
            `${panX}px ${panY}px`,
            `${panX}px ${panY}px`,
            `${panX}px ${panY}px`,
            `${panX}px ${panY}px`,
          ].join(','),
          transition: (theme) =>
            `background-position ${theme.shell.motion.duration.layout}ms ${theme.shell.motion.easing.state}`,
        }}
      />

      {/* pins layer */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        {locationOn && <YouPin x={youAt.x} y={youAt.y + focusY} />}

        {positions.map(({ piece, at }) => (
          <Pin
            key={piece.id}
            x={at.x}
            y={at.y + focusY}
            state={resolveState(piece, selectedId)}
            label={piece.title}
            onClick={() => actions.select(piece.id)}
          />
        ))}

        {withCallout && selected && selectedAt && !locationDenied && (
          <Callout
            piece={selected}
            x={selectedAt.x}
            y={selectedAt.y + focusY}
            onScan={actions.startScan}
          />
        )}
      </Box>

      {/* floating top bar */}
      <Box
        sx={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          right: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            height: 34,
            flex: '1 1 180px',
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            px: '10px',
            borderRadius: '8px',
            backgroundColor: surface.floating,
            boxShadow: `inset 0 0 0 1px ${border.card}`,
            '&:focus-within': { boxShadow: `inset 0 0 0 1px ${accent.main}` },
          }}
        >
          <MagnifyingGlass size={15} color={text.secondary} aria-hidden />
          <InputBase
            value={query}
            onChange={(event) => actions.setQuery(event.target.value)}
            placeholder="Search a place or tag"
            inputProps={{ 'aria-label': 'Search a place or tag' }}
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: 13,
              color: text.primary,
              '& input::placeholder': { color: text.meta, opacity: 1 },
            }}
          />
        </Box>

        <MapChip active={sort === 'nearby'} onClick={() => actions.setSort('nearby')}>
          Nearby
        </MapChip>
        <MapChip active={sort === 'recent'} onClick={() => actions.setSort('recent')}>
          Recent
        </MapChip>
      </Box>

      {/* the map dims when location is refused; nothing on it is actionable */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          backgroundColor: locationDenied ? 'rgba(15,17,25,.62)' : 'transparent',
          transition: (theme) =>
            `background-color ${theme.shell.motion.duration.enter}ms ${theme.shell.motion.easing.state}`,
        }}
      />

      {/* status pill — and, when location is off, the button that fixes it */}
      <Box sx={{ position: 'absolute', left: '16px', bottom: `${bottomInset}px`, zIndex: 6 }}>
        {locationOn ? (
          <Box
            sx={{
              height: 34,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              px: '12px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              backgroundColor: surface.floating,
              boxShadow: `inset 0 0 0 1px ${border.card}`,
              fontSize: 12,
              color: text.secondary,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: pinColor.claimed,
                flex: 'none',
              }}
            />
            Location on · {inView} {inView === 1 ? 'piece' : 'pieces'} in view
          </Box>
        ) : (
          <ButtonBase
            onClick={actions.enableLocation}
            sx={{
              height: 34,
              px: '14px',
              gap: '8px',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              fontSize: 12,
              fontWeight: 600,
              // denied is the action of the moment, so it takes the filled accent
              backgroundColor: locationDenied ? accent.main : surface.floating,
              color: locationDenied ? accent.on : accent.main,
              boxShadow: locationDenied ? 'none' : `inset 0 0 0 1px ${accent.main}`,
              '&:hover': { backgroundColor: locationDenied ? accent.light : surface.floating },
              '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
            }}
          >
            <CrosshairSimple size={14} weight={locationDenied ? 'fill' : 'regular'} aria-hidden />
            Enable location
          </ButtonBase>
        )}
      </Box>

      {/* zoom and recentre */}
      <Box
        sx={{
          position: 'absolute',
          right: '16px',
          bottom: `${bottomInset}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 6,
        }}
      >
        <MapControl label="Zoom in" onClick={() => actions.zoom(1)}>
          <Plus size={15} aria-hidden />
        </MapControl>
        <MapControl label="Zoom out" onClick={() => actions.zoom(-1)}>
          <Minus size={15} aria-hidden />
        </MapControl>
        <MapControl label="Recentre" accented onClick={actions.recenter}>
          <CrosshairSimple size={15} aria-hidden />
        </MapControl>
      </Box>
    </Box>
  );
}

type MapChipProps = {
  active: boolean;
  onClick: () => void;
  children: string;
};

function MapChip({ active, onClick, children }: MapChipProps) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={active}
      sx={{
        height: 34,
        px: '12px',
        flex: 'none',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: surface.floating,
        color: active ? accent.main : text.secondary,
        boxShadow: `inset 0 0 0 1px ${active ? accent.main : border.card}`,
        transition: (theme) =>
          `color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, box-shadow ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
        '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
      }}
    >
      {children}
    </ButtonBase>
  );
}

type MapControlProps = {
  label: string;
  accented?: boolean;
  onClick: () => void;
  children: JSX.Element;
};

function MapControl({ label, accented, onClick, children }: MapControlProps) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      sx={{
        width: 34,
        height: 34,
        borderRadius: '8px',
        backgroundColor: surface.floating,
        color: accented ? accent.main : text.secondary,
        boxShadow: `inset 0 0 0 1px ${accented ? accent.main : border.card}`,
        '&:hover': { backgroundColor: surface.floating, color: text.primary },
        '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
      }}
    >
      {children}
    </IconButton>
  );
}

export default Map;
