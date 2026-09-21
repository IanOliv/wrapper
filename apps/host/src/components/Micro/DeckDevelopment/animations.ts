import type { AnimationPreset, SelectOption } from './types';

/**
 * The animation catalogue, expressed as keys on one property rather than as CSS
 * keyframes. Choosing one writes real keys onto the selection, so everything the
 * select offers is then editable on the timeline like anything else — which is
 * the whole point of a workbench over a fixed dropdown of canned effects.
 *
 * Stops are normalised 0..1 and scaled to the document duration when applied.
 * Every one opens and closes on the same value, so a looping run never jumps.
 *
 * Values are RELATIVE to the layer's own pose, never absolute: `position` and
 * `rotate` stops are offsets added to the base, `scale` and `opacity` stops are
 * factors multiplied by it. Absolute stops would teleport a centred card to the
 * top-left corner the moment you picked an animation.
 */
const animationPresets: AnimationPreset[] = [
  {
    value: 'breathing',
    label: 'Breathing',
    property: 'scale',
    stops: [
      { at: 0, value: 1 },
      { at: 0.15, value: 1.08 },
      { at: 1, value: 1 },
    ],
  },
  {
    value: 'ambient',
    label: 'Ambient',
    property: 'position',
    stops: [
      { at: 0, value: { x: 0, y: 0 } },
      { at: 0.5, value: { x: 0, y: -6 } },
      { at: 1, value: { x: 0, y: 0 } },
    ],
  },
  {
    value: 'flip',
    label: 'Flip',
    property: 'rotate',
    stops: [
      { at: 0, value: { x: 0, y: 0, z: 0 } },
      { at: 1, value: { x: 0, y: 360, z: 0 } },
    ],
  },
  {
    value: 'sway',
    label: 'Sway',
    property: 'rotate',
    stops: [
      { at: 0, value: { x: 0, y: 0, z: 0 } },
      { at: 0.25, value: { x: 0, y: -18, z: 0 } },
      { at: 0.75, value: { x: 0, y: 18, z: 0 } },
      { at: 1, value: { x: 0, y: 0, z: 0 } },
    ],
  },
  {
    value: 'tilt',
    label: 'Tilt',
    property: 'rotate',
    stops: [
      { at: 0, value: { x: 0, y: 0, z: 0 } },
      { at: 0.25, value: { x: 0, y: 0, z: -4 } },
      { at: 0.75, value: { x: 0, y: 0, z: 4 } },
      { at: 1, value: { x: 0, y: 0, z: 0 } },
    ],
  },
  {
    value: 'wobble',
    label: 'Wobble',
    property: 'position',
    stops: [
      { at: 0, value: { x: 0, y: 0 } },
      { at: 0.15, value: { x: -5, y: 0 } },
      { at: 0.3, value: { x: 4, y: 0 } },
      { at: 0.45, value: { x: -2.5, y: 0 } },
      { at: 0.6, value: { x: 1.5, y: 0 } },
      { at: 1, value: { x: 0, y: 0 } },
    ],
  },
  {
    value: 'pop',
    label: 'Pop',
    property: 'scale',
    stops: [
      { at: 0, value: 1 },
      { at: 0.2, value: 0.92 },
      { at: 0.45, value: 1.24 },
      { at: 0.7, value: 0.98 },
      { at: 1, value: 1 },
    ],
  },
  {
    value: 'drift',
    label: 'Drift',
    property: 'position',
    stops: [
      { at: 0, value: { x: 0, y: 0 } },
      { at: 0.33, value: { x: 7, y: -4 } },
      { at: 0.66, value: { x: -5, y: 3 } },
      { at: 1, value: { x: 0, y: 0 } },
    ],
  },
  {
    value: 'fade',
    label: 'Fade',
    property: 'opacity',
    stops: [
      { at: 0, value: 1 },
      { at: 0.5, value: 0.35 },
      { at: 1, value: 1 },
    ],
  },
];

const animationOptions: SelectOption[] = [
  { value: '', label: 'None' },
  ...animationPresets.map(({ value, label }) => ({ value, label })),
];

/**
 * The pill chips under the layers list. A preset is a whole timeline rather than
 * one property, so each names the animations it lays down together.
 */
interface LayerPreset {
  value: string;
  label: string;
  /** applied in order; later entries land on later properties */
  parts: string[];
  /** presets that read as a deal want the cards walked apart in time */
  stagger: number;
}

const layerPresets: LayerPreset[] = [
  { value: 'deal', label: 'Deal', parts: ['drift', 'fade'], stagger: 0.08 },
  { value: 'flip-in', label: 'Flip in', parts: ['flip', 'fade'], stagger: 0.06 },
  { value: 'fan-out', label: 'Fan out', parts: ['drift', 'tilt'], stagger: 0.05 },
  { value: 'shuffle', label: 'Shuffle', parts: ['wobble', 'tilt'], stagger: 0.03 },
];

/** Any animation that turns the card in depth wants the stage's perspective. */
const spatialAnimations = ['flip', 'sway'];

export type { LayerPreset };
export { animationOptions, animationPresets, layerPresets, spatialAnimations };
