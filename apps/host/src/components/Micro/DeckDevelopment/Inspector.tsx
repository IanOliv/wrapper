import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import type { Theme } from '@mui/material/styles';

import { ArrowSquareDown, Diamond, SlidersHorizontal } from '@phosphor-icons/react';

import { FlexBox } from '@/components/styled';

import BezierEditor from './BezierEditor';
import SliderRow from './SliderRow';
import { animationOptions } from './animations';
import { defaultEasing, easingNameOf, easingOptions } from './bezier';
import { cardLayers, localPoseAt } from './model';
import type { Action } from './reducer';
import {
  Chip,
  Group,
  GroupLabel,
  NumberField,
  Panel,
  PanelHeader,
  PanelTitle,
  Segmented,
  SegmentedButton,
  TagChip,
} from './styled';
import type { Bezier, Repeat, Trigger, WorkbenchState } from './types';
import {
  dropPosition,
  format,
  ranges,
  repeatOptions,
  seconds,
  spawnPoints,
  triggerOptions,
  workbench,
} from './utils';

interface InspectorProps {
  state: WorkbenchState;
  dispatch: (action: Action) => void;
  animation: string;
  onAnimation: (value: string) => void;
}

/** A 32px select on the page ground; accent border plus a halo when focused. */
const selectSx = (theme: Theme) => ({
  height: 32,
  fontSize: 12,
  whiteSpace: 'nowrap',
  backgroundColor: theme.palette.background.default,
  '& .MuiSelect-select': { paddingBlock: 0, paddingInline: '10px' },
  '& .MuiSelect-icon': { right: 10, color: workbench(theme).muted, fontSize: 13 },
  '&.Mui-focused': { boxShadow: workbench(theme).selectFocusRing },
});

/** The half-width and 2×2 grid buttons: secondary, elevation 1, hairline edge. */
const secondaryButtonSx = (theme: Theme) => ({
  fontSize: 12,
  whiteSpace: 'nowrap',
  color: theme.palette.text.secondary,
  backgroundColor: theme.shell.surface.level1,
  borderColor: theme.shell.border.card,
});

