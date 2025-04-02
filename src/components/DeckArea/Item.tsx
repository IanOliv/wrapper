/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

// import { min, values, values } from 'lodash';
import {
  Area,
  BoxColumn,
  DeckBox,
  DeckCard,
  DeckContainer,
  InputRange,
  InputText,
  LabelRange,
  OptionRange,
  SelectionRange,
  SpanRange,
} from './styled';

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
  [name: string]: any;
}

//

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

const generateAnimationCss = (animation: string, duration: number) => {
  return;
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
      <br />
    </span>
  );
}

interface SelectionOption {
  value: string;
  label: string;
}

interface SelectionAttributeProps {
  id?: string;
  name?: string;
  hasDefault?: boolean;
  values: SelectionOption[];
  onchange: (event: string) => void;
}

function SelectionAttribute(props: SelectionAttributeProps) {
  const { id, name, values: valueRaw, onchange, hasDefault } = props;
  const values = [
    { value: '', label: 'Please choose an option' },
    ...valueRaw,
  ] as unknown as SelectionOption[];

  return (
    <SpanRange>
      <LabelRange htmlFor={id}>Choose a {name ?? 'option'}:</LabelRange>

      <SelectionRange name={name} id={id} onChange={(event) => onchange(event.target.value)}>
        {values
          ?.filter((item) => (!hasDefault ? true : item.value != ''))
          .map((item, index) => (
            <OptionRange key={index} value={item.value}>
              {item.label}
            </OptionRange>
          ))}
      </SelectionRange>
    </SpanRange>
  );
}

function Item() {
  // const [top, setTop] = useState(1);
  // const [left, setLeft] = useState(2);
  // const [qnt, setQnt] = useState(6);
  // const [scale, setScale] = useState(1);

  const [attributeMatrix, setAttributeMatrix] = useState({
    left: {
      value: 3.2,
      min: 0,
      max: 11,
      step: 0.05,
    } as AttributeDetailsProps,
    top: {
      value: 0,
      min: 0,
      max: 11,
      step: 0.05,
    } as AttributeDetailsProps,
    qnt: {
      value: 9,
      min: 0,
      max: 15,
      step: 1,
    } as AttributeDetailsProps,
    scale: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
    } as AttributeDetailsProps,
    duration: {
      value: 1,
      min: 0,
      max: 15,
      step: 1,
    } as AttributeDetailsProps,
    positionH: {
      value: 0,
      min: -5,
      max: 5,
      step: 0.5,
    } as AttributeDetailsProps,
    positionV: {
      value: 0,
      min: -5,
      max: 5,
      step: 0.5,
    } as AttributeDetailsProps,
  } as AttributeMatrix);

  const {
    left: { value: left, min: leftMin, max: leftMax, step: leftStep },
    top: { value: top, min: topMin, max: topMax, step: topStep },
    qnt: { value: qnt, min: qntMin, max: qntMax, step: qntStep },
    scale: { value: scale, min: scaleMin, max: scaleMax, step: scaleStep },
    duration: { value: duration, min: durationMin, max: durationMax, step: durationStep },
    positionH: { value: positionH, min: positionHMin, max: positionHMax, step: positionHStep },
    positionV: { value: positionV, min: positionVMin, max: positionVMax, step: positionVStep },
  } = attributeMatrix;

  const valuesAnimation = [
    { value: 'breathing', label: 'breathing' },
  ] as unknown as SelectionOption[];

  const valuesEasingFunction = [
    { value: 'ease-out', label: 'ease-out' },
    { value: 'ease-in', label: 'ease-in' },
    { value: 'ease-in-out', label: 'ease-in-out' },
    { value: 'linear', label: 'linear' },
  ] as unknown as SelectionOption[];

  const [animationOption, setAnimationOption] = useState('');
  const [animationEasingFunction, setAnimationEasingFunction] = useState('');
  const [animationIterationCount, setAnimationIterationCount] = useState('');

  const animation = renderAnimaitons(scaleAnimation);

  const dPosition = [];
  const totalPosition = qnt;

  for (let i = 0; i < totalPosition; i++) {
    // console.log(functionPosition(i, scalarPosition));
    console.log(functionPosition(totalPosition - i, { initial: 1, scalar: 0.5, metric: '%' }));
    dPosition.push({
      left: functionPosition(totalPosition - i, { initial: 2, scalar: left, metric: '%' }),
      top: functionPosition(totalPosition - i, { initial: 25, scalar: top, metric: '%' }),
    });
  }

  return (
    <DeckContainer>
      <Area>
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
              min={leftMin}
              max={leftMax}
              step={leftStep}
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
              min={topMin}
              max={topMax}
              step={topStep}
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
              min={qntMin}
              max={qntMax}
              step={qntStep}
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
              min={scaleMin}
              max={scaleMax}
              step={scaleStep}
              value={scale}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: +value },
                })
              }
            />
            <InputAtribute
              name="duration"
              min={durationMin}
              max={durationMax}
              step={durationStep}
              value={duration}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  duration: { ...attributeMatrix.duration, value: +value },
                })
              }
            />
          </BoxColumn>
          <BoxColumn>
            <SelectionAttribute
              name="animation"
              onchange={(value) => setAnimationOption(value)}
              values={valuesAnimation}
            />
            <SelectionAttribute
              name="easing function"
              onchange={(value) => setAnimationEasingFunction(value)}
              values={valuesEasingFunction}
            />
            {/* <SelectionAttribute
              name='animation Iteration'
              onchange={(value) => setAnimationIterationCount(value)}
              values={animationIterationCount}
            />             */}
          </BoxColumn>
          <BoxColumn>
            {/* <span> */}
            <InputAtribute
              name="positionH"
              min={positionHMin}
              max={positionHMax}
              step={positionHStep}
              value={positionH}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionH: { ...attributeMatrix.positionH, value: +value },
                })
              }
            />
            <InputAtribute
              name="positionV"
              min={positionVMin}
              max={positionVMax}
              step={positionVStep}
              value={positionV}
              onchange={(value) =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionV: { ...attributeMatrix.positionV, value: +value },
                })
              }
            />
          </BoxColumn>
        </DeckBox>

        {dPosition.map((item, index) => (
          <DeckCard
            key={index}
            left={item.left}
            top={item.top}
            duration={duration}
            scale={scale}
            animation={animationOption}
            animationEasingFunction={animationEasingFunction}
            // animation={animationOption}
            // transform={generateTransform(
            //   calculateTransform(index, qnt).rotate,
            //   calculateTransform(index, qnt).translate,
            // )}
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
