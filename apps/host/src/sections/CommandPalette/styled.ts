import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

const PaletteRow = styled(Box, { shouldForwardProp: (prop) => prop !== 'selected' })<{
  selected: boolean;
}>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  minHeight: 44,
  paddingInline: theme.spacing(1.5),
  paddingBlock: theme.spacing(1),
  borderRadius: 8,
  cursor: 'pointer',
  color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
  backgroundColor: selected ? theme.shell.tint : 'transparent',
  boxShadow: selected ? `inset 2px 0 0 ${theme.palette.primary.main}` : 'none',
}));

// The input never loses focus, so it never draws a border of its own —
// the whole top bar is the field.
const PaletteInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  fontSize: '0.9375rem',
  color: theme.palette.text.primary,
  '& input::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
}));

const PaletteFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  borderTop: `1px solid ${theme.shell.border.subtle}`,
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
}));

export { PaletteRow, PaletteInput, PaletteFooter };
