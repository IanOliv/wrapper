/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import Card from './card';
import {
  AttributeDetailsProps,
  AttributeMatrix,
  InputAttribute as InputAtribute,
  SelectionAttribute,
  SelectionOption,
} from './inputs';
// import { min, values, values } from 'lodash';
import {
  Area,
  BoxColumn,
  DeckArea,
  DeckBox,
  DeckCard,
  DeckCardFront,
  DeckContainer,
  InputButton,
  InputRange,
  InputText,
  LabelRange,
  OptionRange,
  SelectionRange,
  SpanRange,
} from './styled';
import { functionPosition, renderAnimations, scaleAnimation } from './utils';

interface ScalarPosition {
  initial: number;
  scalar: number;
  metric: string;
}

// const functionPosition = (index: number, scalarPosition: ScalarPosition) => {
//   return `${scalarPosition.initial + scalarPosition.scalar * index}${scalarPosition.metric}`;
// };

interface Animation {
  [name: string]: any;
}

const cardDetailsExample = {
  cardName: 'cardeDetailsExample',
  cardDescription: 'cardeDetailsExample fdsfd  fsdf fd',
  cardImage: 'http://localhost:5173/assets/iso.jpg',
  cardAttack1: 'cardeDetailsExample',
  cardAttack2: 'cardeDetailsExample',
};

function Item() {
  const [attributeMatrix, setAttributeMatrix] = useState({
    left: {
      value: 2.6,
      min: 0,
      max: 8,
      step: 0.05,
    } as AttributeDetailsProps,
    top: {
      value: 0,
      min: 0,
      max: 9,
      step: 0.05,
    } as AttributeDetailsProps,
    qnt: {
      value: 1,
      // value: 9,
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
      min: -2,
      max: 92,
      step: 1,
    } as AttributeDetailsProps,
    positionV: {
      value: 0,
      min: -6,
      max: 77,
      step: 1,
    } as AttributeDetailsProps,
    // positionH: {
    //   value: 0,
    //   min: -5,
    //   max: 5,
    //   step: 0.5,
    // } as AttributeDetailsProps,
    // positionV: {
    //   value: 0,
    //   min: -5,
    //   max: 5,
    //   step: 0.5,
    // } as AttributeDetailsProps,
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
    { value: 'ambiant', label: 'ambiant' },
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
  const [selection, setSelection] = useState<number[]>([]);

  const animation = renderAnimations(scaleAnimation);

  const dPosition = [];
  const totalPosition = qnt;

  // for (let i = 0; i < totalPosition; i++) {
  //   // console.log(functionPosition(i, scalarPosition));
  //   console.log(functionPosition(totalPosition - i, { initial: 1, scalar: 0.5, metric: '%' }));
  //   dPosition.push({
  //     left: functionPosition( i, { initial: positionH, scalar: left, metric: '%' }),
  //     top: functionPosition( i, { initial: positionV, scalar: top, metric: '%' }),
  //   });
  // }

  for (let i = 0; i < totalPosition; i++) {
    // console.log(functionPosition(i, scalarPosition));
    console.log(functionPosition(totalPosition - i, { initial: 1, scalar: 0.5, metric: '%' }));
    dPosition.push({
      left: functionPosition(i, { initial: positionH, scalar: left, metric: '%' }),
      top: functionPosition(i, { initial: positionV, scalar: top, metric: '%' }),
    });
  }

  console.log(JSON.stringify(dPosition));

  return (
    <DeckContainer>
      <Area>
        <DeckBox>
          <BoxColumn>
            {/* <span> */}
            {/* <InputAtribute
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
            /> */}
            {/* <InputAtribute
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
            /> */}
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
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  left: { ...attributeMatrix.positionV, value: 0 },
                })
              }
            >
              reset left
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  left: { ...attributeMatrix.positionV, value: 2.6 },
                })
              }
            >
              set left
            </InputButton>
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
            <SpanRange> positionH : {positionH}</SpanRange>
            <SpanRange> positionV : {positionV}</SpanRange>
          </BoxColumn>
          <BoxColumn>
            {/* <span> */}
            <SpanRange> left : {left}</SpanRange>
            <SpanRange> top : {top}</SpanRange>
            <SpanRange> qnt : {qnt}</SpanRange>
            <SpanRange> scale : {scale}</SpanRange>
            <SpanRange> duration : {duration}</SpanRange>
          </BoxColumn>
          <BoxColumn>
            {/* <span> */}
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionV: { ...attributeMatrix.positionV, value: -6 },
                  positionH: { ...attributeMatrix.positionH, value: -2 },
                })
              }
            >
              Drop Position
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionV: { ...attributeMatrix.positionV, value: 77 },
                  positionH: { ...attributeMatrix.positionH, value: 92 },
                })
              }
            >
              footerPosition
            </InputButton>
            <br />
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionV: { ...attributeMatrix.positionV, value: 40 },
                  positionH: { ...attributeMatrix.positionH, value: 14 },
                })
              }
            >
              DeckSpawn
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionV: { ...attributeMatrix.positionV, value: 40 },
                  positionH: { ...attributeMatrix.positionH, value: 60 },
                })
              }
            >
              shopSpawn
            </InputButton>
            <br />
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  positionV: { ...attributeMatrix.positionV, value: 40 },
                  positionH: { ...attributeMatrix.positionH, value: 76 },
                })
              }
            >
              discardSpawn
            </InputButton>
            <br />
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 1.2 },
                })
              }
            >
              bigger
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 0.5 },
                })
              }
            >
              smaller
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 1 },
                })
              }
            >
              normal
            </InputButton>
            <br />
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 1.2 },
                })
              }
            >
              open deck
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 0.5 },
                })
              }
            >
              smaller
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 1 },
                })
              }
            >
              normal
            </InputButton>
            <br />
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 1.2 },
                })
              }
            >
              bigger
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 0.5 },
                })
              }
            >
              smaller
            </InputButton>
            <InputButton
              onClick={() =>
                setAttributeMatrix({
                  ...attributeMatrix,
                  scale: { ...attributeMatrix.scale, value: 1 },
                })
              }
            >
              normal
            </InputButton>
          </BoxColumn>
        </DeckBox>
        <DeckArea>
          {dPosition.map((item, index) => (
            <Card
              key={index}
              cardDetails={cardDetailsExample}
              // left={`${positionH}%`}
              // top={`${positionV}%`}
              left={item.left}
              top={item.top}
              // left={`${item.left}%`}
              // top={`${item.top}%`}
              duration={duration}
              scale={scale}
              animation={animationOption}
              animationEasingFunction={animationEasingFunction}
              keyframes={animation}
              isSelected={selection.includes(index)}
              onClick={() => {
                if (selection.includes(index)) {
                  const filtredSelection = selection.filter((num) => num !== index);
                  setSelection([...filtredSelection]);
                } else {
                  setSelection([...selection, index]);
                }
              }}
            />
          ))}
        </DeckArea>
      </Area>
      {/* <DeckCardCustom/> */}
    </DeckContainer>
  );
}

export default Item;
