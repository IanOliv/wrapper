import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { Bell, CaretRight, MapTrifold, ShieldCheck } from '@phosphor-icons/react';

import { Mono } from '@/components/styled';

import Thumb from './Thumb';
import { you } from './data';
import { accent, border, success, surface, text } from './tokens';
import type { ARfitiActions, Piece } from './types';

type ProfileProps = {
  pieces: Piece[];
  actions: ARfitiActions;
};

const SETTINGS = [
  { label: 'Location accuracy', icon: MapTrifold },
  { label: 'Notifications', icon: Bell },
  { label: 'Privacy', icon: ShieldCheck },
];

/**
 * The sheet pulled all the way up. Not a route — the map is still mounted and
 * still behind it, so closing the profile is a drag, not a navigation.
 */
function Profile({ pieces, actions }: ProfileProps) {
  const claimed = pieces.filter((piece) => piece.state === 'claimed');

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        px: '14px',
        pb: '16px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', py: '10px' }}>
        <Box
          aria-hidden
          sx={{
            width: 48,
            height: 48,
            flex: 'none',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: accent.tint,
            color: accent.light,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {you.initials}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {you.name}
          </Typography>
          <Mono sx={{ fontSize: 12, color: text.secondary }}>{you.handle}</Mono>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            px: '8px',
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            fontSize: 11,
            color: success.main,
            boxShadow: `inset 0 0 0 1px ${success.border}`,
          }}
        >
          {claimed.length} claimed
        </Box>
      </Box>

      <Typography
        variant="overline"
        sx={{ display: 'block', color: text.meta, mt: '8px', mb: '8px' }}
      >
        Your collection
      </Typography>

      {claimed.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
          {claimed.map((piece) => (
            <ButtonBase
              key={piece.id}
              onClick={() => actions.select(piece.id)}
              sx={{
                display: 'block',
                textAlign: 'left',
                borderRadius: '10px',
                p: '8px',
                minWidth: 0,
                backgroundColor: surface.card,
                boxShadow: `inset 0 0 0 1px ${border.subtle}`,
                '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
              }}
            >
              <Thumb piece={piece} height={72} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: text.primary,
                  mt: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {piece.title}
              </Typography>
              <Typography sx={{ fontSize: 11, color: text.meta }}>{piece.author}</Typography>
            </ButtonBase>
          ))}
        </Box>
      ) : (
        <Typography sx={{ fontSize: 12, color: text.meta }}>
          Nothing claimed yet. Scan a piece to start the collection.
        </Typography>
      )}

      <Typography
        variant="overline"
        sx={{ display: 'block', color: text.meta, mt: '20px', mb: '8px' }}
      >
        Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {SETTINGS.map(({ label, icon: Icon }) => (
          <ButtonBase
            key={label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              height: 40,
              px: '10px',
              borderRadius: '8px',
              color: text.primary,
              '&:hover': { backgroundColor: surface.card },
              '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
            }}
          >
            <Icon size={16} color={text.secondary} aria-hidden />
            <Typography sx={{ fontSize: 13, flex: 1, textAlign: 'left' }}>{label}</Typography>
            <CaretRight size={14} color={text.meta} aria-hidden />
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
}

export default Profile;
