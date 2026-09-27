import { useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import KeyCap from '@/components/KeyCap';

import { PaletteRow } from './styled';
import type { RowProps } from './types';

// The selected row is marked three ways — tinted ground, a 2px accent mark and a
// filled icon — so it survives a colorblind user and a dimmed screen.
function Row({ scored, selected, onSelect, onHover }: RowProps) {
  const { item, range } = scored;
  const Icon = item.icon;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <PaletteRow
      ref={ref}
      selected={selected}
      onClick={onSelect}
      onMouseMove={onHover}
      role="option"
      aria-selected={selected}
    >
      <Icon size={17} weight={selected ? 'fill' : 'regular'} />

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography component="div" noWrap sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {/* Matched substrings are tinted and underlined, not bolded —
              bolding reflows the row as you type. */}
          {range ? (
            <>
              {item.label.slice(0, range[0])}
              <Box
                component="span"
                sx={{ color: 'primary.main', textDecoration: 'underline', textUnderlineOffset: 2 }}
              >
                {item.label.slice(range[0], range[1])}
              </Box>
              {item.label.slice(range[1])}
            </>
          ) : (
            item.label
          )}
        </Typography>
        {item.description && (
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {item.description}
          </Typography>
        )}
      </Box>

      {item.keys && (
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {item.keys.map((key) => (
            <KeyCap key={key}>{key}</KeyCap>
          ))}
        </Box>
      )}
    </PaletteRow>
  );
}

export default Row;
