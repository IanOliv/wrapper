/* eslint-disable @typescript-eslint/no-unused-vars */
import { Padding, Scale } from '@mui/icons-material';
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
  animationDuration?: string | '0';
  animationEasingFunction?: string | 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear';
  animationDelay?: string;
  animationIterationCount?: string | 'infinite';
  animationDirection?: string | 'normal';
  animationFillMode?: string | 'normal';
  animationPlayState?: string | 'running';
  animationName?: string;
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
    scale,
    keyframes,
    transform,
    animation,
    animationEasingFunction,
    animationFillMode,
    animationIterationCount,
    animationDirection,
    animationDelay,
    animationPlayState,
    animationDuration,
    animationName,
  }) => ({
    position: 'absolute',
    scale: scale ?? 1,
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
    transition: '0.5s',
    border: '1vmin solid #D9D9D9',
    borderRadius: 17,
    transform,

    // animation: `${animation} ${duration}s ${animationEasingFunction ?? 'ease-out'} ${
    //   animationIterationCount ?? 'infinite'
    // } ${animationFillMode ?? 'normal'}`,
    // animation: `${duration}s ${animationEasingFunction ?? 'ease-out'} ${
    //   animationIterationCount ?? 'infinite'
    // } ${animationFillMode ?? 'normal'}`,
    // animation: 'idle 1s',
    // -------------------------
    /* @keyframes duration | easing-function | delay |
iteration-count | direction | fill-mode | play-state | name */

    // animation: `${duration}s ${animationEasingFunction ?? 'ease-out'} 0s ${animationIterationCount ?? 'infinite'} ${
    //   animationDirection ?? 'normal'} ${
    //   animationFillMode ?? 'both'} ${
    //   animationPlayState ??'running'} ${
    //   animationName ??'idle'};`,

    '@keyframes breathing': keyframes,

    '@keyframes hover': {
      '0%': {},
      // "25%": {
      //   transform: 'scale(0.9)'
      // },
      '50%': {
        transform: 'translateY(1.5rem) scale(1.1)',
      },
      // "75%": {
      //   transform: 'scale(0.9)'
      // },
      '100%': {},
    },

    '@keyframes idle': {
      from: {},
      // "20%": { transform: 'translateY(0.4rem)' },
      // "45%": { transform: 'translateY(1rem)' },
      '50%': {
        transform: 'translateY(1.5rem)',
      },
      // "55%": { transform: 'translateY(1rem)' },
      // "10%": { transform: 'translateY(0.4rem)' },
      to: {},
    },

    '&:hover': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-8.2rem) scale(1.1) translateX(50px)',
      // "margin-left":'3rem'
      // animation: `${duration}s ${animationEasingFunction ?? 'ease-out'} 1s ${animationIterationCount ?? 'infinite'} ${animationDirection ?? 'normal'} ${animationFillMode ?? 'both'} ${animationPlayState ?? 'running'} ${animationName ?? 'hover'};`,

      // 'animation-fill-mode': 'forwards'
    },
    ':not(&:hover)': {
      backgroundColor: '#A056b3',
    },

    // animation: `${animation} ${duration}s ease-out infinite normal`,
    // '@keyframes breathing': keyframes,
  }),
);

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

const LabelRange = styled('label')({
  fontSize: '1.5vmin',
});

const SelectionRange = styled('select')({
  fontSize: '1.5vmin',
  // color: '#fff',

  // backgroundColor: '#1b1b1b',
  // border: '1px solid #fff',
  borderRadius: '3px',
  padding: '0.2vmin 0 0.2vmin 0 ',
});

const OptionRange = styled('option')({});

export {
  DeckContainer,
  Area,
  DeckCard,
  // DeckCardCustom,
  DeckBox,
  BoxColumn,
  InputRange,
  InputText,
  SpanRange,
  LabelRange,
  SelectionRange,
  OptionRange,
};
