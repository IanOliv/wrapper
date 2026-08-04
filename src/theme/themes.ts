import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import {
  bottomBar,
  dark,
  elevation,
  fontFamily,
  header,
  light,
  motion,
  radius,
  rail,
} from './tokens';
import type { ShellTokens } from './types';
import { Themes } from './types';

type PaletteMode = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Shell tokens per mode
// ---------------------------------------------------------------------------

const shellLayout: ShellTokens['layout'] = {
  headerMobile: header.mobile,
  headerDesktop: header.desktop,
  railCollapsed: rail.collapsed,
  railExpanded: rail.expanded,
  bottomBar,
};

const shellMotion: ShellTokens['motion'] = {
  duration: { ...motion.duration },
  easing: { ...motion.easing },
  spring: {
    drawer: { ...motion.spring.drawer },
    layout: { ...motion.spring.layout },
  },
};

const darkShell: ShellTokens = {
  surface: {
    sunken: dark.ground,
    level1: dark.surface1,
    level2: dark.surface2,
    level3: dark.surface3,
  },
  border: {
    subtle: dark.borderSubtle,
    card: dark.borderCard,
    control: dark.borderControl,
  },
  tint: dark.tint,
  ring: elevation.dark,
  fontFamilyMono: fontFamily.mono,
  motion: shellMotion,
  layout: shellLayout,
};

const lightShell: ShellTokens = {
  surface: {
    sunken: light.sunken,
    level1: light.surface1,
    level2: light.surface2,
    level3: light.surface3,
  },
  border: {
    subtle: light.borderSubtle,
    card: light.borderCard,
    control: light.borderControl,
  },
  tint: light.tint,
  ring: elevation.light,
  fontFamilyMono: fontFamily.mono,
  motion: shellMotion,
  layout: shellLayout,
};

// ---------------------------------------------------------------------------
// Shared — applies to both modes
// ---------------------------------------------------------------------------

const sharedTheme = {
  shape: { borderRadius: radius.default },
  spacing: 8,
  typography: {
    fontFamily: fontFamily.sans,
    h1: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1.1 },
    h2: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.2 },
    h3: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 },
    // h4—h6 continue the same ramp so nothing falls back to Roboto's scale
    h4: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.45 },
    body1: { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.55 },
    body2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },
    button: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.2, textTransform: 'none' },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 500,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
  },
  transitions: {
    duration: {
      shortest: motion.duration.instant,
      shorter: motion.duration.state,
      short: motion.duration.state,
      standard: motion.duration.enter,
      complex: motion.duration.drawer,
      enteringScreen: motion.duration.enter,
      leavingScreen: motion.duration.exit,
    },
    easing: {
      easeInOut: motion.easing.state,
      easeOut: motion.easing.enter,
      easeIn: motion.easing.exit,
      sharp: 'cubic-bezier(.4,0,.6,1)',
    },
  },
  mixins: {
    toolbar: {
      minHeight: header.mobile,
      '@media (min-width:900px)': { minHeight: header.desktop },
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        // consistent with the quieter interaction language
        disableRipple: true,
      },
    },
    MuiDivider: {
      styleOverrides: {
        vertical: {
          marginRight: 10,
          marginLeft: 10,
        },
        // TODO: open issue for missing "horizontal" CSS rule
        // in Divider API - https://mui.com/material-ui/api/divider/#css
        middle: {
          marginTop: 10,
          marginBottom: 10,
          width: '80%',
        },
      },
    },
  },
} as ThemeOptions; // the reason for this casting is deepmerge return type

// ---------------------------------------------------------------------------
// Component overrides — built per mode so they read that mode's own tokens
// ---------------------------------------------------------------------------

type Severity = 'success' | 'error' | 'warning' | 'info';

