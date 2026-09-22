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

export interface ScalarPosition {
  initial: number;
  scalar: number;
  metric: string;
}

export interface InputAttributeProps {
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

export interface AttributeMatrix {
  [name: string]: AttributeDetailsProps;
}
export interface AttributeDetailsProps {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  metric?: string;
}

const dropPosition = { positionH: '5.2%', positionV: '0%' };

const footerPosition = { positionH: '5.2%', positionV: '0%' };

const deckSpawn = { positionH: '5.2%', positionV: '0%' };

const shopSpawn = { positionH: '5.2%', positionV: '0%' };

const discardSpwan = {};

export function InputAttribute(props: InputAttributeProps) {
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
      <InputText>{name}</InputText>
      <br />
    </span>
  );
}

export interface SelectionOption {
  value: string;
  label: string;
}

export interface SelectionAttributeProps {
  id?: string;
  name?: string;
  hasDefault?: boolean;
  values: SelectionOption[];
  onchange: (event: string) => void;
}

export function SelectionAttribute(props: SelectionAttributeProps) {
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

export default { SelectionAttribute, InputAttribute };
