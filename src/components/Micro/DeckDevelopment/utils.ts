import type { Theme } from '@mui/material/styles';

import type { DeckAttributes, SelectOption, SpawnPoint, WorkbenchTokens } from './types';

/**
 * The bounds are lifted verbatim from `Micro/DeckArea` — same props, same
 * ranges, so a value dialled in here means the same thing over there.
 */
const defaultAttributes: DeckAttributes = {
  left: { value: 2.6, min: 0, max: 8, step: 0.05 },
  top: { value: 0, min: 0, max: 9, step: 0.05 },
  qnt: { value: 1, min: 1, max: 15, step: 1 },
  scale: { value: 0.5, min: 0, max: 2, step: 0.1 },
  duration: { value: 1, min: 0, max: 15, step: 1 },
  positionH: { value: 0, min: -2, max: 92, step: 1 },
  positionV: { value: 0, min: -6, max: 77, step: 1 },
};

/** The five spawn actions the deck page already has, in sentence case. */
const spawnPoints: SpawnPoint[] = [
  { label: 'Deck', positionH: 14, positionV: 40 },
  { label: 'Shop', positionH: 60, positionV: 40 },
  { label: 'Discard', positionH: 76, positionV: 40 },
  { label: 'Footer', positionH: 92, positionV: 77 },
];

/** The fifth: "Drop to position", the one that gets the full-width button. */
const dropPosition: SpawnPoint = { label: 'Drop to position', positionH: -2, positionV: -6 };

const animationOptions: SelectOption[] = [
  { value: '', label: 'None' },
  { value: 'breathing', label: 'Breathing' },
  { value: 'ambiant', label: 'Ambient' },
];

const easingOptions: SelectOption[] = [
  { value: 'ease-out', label: 'Ease out' },
  { value: 'ease-in', label: 'Ease in' },
  { value: 'ease-in-out', label: 'Ease in-out' },
  { value: 'linear', label: 'Linear' },
];

/** The stepper's rungs. 100% is the honest default for a workbench. */
const zoomSteps = [25, 50, 75, 100, 150, 200];

const workbench = (theme: Theme): WorkbenchTokens =>
  theme.palette.mode === 'dark'
    ? {
        inspector: '#14161F',
        dot: '#1E202C',
        muted: '#75798C',
        knobRing: '#2B2741',
        imageArea: 'linear-gradient(135deg, #2B2741, #1D1F2E)',
        selectFocusRing: '0 0 0 2px rgba(181,171,252,.18)',
      }
    : {
        inspector: theme.shell.surface.level1,
        dot: theme.shell.border.control,
        muted: theme.palette.text.secondary,
        knobRing: theme.shell.tint,
        imageArea: `linear-gradient(135deg, ${theme.shell.tint}, ${theme.shell.surface.sunken})`,
        selectFocusRing: '0 0 0 2px rgba(93,82,148,.18)',
      };

/**
 * Cards fan out from the anchor by the `left`/`top` scalars — the same
 * `functionPosition` walk `Micro/DeckArea` does, kept in percentages so the
 * spawn points stay meaningful at any stage size.
 */
const fanPositions = (attributes: DeckAttributes) => {
  const { qnt, positionH, positionV, left, top } = attributes;

  return Array.from({ length: Math.max(0, Math.round(qnt.value)) }, (_, index) => ({
    left: positionH.value + left.value * index,
    top: positionV.value + top.value * index,
  }));
};

/** `2.6` not `2.6000000000000005`, and `0.50` where the mock shows two places. */
const format = (value: number, places = 1) =>
  Number.isInteger(value) && places === 0 ? String(value) : value.toFixed(places);

const seconds = (value: number) => `${value.toFixed(2)}s`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Round to a slider's own step so a computed value still lands on a rung. */
const snap = (value: number, step: number) => Math.round(value / step) * step;

export {
  animationOptions,
  clamp,
  defaultAttributes,
  dropPosition,
  easingOptions,
  fanPositions,
  format,
  seconds,
  snap,
  spawnPoints,
  workbench,
  zoomSteps,
};
