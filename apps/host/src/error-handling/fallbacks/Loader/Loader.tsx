import Button from '@mui/material/Button';

import { ArrowCounterClockwise, CloudWarning } from '@phosphor-icons/react';

import ErrorScreen from '@/components/ErrorScreen';
import { messages } from '@/config';
import resetApp from '@/utils/reset-app';

function LoaderErrorBoundaryFallback() {
  return (
    <ErrorScreen
      icon={CloudWarning}
      severity="warning"
      title={messages.loader.fail}
      body={messages.loader.body}
      code="chunk-load-failed"
      actions={
        <Button color="primary" startIcon={<ArrowCounterClockwise size={16} />} onClick={resetApp}>
          Retry
        </Button>
      }
    />
  );
}

export default LoaderErrorBoundaryFallback;
