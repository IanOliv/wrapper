import type { ReactNode } from 'react';

import type { Icon } from '@phosphor-icons/react';

type ErrorScreenProps = {
  icon: Icon;
  /** the glyph's color — semantic as a text color, never as a filled banner */
  severity?: 'error' | 'warning' | 'info';
  title: string;
  body: string;
  /** becomes the mono line `err · <code> · <ISO timestamp>` with a copy affordance */
  code?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export type { ErrorScreenProps };
