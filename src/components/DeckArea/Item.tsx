/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useRef, useState } from 'react';

import { duration } from '@mui/material';

import { min, values } from 'lodash';

import {
  Area,
  BoxColumn,
  DeckBox,
  DeckCard,
  DeckCardCustom,
  DeckContainer,
  InputRange,
  InputText,
} from './styled';

// const deckCardPosition=[
//   {left:'11%',top:'1%'},
//   {left:'9%' ,top:'1%'},
//   {left:'7%'  ,top:'1%'},
//   {left:'5%' ,top:'1%'},
//   {left:'3%' ,top:'1%'},
//   {left:'1%'  ,top:'1%'},]

// const deckCardPosition=[
//   {left:'11%',top:'6%'},
//   {left:'9%' ,top:'5%'},
//   {left:'7%'  ,top:'4%'},
//   {left:'5%' ,top:'3%'},
//   {left:'3%' ,top:'2%'},
//   {left:'1%'  ,top:'1%'},]

//

// const deckCardPosition = [
//   { left: '3.5%', top: '6%' },
//   { left: '3%', top: '5%' },
//   { left: '2.5%', top: '4%' },
//   { left: '2%', top: '3%' },
//   { left: '1.5%', top: '2%' },
//   { left: '1%', top: '1%' },
// ];

interface ScalarPosition {
  initial: number;
  scalar: number;
  metric: string;
}

const functionPosition = (index: number, scalarPosition: ScalarPosition) => {
  return `${scalarPosition.initial + scalarPosition.scalar * index}${scalarPosition.metric}`;
};

const deckCardPosition = [
  { left: '2.5%', top: '6%' },
  { left: '2.2%', top: '5%' },
  { left: '1.9%', top: '4%' },
  { left: '1.6%', top: '3%' },
  { left: '1.3%', top: '2%' },
  { left: '1%', top: '1%' },
];

const scalarPosition = {
  initial: 1,
  scalar: 0.5,
  metric: '%',
};

const scalarTopPosition = {
  initial: 9,
  scalar: 0.5,
  metric: '%',
};

const scalarLeftPosition = {
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
const scaleAnimation = {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderAnimaitons = (object: any) => {
  const keys = Object.keys(object);
  const values = Object.values(object);
  const amina: Animation = {};
  keys.map((key, index) => {
    amina[`${key}%`] = { transform: `scale(${values[index]})` };
  });

  return amina;
};

const calculateTransform = (position: number, count: number) => {
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

const generateTransform = (rotate: number, translate: number) => {
  return `rotate(${rotate}deg) translate(0, ${translate}px)`;
};

interface InputAtributeProps {
  left?: number;
  top?: number;
  qnt?: number;
  scale?: number;
  onchange: (event: number | string) => void;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
}

// interface AttributeSkeleton {
//   name: string;
//   value: number;
//   min: number;
//   max: number;
//   step: number;
// [key: string]: any;
// }

interface AttributeMatrix {
  [name: string]: AttributeDetailsProps;
}
interface AttributeDetailsProps {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

function InputAtribute(props: InputAtributeProps) {
  const { onchange, name, min, max, step, value } = props;

  return (
    <span>
      <InputRange
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onchange(+event.target.value)}
      />
      <InputText>
        {name}:{value}
      </InputText>
    </span>
  );
}

function Item() {
  // const [top, setTop] = useState(1);
  // const [left, setLeft] = useState(2);
  // const [qnt, setQnt] = useState(6);
  // const [scale, setScale] = useState(1);

  const [attributeMatrix, setAttributeMatrix] = useState({
    left: {
      value: 2,
      min: 0,
      max: 11,
      step: 0.05,
    } as AttributeDetailsProps,
    top: {
      value: 1,
      min: 0,
      max: 11,
      step: 0.05,
    } as AttributeDetailsProps,
    qnt: {
      value: 6,
      min: 0,
      max: 15,
      step: 1,
    } as AttributeDetailsProps,
    scale: {
      value: 1,
      min: 0,
      max: 15,
      step: 1,
    } as AttributeDetailsProps,
    duration: {
      value: 0,
      min: 0,
      max: 15,
      step: 1,
    } as AttributeDetailsProps,
  } as AttributeMatrix);

  const {
    left: { value: left },
    top: { value: top },
    qnt: { value: qnt },
    scale: { value: scale },
    duration: { value: duration },
  } = attributeMatrix;

  const animation = renderAnimaitons(scaleAnimation);

  const dPosition = [];
  const totalPosition = qnt;

  for (let i = 0; i < totalPosition; i++) {
    // console.log(functionPosition(i, scalarPosition));
    console.log(functionPosition(totalPosition - i, { initial: 1, scalar: 0.5, metric: '%' }));
    dPosition.push({
      left: functionPosition(totalPosition - i, { initial: 2, scalar: top, metric: '%' }),
      top: functionPosition(totalPosition - i, { initial: 2, scalar: left, metric: '%' }),
    });
  }

  return (
    <DeckContainer>
      <Area>
        {/* {deckCardPosition
        .map((item,index)=>
            <DeckCard 
              key={index} 
              left={item.left} 
              top={item.top} />)} */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        {/* setAttributeMatrix({...attributeMatrix, left: { ...attributeMatrix.left, value: +value } })         */}
        <DeckBox>
          <BoxColumn>
            {/* <span> */}
            <InputAtribute
              name="left"
              min={0}
              max={11}
              step={0.05}
              value={left}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  left: { ...attributeMatrix.left, value: +value },
                })
              }
            />
            <InputAtribute
              name="top"
              min={0}
              max={11}
              step={0.05}
              value={top}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  top: { ...attributeMatrix.top, value: +value },
                })
              }
            />
            <InputAtribute
              name="qnt"
              min={0}
              max={15}
              step={1}
              value={qnt}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  qnt: { ...attributeMatrix.qnt, value: +value },
                })
              }
            />
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: +value },
                })
              }
            />
          </BoxColumn>
          <BoxColumn>
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) => setScale(+value)}
            />
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) => setScale(+value)}
            />
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) => setScale(+value)}
            />
          </BoxColumn>
          <BoxColumn>
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) => setScale(+value)}
            />
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) => setScale(+value)}
            />
            <InputAtribute
              name="scale"
              min={0}
              max={15}
              step={1}
              value={scale}
              onchange={(value) => setScale(+value)}
            />
          </BoxColumn>
        </DeckBox>

        {dPosition.map((item, index) => (
          <DeckCard
            key={index}
            left={item.left}
            top={item.top}
            duration={scale}
            transform={generateTransform(
              calculateTransform(index, qnt).rotate,
              calculateTransform(index, qnt).translate,
            )}
            // transform='rotate(15deg) translate(0, 1px)'
            keyframes={animation}
          />
        ))}
      </Area>
      {/* <DeckCardCustom/> */}
    </DeckContainer>
  );
}

export default Item;