function Inspector({ state, dispatch, animation, onAnimation }: InspectorProps) {
  const { doc, selection, view } = state;
  const cards = cardLayers(doc);
  // Any layer can be inspected, groups included — and the pose shown is the
  // layer's own, not the one its group composes it into, so a slider never
  // jumps when you take hold of it.
  const selected = doc.layers.filter((layer) => selection.layerIds.includes(layer.id));
  const anchor = selected[0] ?? cards[0];
  const pose = anchor ? localPoseAt(doc, anchor, doc.playhead) : undefined;

  // The bezier the editor writes to: a chosen segment if there is one, else the
  // curve every new key is born with.
  const editingKey = doc.keys.find((key) => key.id === view.bezierKeyId);
  const easing: Bezier = editingKey?.easing ?? defaultEasing;
  const easingName = easingNameOf(easing);
  const isCustom = easingName === 'custom';

  const setEasing = (bezier: Bezier) => {
    const ids = editingKey ? [editingKey.id] : selection.keyIds;

    dispatch({ type: 'set-easing', bezier, ids: ids.length ? ids : doc.keys.map((key) => key.id) });
  };

  const count = selected.length || 1;
  const noun = selected.every((layer) => layer.parentId !== null) ? 'card' : 'layer';

  if (!anchor || !pose) return <Panel sx={{ gridArea: 'inspector' }} />;

  return (
    <Panel
      sx={(theme) => ({
        gridArea: 'inspector',
        borderLeft: `1px solid ${theme.shell.border.subtle}`,
        [theme.breakpoints.down('md')]: {
          borderLeft: 'none',
          borderTop: `1px solid ${theme.shell.border.subtle}`,
          borderRadius: `${theme.shape.borderRadius * 1.75}px ${
            theme.shape.borderRadius * 1.75
          }px 0 0`,
        },
      })}
    >
      <PanelHeader>
        <Box
          component={SlidersHorizontal}
          size={15}
          sx={{ color: 'primary.main', flexShrink: 0 }}
        />
        <PanelTitle>Inspector</PanelTitle>
        <TagChip sx={{ marginLeft: 'auto' }}>
          {count} {count === 1 ? noun : `${noun}s`}
        </TagChip>
      </PanelHeader>

      <Group>
        <GroupLabel>Transform</GroupLabel>
        <SliderRow
          label="Scale"
          value={pose.scale}
          {...ranges.scale}
          display={format(pose.scale, 2)}
          onChange={(value) => dispatch({ type: 'set-base', property: 'scale', value })}
        />
        <SliderRow
          label="Position H"
          value={pose.position.x}
          {...ranges.positionH}
          display={format(pose.position.x)}
          onChange={(value) =>
            dispatch({
              type: 'set-base',
              property: 'position',
              value: { ...pose.position, x: value },
            })
          }
        />
        <SliderRow
          label="Position V"
          value={pose.position.y}
          {...ranges.positionV}
          display={format(pose.position.y)}
          onChange={(value) =>
            dispatch({
              type: 'set-base',
              property: 'position',
              value: { ...pose.position, y: value },
            })
          }
        />
        <SliderRow
          label="Rotate"
          bipolar
          value={pose.rotate.z}
          {...ranges.rotate}
          display={`${format(pose.rotate.z, 0)}°`}
          onChange={(value) =>
            dispatch({ type: 'set-base', property: 'rotate', value: { ...pose.rotate, z: value } })
          }
        />

        {/* 3D turns the other two axes on rather than showing dead controls. */}
        {view.three && (
          <>
            <SliderRow
              label="Rotate X"
              bipolar
              value={pose.rotate.x}
              {...ranges.rotate}
              display={`${format(pose.rotate.x, 0)}°`}
              onChange={(value) =>
                dispatch({
                  type: 'set-base',
                  property: 'rotate',
                  value: { ...pose.rotate, x: value },
                })
              }
            />
            <SliderRow
              label="Rotate Y"
              bipolar
              value={pose.rotate.y}
              {...ranges.rotate}
              display={`${format(pose.rotate.y, 0)}°`}
              onChange={(value) =>
                dispatch({
                  type: 'set-base',
                  property: 'rotate',
                  value: { ...pose.rotate, y: value },
                })
              }
            />
            <SliderRow
              label="Perspective"
              value={doc.perspective}
              min={200}
              max={2000}
              step={50}
              display={`${Math.round(doc.perspective)}px`}
              onChange={(value) => dispatch({ type: 'set-number', field: 'perspective', value })}
            />
          </>
        )}

        <SliderRow
          label="Opacity"
          value={pose.opacity}
          {...ranges.opacity}
          display={format(pose.opacity, 2)}
          onChange={(value) => dispatch({ type: 'set-base', property: 'opacity', value })}
        />

        <FlexBox sx={{ gap: 1, alignItems: 'stretch' }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => dispatch({ type: 'reset-transform' })}
            sx={secondaryButtonSx}
          >
            Reset
          </Button>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => dispatch({ type: 'set-left' })}
            sx={secondaryButtonSx}
          >
            Set left
          </Button>
          <Tooltip title="Key every property at the playhead" arrow>
            <Chip
              className="accent"
              aria-label="Add a keyframe at the playhead"
              onClick={() => dispatch({ type: 'add-key' })}
              sx={{ width: 28, p: 0, flexShrink: 0 }}
            >
              <Diamond size={13} weight="fill" />
            </Chip>
          </Tooltip>
        </FlexBox>
      </Group>

      <Group>
        <GroupLabel>Motion</GroupLabel>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Animation
          </Box>
          <Select
            value={animation}
            onChange={(event) => onAnimation(event.target.value)}
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
            value={easingName}
            onChange={(event) => {
              const option = easingOptions.find(
                (candidate) => candidate.value === event.target.value,
              );

              // "Custom bezier" keeps whatever the editor already holds.
              if (option?.bezier) setEasing(option.bezier);
            }}
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

        {isCustom && <BezierEditor value={easing} onChange={setEasing} />}

        <SliderRow
          label="Duration"
          value={doc.duration}
          {...ranges.duration}
          display={seconds(doc.duration)}
          onChange={(value) => dispatch({ type: 'set-duration', value })}
        />

        <FlexBox sx={{ gap: 1 }}>
          {(['delay', 'stagger'] as const).map((field) => (
            <Box
              key={field}
              sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}
            >
              <Box
                component="span"
                sx={{ fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}
              >
                {field === 'delay' ? 'Delay' : 'Stagger'}
              </Box>
              <NumberField
                type="number"
                step={0.01}
                min={0}
                value={doc[field]}
                aria-label={field === 'delay' ? 'Delay' : 'Stagger'}
                onChange={(event) =>
                  dispatch({ type: 'set-number', field, value: Number(event.target.value) || 0 })
                }
              />
            </Box>
          ))}
        </FlexBox>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Repeat
          </Box>
          <Segmented>
            {repeatOptions.map((option) => (
              <SegmentedButton
                key={option.value}
                className={doc.repeat === option.value ? 'active' : undefined}
                aria-pressed={doc.repeat === option.value}
                onClick={() => dispatch({ type: 'set-repeat', value: option.value as Repeat })}
              >
                {option.label}
              </SegmentedButton>
            ))}
          </Segmented>
        </Box>

        {/* Preview should match how the animation actually fires in the app. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
            Trigger
          </Box>
          <Select
            value={doc.trigger}
            onChange={(event) =>
              dispatch({ type: 'set-trigger', value: event.target.value as Trigger })
            }
            inputProps={{ 'aria-label': 'Trigger' }}
            sx={selectSx}
          >
            {triggerOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Group>

      {/* Last in the panel on purpose — these jump the card somewhere else, and
          they should not sit next to the sliders being scrubbed. */}
      <Group sx={{ gap: 1.25 }}>
        <GroupLabel>Spawn</GroupLabel>
        <SliderRow
          label="Quantity"
          value={cards.length}
          {...ranges.qnt}
          display={String(cards.length)}
          onChange={(value) => dispatch({ type: 'set-quantity', count: value })}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '7px' }}>
          {spawnPoints.map((point) => (
            <Button
              key={point.label}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() =>
                dispatch({ type: 'spawn', positionH: point.positionH, positionV: point.positionV })
              }
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
          onClick={() =>
            dispatch({
              type: 'spawn',
              positionH: dropPosition.positionH,
              positionV: dropPosition.positionV,
            })
          }
          sx={{ fontSize: 12, minHeight: 32, whiteSpace: 'nowrap' }}
        >
          {dropPosition.label}
        </Button>
      </Group>
    </Panel>
  );
}

export default Inspector;
