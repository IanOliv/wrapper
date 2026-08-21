import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { Theme } from '@mui/material/styles';

import { ArrowSquareDown, CaretDown, SlidersHorizontal } from '@phosphor-icons/react';

import { FlexBox } from '@/components/styled';

import SliderRow from './SliderRow';
import { animationOptions } from './animations';
import { GroupLabel, InspectorGroup, InspectorPanel, Readout } from './styled';
import type { AttributeName, DeckAttributes } from './types';
import { dropPosition, easingOptions, format, seconds, spawnPoints, workbench } from './utils';

interface InspectorProps {
  attributes: DeckAttributes;
  animation: string;
  easing: string;
  count: number;
  onAttribute: (name: AttributeName, value: number) => void;
  onAnimation: (value: string) => void;
  onEasing: (value: string) => void;
  onResetTransform: () => void;
  onSetLeft: () => void;
  onSpawn: (positionH: number, positionV: number) => void;
}

/** A 32px select on the page ground; accent border plus a halo when focused. */
const selectSx = (theme: Theme) => ({
  height: 32,
  fontSize: 12,
  backgroundColor: theme.palette.background.default,
  '& .MuiSelect-select': { paddingBlock: 0, paddingInline: '10px' },
  '& .MuiSelect-icon': { right: 10, color: workbench(theme).muted, fontSize: 13 },
  '&.Mui-focused': { boxShadow: workbench(theme).selectFocusRing },
});

/** The half-width and 2×2 grid buttons: secondary, elevation 1, hairline edge. */
const secondaryButtonSx = (theme: Theme) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
  backgroundColor: theme.shell.surface.level1,
  borderColor: theme.shell.border.card,
});

function Inspector({
  attributes,
  animation,
  easing,
  count,
  onAttribute,
  onAnimation,
  onEasing,
  onResetTransform,
  onSetLeft,
  onSpawn,
}: InspectorProps) {
  const { qnt, scale, duration, positionH, positionV } = attributes;

  return (
    <InspectorPanel>
      <FlexBox
        sx={(theme) => ({
          alignItems: 'center',
          gap: 1,
          padding: '13px 16px',
          borderBottom: `1px solid ${theme.shell.border.subtle}`,
        })}
      >
        <Box component={SlidersHorizontal} size={15} sx={{ color: 'primary.main' }} />
        <Box component="span" sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
          Inspector
        </Box>
        <Readout
          sx={(theme) => ({
            marginLeft: 'auto',
            fontSize: 10,
            border: `1px solid ${theme.shell.border.card}`,
            borderRadius: '3px',
            padding: '1px 5px',
            flex: 'none',
          })}
        >
          {count} {count === 1 ? 'card' : 'cards'}
        </Readout>
      </FlexBox>

      <InspectorGroup>
        <GroupLabel>Transform</GroupLabel>
        <SliderRow
          label="Scale"
          attribute={scale}
          display={format(scale.value, 2)}
          onChange={(value) => onAttribute('scale', value)}
        />
        <SliderRow
          label="Position H"
          attribute={positionH}
          display={format(positionH.value)}
          onChange={(value) => onAttribute('positionH', value)}
        />
        <SliderRow
          label="Position V"
          attribute={positionV}
          display={format(positionV.value)}
          onChange={(value) => onAttribute('positionV', value)}
        />
        <FlexBox sx={{ gap: 1 }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="inherit"
            onClick={onResetTransform}
            sx={secondaryButtonSx}
          >
            Reset
          </Button>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="inherit"
            onClick={onSetLeft}
            sx={secondaryButtonSx}
          >
            Set left
          </Button>
        </FlexBox>
      </InspectorGroup>

      <InspectorGroup>
        <GroupLabel>Motion</GroupLabel>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Animation
          </Box>
          <Select
            value={animation}
            onChange={(event) => onAnimation(event.target.value)}
            IconComponent={CaretDown}
            inputProps={{ 'aria-label': 'Animation' }}
            sx={selectSx}
          >
            {animationOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Easing
          </Box>
          <Select
            value={easing}
            onChange={(event) => onEasing(event.target.value)}
            IconComponent={CaretDown}
            inputProps={{ 'aria-label': 'Easing' }}
            sx={selectSx}
          >
            {easingOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <SliderRow
          label="Duration"
          attribute={duration}
          display={seconds(duration.value)}
          onChange={(value) => onAttribute('duration', value)}
        />
      </InspectorGroup>

      {/* Last in the panel on purpose — these jump the card somewhere else, and
          they should not sit next to the sliders being scrubbed. */}
      <InspectorGroup sx={{ gap: 1.25 }}>
        <GroupLabel>Spawn</GroupLabel>
        <SliderRow
          label="Quantity"
          attribute={qnt}
          display={String(Math.round(qnt.value))}
          onChange={(value) => onAttribute('qnt', value)}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '7px' }}>
          {spawnPoints.map((point) => (
            <Button
              key={point.label}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => onSpawn(point.positionH, point.positionV)}
              sx={(theme) => ({ ...secondaryButtonSx(theme), minHeight: 30 })}
            >
              {point.label}
            </Button>
          ))}
        </Box>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<ArrowSquareDown size={14} />}
          onClick={() => onSpawn(dropPosition.positionH, dropPosition.positionV)}
          sx={{ fontSize: 12, minHeight: 32 }}
        >
          {dropPosition.label}
        </Button>
      </InspectorGroup>
    </InspectorPanel>
  );
}

export default Inspector;
