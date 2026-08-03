import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import Pages from '@/routes/Pages';
import CommandPalette from '@/sections/CommandPalette';
import HotKeys from '@/sections/HotKeys';
import Notifications from '@/sections/Notifications';
import SW from '@/sections/SW';
import Shell from '@/sections/Shell';
import RouteTracker from '@/sections/Shell/RouteTracker';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <Notifications />
      <SW />
      <BrowserRouter>
        {/* palette and hotkeys navigate, so they live inside the router */}
        <HotKeys />
        <CommandPalette />
        <RouteTracker />
        <Shell>
          <Pages />
        </Shell>
      </BrowserRouter>
    </Fragment>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
