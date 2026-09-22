import type { FallbackProps } from 'react-error-boundary';

import Button from '@mui/material/Button';

import { ArrowCounterClockwise, Cards, PlugsConnected } from '@phosphor-icons/react';

import ErrorScreen from '@/components/ErrorScreen';
import { messages } from '@/config';
import routes from '@/routes';
import { Pages } from '@/routes/types';

// Module crash: "This module came off its hinges." → Retry / Back to Cards.
function AppErrorBoundaryFallback({ error, resetErrorBoundary }: Partial<FallbackProps>) {
  return (
    <ErrorScreen
      icon={PlugsConnected}
      severity="error"
      title={messages.app.crash.title}
      body={messages.app.crash.body}
      code={error?.name ? error.name.toLowerCase() : 'module-crashed'}
      actions={
        <>
          <Button
            color="primary"
            startIcon={<ArrowCounterClockwise size={16} />}
            onClick={() => (resetErrorBoundary ? resetErrorBoundary() : window.location.reload())}
          >
            {messages.app.crash.options.retry}
          </Button>
          <Button color="inherit" startIcon={<Cards size={16} />} href={routes[Pages.Card].path}>
            {messages.app.crash.options.home}
          </Button>
        </>
      }
    />
  );
}

export default AppErrorBoundaryFallback;
