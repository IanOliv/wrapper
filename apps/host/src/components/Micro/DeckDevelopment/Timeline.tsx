import { PointerEvent, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import {
  CaretDown,
  CaretRight,
  Copy,
  Diamond,
  Pause,
  Play,
  Record,
  SkipBack,
  SkipForward,
} from '@phosphor-icons/react';

import { FlexBox } from '@/components/styled';

import {
  childrenOf,
  clamp,
  extentOf,
  groupLayers,
  keysOf,
  propertyLabels,
  snapTime,
  trackProperties,
} from './model';
import type { Action } from './reducer';
import { Chip, Readout } from './styled';
import type { Layer, WorkbenchState } from './types';
import { speedSteps, timecode, workbench } from './utils';

interface TimelineProps {
  state: WorkbenchState;
  dispatch: (action: Action) => void;
  onCopy: () => void;
  copied: boolean;
  compact: boolean;
}

const GUTTER = 152;
const RULER = 24;
const LAYER_ROW = 28;
const PROPERTY_ROW = 26;

/**
 * The gutter and the track area walk the same row list, so the two halves of
 * the timeline can never drift out of alignment.
 */
type Row = {
  id: string;
  layer: Layer;
  label: string;
  depth: number;
  top: number;
  height: number;
} & ({ kind: 'layer' } | { kind: 'property'; trackId: string });

interface DragState {
  kind: 'keys' | 'marquee' | 'scrub';
  startX: number;
  startT: number;
  duplicated: boolean;
  x: number;
  y: number;
  startY: number;
}

/**
 * The bottom panel. Everything above shows one instant; this shows the whole
 * animation, which is the only place the shape of a motion is actually legible.
 */
function Timeline({ state, dispatch, onCopy, copied, compact }: TimelineProps) {
  const { doc, selection, view } = state;
  const trackArea = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  /** Pixel position inside the track area, as a time in seconds. */
  const timeAt = (clientX: number) => {
    const bounds = trackArea.current?.getBoundingClientRect();

    if (!bounds || bounds.width === 0) return 0;

    return clamp(((clientX - bounds.left) / bounds.width) * doc.duration, 0, doc.duration);
  };

  const asPercent = (t: number) => (doc.duration > 0 ? (t / doc.duration) * 100 : 0);

  const endDrag = () => setDrag(null);

  /** Dragging on the ruler, or Alt anywhere in the tracks, scrubs live. */
  const beginScrub = (event: PointerEvent) => {
    dispatch({ type: 'set-playing', value: false });
    dispatch({ type: 'set-playhead', value: timeAt(event.clientX) });
    setDrag({
      kind: 'scrub',
      startX: event.clientX,
      startT: 0,
      duplicated: false,
      x: event.clientX,
      y: event.clientY,
      startY: event.clientY,
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!drag) return;

    if (drag.kind === 'scrub') {
      dispatch({ type: 'set-playhead', value: timeAt(event.clientX) });

      return;
    }

    if (drag.kind === 'marquee') {
      setDrag({ ...drag, x: event.clientX, y: event.clientY });

      return;
    }

    const raw = timeAt(event.clientX) - drag.startT;
    const delta = snapTime(raw, event.shiftKey);

    // Alt copies the selection once, then drags the copies.
    if (event.altKey && !drag.duplicated) {
      dispatch({ type: 'move-keys', ids: selection.keyIds, delta, duplicate: true });
      setDrag({ ...drag, duplicated: true, startT: timeAt(event.clientX) });

      return;
    }

    if (delta !== 0) {
      dispatch({ type: 'move-keys', ids: selection.keyIds, delta });
      setDrag({ ...drag, startT: timeAt(event.clientX) });
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (drag?.kind === 'marquee') {
      const bounds = trackArea.current?.getBoundingClientRect();

      if (bounds) {
        const from = timeAt(Math.min(drag.startX, event.clientX));
        const to = timeAt(Math.max(drag.startX, event.clientX));
        const top = Math.min(drag.startY, event.clientY) - bounds.top;
        const bottom = Math.max(drag.startY, event.clientY) - bounds.top;
        const caught = rows
          .flatMap((row) =>
            row.kind === 'property' && row.top + row.height > top && row.top < bottom
              ? keysOf(doc, row.trackId)
              : [],
          )
          .filter((key) => key.t >= from && key.t <= to)
          .map((key) => key.id);

        dispatch({ type: 'select-keys', ids: caught });
      }
    }

    endDrag();
  };

  /** The gutter and the track area share this row list, so they cannot drift. */
  const rows: Row[] = [];

  let offset = 0;
  const visibleLayers = compact
    ? doc.layers.filter((layer) => selection.layerIds.includes(layer.id))
    : groupLayers(doc).flatMap((group) => [
        group,
        ...(group.collapsed ? [] : childrenOf(doc, group.id)),
      ]);

  visibleLayers.forEach((layer) => {
    rows.push({
      kind: 'layer',
      id: layer.id,
      layer,
      label: layer.name,
      depth: layer.parentId ? 1 : 0,
      top: offset,
      height: LAYER_ROW,
    });
    offset += LAYER_ROW;

    if (layer.collapsed) return;

    trackProperties.forEach((property) => {
      const track = doc.tracks.find(
        (candidate) => candidate.layerId === layer.id && candidate.property === property,
      );

      if (!track) return;

      rows.push({
        kind: 'property',
        id: track.id,
        layer,
        label: propertyLabels[property],
        trackId: track.id,
        depth: layer.parentId ? 2 : 1,
        top: offset,
        height: PROPERTY_ROW,
      });
      offset += PROPERTY_ROW;
    });
  });

  const bodyHeight = offset;

  // Resolved here rather than inside `sx`, so the ref is checked once.
  const marqueeBounds = trackArea.current?.getBoundingClientRect();
  const marquee =
    drag?.kind === 'marquee' && marqueeBounds
      ? {
          left: Math.min(drag.startX, drag.x) - marqueeBounds.left,
          top: Math.min(drag.startY, drag.y) - marqueeBounds.top,
          width: Math.abs(drag.x - drag.startX),
          height: Math.abs(drag.y - drag.startY),
        }
      : null;
  const ticks = Array.from({ length: 11 }, (_, index) => (index / 10) * doc.duration);

  return (
    <Box
      sx={(theme) => ({
        gridArea: 'timeline',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        // fills the band the workbench grid hands it
        height: '100%',
        backgroundColor: workbench(theme).panel,
        borderTop: `1px solid ${theme.shell.border.subtle}`,
      })}
    >
      {/* Transport */}
      <FlexBox
        sx={(theme) => ({
          height: 40,
          alignItems: 'center',
          gap: 1,
          padding: '0 12px',
          flexWrap: 'wrap',
          borderBottom: `1px solid ${theme.shell.border.subtle}`,
        })}
      >
        <Tooltip title="Back to start" arrow>
          <Chip
            aria-label="Back to start"
            sx={{ width: 28, p: 0 }}
            onClick={() => dispatch({ type: 'set-playhead', value: 0 })}
          >
            <SkipBack size={13} />
          </Chip>
        </Tooltip>
        <Chip
          className="accent"
          aria-label={view.playing ? 'Pause' : 'Play'}
          sx={{ width: 28, p: 0 }}
          onClick={() => dispatch({ type: 'set-playing', value: !view.playing })}
        >
          {view.playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
        </Chip>
        <Tooltip title="To the end" arrow>
          <Chip
            aria-label="To the end"
            sx={{ width: 28, p: 0 }}
            onClick={() => dispatch({ type: 'set-playhead', value: doc.duration })}
          >
            <SkipForward size={13} />
          </Chip>
        </Tooltip>

        <Readout sx={{ ml: 0.5, color: 'text.primary' }}>{timecode(doc.playhead)}</Readout>
        <Readout>/ {timecode(doc.duration)}</Readout>

        <FlexBox sx={{ marginLeft: 'auto', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip onClick={() => dispatch({ type: 'add-key' })}>
            <Diamond size={12} weight="fill" />
            Add key
          </Chip>

          {/* Armed, a slider writes a key at the playhead instead of moving the
              layer's base pose. */}
          <Chip
            className={view.recording ? 'active' : undefined}
            aria-pressed={view.recording}
            onClick={() => dispatch({ type: 'toggle-view', field: 'recording' })}
            sx={view.recording ? { color: 'error.main', borderColor: 'error.main' } : undefined}
          >
            <Record size={12} weight={view.recording ? 'fill' : 'regular'} />
            Record
          </Chip>

          <FlexBox sx={{ gap: '4px' }}>
            {speedSteps.map((speed) => (
              <Chip
                key={speed}
                className={doc.speed === speed ? 'active' : undefined}
                aria-pressed={doc.speed === speed}
                onClick={() => dispatch({ type: 'set-number', field: 'speed', value: speed })}
                sx={{ padding: '0 7px' }}
              >
                {speed}×
              </Chip>
            ))}
          </FlexBox>

          <Chip className="accent" onClick={onCopy}>
            <Copy size={12} />
            {copied ? 'Copied' : 'Copy code'}
          </Chip>
        </FlexBox>
      </FlexBox>

      {/* Body: a fixed ruler over rows that scroll under it, so the time
          labels stay readable however many layers the document holds. */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${GUTTER}px 1fr`,
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <Box
            sx={(theme) => ({
              height: RULER,
              borderRight: `1px solid ${theme.shell.border.subtle}`,
              borderBottom: `1px solid ${theme.shell.border.subtle}`,
            })}
          />
          <Box
            onPointerDown={beginScrub}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            sx={(theme) => ({
              height: RULER,
              position: 'relative',
              cursor: 'ew-resize',
              touchAction: 'none',
              borderBottom: `1px solid ${theme.shell.border.subtle}`,
            })}
          >
            {ticks.map((t, index) => (
              <Box
                key={index}
                sx={{ position: 'absolute', left: `${asPercent(t)}%`, top: 0, bottom: 0 }}
              >
                <Box
                  sx={(theme) => ({
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    backgroundColor: theme.shell.border.subtle,
                  })}
                />
                <Readout
                  sx={{ position: 'absolute', top: 5, left: 4, fontSize: 9, pointerEvents: 'none' }}
                >
                  {t.toFixed(1)}
                </Readout>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${GUTTER}px 1fr`,
            // one row that stretches to the band when the document is small and
            // grows past it when there are more tracks than fit
            gridTemplateRows: 'minmax(min-content, 1fr)',
            minWidth: 0,
            minHeight: 0,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Box
            sx={(theme) => ({
              borderRight: `1px solid ${theme.shell.border.subtle}`,
            })}
          >
            {rows.map((row) => (
              <FlexBox
                key={`${row.kind}-${row.id}`}
                sx={{
                  height: row.height,
                  alignItems: 'center',
                  gap: '6px',
                  paddingLeft: `${8 + row.depth * 15}px`,
                  paddingRight: '8px',
                  fontSize: row.kind === 'layer' ? 12 : 11,
                  color: row.kind === 'layer' ? 'text.primary' : 'text.secondary',
                }}
              >
                {row.kind === 'layer' ? (
                  <>
                    <Box
                      component="span"
                      role="button"
                      tabIndex={-1}
                      aria-label={row.layer.collapsed ? 'Expand' : 'Collapse'}
                      onClick={() => dispatch({ type: 'toggle-collapsed', id: row.layer.id })}
                      sx={{
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {row.layer.collapsed ? <CaretRight size={11} /> : <CaretDown size={11} />}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '2px',
                        backgroundColor: row.layer.color,
                        flexShrink: 0,
                      }}
                    />
                  </>
                ) : (
                  <Box component="span" sx={{ width: 15, flexShrink: 0 }} />
                )}
                <Box
                  component="span"
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.label}
                </Box>
              </FlexBox>
            ))}
          </Box>

          <Box
            ref={trackArea}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={endDrag}
            sx={{
              position: 'relative',
              minWidth: 0,
              // a minimum, not a fixed height: below the last track the surface
              // keeps its gridlines and stays clickable to the bottom of the band
              minHeight: bodyHeight,
              touchAction: 'none',
              userSelect: 'none',
            }}
            onPointerDown={(event) => {
              if (event.altKey) {
                beginScrub(event);

                return;
              }

              setDrag({
                kind: 'marquee',
                startX: event.clientX,
                startT: 0,
                duplicated: false,
                x: event.clientX,
                y: event.clientY,
                startY: event.clientY,
              });
            }}
          >
            {ticks.map((t, index) => (
              <Box
                key={index}
                sx={(theme) => ({
                  position: 'absolute',
                  left: `${asPercent(t)}%`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: theme.shell.border.subtle,
                  pointerEvents: 'none',
                })}
              />
            ))}

            {rows.map((row) => {
              if (row.kind === 'layer') {
                const extent = extentOf(doc, row.layer.id);

                if (!extent) return null;

                return (
                  <Box
                    key={`bar-${row.id}`}
                    sx={(theme) => ({
                      position: 'absolute',
                      top: row.top + row.height / 2 - 4,
                      left: `${asPercent(extent[0])}%`,
                      width: `${Math.max(1, asPercent(extent[1] - extent[0]))}%`,
                      height: 8,
                      borderRadius: '2px',
                      backgroundColor: workbench(theme).knobRing,
                      pointerEvents: 'none',
                    })}
                  />
                );
              }

              const { trackId } = row;
              const keys = keysOf(doc, trackId);

              return (
                <Box
                  key={`track-${row.id}`}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    dispatch({
                      type: 'add-key-at',
                      trackId,
                      t: snapTime(timeAt(event.clientX), false),
                    });
                  }}
                  sx={{ position: 'absolute', top: row.top, left: 0, right: 0, height: row.height }}
                >
                  {/* the 2px run between consecutive keys */}
                  {keys.slice(0, -1).map((from, index) => {
                    const to = keys[index + 1];

                    return (
                      <Box
                        key={from.id}
                        onDoubleClick={(event) => {
                          // opens the bezier editor for THIS segment
                          event.stopPropagation();
                          dispatch({ type: 'select-keys', ids: [from.id] });
                          dispatch({ type: 'edit-bezier', keyId: from.id });
                        }}
                        sx={(theme) => ({
                          position: 'absolute',
                          top: '50%',
                          marginTop: '-1px',
                          left: `${asPercent(from.t)}%`,
                          width: `${asPercent(to.t - from.t)}%`,
                          height: 2,
                          backgroundColor: theme.shell.tint,
                          cursor: 'pointer',
                        })}
                      />
                    );
                  })}

                  {keys.map((key) => {
                    const isSelected = selection.keyIds.includes(key.id);

                    return (
                      <Box
                        key={key.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${row.label} key at ${key.t.toFixed(2)}s`}
                        onPointerDown={(event) => {
                          event.stopPropagation();

                          const additive = event.shiftKey || event.metaKey || event.ctrlKey;

                          if (!isSelected) {
                            dispatch({ type: 'select-keys', ids: [key.id], additive });
                          }

                          setDrag({
                            kind: 'keys',
                            startX: event.clientX,
                            startT: timeAt(event.clientX),
                            duplicated: false,
                            x: event.clientX,
                            y: event.clientY,
                            startY: event.clientY,
                          });
                        }}
                        sx={(theme) => ({
                          position: 'absolute',
                          top: '50%',
                          left: `${asPercent(key.t)}%`,
                          width: 8,
                          height: 8,
                          marginTop: '-4px',
                          marginLeft: '-4px',
                          transform: 'rotate(45deg)',
                          cursor: 'grab',
                          backgroundColor: isSelected
                            ? theme.palette.background.default
                            : theme.palette.primary.main,
                          boxShadow: isSelected
                            ? `0 0 0 2px ${theme.palette.primary.main}`
                            : 'none',
                          '&:focus-visible': {
                            outline: `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: 2,
                          },
                        })}
                      />
                    );
                  })}
                </Box>
              );
            })}

            {/* marquee */}
            {marquee && (
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  ...marquee,
                  border: `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.shell.tint,
                  opacity: 0.4,
                  pointerEvents: 'none',
                })}
              />
            )}
          </Box>
        </Box>

        {/* The playhead sits outside the scroller, so it spans the ruler and
            the rows and never scrolls out of view. */}
        <Box
          sx={{
            position: 'absolute',
            left: GUTTER,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${asPercent(doc.playhead)}%`,
              width: '1px',
              backgroundColor: theme.palette.primary.main,
            })}
          >
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                left: -4,
                width: 9,
                height: 9,
                backgroundColor: theme.palette.primary.main,
              })}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Timeline;
