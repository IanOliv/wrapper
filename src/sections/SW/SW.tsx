import { useCallback, useEffect, useRef } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import type { SnackbarKey } from 'notistack';
import { useRegisterSW } from 'virtual:pwa-register/react';

import useNotifications from '@/store/notifications';

// TODO (Suren): this should be a custom hook :)
function SW() {
  const [, notificationsActions] = useNotifications();
  const notificationKey = useRef<SnackbarKey | null>(null);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);

    if (notificationKey.current) {
      notificationsActions.close(notificationKey.current);
    }
  }, [setOfflineReady, setNeedRefresh, notificationsActions]);

  useEffect(() => {
    if (offlineReady) {
      notificationsActions.push({
        // notistack v3 rejects an undefined message even when `content` renders
        // everything — this is the accessible label, not what is drawn.
        message: 'App is ready to work offline.',
        options: {
          autoHideDuration: 4500,
          content: <Alert severity="success">App is ready to work offline.</Alert>,
        },
      });
    } else if (needRefresh) {
      // The one exception to auto-dismiss: a new version is worth interrupting
      // for, and the action is an accent-outline button, not a filled bar.
      notificationKey.current = notificationsActions.push({
        message: 'A new version of Wrapper is ready.',
        options: {
          persist: true,
          content: (
            <Alert
              severity="info"
              action={
                <>
                  <Button color="primary" size="small" onClick={() => updateServiceWorker(true)}>
                    Reload now
                  </Button>
                  <Button variant="text" size="small" color="inherit" onClick={close}>
                    Later
                  </Button>
                </>
              }
            >
              A new version of Wrapper is ready.
            </Alert>
          ),
        },
      });
    }
  }, [close, needRefresh, offlineReady, notificationsActions, updateServiceWorker]);

  return null;
}

export default SW;