function componentsFor(mode: PaletteMode): ThemeOptions['components'] {
  const t = mode === 'dark' ? dark : light;
  const shell = mode === 'dark' ? darkShell : lightShell;
  const ring = shell.ring;
  const semantic: Record<Severity, string> = {
    success: t.success,
    error: t.error,
    warning: t.warning,
    info: t.info,
  };

  // MUI ships 25 elevation levels; the shell has four. Everything is aliased down.
  const levelFor = (e: number): 0 | 1 | 2 | 3 => (e <= 0 ? 0 : e <= 2 ? 1 : e <= 8 ? 2 : 3);
  const surfaceFor = (level: 0 | 1 | 2 | 3) =>
    [shell.surface.sunken, shell.surface.level1, shell.surface.level2, shell.surface.level3][level];

  return {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': { colorScheme: mode },
        body: {
          fontFamily: fontFamily.sans,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        // The accent is a focus ring before it is anything else.
        ':focus-visible': {
          outline: `2px solid ${t.primary}`,
          outlineOffset: 2,
        },
        '::selection': { background: shell.tint, color: t.textPrimary },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          background: shell.border.control,
          borderRadius: 8,
          border: `3px solid ${t.ground}`,
        },
        // One hook for reduced motion, not one per component.
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: ({ ownerState }) => {
          const level = levelFor((ownerState.elevation as number | undefined) ?? 1);

          return {
            // MUI fakes dark-mode elevation with a white overlay image; the shell
            // uses a real surface plus a hairline instead.
            backgroundImage: 'none',
            backgroundColor: surfaceFor(level),
            boxShadow: ring[level],
          };
        },
        rounded: { borderRadius: radius.default },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 1, color: 'default' },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: shell.surface.level1,
          color: t.textPrimary,
          boxShadow: ring[1],
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: header.mobile,
          '@media (min-width:900px)': { minHeight: header.desktop },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.default,
          paddingInline: 14,
          minHeight: 36,
          transition: `background-color ${motion.duration.state}ms ${motion.easing.state}, border-color ${motion.duration.state}ms ${motion.easing.state}`,
        },
        // Primary actions are an accent outline on transparent, not a fill.
        outlinedPrimary: {
          borderColor: t.primary,
          color: t.primary,
          '&:hover': { borderColor: t.primary, backgroundColor: shell.tint },
        },
        outlinedInherit: {
          borderColor: shell.border.control,
          '&:hover': { borderColor: t.textSecondary, backgroundColor: 'transparent' },
        },
        text: { '&:hover': { backgroundColor: shell.tint } },
        sizeSmall: { minHeight: 30, paddingInline: 10 },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.default,
          color: t.textSecondary,
          transition: `background-color ${motion.duration.state}ms ${motion.easing.state}, color ${motion.duration.state}ms ${motion.easing.state}`,
          '&:hover': { backgroundColor: shell.tint, color: t.textPrimary },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.default,
          backgroundColor: mode === 'dark' ? shell.surface.sunken : shell.surface.level2,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: shell.border.control },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.textSecondary },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: t.primary,
            borderWidth: 1,
          },
          '&.Mui-focused': { boxShadow: `0 0 0 3px ${shell.tint}` },
        },
        input: { paddingBlock: 11 },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { color: t.textSecondary, '&.Mui-focused': { color: t.primary } },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.chip, fontSize: '0.75rem', fontWeight: 500, height: 24 },
        outlined: { borderColor: shell.border.control },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.dialog,
          backgroundImage: 'none',
          backgroundColor: shell.surface.level3,
          boxShadow: ring[3],
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(10,11,16,.62)', backdropFilter: 'blur(6px)' },
        invisible: { backgroundColor: 'transparent', backdropFilter: 'none' },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: shell.surface.level2,
          boxShadow: ring[2],
          borderRadius: radius.default,
        },
        list: { padding: 4 },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: radius.chip,
          minHeight: 36,
          fontSize: '0.875rem',
          '&:hover': { backgroundColor: shell.tint },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: shell.tint },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.default,
          paddingBlock: 8,
          transition: `background-color ${motion.duration.state}ms ${motion.easing.state}`,
          '&:hover': { backgroundColor: shell.tint },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: shell.tint },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 32, color: 'inherit' } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: shell.surface.level2,
          color: t.textPrimary,
          border: `1px solid ${shell.border.control}`,
          borderRadius: radius.chip,
          fontSize: '0.75rem',
          fontWeight: 400,
          paddingBlock: 5,
        },
        arrow: { color: shell.surface.level2 },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: shell.border.subtle } },
    },

    // Semantic color is a text color and a 2px mark — never a filled banner.
    MuiAlert: {
      defaultProps: { variant: 'standard' },
      styleOverrides: {
        root: ({ ownerState }) => {
          const color = semantic[(ownerState.severity as Severity | undefined) ?? 'info'];

          return {
            backgroundColor: shell.surface.level3,
            color: t.textPrimary,
            borderRadius: radius.default,
            boxShadow: ring[3],
            borderLeft: `2px solid ${color}`,
            paddingBlock: 8,
            alignItems: 'center',
            '& .MuiAlert-icon': { color, opacity: 1, paddingBlock: 0 },
            '& .MuiAlert-message': { paddingBlock: 0, fontSize: '0.875rem' },
          };
        },
      },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: shell.surface.level3,
          color: t.textPrimary,
          borderRadius: radius.default,
          boxShadow: ring[3],
          fontSize: '0.875rem',
        },
      },
    },

    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: {
        root: { backgroundColor: shell.border.subtle, borderRadius: radius.default },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: radius.chip, backgroundColor: shell.border.subtle },
      },
    },

    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: { root: { color: t.primary, fontWeight: 500 } },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { backgroundColor: shell.tint, color: t.primaryLight, fontSize: '0.8125rem' },
      },
    },
  };
}

// ---------------------------------------------------------------------------

function paletteFor(mode: PaletteMode) {
  const t = mode === 'dark' ? dark : light;

  return {
    mode,
    primary: { main: t.primary, dark: t.primaryDark, light: t.primaryLight },
    secondary: { main: t.secondary },
    background: { default: t.ground, paper: t.surface1 },
    text: { primary: t.textPrimary, secondary: t.textSecondary, disabled: t.textDisabled },
    divider: t.borderSubtle,
    success: { main: t.success },
    error: { main: t.error },
    warning: { main: t.warning },
    info: { main: t.info },
  };
}

const themes: Record<Themes, ThemeOptions> = {
  light: deepmerge(sharedTheme, {
    palette: paletteFor('light'),
    shell: lightShell,
    components: componentsFor('light'),
  }),

  dark: deepmerge(sharedTheme, {
    palette: paletteFor('dark'),
    shell: darkShell,
    components: componentsFor('dark'),
  }),
};

export default themes;
