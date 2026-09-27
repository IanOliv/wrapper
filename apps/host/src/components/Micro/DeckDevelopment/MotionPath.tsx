import { PointerEvent, useRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { keysOf, trackOf } from './model';
import type { Action } from './reducer';
import type { Key, Vec2, WorkbenchState } from './types';

interface MotionPathProps {
  state: WorkbenchState;
  dispatch: (action: Action) => void;
}

/** The path is drawn in the stage's own percentage space, so 0–100 is the box. */
const VIEW = 100;

/**
 * The interpolated route between position keys, as an editable spline.
 *
 * Dragging a point retimes nothing — it moves the key's value. Dragging a
 * tangent bends the segment in space, which is a different thing from the
 * easing curve: easing is when the card is somewhere, the tangent is where.
 */
function MotionPath({ state, dispatch }: MotionPathProps) {
  const theme = useTheme();
  const surface = useRef<SVGSVGElement>(null);
  const { doc, selection } = state;

  const layerId = selection.layerIds[0];
  const track = layerId ? trackOf(doc, layerId, 'position') : undefined;
  const keys = track ? keysOf(doc, track.id) : [];

  if (keys.length < 2) return null;

  const point = (key: Key) => key.value as Vec2;

  /** Pointer position in the same percentage space the keys are stored in. */
  const toPercent = (event: PointerEvent) => {
    const bounds = surface.current?.getBoundingClientRect();

    if (!bounds) return { x: 0, y: 0 };

    return {
      x: ((event.clientX - bounds.left) / bounds.width) * VIEW,
      y: ((event.clientY - bounds.top) / bounds.height) * VIEW,
    };
  };

  const drag = (event: PointerEvent, onMove: (at: Vec2) => void) => {
    event.stopPropagation();
    event.preventDefault();

    const move = (moveEvent: globalThis.PointerEvent) =>
      onMove(toPercent(moveEvent as unknown as PointerEvent));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const segments = keys.slice(0, -1).map((from, index) => {
    const to = keys[index + 1];
    const a = point(from);
    const d = point(to);
    const b = { x: a.x + (from.tangentOut?.x ?? 0), y: a.y + (from.tangentOut?.y ?? 0) };
    const c = { x: d.x + (to.tangentIn?.x ?? 0), y: d.y + (to.tangentIn?.y ?? 0) };

    return `M ${a.x} ${a.y} C ${b.x} ${b.y}, ${c.x} ${c.y}, ${d.x} ${d.y}`;
  });

  return (
    <Box
      component="svg"
      ref={surface}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      preserveAspectRatio="none"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
    >
      {segments.map((path, index) => (
        <path
          key={index}
          d={path}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={0.35}
          strokeDasharray="1.4 1.4"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {keys.map((key) => {
        const at = point(key);
        const selected = selection.keyIds.includes(key.id);
        const handles: ('in' | 'out')[] = ['in', 'out'];

        return (
          <g key={key.id}>
            {selected &&
              handles.map((side) => {
                const offset = side === 'in' ? key.tangentIn : key.tangentOut;

                if (!offset) return null;

                const tip = { x: at.x + offset.x, y: at.y + offset.y };

                return (
                  <g key={side}>
                    <line
                      x1={at.x}
                      y1={at.y}
                      x2={tip.x}
                      y2={tip.y}
                      stroke={theme.shell.border.control}
                      strokeWidth={0.25}
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={tip.x}
                      cy={tip.y}
                      r={1.1}
                      fill={theme.palette.background.default}
                      stroke={theme.palette.primary.main}
                      strokeWidth={0.3}
                      vectorEffect="non-scaling-stroke"
                      style={{ cursor: 'grab' }}
                      onPointerDown={(event) =>
                        drag(event, (to) =>
                          dispatch({
                            type: 'set-tangent',
                            id: key.id,
                            side,
                            value: { x: to.x - at.x, y: to.y - at.y },
                          }),
                        )
                      }
                    />
                  </g>
                );
              })}

            <circle
              cx={at.x}
              cy={at.y}
              r={selected ? 1.5 : 1.2}
              fill={selected ? theme.palette.background.default : theme.palette.primary.main}
              stroke={theme.palette.primary.main}
              strokeWidth={selected ? 0.5 : 0}
              vectorEffect="non-scaling-stroke"
              style={{ cursor: 'grab' }}
              onPointerDown={(event) => {
                dispatch({ type: 'select-keys', ids: [key.id] });
                // A key with no tangents gets a pair the first time it is
                // touched, so the handles are there to grab.
                if (!key.tangentOut) {
                  dispatch({ type: 'set-tangent', id: key.id, side: 'out', value: { x: 8, y: 0 } });
                  dispatch({ type: 'set-tangent', id: key.id, side: 'in', value: { x: -8, y: 0 } });
                }

                drag(event, (to) => dispatch({ type: 'set-key-value', id: key.id, value: to }));
              }}
            />
          </g>
        );
      })}
    </Box>
  );
}

export default MotionPath;
