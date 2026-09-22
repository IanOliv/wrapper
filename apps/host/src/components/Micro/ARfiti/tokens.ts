// ARfiti's own palette, inside its own box.
//
// The module contract permits a module to theme *inside itself* as long as the
// surrounding chrome is untouched and text on it passes 4.5:1 — the map is a
// night tile ground in both shell themes, because a map lit like a document is
// not a map. Radius, spacing and motion still come from `theme.shell`.
//
// The green flood is gone: the only saturated colors left are the accent on the
// action of the moment, one success green for claimed, and amber while an insert
// is in flight.

const map = {
  /** tile ground */
  ground: '#101520',
  /** 1px streets every 74px */
  street: '#151B28',
  /** 2px avenue every 226px */
  avenue: '#1A2233',
  /** soft radial for depth, at 38%/42% */
  glow: 'rgba(66,58,106,.34)',
} as const;

const surface = {
  /** callout, selected row */
  card: '#161826',
  /** the pieces panel / the sheet */
  panel: '#14161F',
  /** the shell ground, reused for pin centres and scrims */
  ground: '#0F1119',
  /** floating controls over the map */
  floating: 'rgba(22,24,38,.92)',
} as const;

const border = {
  subtle: '#232532',
  card: '#2A2D3D',
  control: '#3F424D',
} as const;

const accent = {
  main: '#B5ABFC',
  light: '#D2CEFD',
  /** active filter pill ground */
  tint: '#423A6A',
  /** "Unclaimed" chip ground */
  chip: '#2B2741',
  halo: 'rgba(181,171,252,.16)',
  /** text on a filled accent surface */
  on: '#14161F',
} as const;

const pin = {
  available: '#6F68A8',
  outOfRange: '#4A4F63',
  claimed: '#7ECFA0',
  inserting: '#E5B769',
  you: '#7F9CF5',
} as const;

const text = {
  primary: '#E9E9ED',
  secondary: '#9397AB',
  meta: '#75798C',
} as const;

const success = {
  main: '#7ECFA0',
  border: '#2F6A4C',
} as const;

const scrim = 'rgba(15,17,25,.42)';

/** the panel on desktop, and the sheet's widest detent on mobile */
const panelWidth = 316;

/** the map never gets thinner than this above the sheet */
const mapMinAboveSheet = 190;

export { accent, border, map, mapMinAboveSheet, panelWidth, pin, scrim, success, surface, text };
