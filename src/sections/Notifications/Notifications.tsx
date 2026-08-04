import { SnackbarProvider } from 'notistack';

import { notifications } from '@/config';

import Notifier from './Notifier';

// Toasts sit at elevation 3 with an 8px radius — see the MuiAlert and
// MuiSnackbarContent overrides in the theme. They stack; they do not pile up.
function Notifications() {
  return (
    <SnackbarProvider
      maxSnack={notifications.maxSnack}
      anchorOrigin={notifications.options.anchorOrigin}
      autoHideDuration={notifications.options.autoHideDuration}
    >
      <Notifier />
    </SnackbarProvider>
  );
}

export default Notifications;
