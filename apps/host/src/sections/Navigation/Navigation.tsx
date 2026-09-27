import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import BottomBar from './BottomBar';
import Rail from './Rail';

// A slide-over drawer is wrong for a three-destination phone app: it costs a tap
// for the most common action, hides where you are, and in a full-screen PWA the
// hamburger sits exactly where the OS back gesture lives. So: rail or bar.
function Navigation() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return isDesktop ? <Rail /> : <BottomBar />;
}

export default Navigation;
