import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Chat from './Chat';
import { standaloneTheme } from './standalone-theme';

const theme = createTheme(standaloneTheme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: '100vh', padding: 24, boxSizing: 'border-box' }}>
        <Chat userProfile={{ role: 'operator', tenantName: 'Standalone preview' }} />
      </div>
    </ThemeProvider>
  );
}

export default App;
