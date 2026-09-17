import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { keyframes } from '@emotion/react';

// Transient ($-prefixed) props style the node but never reach the DOM.
const noForward = (prop: string) => !prop.startsWith('$');

const floatRise = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: .6; }
`;

const hintPulse = keyframes`
  0%, 100% { opacity: .4; }
  50% { opacity: .8; }
`;

const Root = styled('div')({
  position: 'relative',
  width: '100%',
  minHeight: 760,
  borderRadius: 16,
  background: '#4d7356',
  display: 'grid',
  columnGap: 14,
  rowGap: 16,
  padding: '22px 26px 26px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  outline: 'none',
  containerType: 'inline-size',
});

const Hud = styled('div')({
  gridColumn: '1 / -1',
  gridRow: 1,
  height: 34,
  borderRadius: 8,
  background: '#3f5c48',
  border: '0.5px solid #7fa987',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  padding: '0 14px',
});

const HpTrack = styled('div', { shouldForwardProp: noForward })<{ $pulse: boolean }>(
  ({ $pulse }) => ({
    width: 120,
    height: 8,
    borderRadius: 4,
    background: '#2f4a38',
    overflow: 'hidden',
    animation: $pulse ? `${pulse} 150ms ease 1` : 'none',
    '@container (max-width: 1100px)': { width: 52 },
  }),
);

const HpFill = styled('div')({
  height: '100%',
  borderRadius: 4,
  transition: 'transform .18s ease',
});

const ThreatPill = styled('div')({
  height: 22,
  minWidth: 44,
  padding: '0 8px',
  borderRadius: 6,
  background: '#5c2a24',
  border: '1px solid #f0a68f',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  fontSize: 12,
  color: '#ffb69c',
  cursor: 'default',
});

const EnergyPip = styled('span')({
  width: 11,
  height: 11,
  borderRadius: 999,
  boxSizing: 'border-box',
});

const HudPillButton = styled('button')({
  height: 22,
  padding: '0 10px',
  borderRadius: 6,
  background: 'transparent',
  border: '1px solid #7fa987',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  color: '#cfe0d2',
  fontFamily: 'inherit',
  fontSize: 11,
  cursor: 'pointer',
  transition: 'opacity .18s ease',
  '&:hover': { opacity: 0.75 },
  '&:focus-visible': { outline: '2px solid #b8e6c0', outlineOffset: 2 },
});

const EndTurnButton = styled('button', { shouldForwardProp: noForward })<{ $hot: boolean }>(
  ({ $hot }) => ({
    height: 22,
    padding: '0 12px',
    minWidth: 112,
    borderRadius: 6,
    background: '#5f9c6d',
    border: `1px solid ${$hot ? '#eefaf0' : '#b8e6c0'}`,
    color: '#eefaf0',
    fontFamily: 'inherit',
    fontSize: 11,
    cursor: 'pointer',
    transition: 'transform .18s ease, opacity .18s ease',
    '&:hover': { transform: 'translateY(-1px)' },
    '&:focus-visible': { outline: '2px solid #b8e6c0', outlineOffset: 2 },
  }),
);

const Rail = styled('div')({
  gridColumn: 1,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 22,
  '@container (max-width: 1100px)': {
    gridColumn: 1,
    gridRow: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 14,
  },
});

const PLabel = styled('span')({
  fontSize: 9,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: '#a8c4ad',
});

/** The base `dbs-card` face: hand cards, played cards, pile/discard backs. */
const CardFace = styled('div', { shouldForwardProp: noForward })<{ $stripe?: string }>(
  ({ $stripe }) => ({
    position: 'relative',
    borderRadius: 10,
    background: '#262444',
    border: '2px solid #4b4780',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: '8px 7px',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 3,
      left: 3,
      right: 3,
      height: 3,
      borderRadius: 1.5,
      background: $stripe ?? '#9d97e0',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 44,
      height: 44,
      transform: 'translate(-50%, -50%)',
    },
  }),
);

const PlayedCardBox = styled(CardFace)({
  position: 'absolute',
  top: 0,
  left: 0,
  cursor: 'pointer',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: '5px 6px',
});

const HandCardBox = styled(CardFace, { shouldForwardProp: noForward })<{ $dragOrigin?: boolean }>(
  ({ $dragOrigin }) => ({
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transformOrigin: '50% 190%',
    cursor: 'pointer',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: '7px 8px',
    '&:hover': { zIndex: 40 },
    '@container (max-width: 1100px)': {
      position: 'relative',
      left: 'auto',
      bottom: 'auto',
      transform: 'none !important',
      flex: '0 0 auto',
      scrollSnapAlign: 'center',
    },
    // the fan keeps its gap while a card is being dragged — the origin slot
    // becomes an empty dashed placeholder instead of collapsing
    ...($dragOrigin && {
      background: 'transparent !important',
      borderStyle: 'dashed !important',
      borderColor: 'rgba(207,224,210,.5) !important',
      '& > *, &::before': { opacity: 0 },
    }),
  }),
);

const CardName = styled('span')({
  maxWidth: '100%',
  fontSize: 10,
  lineHeight: 1.15,
  color: '#dcd9f5',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const CardStats = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  width: '100%',
  fontSize: 9,
  color: '#8f8ab8',
});

const CostBadge = styled('span')({
  position: 'absolute',
  top: 6,
  right: 6,
  minWidth: 17,
  height: 15,
  padding: '0 4px',
  borderRadius: 4,
  background: '#3a3668',
  boxSizing: 'border-box',
  display: 'grid',
  placeItems: 'center',
  fontSize: 11,
  lineHeight: 1,
  color: '#dcd9f5',
});

const BoardWrap = styled('div')({
  gridColumn: 2,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  '@container (max-width: 1100px)': { gridColumn: 1, gridRow: 3 },
});

const EnemyTurnBanner = styled('div')({
  width: 182,
  height: 20,
  borderRadius: 6,
  background: '#5c2a24',
  border: '1px solid #f0a68f',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 9,
  flex: 'none',
});

const BoardGrid = styled('div')({
  position: 'relative',
  display: 'grid',
});

const Slot = styled('div', { shouldForwardProp: noForward })<{
  $variant: 'enemy' | 'player' | 'player-hint' | 'armed' | 'bad';
  $focused: boolean;
}>(({ $variant, $focused }) => ({
  position: 'relative',
  borderRadius: 10,
  boxSizing: 'border-box',
  display: 'grid',
  placeItems: 'center',
  transition: 'transform .18s ease, opacity .18s ease',
  cursor: $variant === 'armed' ? 'pointer' : 'default',
  ...($variant === 'player' && {
    background: 'rgba(65,101,75,.5)',
    border: '2px dashed rgba(127,169,135,.45)',
  }),
  ...($variant === 'player-hint' && {
    background: 'rgba(65,101,75,.5)',
    border: '2px dashed rgba(127,169,135,.45)',
    animation: `${hintPulse} 2s ease-in-out infinite`,
  }),
  ...($variant === 'enemy' && { background: '#54382f', border: '2px dashed #a87a6b' }),
  ...($variant === 'armed' && {
    background: '#5f9c6d',
    border: '1.5px solid #b8e6c0',
    '&:hover': { transform: 'scale(1.04)' },
  }),
  ...($variant === 'bad' && { background: '#4a3630', border: '1px dashed #e08a6e' }),
  ...($focused && { border: '1.5px solid #e6f2e8' }),
  '&:hover [data-role="slot-coord"]': { opacity: 0.7 },
}));

const SlotCoord = styled('span')({
  position: 'absolute',
  top: 5,
  left: 6,
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: 9,
  lineHeight: 1,
  color: '#cfe0d2',
  opacity: 0,
  transition: 'opacity .18s ease',
});

const SlotTip = styled('span', { shouldForwardProp: noForward })<{ $focused?: boolean }>(
  ({ $focused }) => ({
    position: 'relative',
    zIndex: 1,
    lineHeight: 1,
    fontWeight: 300,
    fontSize: $focused ? 15 : 20,
    color: $focused ? '#e6f2e8' : '#e4f4e7',
  }),
);

const SlotLabel = styled('span')({
  position: 'absolute',
  padding: '0 4px',
  textAlign: 'center',
  fontSize: 10,
  lineHeight: 1.25,
});

const CombatLine = styled('div')({
  position: 'absolute',
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  pointerEvents: 'none',
  transform: 'translateY(-50%)',
});

const CombatLineRule = styled('span')({
  flex: 1,
  height: 0,
  borderTop: '0.5px dashed #8fb896',
});

const EnemyBox = styled('div', { shouldForwardProp: noForward })<{
  $targetable: boolean;
  $highlighted: boolean;
}>(({ $targetable, $highlighted }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  borderRadius: 10,
  boxSizing: 'border-box',
  background: $targetable ? '#5c2a24' : '#43221f',
  border: `${$targetable ? 2 : 1}px solid ${
    $targetable ? '#f0a68f' : $highlighted ? '#f0a68f' : '#9c5340'
  }`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: '5px 6px',
  transition: 'transform .18s ease',
  cursor: $targetable ? 'pointer' : 'default',
  '&:hover': { transform: 'translateY(-4px)' },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    height: 3,
    borderRadius: 1.5,
    background: '#f0a68f',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 44,
    height: 44,
    transform: 'translate(-50%, -50%)',
  },
  '@container (max-width: 1100px)': { justifyContent: 'center', alignItems: 'center' },
}));

const EnemyHeader = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 5,
  width: '100%',
  '@container (max-width: 1100px)': { justifyContent: 'center' },
});

const EnemyName = styled('span')({
  flex: 1,
  minWidth: 0,
  fontSize: 10,
  lineHeight: 1.1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@container (max-width: 1100px)': { display: 'none' },
});

const IntentBadge = styled('span')({
  flex: 'none',
  width: 18,
  height: 13,
  borderRadius: 3,
  display: 'grid',
  placeItems: 'center',
  fontSize: 11,
  lineHeight: 1,
  color: '#f5d9d0',
  '@container (max-width: 1100px)': { width: 24, height: 18, fontSize: 12 },
});

const EnemyStats = styled(CardStats)({
  '@container (max-width: 1100px)': { display: 'none' },
});

const EnemyHpTrack = styled('div')({
  width: 'calc(100% - 8px)',
  height: 3,
  margin: '3px 4px 0',
  borderRadius: 999,
  background: '#6b3a30',
  flex: 'none',
});

const EnemyHpFill = styled('div', { shouldForwardProp: noForward })<{ $pulse: boolean }>(
  ({ $pulse }) => ({
    height: '100%',
    borderRadius: 999,
    background: '#d4614a',
    animation: $pulse ? `${pulse} 150ms ease 1` : 'none',
  }),
);

const RingHighlight = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  borderRadius: 13,
  border: '1.5px solid #ffb69c',
  opacity: 0.8,
  pointerEvents: 'none',
  zIndex: 26,
});

const FloatSpan = styled('span')({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 130,
  fontSize: 16,
  lineHeight: 1,
  animation: `${floatRise} 600ms cubic-bezier(.2,.7,.3,1) forwards`,
});

const SidePanel = styled(Box)({
  gridColumn: 3,
  gridRow: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minHeight: 0,
  overflowY: 'auto',
  '@container (max-width: 1100px)': { display: 'none' },
});

const Panel = styled('div')({
  borderRadius: 10,
  background: 'rgba(63,92,72,.55)',
  border: '1px solid rgba(127,169,135,.4)',
  padding: '10px 11px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const KeyCap = styled('span')({
  minWidth: 34,
  height: 18,
  padding: '0 6px',
  borderRadius: 4,
  border: '1px solid rgba(207,224,210,.4)',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  color: '#e6f2e8',
});

const HandRow = styled('div')({
  gridColumn: '1 / -1',
  gridRow: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 14,
  paddingTop: 18,
  '@container (max-width: 1100px)': { gridColumn: 1, gridRow: 4 },
});

const Fan = styled('div')({
  position: 'relative',
  width: '100%',
  '@container (max-width: 1100px)': {
    display: 'flex',
    height: 'auto !important',
    gap: 8,
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    paddingBottom: 4,
  },
});

// `display: contents` keeps the wrapper out of the flex layout so it doesn't
// disturb the HUD's gap — only visibility toggles at the breakpoint.
const DesktopOnly = styled('span')({
  display: 'contents',
  '@container (max-width: 1100px)': { display: 'none' },
});

const MobileOnly = styled('span')({
  display: 'none',
  '@container (max-width: 1100px)': { display: 'contents' },
});

const DebugDrawer = styled('div', { shouldForwardProp: noForward })<{ $open: boolean }>(
  ({ $open }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: 244,
    background: '#14161f',
    borderLeft: '1px solid #2a2d3d',
    padding: '14px 15px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 11,
    transform: $open ? 'translateX(0)' : 'translateX(100%)',
    opacity: $open ? 1 : 0,
    transition: 'transform .2s ease, opacity .2s ease',
    zIndex: 60,
  }),
);

const RangeInput = styled('input')({
  WebkitAppearance: 'none',
  appearance: 'none',
  width: '100%',
  height: 3,
  borderRadius: 999,
  background: '#232532',
  outline: 'none',
  cursor: 'pointer',
  '&::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    width: 13,
    height: 13,
    borderRadius: 999,
    background: '#9d97e0',
    cursor: 'pointer',
  },
  '&::-moz-range-thumb': {
    width: 13,
    height: 13,
    border: 'none',
    borderRadius: 999,
    background: '#9d97e0',
    cursor: 'pointer',
  },
  '&:focus-visible': { outline: '2px solid #9d97e0', outlineOffset: 4 },
});

const DebugButton = styled('button')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  padding: '9px 13px',
  borderRadius: 10,
  border: '1px solid rgba(207,224,210,.34)',
  background: 'transparent',
  color: '#cfe0d2',
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'opacity .18s ease',
  '&:hover': { opacity: 0.72 },
  '&:focus-visible': { outline: '2px solid #b8e6c0', outlineOffset: 2 },
});

const Ghost = styled(CardFace)({
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0.62,
  pointerEvents: 'none',
  zIndex: 140,
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: '7px 8px',
});

const OverlayBackdrop = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(22,36,27,.82)',
  zIndex: 150,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  boxSizing: 'border-box',
});

const LogOverlayBackdrop = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(20,22,31,.72)',
  zIndex: 70,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
});

const HandThumbTrack = styled('div')({
  display: 'none',
  height: 3,
  borderRadius: 999,
  background: 'rgba(207,224,210,.25)',
  overflow: 'hidden',
  '@container (max-width: 1100px)': { display: 'block' },
});

export {
  BoardGrid,
  BoardWrap,
  CardFace,
  CardName,
  CardStats,
  CombatLine,
  CombatLineRule,
  CostBadge,
  DebugButton,
  DebugDrawer,
  DesktopOnly,
  EndTurnButton,
  EnemyBox,
  EnemyHeader,
  EnemyHpFill,
  EnemyHpTrack,
  EnemyName,
  EnemyStats,
  EnemyTurnBanner,
  EnergyPip,
  Fan,
  FloatSpan,
  Ghost,
  HandCardBox,
  HandRow,
  HandThumbTrack,
  Hud,
  HudPillButton,
  HpFill,
  HpTrack,
  IntentBadge,
  KeyCap,
  LogOverlayBackdrop,
  MobileOnly,
  OverlayBackdrop,
  Panel,
  PLabel,
  PlayedCardBox,
  RangeInput,
  Rail,
  RingHighlight,
  Root,
  SidePanel,
  Slot,
  SlotCoord,
  SlotLabel,
  SlotTip,
  ThreatPill,
};
