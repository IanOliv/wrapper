enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

type CustomThemeProviderProps = {
  children: JSX.Element;
};

// Tokens the shell owns that have no home in MUI's own palette.
// Reachable from any `sx` callback as `theme.shell.*`.
type ShellTokens = {
  surface: {
    sunken: string;
    level1: string;
    level2: string;
    level3: string;
  };
  border: {
    subtle: string;
    card: string;
    control: string;
  };
  /** active nav ground, hover ground, selected palette row */
  tint: string;
  /** four elevation levels; MUI's other 20 are aliased down to these */
  ring: Record<0 | 1 | 2 | 3, string>;
  fontFamilyMono: string;
  motion: {
    duration: Record<'instant' | 'state' | 'enter' | 'exit' | 'drawer' | 'layout', number>;
    easing: Record<'instant' | 'state' | 'enter' | 'exit', string>;
    spring: {
      drawer: { type: string; stiffness: number; damping: number };
      layout: { type: string; stiffness: number; damping: number };
    };
  };
  layout: {
    headerMobile: number;
    headerDesktop: number;
    railCollapsed: number;
    railExpanded: number;
    bottomBar: number;
  };
};

declare module '@mui/material/styles' {
  interface Theme {
    shell: ShellTokens;
  }
  interface ThemeOptions {
    shell?: ShellTokens;
  }
}

export type { CustomThemeProviderProps, ShellTokens };
export { Themes };
