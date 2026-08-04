import { useMemo } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import useTheme from '@/store/theme';

import themes from './themes';
import type { CustomThemeProviderProps } from './types';

function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme] = useTheme();

  // createTheme walks every component override; re-running it on each render
  // re-creates emotion's cache keys for the whole tree.
  const muiTheme = useMemo(() => createTheme(themes[theme]), [theme]);

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
