import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import MuiSlider from '@mui/material/Slider';
// `styled` from @mui/material/styles (not @mui/system) so `theme.shell` is typed
import { styled } from '@mui/material/styles';

import { FlexBox } from '@/components/styled';

import { workbench } from './utils';

/** The band the timeline occupies; its rows scroll inside it. */
const TIMELINE_BAND = 'clamp(200px, 34%, 340px)';

/**
 * The body: Layers | Stage | Inspector, with the timeline spanning the stage and
 * inspector beneath. Under 900px the columns stack and the inspector becomes a
 * bottom sheet.
 */
const Workbench = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '168px 1fr 296px',
  // The workbench fills the height the shell gives it and never exceeds it:
  // the three columns and the timeline scroll inside themselves instead of
  // pushing the page into a scrollbar.
  height: '100%',
  minHeight: 0,
  maxHeight: '100%',
  // The timeline holds a band of its own rather than hugging its content: a
  // content-sized row left dead space under the last track whenever the
  // document was small.
  gridTemplateRows: `minmax(0, 1fr) ${TIMELINE_BAND}`,
  gridTemplateAreas: `
    "layers stage inspector"
    "layers timeline timeline"
  `,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.shell.border.subtle}`,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    // A phone cannot show all four regions at once; here the page does scroll,
    // with the inspector as a bottom sheet.
    height: 'auto',
    maxHeight: 'none',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto minmax(320px, 1fr) auto 60vh',
    gridTemplateAreas: `
      "layers"
      "stage"
      "timeline"
      "inspector"
    `,
  },
}));

/** Each column scrolls on its own, so scrubbing never moves the other two. */
const Panel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  overflowY: 'auto',
  backgroundColor: workbench(theme).panel,
}));

const PanelHeader = styled(FlexBox)(({ theme }) => ({
  alignItems: 'center',
  gap: 8,
  padding: '13px 16px',
  borderBottom: `1px solid ${theme.shell.border.subtle}`,
  position: 'sticky',
  top: 0,
  zIndex: 3,
  backgroundColor: workbench(theme).panel,
}));

const PanelTitle = styled('span')(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
}));

/**
 * The dot grid is the canvas signal — cheap, and it reads in both modes where a
 * filled field would read as a second brand color.
 */
const StageGround = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'grid',
})<{ grid: boolean }>(({ theme, grid }) => ({
  gridArea: 'stage',
  display: 'flex',
  flexDirection: 'column',
  // 424 is the design's preferred height, not a floor: on a short viewport the
  // stage yields so the workbench still fits without a page scrollbar.
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  backgroundImage: grid ? `radial-gradient(${workbench(theme).dot} 1px, transparent 1px)` : 'none',
  backgroundSize: '18px 18px',
  [theme.breakpoints.down('md')]: { minHeight: 320 },
}));

/** Toolbar and toggle rows are in flow, so a narrow stage reflows them. */
const StageRow = styled(FlexBox)({
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  flexShrink: 0,
});

/** Every fixed-height chip, select and button label keeps its line. */
const Chip = styled(ButtonBase)(({ theme }) => ({
  height: 28,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.shell.surface.level1,
  border: `1px solid ${theme.shell.border.card}`,
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: `color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, border-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
  '&:hover': { color: theme.palette.text.primary, borderColor: theme.shell.border.control },
  '&.active': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.shell.tint,
  },
  '&.accent': {
    backgroundColor: 'transparent',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

/** The zoom stepper's shell — its three parts share one 8px pill. */
const Stepper = styled(FlexBox)(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.shell.surface.level1,
  border: `1px solid ${theme.shell.border.card}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  flexShrink: 0,
}));

const StepperButton = styled(ButtonBase)(({ theme }) => ({
  width: 30,
  height: 28,
  display: 'grid',
  placeItems: 'center',
  color: theme.palette.text.secondary,
  '&:hover': { color: theme.palette.text.primary },
  '&.Mui-disabled': { color: theme.palette.text.disabled },
}));

/** The stage card. 172px is the mock's width; everything else follows elev 1. */
const StageCard = styled(Box)(({ theme }) => ({
  width: 172,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.shell.surface.level1,
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 0 0 1px ${theme.shell.border.card}, 0 18px 46px rgba(0,0,0,.55)`
      : `0 0 0 1px ${theme.shell.border.card}, 0 18px 46px rgba(26,28,36,.14)`,
  overflow: 'hidden',
}));

/**
 * A 26px hairline fading in from the origin side, so `positionH`/`positionV`
 * read as a distance travelled rather than as a bare number under a slider.
 */
