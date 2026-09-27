import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { MarkProps } from './types';

// A frame with a `< >` inside it: a shell that wraps things. Accent stroke on
// transparent — the identity is a line, never a fill.
function Mark({ size = 24, wordmark = false, sx }: MarkProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', ...sx }}>
      <Box
        component="svg"
        viewBox="0 0 24 24"
        aria-hidden
        sx={{ width: size, height: size, flexShrink: 0, display: 'block' }}
      >
        <rect
          x="1.25"
          y="1.25"
          width="21.5"
          height="21.5"
          rx="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M9.6 8.4 6.4 12l3.2 3.6M14.4 8.4 17.6 12l-3.2 3.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
      {wordmark && (
        <Typography
          component="span"
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            letterSpacing: '-.02em',
            color: 'text.primary',
          }}
        >
          Wrapper
        </Typography>
      )}
    </Box>
  );
}

export default Mark;
