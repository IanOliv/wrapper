import type { Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

import Item from './Item';
import type { UserProfile } from './types';

type ExposedChatProps = {
  // Passed by the host so this remote's styled() components (which read
  // theme.shell.*) get a real theme — sharing @mui/material itself as a
  // federation singleton hits a circular-init bug in this Rollup/Vite setup,
  // so the theme travels as a plain prop instead. Omit when this remote is
  // already wrapped in a compatible ThemeProvider (see ../App.tsx).
  theme?: Theme;
  // Same reasoning as `theme` — Recoil isn't a true singleton across the
  // federation boundary either, so host app state (the logged-in user's
  // profile) travels as a prop too. See apps/host/src/pages/Chat/Chat.tsx.
  userProfile?: UserProfile;
};

function ExposedChat({ theme, userProfile }: ExposedChatProps) {
  if (!theme) return <Item userProfile={userProfile} />;

  return (
    <ThemeProvider theme={theme}>
      <Item userProfile={userProfile} />
    </ThemeProvider>
  );
}

export default ExposedChat;
