import type { Theme } from '@mui/material/styles';

import type { Repeat, SpawnPoint, Trigger, WorkbenchTokens } from './types';

/**
 * The bounds are lifted verbatim from `Micro/DeckArea` — same props, same
 * ranges, so a value dialled in here means the same thing over there.
 */
const ranges = {
  scale: { min: 0, max: 2, step: 0.05 },
  positionH: { min: -2, max: 92, step: 1 },
  positionV: { min: -6, max: 77, step: 1 },
  rotate: { min: -180, max: 180, step: 1 },
  opacity: { min: 0, max: 1, step: 0.01 },
  qnt: { min: 1, max: 15, step: 1 },
  duration: { min: 0.1, max: 15, step: 0.05 },
} as const;

/** The five spawn actions the deck page already has, in sentence case. */
const spawnPoints: SpawnPoint[] = [
  { label: 'Deck', positionH: 14, positionV: 40 },
  { label: 'Shop', positionH: 60, positionV: 40 },
  { label: 'Discard', positionH: 76, positionV: 40 },
  { label: 'Footer', positionH: 92, positionV: 77 },
];

/** The fifth: "Drop to position", the one that gets the full-width button. */
const dropPosition: SpawnPoint = { label: 'Drop to position', positionH: -2, positionV: -6 };

const repeatOptions: { value: Repeat; label: string }[] = [
  { value: 'once', label: 'Once' },
  { value: 'loop', label: 'Loop' },
  { value: 'yoyo', label: 'Yoyo' },
];

/** Preview should match how the animation actually fires in the app. */
const triggerOptions: { value: Trigger; label: string }[] = [
  { value: 'mount', label: 'On mount' },
  { value: 'click', label: 'On click' },
  { value: 'hover', label: 'On hover' },
  { value: 'state', label: 'On state change' },
];

const speedSteps = [0.25, 0.5, 1, 2];

/** The card's own box. `Center` and the origin leaders both measure from it. */
const cardBox = { width: 172, height: 190 };

/** The stepper's rungs. 100% is the honest default for a workbench. */
const zoomSteps = [25, 50, 75, 100, 150, 200];

const workbench = (theme: Theme): WorkbenchTokens =>
  theme.palette.mode === 'dark'
    ? {
        panel: '#14161F',
        dot: '#1E202C',
        muted: '#75798C',
        knobRing: '#2B2741',
        imageArea: 'linear-gradient(135deg, #2B2741, #1D1F2E)',
        selectFocusRing: '0 0 0 2px rgba(181,171,252,.18)',
      }
    : {
        panel: theme.shell.surface.level1,
        dot: theme.shell.border.control,
        muted: theme.palette.text.secondary,
        knobRing: theme.shell.tint,
        imageArea: `linear-gradient(135deg, ${theme.shell.tint}, ${theme.shell.surface.sunken})`,
        selectFocusRing: '0 0 0 2px rgba(93,82,148,.18)',
      };

/** `2.6` not `2.6000000000000005`, with a stable digit count for tabular-nums. */
const format = (value: number, places = 1) => value.toFixed(places);

const seconds = (value: number) => `${value.toFixed(2)}s`;

/** `0:00.00` — the transport's current time. */
const timecode = (value: number) => {
  const whole = Math.max(0, value);
  const minutes = Math.floor(whole / 60);
  const rest = whole - minutes * 60;

  return `${minutes}:${rest < 10 ? '0' : ''}${rest.toFixed(2)}`;
};

export {
  cardBox,
  dropPosition,
  format,
  ranges,
  repeatOptions,
  seconds,
  spawnPoints,
  speedSteps,
  timecode,
  triggerOptions,
  workbench,
  zoomSteps,
};
