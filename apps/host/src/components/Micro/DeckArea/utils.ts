/* eslint-disable @typescript-eslint/no-explicit-any */
import { AttributeDetailsProps, ScalarPosition } from './inputs';

export const functionPosition = (index: number, scalarPosition: ScalarPosition) => {
  return `${scalarPosition.initial + scalarPosition.scalar * index}${scalarPosition.metric}`;
};

export const functionARCPosition = (index: number, scalarPosition: ScalarPosition) => {
  // const COUNT = 9
  // const rotateConstant = 0.25 * COUNT / 2;
  // const rotateOffset = 1 * COUNT / 2;

  // const translateConstant = 5;
  // const translateOffest = 50;

  return `${scalarPosition.initial + scalarPosition.scalar * index}${scalarPosition.metric}`;
};

export const deckCardPosition = [
  { left: '2.5%', top: '6%' },
  { left: '2.2%', top: '5%' },
  { left: '1.9%', top: '4%' },
  { left: '1.6%', top: '3%' },
  { left: '1.3%', top: '2%' },
  { left: '1%', top: '1%' },
];

export const scalarPosition = {
  initial: 1,
  scalar: 0.5,
  metric: '%',
};

export const scalarTopPosition = {
  initial: 9,
  scalar: 0.5,
  metric: '%',
};

export const scalarLeftPosition = {
  initial: 1,
  scalar: 0.5,
  metric: '%',
};

// const scaleAnimation = {
//   '15': 1,
//   '14': 1.1,
//   '13': 1.2,
//   '12': 1.3,
//   '11': 1.4,
//   '10': 1.5,
// }
export const scaleAnimation = {
  '0': 0.9,
  '15': 1,
  // '20': 0.9,
  // '25': 1,
  // '30': 0.9,
  // '35': 1,
  // '40': 0.9,
  // '60': 0.9,
  '100': 0.9,
};

interface Animation {
  [key: string]: {
    transform: string;
  };
}

export const renderAnimations = (object: any) => {
  const keys = Object.keys(object);
  const values = Object.values(object);
  const amina: Animation = {};
  keys.map((key, index) => {
    amina[`${key}%`] = { transform: `scale(${values[index]})` };
  });

  return amina;
};

export const calculateTransform = (position: number) => {
  const COUNT = 11;
  const rotateConstant = (0.25 * COUNT) / 2;
  const rotateOffset = (1 * COUNT) / 2;

  const translateConstant = 5;
  const translateOffest = 50;
  const rotate = rotateConstant * position - rotateOffset;
  const translate =
    position > COUNT / 2
      ? translateConstant * position
      : -translateConstant * position + translateOffest;
  return {
    rotate,
    translate,
  };
};

// export const generateTransform = (rotate: number, translate: number) => {
//   return `rotate(${rotate}deg) translate(0, ${translate}px)`;
// };

// export const generateAnimationCss = (animation: string, duration: number) => {
//   return;
// };

export const defaultValues = {
  positionH: {
    value: 0,
    min: -50,
    max: 100,
    step: 5,
  } as AttributeDetailsProps,
  positionV: {
    value: 0,
    min: -25,
    max: 100,
    step: 5,
  } as AttributeDetailsProps,
};

// const NeonDeoxysValues = {
//   positionH: {
//     value: 0,
//     min: -2,
//     max: 92,
//     step: 1,
//   } as AttributeDetailsProps,
//   positionV: {
//     value: 0,
//     min: -6,
//     max: 77,
//     step: 1,
//   } as AttributeDetailsProps,
// };
// const BreakFastValues = {
//   positionH: {
//     value: 0,
//     min: -9,
//     max: 66,
//     step: 1,
//   } as AttributeDetailsProps,
//   positionV: {
//     value: 0,
//     min: -7,
//     max: 74,
//     step: 1,
//   } as AttributeDetailsProps,
// };

// const BismutTortoiseValues = {
//   positionH: {
//     value: 0,
//     min: -3,
//     max: 87,
//     step: 1,
//   } as AttributeDetailsProps,
//   positionV: {
//     value: 0,
//     min: -7,
//     max: 70,
//     step: 1,
//   } as AttributeDetailsProps,
// };

// // default points
// const pointsInCommon = {
//   dropPosition: {
//     positionV: -6,
//     positionH: -2,
//   },
//   deckSpawn: {
//     positionV: 40,
//     positionH: 14,
//   },
//   footerPosition: {
//     positionV: 77,
//     positionH: 92,
//   },

//   shopSpawn: {
//     positionV: 40,
//     positionH: 60,
//   },
//   discardSpawn: {
//     positionV: 40,
//     positionH: 76,
//   },
// };
