/* eslint-disable @typescript-eslint/no-unused-vars */
import { Padding, Scale } from '@mui/icons-material';
import { display, margin, styled, width } from '@mui/system';

export interface DeckCardProps {
  left?: number | string;
  top?: number | string;
  isShadowEnabled?: boolean;
  scale?: number;
  duration: number | 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyframes?: any;
  transform?: string;
  transition?: string;
  animation?: string;
  animationDuration?: string | '0';
  animationEasingFunction?: string | 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear';
  animationDelay?: string;
  animationIterationCount?: string | 'infinite';
  animationDirection?: string | 'normal';
  animationFillMode?: string | 'normal';
  animationPlayState?: string | 'running';
  animationName?: string;

  isSelected?: boolean;
  isFlipped?: boolean;
}

interface CardProps {
  isFlipped?: boolean;
}

export const DeckContainer = styled('div')(() => ({
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  padding: '0 2% 0 2%',
}));

export const Area = styled('div')(() => ({
  height: '85%',
  width: '70%',
  // position: 'absolute',
  // top: 0,
  margin: '3% 3% 0 3%',
  // 'margin-top': '1%',

  background: '#356D55',
  borderRadius: 17,
  overflow: 'hidden',
}));

export const AreaW = styled('div')(() => ({
  height: '100%',
  width: '100%',
  // position: 'absolute',
  // top: 0,
  // margin: '3% 3% 0 3%',
  // margin:'5%',
  // marginBottom:'8%',
  // 'margin-top': '1%',

  background: '#9A9D55',
  borderRadius: 17,
  overflow: 'hidden',
}));

export const ColumnContainer = styled('div')(() => ({
  height: '85%',
  width: '40%',
  margin: '3% 3% 3% 3%',
  // marginTop: '3%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
}));

export const List = styled('ul')(() => ({
  listStyleType: 'none',
  padding: '0.5rem 0 0.5rem 0',
  margin: 0,
  height: '100%',
  overflowY: 'auto',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  scrollBehavior: 'smooth',
  fontFamily: 'Helvetica, Arial, sans-serif',
  '&::-webkit-scrollbar': {
    width: '8px',
    display: 'none',
  },
}));
export const VerticalList = styled('ul')(() => ({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  height: '100%',
  overflowY: 'auto',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  scrollBehavior: 'smooth',
  fontFamily: 'Helvetica, Arial, sans-serif',
  '&::-webkit-scrollbar': {
    width: '8px',
    display: 'none',
  },
}));

export const ListItem = styled('li')(() => ({
  padding: '4px',
  margin: '0 0.5rem',
  fontSize: '18px',
  borderBottom: '1px solid #ddd',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: '#423',
  },
  '&:active': {
    backgroundColor: '#e0e0e0',
  },
}));
