import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

// Only a cold route mount gets a skeleton, and skeletons match the real layout's
// boxes: a page heading, then a card grid. Shimmer, not spin — spin is reserved
// for indeterminate actions.
function Loading() {
  return (
    <Box sx={{ width: '100%' }} aria-busy aria-label="Loading">
      <Skeleton width={180} height={32} sx={{ mb: 1 }} />
      <Skeleton width={260} height={20} sx={{ mb: 4 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              boxShadow: (theme) => theme.shell.ring[1],
            }}
          >
            <Skeleton variant="rectangular" height={132} sx={{ mb: 2 }} />
            <Skeleton width="75%" height={22} />
            <Skeleton width="45%" height={16} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Loading;
