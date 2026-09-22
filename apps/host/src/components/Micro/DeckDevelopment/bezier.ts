import type { Bezier, EasingOption } from './types';

/**
 * A cubic-bezier timing function, solved the way the browser solves it: find
 * the parameter whose x equals the elapsed fraction, then read that point's y.
 *
 * Every easing in the workbench is stored as these four numbers, so a named
 * curve and a hand-dragged one are the same kind of thing and the "Copy code"
 * output can always name the exact curve.
 */

const curve = (a: number, b: number, u: number) => {
  // the standard cubic with P0 = 0 and P3 = 1 collapsed into its coefficients
  const c = 3 * a;
  const d = 3 * (b - a) - c;
  const e = 1 - c - d;

  return ((e * u + d) * u + c) * u;
};

const slope = (a: number, b: number, u: number) => {
  const c = 3 * a;
  const d = 3 * (b - a) - c;
  const e = 1 - c - d;

  return (3 * e * u + 2 * d) * u + c;
};

/** Newton–Raphson, falling back to bisection where the curve goes flat. */
const solve = (x1: number, x2: number, x: number) => {
  let u = x;

  for (let i = 0; i < 8; i += 1) {
    const error = curve(x1, x2, u) - x;

    if (Math.abs(error) < 1e-6) return u;

    const gradient = slope(x1, x2, u);

    if (Math.abs(gradient) < 1e-6) break;

    u -= error / gradient;
  }

  let low = 0;
  let high = 1;

  u = x;

  while (low < high) {
    const error = curve(x1, x2, u);

    if (Math.abs(error - x) < 1e-6) return u;

    if (x > error) low = u;
    else high = u;

    u = (high - low) / 2 + low;

    if (high - low < 1e-6) break;
  }

  return u;
};

/** Ease a 0..1 fraction through the curve. */
const ease = (bezier: Bezier, fraction: number) => {
  const [x1, y1, x2, y2] = bezier;

  if (fraction <= 0) return 0;
  if (fraction >= 1) return 1;
  // a straight line needs no solving, and linear is the common case
  if (x1 === y1 && x2 === y2) return fraction;

  return curve(y1, y2, solve(x1, x2, fraction));
};

/** `.24 1 .34 1` — the mono readout, and the four numbers the code emits. */
const formatBezier = (bezier: Bezier) =>
  bezier.map((value) => `${Math.round(value * 100) / 100}`.replace(/^0\./, '.')).join(' ');

const cssBezier = (bezier: Bezier) =>
  `cubic-bezier(${bezier.map((value) => Math.round(value * 100) / 100).join(', ')})`;

const linear: Bezier = [0, 0, 1, 1];

/**
 * The named curves, including the shell's own motion tokens so a card can be
 * tuned to move exactly like the chrome around it.
 */
const easingOptions: EasingOption[] = [
  { value: 'linear', label: 'Linear', bezier: linear },
  { value: 'ease-in', label: 'Ease in', bezier: [0.42, 0, 1, 1] },
  { value: 'ease-out', label: 'Ease out', bezier: [0, 0, 0.58, 1] },
  { value: 'ease-in-out', label: 'Ease in-out', bezier: [0.42, 0, 0.58, 1] },
  { value: 'shell-state', label: 'Shell state', bezier: [0.4, 0, 0.2, 1] },
  { value: 'shell-enter', label: 'Shell enter', bezier: [0, 0, 0.2, 1] },
  { value: 'shell-exit', label: 'Shell exit', bezier: [0.4, 0, 1, 1] },
  { value: 'overshoot', label: 'Overshoot', bezier: [0.34, 1.56, 0.64, 1] },
  { value: 'custom', label: 'Custom bezier' },
];

const sameBezier = (a: Bezier, b: Bezier) => a.every((value, index) => value === b[index]);

/** Which entry in the select a raw curve corresponds to, or "custom". */
const easingNameOf = (bezier: Bezier) =>
  easingOptions.find((option) => option.bezier && sameBezier(option.bezier, bezier))?.value ??
  'custom';

const defaultEasing: Bezier = [0.4, 0, 0.2, 1];

export {
  cssBezier,
  defaultEasing,
  ease,
  easingNameOf,
  easingOptions,
  formatBezier,
  linear,
  sameBezier,
};
