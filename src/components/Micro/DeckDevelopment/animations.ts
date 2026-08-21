import type { CSSObject, Theme } from '@mui/material/styles';

import type { DeckAnimation, SelectOption } from './types';

/**
 * Every animation the workbench offers, each one its own keyframes.
 *
 * Two rules hold for all of them, because the timeline loops and can be
 * scrubbed to any point:
 *
 * 1. `0%` and `100%` describe the same pose, so an infinite run never jumps.
 * 2. Only `transform`, `opacity` and `box-shadow` are touched — the card's
 *    position and scale belong to its wrapper, and the two must not fight over
 *    the same property.
 */
const deckAnimations: DeckAnimation[] = [
  {
    value: '',
    label: 'None',
    keyframes: () => ({}),
  },
  {
    value: 'breathing',
    label: 'Breathing',
    keyframes: () => ({
      '0%': { transform: 'scale(.9)' },
      '15%': { transform: 'scale(1)' },
      '100%': { transform: 'scale(.9)' },
    }),
  },
  {
    value: 'ambiant',
    label: 'Ambient',
    keyframes: () => ({
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-8px)' },
    }),
  },
  {
    value: 'flip',
    label: 'Flip',
    keyframes: () => ({
      '0%': { transform: 'rotateY(0deg)' },
      '100%': { transform: 'rotateY(360deg)' },
    }),
  },
  {
    value: 'sway',
    label: 'Sway',
    keyframes: () => ({
      '0%, 100%': { transform: 'rotateY(0deg)' },
      '25%': { transform: 'rotateY(-18deg)' },
      '75%': { transform: 'rotateY(18deg)' },
    }),
  },
  {
    value: 'tilt',
    label: 'Tilt',
    keyframes: () => ({
      '0%, 100%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(-4deg)' },
      '75%': { transform: 'rotate(4deg)' },
    }),
  },
  {
    value: 'wobble',
    label: 'Wobble',
    keyframes: () => ({
      '0%, 100%': { transform: 'translateX(0)' },
      '15%': { transform: 'translateX(-8px)' },
      '30%': { transform: 'translateX(6px)' },
      '45%': { transform: 'translateX(-4px)' },
      '60%': { transform: 'translateX(2px)' },
      '75%': { transform: 'translateX(-1px)' },
    }),
  },
  {
    value: 'pop',
    label: 'Pop',
    keyframes: () => ({
      '0%, 100%': { transform: 'scale(1)' },
      '20%': { transform: 'scale(.94)' },
      '45%': { transform: 'scale(1.12)' },
      '70%': { transform: 'scale(.98)' },
    }),
  },
  {
    value: 'drift',
    label: 'Drift',
    keyframes: () => ({
      '0%, 100%': { transform: 'translate(0, 0)' },
      '33%': { transform: 'translate(10px, -6px)' },
      '66%': { transform: 'translate(-8px, 4px)' },
    }),
  },
  {
    value: 'fade',
    label: 'Fade',
    keyframes: () => ({
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.35 },
    }),
  },
  {
    // The one that needs the palette: it restates the card's own elevation so
    // the bloom replaces the hairline rather than sitting on top of it.
    value: 'glow',
    label: 'Glow',
    keyframes: (theme) => {
      const edge = `0 0 0 1px ${theme.shell.border.card}`;
      const drop =
        theme.palette.mode === 'dark'
          ? '0 18px 46px rgba(0,0,0,.55)'
          : '0 18px 46px rgba(26,28,36,.14)';

      return {
        '0%, 100%': { boxShadow: `${edge}, ${drop}` },
        '50%': {
          boxShadow: `0 0 0 1px ${theme.palette.primary.main}, 0 0 22px 2px ${theme.shell.tint}, ${drop}`,
        },
      };
    },
  },
];

/** What the inspector's Animation select is built from. */
const animationOptions: SelectOption[] = deckAnimations.map(({ value, label }) => ({
  value,
  label,
}));

/** Any animation that turns the card in 3D wants a perspective on its wrapper. */
const spatialAnimations = ['flip', 'sway'];

/**
 * Every animation's keyframes at once, named `deck-<value>`, so the card can
 * switch between them without remounting and the browser keeps them warm.
 */
const keyframesFor = (theme: Theme): CSSObject =>
  deckAnimations.reduce<CSSObject>((styles, { value, keyframes }) => {
    if (!value) return styles;

    return { ...styles, [`@keyframes deck-${value}`]: keyframes(theme) };
  }, {});

export { animationOptions, deckAnimations, keyframesFor, spatialAnimations };
