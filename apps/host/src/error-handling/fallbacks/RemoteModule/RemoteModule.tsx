import type { FallbackProps } from 'react-error-boundary';

import Button from '@mui/material/Button';

import { ArrowCounterClockwise, Cards, PlugsConnected } from '@phosphor-icons/react';

import ErrorScreen from '@/components/ErrorScreen';
import { messages } from '@/config';
import routes from '@/routes';
import { Pages } from '@/routes/types';

// A federated remote crashed, is unreachable, or the manifest has no entry
// for this :remoteId. Same call shape as AppErrorBoundaryFallback — usable
// both as an ErrorBoundary's FallbackComponent and called directly with a
// synthetic error — but scoped to one module's Suspense boundary, not the
// whole shell (see src/pages/DynamicModule).
function RemoteModuleErrorFallback({ error, resetErrorBoundary }: Partial<FallbackProps>) {
  return (
    <ErrorScreen
      icon={PlugsConnected}
      severity="error"
      title={messages.remoteModule.title}
      body={messages.remoteModule.body}
      code={error?.name ? error.name.toLowerCase() : 'remote-unreachable'}
      actions={
        <>
          <Button
            color="primary"
            startIcon={<ArrowCounterClockwise size={16} />}
            onClick={() => (resetErrorBoundary ? resetErrorBoundary() : window.location.reload())}
          >
            {messages.remoteModule.options.retry}
          </Button>
          <Button color="inherit" startIcon={<Cards size={16} />} href={routes[Pages.Card].path}>
            {messages.remoteModule.options.home}
          </Button>
        </>
      }
    />
  );
}

export default RemoteModuleErrorFallback;
