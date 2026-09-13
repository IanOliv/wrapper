/* eslint-disable @typescript-eslint/no-unused-vars */
import { Padding, Scale } from '@mui/icons-material';
import { styled, width } from '@mui/system';

interface AreaProps {
  children: React.ReactNode;
  isSelected: boolean;
}
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
  bottom: 0,
  scale: '0.7',
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
const DeckArea = styled('div')(() => ({
  background: '#aA6D55',
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
    isSelected,
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
    backgroundColor: isSelected ? '#3b7b8b' : '#1b1b1b',
    transition: '0.5s',
    border: '1vmin solid #D9D9D9',
    borderRadius: 17,
    transform,

    // animation: `ambiant 2000ms ease-in-out 1000ms infinite alternate `,
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
    '@keyframes ambiant': {
      from: {
        transform: 'scale(0.98) rotate(-1deg) skew(1deg)',
      },
      to: {
        transform: 'scale(1.02) rotate(1deg) skew(-1deg)',
      },
    },

    // '&:hover': {
    //   backgroundColor: '#0056b3',
    //   transform: 'translateY(-8.2rem) scale(1.1) translateX(50px)',
    //   // "margin-left":'3rem'
    //   // animation: `${duration}s ${animationEasingFunction ?? 'ease-out'} 1s ${animationIterationCount ?? 'infinite'} ${animationDirection ?? 'normal'} ${animationFillMode ?? 'both'} ${animationPlayState ?? 'running'} ${animationName ?? 'hover'};`,

    //   // 'animation-fill-mode': 'forwards'
    // },
    '&.selection': {
      backgroundColor: '#0056b3',
      transform: 'translateY(-18em) scale(1.18) ',
      // "margin-left":'3rem'
      // animation: `${duration}s ${animationEasingFunction ?? 'ease-out'} 1s ${animationIterationCount ?? 'infinite'} ${animationDirection ?? 'normal'} ${animationFillMode ?? 'both'} ${animationPlayState ?? 'running'} ${animationName ?? 'hover'};`,

      // 'animation-fill-mode': 'forwards'
    },
    // ':not(&:hover)': {
    //   backgroundColor: '#A056b3',
    // },

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

const InputButton = styled('button')({
  fontSize: '2vmin',
  color: '#fff',
  background: '#43d',
  fontFamily: 'Courier New',
  margin: '0.2vmin',
  scale: '0.9',
});

export const SpanRange = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  margin: '10px',
});

export const LabelRange = styled('label')({
  fontSize: '1.5vmin',
});

export const SelectionRange = styled('select')({
  fontSize: '1.5vmin',
  // color: '#fff',

  // backgroundColor: '#1b1b1b',
  // border: '1px solid #fff',
  borderRadius: '3px',
  padding: '0.2vmin 0 0.2vmin 0 ',
});

const OptionRange = styled('option')({});

export const DeckCardFront = styled('div')<DeckCardProps>(({ isShadowEnabled, isFlipped }) => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  boxShadow: !isShadowEnabled
    ? '0 0 0 0.2vmin black, -2vmin 4vmin 1vmin 0 rgba(0, 0, 0, 0.0)'
    : '0 0 0 0.2vmin black, -2vmin 4vmin 1vmin 0 rgba(0, 0, 0, 0.2)',

  backgroundColor: '#1C325B',
  transition: '0.5s',
  border: '0.4rem solid #D9D9D9',
  borderRadius: '1rem',
  transform: isFlipped ? 'rotateY(180deg)' : '',
  backfaceVisibility: 'hidden',
  '-webkit-backface-visibility': 'hidden',
}));

export const DeckCardBack = styled('div')<DeckCardProps>(({ isShadowEnabled, isFlipped }) => ({
  position: 'absolute',
  // scale: scale ?? 1,
  height: '100%',
  width: '100%',
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
  transform: isFlipped ? '' : 'rotateY(180deg)',
  backfaceVisibility: 'hidden',
  '-webkit-backface-visibility': 'hidden',
}));

export const DeckCardInner = styled('div')<DeckCardProps>(
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
    isSelected,
    isFlipped,
  }) => ({
    position: 'absolute',
    backgroundColor: 'transparent',
    height: '15.5em',
    width: '10em',
    left: left,
    top: top,
    scale: scale ?? 1,
    transition: '0.5s',
    transformStyle: 'preserve-3d',
    '&.selection': {
      transform: 'translate(-18em) translateX(20em) scale(2)',
      // transform: 'translateY(-18em) translateX(20em) scale(2)',
      // animation: `ambiant 2000ms ease-in-out 1000ms infinite alternate `,
    },
    '&.rotate': {
      transform: 'rotateZ(90deg)',
      // animation: `ambiant 2000ms ease-in-out 1000ms infinite alternate `,
    },
    '&.ambiant': {
      animation: `ambiant 2000ms ease-in-out 1000ms infinite alternate `,
      // animation: `ambiant 2000ms ease-in-out 1000ms infinite alternate `,
    },
    '@keyframes ambiant': {
      from: {
        transform: 'scale(0.98) rotate(-1deg) skew(1deg)',
      },
      to: {
        transform: 'scale(1.02) rotate(1deg) skew(-1deg)',
      },
    },
  }),
);

export const CardFrontSection = styled('div')({
  // backgroundColor: '#328E6E',
  margin: '0.1rem auto',
});

export const CardFrontImage = styled('div')(() => ({
  // backgroundColor: '#FEBA17',
  margin: '0.5rem auto',
  width: '80%',
  height: '40%',
  border: '0.1rem solid #fff',
  borderRadius: '0.3rem',
  overflow: 'hidden',
  alignContent: 'center',
}));

export const FrontImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
}));

export const CardFrontTitle = styled('h4')(() => ({
  backgroundColor: '#5b6880',
  margin: '0.2rem auto',
  width: '85%',
  textAlign: 'right',
  textJustify: 'inter-word',
  overflow: 'hidden',
  borderRadius: '0.3rem',
}));

export const CardFrontSubTitle = styled('h6')(() => ({
  backgroundColor: '#5b6880',
  fontSize: '0.6rem',
  margin: '0.4rem auto',
  padding: '0.2rem',
  width: '85%',
  textAlign: 'right',
  textJustify: 'inter-word',
  overflow: 'hidden',
  borderRadius: '0.3rem',
}));

export const CardFrontDescription = styled('h6')(() => ({
  backgroundColor: '#5b6880',
  fontsize: '0.2rem',
  margin: '0.2rem auto',
  width: '85%',
  textAlign: 'right',
  textJustify: 'inter-word',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  borderRadius: '0.3rem',
  padding: '0.2rem 0.2rem 0rem 0.2rem',
}));

export {
  DeckContainer,
  Area,
  DeckCard,
  DeckArea,
  // DeckCardCustom,
  DeckBox,
  BoxColumn,
  InputRange,
  InputText,
  InputButton,
  OptionRange,
};
