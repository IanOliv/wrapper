import { useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {
  ArrowClockwise,
  CheckCircle,
  DotsThree,
  MapPin,
  Scan,
  ShareNetwork,
} from '@phosphor-icons/react';
import { useReducedMotion } from 'framer-motion';

import Thumb from './Thumb';
import { accent, border, pin as pinColor, success, surface, text } from './tokens';
import type { PieceRowProps } from './types';
import { metaFor } from './utils';

/**
 * The one row. Desktop panel and mobile sheet render this same component; what
 * changes between them is `state` and which of them owns the filled accent.
 *
 * Selection is revealed *in place* — the action row appears inside the row that
 * was already there. Nothing routes, nothing replaces the map.
 */
function PieceRow({ piece, state, emphasis, compact, onSelect, onScan, onRetry }: PieceRowProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const selected = state === 'selected';
  const inserting = state === 'inserting';
  const claimed = state === 'claimed';
  const outOfRange = state === 'out-of-range';

  // tapping a pin scrolls its row into view — same `selectedId`, other direction
  useEffect(() => {
    if (!selected) return;

    ref.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced, selected]);

  if (inserting) {
    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          gap: '10px',
          p: '10px',
          borderRadius: '10px',
          boxShadow: `inset 0 0 0 1px ${border.subtle}`,
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            flex: 'none',
            borderRadius: '8px',
            backgroundColor: surface.card,
            backgroundImage: piece.failed
              ? 'none'
              : `linear-gradient(90deg, ${surface.card} 0%, #1E2130 50%, ${surface.card} 100%)`,
            backgroundSize: '200% 100%',
            animation: piece.failed ? 'none' : 'arfiti-shimmer 1.4s ease-in-out infinite',
            boxShadow: piece.failed ? `inset 0 0 0 1px ${pinColor.inserting}` : 'none',
            '@keyframes arfiti-shimmer': {
              from: { backgroundPosition: '150% 0' },
              to: { backgroundPosition: '-50% 0' },
            },
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box
            sx={{
              height: 11,
              width: '68%',
              borderRadius: '4px',
              backgroundColor: surface.card,
            }}
          />
          <Typography sx={{ fontSize: 11, color: piece.failed ? pinColor.inserting : text.meta }}>
            {metaFor(piece)}
          </Typography>

          {piece.failed && (
            <ButtonBase
              onClick={() => onRetry(piece.id)}
              sx={{
                alignSelf: 'flex-start',
                height: 26,
                px: '10px',
                gap: '6px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                fontSize: 12,
                color: text.primary,
                boxShadow: `inset 0 0 0 1px ${border.control}`,
                '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
              }}
            >
              <ArrowClockwise size={13} aria-hidden />
              Retry
            </ButtonBase>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: '10px',
        backgroundColor: selected ? surface.card : 'transparent',
        boxShadow: selected ? `0 0 0 1px ${accent.tint}` : `inset 0 0 0 1px ${border.subtle}`,
        opacity: outOfRange ? 0.6 : 1,
        transition: (theme) =>
          `background-color ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, box-shadow ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
      }}
    >
      <ButtonBase
        onClick={() => onSelect(piece.id)}
        aria-pressed={selected}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          p: '10px',
          borderRadius: '10px',
          textAlign: 'left',
          '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
        }}
      >
        <Thumb piece={piece} width={52} height={52} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            {selected && <MapPin size={13} weight="fill" color={accent.main} aria-hidden />}
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: selected ? 600 : 500,
                color: text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}
            >
              {piece.title}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 11, color: text.meta, mt: '2px' }}>
            {metaFor(piece)}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {piece.author}
          </Typography>
        </Box>

        {claimed && (
          <CheckCircle
            size={18}
            weight="fill"
            color={success.main}
            aria-label="Claimed"
            style={{ flex: 'none' }}
          />
        )}
      </ButtonBase>

      {/* revealed in place — no route change */}
      {selected && !claimed && !outOfRange && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', px: '10px', pb: '10px' }}>
          <ButtonBase
            onClick={onScan}
            sx={{
              flex: 1,
              minWidth: 0,
              height: compact ? 30 : 34,
              gap: '6px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: emphasis === 'filled' ? accent.main : 'transparent',
              color: emphasis === 'filled' ? accent.on : accent.main,
              boxShadow: emphasis === 'filled' ? 'none' : `inset 0 0 0 1px ${accent.main}`,
              '&:hover': {
                backgroundColor: emphasis === 'filled' ? accent.light : accent.tint,
              },
              '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
            }}
          >
            <Scan size={14} weight="fill" aria-hidden />
            {compact ? 'Scan' : 'Scan to claim'}
          </ButtonBase>

          <RowAction label="Share">
            <ShareNetwork size={15} aria-hidden />
          </RowAction>
          <RowAction label="More">
            <DotsThree size={17} aria-hidden />
          </RowAction>
        </Box>
      )}
    </Box>
  );
}

type RowActionProps = {
  label: string;
  children: JSX.Element;
};

function RowAction({ label, children }: RowActionProps) {
  return (
    <IconButton
      aria-label={label}
      sx={{
        width: 30,
        height: 30,
        flex: 'none',
        borderRadius: '8px',
        color: text.secondary,
        boxShadow: `inset 0 0 0 1px ${border.card}`,
        '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
      }}
    >
      {children}
    </IconButton>
  );
}

export default PieceRow;
