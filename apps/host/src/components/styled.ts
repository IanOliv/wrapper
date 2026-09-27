import Box from '@mui/material/Box';
// `styled` from @mui/material/styles (not @mui/system) so `theme.shell` is typed
import { styled } from '@mui/material/styles';

const FlexBox = styled(Box)({
  display: 'flex',
});

const CenteredFlexBox = styled(FlexBox)({
  justifyContent: 'center',
  alignItems: 'center',
});

const FullSizeCenteredFlexBox = styled(CenteredFlexBox)({
  width: '100%',
  height: '100%',
});

// The monospace role, outside MUI's type scale. Readings, IDs and key caps only.
const Mono = styled('span')(({ theme }) => ({
  fontFamily: theme.shell.fontFamilyMono,
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
}));

export { FlexBox, CenteredFlexBox, FullSizeCenteredFlexBox, Mono };
