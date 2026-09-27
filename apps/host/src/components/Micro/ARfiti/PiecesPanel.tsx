import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { ListBullets, PlusCircle } from '@phosphor-icons/react';

import { Mono } from '@/components/styled';

import PieceRow from './PieceRow';
import { accent, border, surface, text } from './tokens';
import type { ARfitiActions, ARfitiState, Filter } from './types';
import { resolveState } from './utils';

type PiecesPanelProps = {
  state: ARfitiState;
  actions: ARfitiActions;
  /** who owns the filled accent: the sheet row on mobile, the callout on desktop */
  emphasis: 'filled' | 'outlined';
  /** the desktop panel's tighter action row */
  compact: boolean;
};

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unclaimed', label: 'Unclaimed' },
  { value: 'mine', label: 'Mine' },
];

/** The list of pieces. Desktop renders it in the 316px panel, mobile in the sheet. */
function PiecesPanel({ state, actions, emphasis, compact }: PiecesPanelProps) {
  const { visible, selectedId, filter } = state;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          px: '14px',
          pt: '12px',
          pb: '10px',
        }}
      >
        <ListBullets size={15} color={text.secondary} aria-hidden />
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: text.primary, flex: 1 }}>
          Pieces
        </Typography>
        <Mono
          sx={{
            fontSize: 10,
            px: '6px',
            height: 20,
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            color: text.meta,
            boxShadow: `inset 0 0 0 1px ${border.card}`,
          }}
        >
          {visible.length}
        </Mono>
      </Box>

      <Box sx={{ display: 'flex', gap: '6px', px: '14px', pb: '10px', flexWrap: 'wrap' }}>
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;

          return (
            <ButtonBase
              key={value}
              onClick={() => actions.setFilter(value)}
              aria-pressed={active}
              sx={{
                height: 24,
                px: '10px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                fontSize: 12,
                fontWeight: 500,
                backgroundColor: active ? accent.tint : 'transparent',
                color: active ? accent.light : text.secondary,
                boxShadow: active ? 'none' : `inset 0 0 0 1px ${border.subtle}`,
                transition: (theme) =>
                  `background-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
                '&:hover': { backgroundColor: active ? accent.tint : border.subtle },
                '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
              }}
            >
              {label}
            </ButtonBase>
          );
        })}
      </Box>

      {/* the panel scrolls independently of the map */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          px: '14px',
          pb: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {visible.map((piece) => (
          <PieceRow
            key={piece.id}
            piece={piece}
            state={resolveState(piece, selectedId)}
            emphasis={emphasis}
            compact={compact}
            onSelect={actions.select}
            onScan={actions.startScan}
            onRetry={actions.retryInsert}
          />
        ))}

        {!visible.length && (
          <Typography sx={{ fontSize: 12, color: text.meta, px: '2px', py: '12px' }}>
            No pieces here. Try another filter, or drop the first one.
          </Typography>
        )}
      </Box>

      <Box sx={{ p: '12px 14px', boxShadow: `inset 0 1px 0 ${border.subtle}` }}>
        <ButtonBase
          onClick={actions.insert}
          sx={{
            width: '100%',
            height: 34,
            gap: '8px',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            fontSize: 12,
            fontWeight: 500,
            color: accent.main,
            backgroundColor: 'transparent',
            boxShadow: `inset 0 0 0 1px ${accent.main}`,
            '&:hover': { backgroundColor: accent.tint },
            '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
          }}
        >
          <PlusCircle size={15} aria-hidden />
          Insert a piece here
        </ButtonBase>
      </Box>
    </Box>
  );
}

type DesktopPanelProps = PiecesPanelProps;

/** the 316px column on the right of the map */
function DesktopPanel(props: DesktopPanelProps) {
  return (
    <Box
      sx={{
        width: 316,
        flex: 'none',
        minHeight: 0,
        backgroundColor: surface.panel,
        boxShadow: `inset 1px 0 0 ${border.subtle}`,
      }}
    >
      <PiecesPanel {...props} />
    </Box>
  );
}

export { DesktopPanel };
export default PiecesPanel;
