// Design tokens for the Wrapper shell — "Instrument" direction.
//
// One dark ground, one accent, always the same. The shell never changes color;
// identity comes from typography, density and the accent used as a line, edge,
// glow and focus ring — almost never as a fill.
//
// These are the only values allowed. Modules use the scale, they do not add steps.

const radius = {
  chip: 4,
  default: 8,
  dialog: 14,
} as const;

// base 8 — only these steps, no arbitrary px in `sx`
const space = {
  hairline: 4, // icon <-> label, chip padding
  control: 8, // inside a control
  row: 12, // list row padding
  card: 16, // card padding, mobile gutter
  gutter: 24, // between cards, desktop gutter
  section: 32, // between sections
  page: 48, // page top/bottom (desktop)
} as const;

const header = {
  mobile: 56,
  desktop: 60,
} as const;

const rail = {
  collapsed: 72,
  expanded: 232,
} as const;

const bottomBar = 64;

const motion = {
  duration: {
    instant: 80,
    state: 140,
    enter: 220,
    exit: 160,
    drawer: 280,
    layout: 320,
  },
  easing: {
    instant: 'linear',
    state: 'cubic-bezier(.4,0,.2,1)',
    enter: 'cubic-bezier(0,0,.2,1)',
    exit: 'cubic-bezier(.4,0,1,1)',
  },
  // framer-motion springs — the shell animates only to explain a spatial change
  spring: {
    drawer: { type: 'spring', stiffness: 260, damping: 30 },
    layout: { type: 'spring', stiffness: 210, damping: 26 },
  },
} as const;

const fontFamily = {
  sans: '"Inter Variable", "Inter var", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

const dark = {
  ground: '#0F1119',
  surface1: '#161826',
  surface2: '#1D1F2E',
  surface3: '#232532',
  primary: '#B5ABFC',
  primaryDark: '#968AE0',
  primaryLight: '#D2CEFD',
  tint: '#423A6A',
  secondary: '#9690C9',
  textPrimary: '#E9E9ED',
  textSecondary: '#9397AB',
  textDisabled: '#595D6C',
  success: '#67C99A',
  error: '#F2777A',
  warning: '#E5B769',
  info: '#79B8E0',
  borderSubtle: '#232532',
  borderCard: '#2A2D3D',
  borderControl: '#3F424D',
} as const;

const light = {
  ground: '#F4F4F7',
  surface1: '#FDFDFF',
  surface2: '#FFFFFF',
  surface3: '#FFFFFF',
  sunken: '#E4E7F5',
  primary: '#5D5294',
  primaryDark: '#463D74',
  primaryLight: '#8279B8',
  tint: '#E7E5FE',
  secondary: '#5C5783',
  textPrimary: '#1A1C24',
  textSecondary: '#595D6C',
  textDisabled: '#B2B6CA',
  success: '#1F7A52',
  error: '#B03B3E',
  warning: '#8A5A10',
  info: '#1F5F87',
  borderSubtle: '#E4E5EE',
  borderCard: '#E6E7F0',
  borderCardStrong: '#D7D9E6',
  borderControl: '#CFD3E5',
} as const;

// Elevation — four levels. On dark it is a lighter surface plus a hairline,
// never a shadow. On light it is a soft ink shadow.
const elevation = {
  dark: {
    0: 'none',
    1: `0 0 0 1px ${dark.borderCard}`,
    2: `0 0 0 1px ${dark.borderControl}, 0 6px 18px rgba(0,0,0,.55)`,
    3: `0 0 0 1px ${dark.textDisabled}, 0 16px 40px rgba(0,0,0,.65)`,
  },
  light: {
    0: 'none',
    1: `0 1px 2px rgba(26,28,36,.07), 0 0 0 1px ${light.borderCard}`,
    2: `0 0 0 1px ${light.borderCardStrong}, 0 6px 18px rgba(26,28,36,.10)`,
    3: `0 0 0 1px ${light.borderControl}, 0 22px 50px rgba(26,28,36,.18)`,
  },
} as const;

export { radius, space, header, rail, bottomBar, motion, fontFamily, dark, light, elevation };
