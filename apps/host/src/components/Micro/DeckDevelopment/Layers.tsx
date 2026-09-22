import { MouseEvent } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import {
  CaretDown,
  CaretRight,
  Circle,
  Eye,
  EyeSlash,
  Plus,
  Rectangle,
  StackSimple,
} from '@phosphor-icons/react';

import { FlexBox } from '@/components/styled';

import { layerPresets } from './animations';
import { childrenOf, groupLayers } from './model';
import type { Action } from './reducer';
import { GroupLabel, LayerRow, Panel, PanelHeader, PanelTitle, PresetChip } from './styled';
import type { Layer, WorkbenchState } from './types';

interface LayersProps {
  state: WorkbenchState;
  dispatch: (action: Action) => void;
}

/**
 * The left column. Structure only: what exists, what is visible, and which
 * layers the inspector and timeline are talking about.
 */
function Layers({ state, dispatch }: LayersProps) {
  const { doc, selection, view } = state;
  const soloing = doc.layers.some((layer) => layer.solo);

  const select = (event: MouseEvent, id: string) => {
    // Shift or ⌘/Ctrl extends, so a preset can land on several cards at once.
    dispatch({
      type: 'select-layers',
      ids: [id],
      additive: event.shiftKey || event.metaKey || event.ctrlKey,
    });
  };

  const renderRow = (layer: Layer, depth: number) => {
    const selected = selection.layerIds.includes(layer.id);
    const children = childrenOf(doc, layer.id);
    const isGroup = children.length > 0 || layer.parentId === null;

    return (
      <Box key={layer.id}>
        <LayerRow
          selected={selected}
          depth={depth}
          onClick={(event) => select(event, layer.id)}
          aria-pressed={selected}
        >
          {isGroup ? (
            <Box
              component="span"
              role="button"
              tabIndex={-1}
              aria-label={layer.collapsed ? 'Expand group' : 'Collapse group'}
              onClick={(event) => {
                event.stopPropagation();
                dispatch({ type: 'toggle-collapsed', id: layer.id });
              }}
              sx={{ display: 'grid', placeItems: 'center', flexShrink: 0, cursor: 'pointer' }}
            >
              {layer.collapsed ? <CaretRight size={12} /> : <CaretDown size={12} />}
            </Box>
          ) : (
            <Box component="span" sx={{ width: 12, flexShrink: 0 }} />
          )}

          {isGroup ? (
            <StackSimple size={14} weight={selected ? 'fill' : 'regular'} />
          ) : (
            <Rectangle size={14} weight={selected ? 'fill' : 'regular'} />
          )}

          <Box
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {layer.name}
          </Box>

          {/* Solo before the eye: it is the stronger statement of the two. */}
          <Tooltip title={layer.solo ? 'Unsolo' : 'Solo'} arrow>
            <Box
              component="span"
              role="button"
              tabIndex={-1}
              aria-label={layer.solo ? 'Unsolo layer' : 'Solo layer'}
              onClick={(event) => {
                event.stopPropagation();
                dispatch({ type: 'toggle-solo', id: layer.id });
              }}
              sx={{
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                color: (theme) =>
                  layer.solo ? theme.palette.warning.main : theme.palette.text.disabled,
              }}
            >
              <Circle size={11} weight={layer.solo ? 'fill' : 'regular'} />
            </Box>
          </Tooltip>

          <Box
            component="span"
            role="button"
            tabIndex={-1}
            aria-label={layer.hidden ? 'Show layer' : 'Hide layer'}
            onClick={(event) => {
              event.stopPropagation();
              dispatch({ type: 'toggle-hidden', id: layer.id });
            }}
            sx={{
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              opacity: soloing && !layer.solo ? 0.4 : 1,
            }}
          >
            {layer.hidden ? <EyeSlash size={13} /> : <Eye size={13} />}
          </Box>
        </LayerRow>

        {!layer.collapsed && children.map((child) => renderRow(child, depth + 1))}
      </Box>
    );
  };

  return (
    <Panel
      sx={{ gridArea: 'layers', borderRight: (theme) => `1px solid ${theme.shell.border.subtle}` }}
    >
      <PanelHeader>
        <Box component={StackSimple} size={15} sx={{ color: 'primary.main', flexShrink: 0 }} />
        <PanelTitle>Layers</PanelTitle>
        <Tooltip title="Add a card" arrow>
          <Box
            component="button"
            type="button"
            aria-label="Add a card"
            onClick={() => dispatch({ type: 'add-layer' })}
            sx={{
              marginLeft: 'auto',
              display: 'grid',
              placeItems: 'center',
              width: 22,
              height: 22,
              flexShrink: 0,
              borderRadius: '4px',
              border: (theme) => `1px solid ${theme.shell.border.card}`,
              backgroundColor: 'transparent',
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <Plus size={12} />
          </Box>
        </Tooltip>
      </PanelHeader>

      <Box
        sx={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}
      >
        {groupLayers(doc).map((group) => renderRow(group, 0))}
      </Box>

      {/* A preset saves the current timeline and reapplies it to any selection. */}
      <Box
        sx={{
          padding: '12px 10px 14px',
          borderTop: (theme) => `1px solid ${theme.shell.border.subtle}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <GroupLabel>Presets</GroupLabel>
        <FlexBox sx={{ flexWrap: 'wrap', gap: '6px' }}>
          {layerPresets.map((preset) => (
            <PresetChip
              key={preset.value}
              className={view.activePreset === preset.value ? 'active' : undefined}
              aria-pressed={view.activePreset === preset.value}
              onClick={() => dispatch({ type: 'apply-preset', value: preset.value })}
            >
              {preset.label}
            </PresetChip>
          ))}
        </FlexBox>
      </Box>
    </Panel>
  );
}

export default Layers;
