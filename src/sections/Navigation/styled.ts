import type { ElementType } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';

const shouldForward = (prop: string) => prop !== 'expanded' && prop !== 'active';

// `styled()` erases ButtonBase's overridable `component` typing, so nav items
// re-declare the props they hand to react-router's Link.
type AsLink = { component?: ElementType; to?: string };

// Rail expand/collapse is width-only at 220ms enter; labels cross-fade at 140ms
// so text never squashes.
const RailSurface = styled(Box, { shouldForwardProp: shouldForward })<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: expanded ? theme.shell.layout.railExpanded : theme.shell.layout.railCollapsed,
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.shell.border.subtle}`,
    transition: `width ${theme.shell.motion.duration.enter}ms ${theme.shell.motion.easing.enter}`,
  }),
);

// Active state is carried by three things at once — fill-weight icon, a 2px
// accent rule and a tinted ground — so it never depends on color alone.
const RailLink = styled(ButtonBase, { shouldForwardProp: shouldForward })<
  { expanded: boolean; active: boolean } & AsLink
>(({ theme, expanded, active }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: expanded ? 'flex-start' : 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  height: 44,
  paddingInline: expanded ? theme.spacing(1.5) : 0,
  borderRadius: 8,
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  backgroundColor: active ? theme.shell.tint : 'transparent',
  transition: `background-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
  '&:hover': {
    backgroundColor: active ? theme.shell.tint : theme.shell.border.subtle,
    color: theme.palette.text.primary,
  },
}));

const RailLabel = styled('span', { shouldForwardProp: shouldForward })<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    flexGrow: 1,
    minWidth: 0,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.875rem',
    fontWeight: 500,
    opacity: expanded ? 1 : 0,
    transition: `opacity ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
  }),
);

const RailToggle = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 36,
  borderRadius: 8,
  color: theme.palette.text.secondary,
  '&:hover': { backgroundColor: theme.shell.border.subtle, color: theme.palette.text.primary },
}));

// Mobile: a bottom bar with the three primary modules + "More". Always visible,
// thumb-reachable, and it never sits where the OS back gesture lives.
const BottomBarSurface = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'stretch',
  // the safe-area gutter is reserved here (so the bar's total footprint is
  // unchanged) but no longer as the surface's own padding — see BottomBarItem,
  // which stretches into it so the active tint reaches the true screen edge.
  height: `calc(${theme.shell.layout.bottomBar}px + env(safe-area-inset-bottom))`,
  boxSizing: 'content-box',
  backgroundColor: theme.shell.surface.level1,
  borderTop: `1px solid ${theme.shell.border.card}`,
}));

const BottomBarItem = styled(ButtonBase, { shouldForwardProp: shouldForward })<
  { active: boolean } & AsLink
>(({ theme, active }) => ({
  position: 'relative',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  minWidth: 0,
  // keeps the icon/label clear of the home-indicator gesture strip while the
  // item's own background — stretched by the surface above — still fills it
  paddingBottom: 'env(safe-area-inset-bottom)',
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  backgroundColor: active ? theme.shell.tint : 'transparent',
  fontSize: 11,
  fontWeight: 500,
  transition: `background-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
  '& > span': {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingInline: 4,
  },
}));

export { RailSurface, RailLink, RailLabel, RailToggle, BottomBarSurface, BottomBarItem };
