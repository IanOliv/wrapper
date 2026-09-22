import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

// "Jump to…" reads as a field, not a button — it is the entrance to ⌘K, and the
// key cap tells you the faster way in.
const JumpToButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  height: 34,
  minWidth: 208,
  paddingInline: theme.spacing(1.5),
  borderRadius: 8,
  border: `1px solid ${theme.shell.border.control}`,
  backgroundColor: theme.shell.surface.sunken,
  color: theme.palette.text.secondary,
  fontSize: '0.8125rem',
  transition: `border-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
  '&:hover': { borderColor: theme.palette.text.secondary },
  '& > span': { flexGrow: 1, textAlign: 'left' },
  '& .jump-to-cap': {
    fontFamily: theme.shell.fontFamilyMono,
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1,
    padding: '4px 5px',
    borderRadius: 4,
    border: `1px solid ${theme.shell.border.control}`,
    color: theme.palette.text.secondary,
  },
}));

const JumpToIconButton = styled(IconButton)({
  borderRadius: 8,
});

export { JumpToButton, JumpToIconButton };
