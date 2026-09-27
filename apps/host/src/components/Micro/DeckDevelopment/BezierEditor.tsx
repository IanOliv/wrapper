import { PointerEvent, useRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { formatBezier } from './bezier';
import { Readout } from './styled';
import type { Bezier } from './types';

interface BezierEditorProps {
  value: Bezier;
  onChange: (value: Bezier) => void;
}

/** The editor is square in curve space: x is time 0..1, y is progress 0..1. */
const SIZE = 100;

/**
 * A 92px curve editor. The handles are the two control points of the cubic, and
 * the mono readout under them is the exact string the emitted code carries — so
 * what is dragged here is what ships, with no translation step in between.
 */
function BezierEditor({ value, onChange }: BezierEditorProps) {
  const theme = useTheme();
  const surface = useRef<HTMLDivElement>(null);
  const [x1, y1, x2, y2] = value;

  const drag = (event: PointerEvent, handle: 0 | 1) => {
    event.preventDefault();

    const bounds = surface.current?.getBoundingClientRect();

    if (!bounds) return;

    const move = (moveEvent: globalThis.PointerEvent) => {
      // x is clamped to the unit interval as CSS requires; y is left free so
      // overshoot curves can be drawn.
      const x = Math.min(1, Math.max(0, (moveEvent.clientX - bounds.left) / bounds.width));
      const y = 1 - (moveEvent.clientY - bounds.top) / bounds.height;
      const next: Bezier = [...value];

      next[handle * 2] = Math.round(x * 100) / 100;
      next[handle * 2 + 1] = Math.round(y * 100) / 100;

      onChange(next);
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // SVG y runs down, curve y runs up
  const toY = (unit: number) => (1 - unit) * SIZE;
  const handles: { at: [number, number]; index: 0 | 1 }[] = [
    { at: [x1, y1], index: 0 },
    { at: [x2, y2], index: 1 },
  ];

  return (
    <Box
      ref={surface}
      sx={(t) => ({
        position: 'relative',
        height: 92,
        borderRadius: t.shape.borderRadius,
        backgroundColor: t.palette.background.default,
        border: `1px solid ${t.shell.border.card}`,
        overflow: 'hidden',
        touchAction: 'none',
      })}
    >
      <Box
        component="svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        preserveAspectRatio="none"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {/* the straight line the curve is judged against */}
        <line
          x1={0}
          y1={SIZE}
          x2={SIZE}
          y2={0}
          stroke={theme.shell.border.card}
          strokeWidth={1}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />

        {handles.map(({ at, index }) => (
          <line
            key={index}
            x1={index === 0 ? 0 : SIZE}
            y1={index === 0 ? SIZE : 0}
            x2={at[0] * SIZE}
            y2={toY(at[1])}
            stroke={theme.shell.border.control}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path
          d={`M 0 ${SIZE} C ${x1 * SIZE} ${toY(y1)}, ${x2 * SIZE} ${toY(y2)}, ${SIZE} 0`}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </Box>

      {handles.map(({ at, index }) => (
        <Box
          key={index}
          role="slider"
          tabIndex={0}
          aria-label={index === 0 ? 'First bezier handle' : 'Second bezier handle'}
          aria-valuetext={`${at[0]}, ${at[1]}`}
          onPointerDown={(event) => drag(event, index)}
          sx={(t) => ({
            position: 'absolute',
            left: `${at[0] * 100}%`,
            top: `${(1 - at[1]) * 100}%`,
            width: 11,
            height: 11,
            marginLeft: '-5.5px',
            marginTop: '-5.5px',
            borderRadius: '50%',
            backgroundColor: t.palette.primary.main,
            boxShadow: `0 0 0 3px ${t.palette.background.default}`,
            cursor: 'grab',
            touchAction: 'none',
            '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
          })}
        />
      ))}

      <Readout
        sx={{
          position: 'absolute',
          right: 8,
          bottom: 6,
          color: 'text.primary',
          pointerEvents: 'none',
        }}
      >
        {formatBezier(value)}
      </Readout>
    </Box>
  );
}

export default BezierEditor;
