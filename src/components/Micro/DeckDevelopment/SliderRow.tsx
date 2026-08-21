import Box from '@mui/material/Box';

import { FlexBox } from '@/components/styled';

import { Readout, Slider } from './styled';
import type { Attribute } from './types';

interface SliderRowProps {
  label: string;
  attribute: Attribute;
  /** already formatted — the row shows the value, it does not decide its shape */
  display: string;
  onChange: (value: number) => void;
}

/**
 * The inspector's one repeated unit: a 12px label with its live value
 * right-aligned in mono, above the track. The value is shown where it is set,
 * which is what lets the old "left : 2.6 / top : 0" readout block disappear.
 */
function SliderRow({ label, attribute, display, onChange }: SliderRowProps) {
  const { value, min, max, step } = attribute;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <FlexBox sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
        <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
          {label}
        </Box>
        <Readout sx={{ color: 'text.primary' }}>{display}</Readout>
      </FlexBox>
      <Slider
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, next) => onChange(next as number)}
        aria-label={label}
        // the mono value above already reads the number out loud
        valueLabelDisplay="off"
      />
    </Box>
  );
}

export default SliderRow;
