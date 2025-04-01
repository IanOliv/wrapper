/* eslint-disable @typescript-eslint/no-unused-vars */
import { Scale } from '@mui/icons-material';
import { styled } from '@mui/system';

interface AreaProps {
  children: React.ReactNode;
  isSelected: boolean;
}
interface DeckCardProps {
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
  animationName?: string;
  animationDuration: string | '0';
  animationEasingFunction?: string;
  animationFillMode: string | 'normal';
  animationPlayState: string | 'running';
  animationIterationCount: string | 'infinite';
}

const DeckContainer = styled('div')(() => ({
  height: '100%',
  width: '100%',
  position: 'relative',
}));

const DeckBox = styled('div')(() => ({
  width: '96%',
  margin: '2%',
  padding: '2% 3%',
  position: 'absolute',
  background: '#1e3e2d',
  borderRadius: 17,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'left',
  // justifyContent: 'center',

  //------
  // 'max-width': '400px',
  // margin: '0 auto',
  // border: '1px solid #ccc'
}));

const BoxColumn = styled('div')(() => ({
  justifySelf: 'center',
  margin: '1%',
  // width: '30%',
  background: ' tomato',
  // 'text-align': 'center',
  // 'font-size': '1.5em'
}));

const Area = styled('div')(() => ({
  height: '96%',
  width: '96%',
  position: 'absolute',
  // left: 0,
  // top: 0,
  margin: '2%',
  'margin-top': '1%',
  background: '#356D55',
  borderRadius: 17,
}));

const DeckCard = styled('div')<DeckCardProps>(
  ({
    left,
    top,
    isShadowEnabled,
    duration,
    keyframes,
    transform,
    animation,
    animationEasingFunction,
    animationFillMode,
    animationIterationCount,
  }) => ({
    position: 'absolute',
    height: '15.5em',
    width: '10em',
    left: left,
    top: top,
    boxShadow: !isShadowEnabled
      ? '0 0 0 0.2vmin black, -2vmin 4vmin 1vmin 0 rgba(0, 0, 0, 0.0)'
      : '0 0 0 0.2vmin black, -2vmin 4vmin 1vmin 0 rgba(0, 0, 0, 0.2)',
    // boxShadow: '0 0 0 0.2vmin black, -2vmin 4vmin 1vmin 0 rgba(0, 0, 0, 0.2)',
    backgroundImage: `linear-gradient(135deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(225deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(45deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(315deg, rgb(0, 0, 0) 25%, transparent 25%)`,
    backgroundPosition: '10px 0px, 10px 0px, 0px 0px, 0px 0px',
    backgroundSize: '20px 20px',
    backgroundRepeat: 'repeat',
    backgroundColor: '#1b1b1b',
    transition: 'transform 0.2s',
    border: '1vmin solid #D9D9D9',
    borderRadius: 17,
    transform,
    animation: `${animation} ${duration}s ${animationEasingFunction ?? 'ease-out'} ${
      animationIterationCount ?? 'infinite'
    } ${animationFillMode ?? 'normal'}`,
    '@keyframes breathing': keyframes,
    // animation: `${animation} ${duration}s ease-out infinite normal`,
    // '@keyframes breathing': keyframes,
  }),
);

const DeckCardCustom = styled('div')({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  width: '50vmin',
  border: '1vmin solid #fff',
  aspectRatio: '200/280',
  borderRadius: '3vmin',
  // boxShadow: '0 0 0 0.2vmin black, -2vmin 4vmin 1vmin 0 rgba(0, 0, 0, 0.2)',
  // boxShadow: '',
  backgroundImage: `linear-gradient(135deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(225deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(45deg, rgb(0, 0, 0) 25%, transparent 25%),
    linear-gradient(315deg, rgb(0, 0, 0) 25%, transparent 25%)`,
  backgroundPosition: '10px 0px, 10px 0px, 0px 0px, 0px 0px',
  backgroundSize: '20px 20px',
  backgroundRepeat: 'repeat',
  backgroundColor: '#1b1b1b',
  transition: 'transform 0.2s',
  animation: 'breathing 5s ease-out infinite normal',

  '&::before, &::after': {
    position: 'absolute',
    fontFamily: 'Sancreek',
    letterSpacing: '-0.4em',
    fontSize: '4.5vmin',
    writingMode: 'vertical-lr',
    textOrientation: 'upright',
    color: '#fff',
  },

  '&::before': {
    content: '"CODEPEN"',
    top: '3%',
    left: '1%',
  },

  '&::after': {
    content: '"JOKER"',
    bottom: '3%',
    right: '1%',
    transform: 'scaleX(-1)',
  },

  '> img': {
    width: '70%',
    imageRendering: 'pixelated',
    filter: 'invert(1)',
  },
  '@keyframes breathing': {
    '0%': { transform: 'scale(0.9)' },
    '25%': { transform: 'scale(1)' },
    '60%': { transform: 'scale(0.9)' },
    '100%': { transform: 'scale(0.9)' },
  },
  span: {
    color: '#fff',
    fontSize: '8vmin',
    fontFamily: 'Courier New',

    img: {
      width: '0.75em',
      filter: 'brightness(0) invert(1)',
    },
  },
});

const InputRange = styled('input')({
  margin: '0 1vmin',
});

const InputText = styled('span')({
  fontSize: '2vmin',
  color: '#fff',
  fontFamily: 'Courier New',
  marginLeft: '1vmin',
});

const SpanRange = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  margin: '10px',
});

const LabelRange = styled('label')({});

const SelectionRange = styled('select')({});

const OptionRange = styled('option')({});

export {
  DeckContainer,
  Area,
  DeckCard,
  DeckCardCustom,
  DeckBox,
  BoxColumn,
  InputRange,
  InputText,
  SpanRange,
};
