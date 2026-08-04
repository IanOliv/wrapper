import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SectionProps } from './types';

function Section({ title, children }: SectionProps) {
  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          mt: 1,
          p: 2,
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.shell.border.subtle}`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Section;
