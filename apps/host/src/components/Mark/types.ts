import type { SxProps, Theme } from '@mui/material/styles';

type MarkProps = {
  size?: number;
  /** desktop shows the wordmark next to the mark; mobile drops to the mark alone */
  wordmark?: boolean;
  sx?: SxProps<Theme>;
};

export type { MarkProps };
