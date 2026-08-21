import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import MuiSlider from '@mui/material/Slider';
// `styled` from @mui/material/styles (not @mui/system) so `theme.shell` is typed
import { styled } from '@mui/material/styles';

import { FlexBox } from '@/components/styled';

import { workbench } from './utils';

/**
 * The body: stage and inspector, `1fr / 296px`. Under 900px the inspector
 * stops being a column and becomes a bottom sheet — see `InspectorPanel`.
 */
const Workbench = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 296px',
  minHeight: 468,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.shell.border.subtle}`,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 60vh',
  },
}));

/**
 * The dot grid is the canvas signal — cheap, and it reads in both modes where a
 * filled field would read as a second brand color.
 */
const StageGround = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'grid',
})<{ grid: boolean }>(({ theme, grid }) => ({
  position: 'relative',
  minHeight: 320,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  backgroundImage: grid ? `radial-gradient(${workbench(theme).dot} 1px, transparent 1px)` : 'none',
  backgroundSize: '18px 18px',
}));

const StageToolbar = styled(FlexBox)({
  position: 'absolute',
  top: 14,
  gap: 8,
  alignItems: 'center',
  zIndex: 2,
});

/** The 28px controls that float over the stage: chips, steppers, icon buttons. */
const StageControl = styled(ButtonBase)(({ theme }) => ({
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
  transition: `color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, border-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
  '&:hover': { color: theme.palette.text.primary, borderColor: theme.shell.border.control },
  '&.active': { color: theme.palette.primary.main, borderColor: theme.palette.primary.main },
}));

/** The zoom stepper's shell — its three parts share one 8px pill. */
const Stepper = styled(FlexBox)(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.shell.surface.level1,
  border: `1px solid ${theme.shell.border.card}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
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

/** Readings, IDs and coordinates. The mono role, at the stage's 11px. */
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
}));

const TimelineBar = styled(FlexBox)(({ theme }) => ({
  position: 'absolute',
  left: 16,
  right: 16,
  bottom: 14,
  height: 40,
  alignItems: 'center',
  gap: 12,
  padding: '0 12px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.shell.surface.level1,
  border: `1px solid ${theme.shell.border.card}`,
  zIndex: 2,
}));

const InspectorPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  overflowY: 'auto',
  backgroundColor: workbench(theme).inspector,
  borderLeft: `1px solid ${theme.shell.border.subtle}`,
  [theme.breakpoints.down('md')]: {
    // a bottom sheet at 60% of the viewport, same three groups, stage above
    borderLeft: 'none',
    borderTop: `1px solid ${theme.shell.border.subtle}`,
    borderRadius: `${theme.shape.borderRadius * 1.75}px ${theme.shape.borderRadius * 1.75}px 0 0`,
  },
}));

const InspectorGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: '14px 16px',
  borderBottom: `1px solid ${theme.shell.border.subtle}`,
  '&:last-of-type': { borderBottom: 'none' },
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

/** The timeline's knob is 11px and rides bare on the bar's own ground. */
const TimelineSlider = styled(Slider)({
  flex: 1,
  '& .MuiSlider-thumb': { width: 11, height: 11, boxShadow: 'none' },
});

export {
  GroupLabel,
  InspectorGroup,
  InspectorPanel,
  OriginLeader,
  Readout,
  Slider,
  StageCard,
  StageControl,
  StageGround,
  StageToolbar,
  Stepper,
  StepperButton,
  TimelineBar,
  TimelineSlider,
  Workbench,
};
