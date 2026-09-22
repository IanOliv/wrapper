import Box from '@mui/material/Box';

import { FlexBox } from '@/components/styled';

import { BipolarSlider, Readout, Slider } from './styled';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** already formatted — the row shows the value, it does not decide its shape */
  display: string;
  /** fills from the centre rather than from the left, for signed values */
  bipolar?: boolean;
  onChange: (value: number) => void;
}

/**
 * The inspector's one repeated unit: a 12px label with its live value
 * right-aligned in mono, above the track. The value is shown where it is set,
 * which is what lets the old "left : 2.6 / top : 0" readout block disappear.
 */
function SliderRow({ label, value, min, max, step, display, bipolar, onChange }: SliderRowProps) {
  // Where the fill starts and stops, as a fraction of the track.
  const span = max - min || 1;
  const at = (value - min) / span;
  const origin = bipolar ? (0 - min) / span : 0;
  const [from, to] = at >= origin ? [origin, at] : [at, origin];

  const Track = bipolar ? BipolarSlider : Slider;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <FlexBox sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
        <Box component="span" sx={{ fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {label}
        </Box>
        <Readout sx={{ color: 'text.primary' }}>{display}</Readout>
      </FlexBox>

      <Box sx={{ position: 'relative', display: 'flex' }}>
        {bipolar && (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: '50%',
              left: `${from * 100}%`,
              width: `${Math.max(0, to - from) * 100}%`,
              height: 3,
              marginTop: '-1.5px',
              borderRadius: 999,
              backgroundColor: theme.palette.primary.main,
              pointerEvents: 'none',
            })}
          />
        )}
        <Track
          size="small"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(_, next) => onChange(next as number)}
          aria-label={label}
          // the mono value above already reads the number out loud
          valueLabelDisplay="off"
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
}

export default SliderRow;
