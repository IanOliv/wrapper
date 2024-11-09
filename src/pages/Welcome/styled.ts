import { styled } from '@mui/system';

interface iProps {
  size?: string;
  backgroundColor?: string;
  columns?: number;
  width?: number;
}
const Image = styled('img')({
  width: '100%',
  height: '100%',
  margin: 4,
});

const Container = styled('div')<iProps>(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}));

function howManyColumns(screenWidth: number, columns: number | undefined) {
  if (columns) {
    console.log('columns', columns);
    return columns;
  }
  if (screenWidth > 1200) {
    return 5;
  } else if (screenWidth > 1000) {
    return 4;
  } else {
    return 2;
  }
}

const Grid = styled('div')<iProps>(({ columns, width }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${howManyColumns(width ?? 0, columns)}, 1fr)`,
  gap: '0.8em',
  margin: '20px 8%',
  width,
}));

const Slot = styled('div')<iProps>(({ backgroundColor }) => ({
  backgroundColor,
  borderRadius: '5%',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
}));

const SlotMain = styled('div')<iProps>(({ backgroundColor }) => ({
  backgroundColor,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const SlotDescription = styled('h5')<iProps>(() => ({
  marginTop: '10px',
  width: '100%',
  color: '#EEEEEE',
  size: '0.5em',
  fontFamily: 'helvetica',
}));

const RoundSkeleton = styled('div')<iProps>(({ size }) => ({
  width: size ?? '50px',
  height: size ?? '50px',
  borderRadius: '50%',
  backgroundColor: '#EEEEEE',
  maxWidth: '100%',
  maxHeight: '100%',
}));

const StyledH6 = styled('h3')<iProps>(({ color }) => ({
  color,
  margin: 0,
  size: '2em',
  fontFamily: 'helvetica-bold',
}));

// h

export { Image, RoundSkeleton, Grid, Slot, SlotMain, SlotDescription, Container, StyledH6 };