const OriginLeader = styled('span', {
  shouldForwardProp: (prop) => prop !== 'axis',
})<{ axis: 'h' | 'v' }>(({ theme, axis }) =>
  axis === 'h'
    ? {
        position: 'absolute',
        left: -34,
        top: '50%',
        width: 26,
        height: 1,
        background: `linear-gradient(to right, transparent, ${theme.shell.tint})`,
      }
    : {
        position: 'absolute',
        top: -34,
        left: '50%',
        width: 1,
        height: 26,
        background: `linear-gradient(to bottom, transparent, ${theme.shell.tint})`,
      },
);

/** Readings, IDs, coordinates and timecode. The mono role at panel size. */
const Readout = styled('span')(({ theme }) => ({
  fontFamily: theme.shell.fontFamilyMono,
  fontSize: 11,
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
  color: workbench(theme).muted,
  whiteSpace: 'nowrap',
}));

/** 11px .12em uppercase — the label above each inspector group. */
const GroupLabel = styled('div')(({ theme }) => ({
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: workbench(theme).muted,
  whiteSpace: 'nowrap',
}));

const Group = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: '14px 16px',
  borderBottom: `1px solid ${theme.shell.border.subtle}`,
  '&:last-of-type': { borderBottom: 'none' },
}));

/** The count chip in a panel header, and the timeline's mono tags. */
const TagChip = styled(Readout)(({ theme }) => ({
  fontSize: 10,
  border: `1px solid ${theme.shell.border.card}`,
  borderRadius: 3,
  padding: '1px 5px',
  flex: 'none',
}));

/** A layer row: 30px, 6px radius, accent ground when selected. */
const LayerRow = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'depth',
})<{ selected: boolean; depth: number }>(({ theme, selected, depth }) => ({
  height: 30,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  paddingLeft: 8 + depth * 20,
  paddingRight: 6,
  borderRadius: 6,
  fontSize: 12,
  textAlign: 'left',
  color: selected ? theme.palette.primary.light : theme.palette.text.secondary,
  backgroundColor: selected ? theme.shell.tint : 'transparent',
  '&:hover': { backgroundColor: selected ? theme.shell.tint : theme.shell.surface.level1 },
}));

/** Presets: 24px pills that never wrap their label. */
const PresetChip = styled(ButtonBase)(({ theme }) => ({
  height: 24,
  padding: '0 10px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  border: `1px solid ${theme.shell.border.card}`,
  backgroundColor: theme.shell.surface.level1,
  color: theme.palette.text.secondary,
  '&:hover': { color: theme.palette.text.primary, borderColor: theme.shell.border.control },
  '&.active': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
}));

/**
 * 3px track, 12px knob with a 3px ring. Focus lands on the knob and gets the
 * shell's own accent ring, so the control is keyboard-scrubbable.
 */
const Slider = styled(MuiSlider)(({ theme }) => ({
  height: 3,
  padding: '10px 0',
  color: theme.palette.primary.main,
  '& .MuiSlider-rail': { backgroundColor: theme.shell.border.subtle, opacity: 1 },
  '& .MuiSlider-track': { border: 'none' },
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${workbench(theme).knobRing}`,
    '&::before': { boxShadow: 'none' },
    '&:hover, &.Mui-focusVisible, &.Mui-active': {
      boxShadow: `0 0 0 3px ${workbench(theme).knobRing}`,
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
}));

/** A bipolar slider fills from the centre, so ±0 reads as centred, not empty. */
const BipolarSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-track': { display: 'none' },
  '& .MuiSlider-rail': {
    opacity: 1,
    backgroundColor: theme.shell.border.subtle,
  },
}));

/** The segmented control behind Repeat. */
const Segmented = styled(FlexBox)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.shell.border.control}`,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}));

const SegmentedButton = styled(ButtonBase)(({ theme }) => ({
  flex: 1,
  height: 30,
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  color: theme.palette.text.secondary,
  '&.active': { backgroundColor: theme.shell.tint, color: theme.palette.primary.light },
}));

/** The 30px mono number fields behind Delay and Stagger. */
const NumberField = styled('input')(({ theme }) => ({
  height: 30,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  padding: '0 8px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.shell.border.control}`,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontFamily: theme.shell.fontFamilyMono,
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export {
  TIMELINE_BAND,
  BipolarSlider,
  Chip,
  Group,
  GroupLabel,
  LayerRow,
  NumberField,
  OriginLeader,
  Panel,
  PanelHeader,
  PanelTitle,
  PresetChip,
  Readout,
  Segmented,
  SegmentedButton,
  Slider,
  StageCard,
  StageGround,
  StageRow,
  Stepper,
  StepperButton,
  TagChip,
  Workbench,
};
