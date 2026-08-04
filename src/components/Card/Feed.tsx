import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { AnimatePresence } from 'framer-motion';

import routes from '@/routes';
import { Pages } from '@/routes/types';

import Card from './Card';
import Detail from './Detail';
import cards from './data';
import useScrollLock from './useScrollLock';

const ALL = 'All';

// Card grid on the page ground: 24px gaps on desktop, 16px on mobile. The page
// heading is the module's own — the shell already says which module you're in.
function Feed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(cards.map((card) => card.category)))],
    [],
  );

  const visible = filter === ALL ? cards : cards.filter((card) => card.category === filter);
  const selected = cards.find((card) => card.id === id);

  // the feed must not slide around behind the centred detail
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollLock(rootRef, Boolean(selected));

  return (
    <Box ref={rootRef}>
      <Typography variant="h1">Feed</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {cards.length} cards · updated 4 min ago
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3, mb: 3 }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            variant="outlined"
            clickable
            onClick={() => setFilter(category)}
            sx={
              category === filter
                ? {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    backgroundColor: (theme) => theme.shell.tint,
                  }
                : undefined
            }
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
          alignItems: 'start',
        }}
      >
        {visible.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </Box>

      <AnimatePresence>
        {selected && (
          <Detail
            key={selected.id}
            card={selected}
            onClose={() => navigate(routes[Pages.Card].path)}
          />
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Feed;
