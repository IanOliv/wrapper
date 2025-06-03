/* eslint-disable @typescript-eslint/no-unused-vars */
import { Padding, Scale } from '@mui/icons-material';
import { margin, styled, width } from '@mui/system';

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
}));

export const Area = styled('div')(() => ({
  height: '96%',
  width: '96%',
  position: 'absolute',
  // left: 0,
  // top: 0,
  margin: '2%',
  'margin-top': '1%',
  background: '#356D55',
  borderRadius: 17,
  overflow: 'hidden',
}));

export const Message = styled('div')(() => ({
  padding: '1rem',
  borderRadius: '1rem',
  maxWidth: '90%',
  minWidth: '20%',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
}));

export const MessageList = styled('div')(() => ({
  padding: '1rem',
  background: '#FF0B55',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  maxHeight: '82%',
  scrollbarColor: '#c40840 #c40840',
  overflow: 'auto',
  '& > div': {
    margin: '1rem',
  },
  '& > .outcome': {
    background: '#3AA6B9',
    marginLeft: 'auto',
  },
  '& > .income': {
    background: '#69247C',
    marginRight: 'auto',
  },
}));

export const MessageInput = styled('div')(() => ({
  position: 'absolute',
  width: '100%',
  background: '#F26B0F',
  bottom: '1rem',
  padding: '1rem',
}));

export const LabelTextarea = styled('label')(() => ({}));
export const InputTextarea = styled('textarea')(() => ({
  width: '100%',
  height: '3rem',
  border: 'none',
  resize: 'none',
  borderRadius: '0.4rem',
  fontSize: '1rem',
}));
export const InputButton = styled('button')(() => ({
  fontSize: '1rem',
  background: '#F26B0F',
  color: '#fff',
  border: '1px solid #fff',
  borderRadius: '0.4rem',
}));
