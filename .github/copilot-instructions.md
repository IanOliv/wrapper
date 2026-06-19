# Wrapper - React PWA Project

## Architecture Overview

This is a React 18 Progressive Web App (PWA) built with **Vite**, using **TypeScript**, **MUI v5**, and **Recoil** for state management. The app uses a split-chunk architecture where `main.tsx` loads `Root.tsx` (providers) and `App.tsx` (structure) in parallel via `Promise.all` for optimal performance.

### Core Provider Chain
```tsx
StrictMode → RecoilRoot → HelmetProvider → ThemeProvider → App
```

App structure: `<Notifications /> + <HotKeys /> + <SW /> + <BrowserRouter><Header /><Sidebar /><Pages /></BrowserRouter>`

## Critical Conventions

### Path Aliases
- **Always use `@/` imports** for src files: `import { config } from '@/config'`
- Configured in `tsconfig.json` and `vite.config.ts`

### Async Component Loading
All page components use **`asyncComponentLoader`** from `@/utils/loader`:
```ts
// In src/routes/index.ts
[Pages.Welcome]: {
  component: asyncComponentLoader(() => import('@/pages/Card')),
  path: '/',
  title: 'Welcome',
  icon: HomeIcon,
}
```
The loader implements:
- **Delayed fallback** (300ms) - prevents loader flicker for fast loads
- **Minimum loading time** (700ms) - ensures loader doesn't blink when shown
- Uses `React.Suspense` + `React.lazy` + performance timing

### State Management (Recoil)
All global state lives in `src/store/` with a consistent pattern:
```ts
// Pattern: [state, actions] tuple
const [theme, actions] = useTheme();
const [isOpen, actions] = useSidebar();
const [notifications, actions] = useNotifications();
```

State modules include: `theme`, `sidebar`, `notifications`, `hotkeys`, `session`, `beerPong`

**Atom effects pattern** for localStorage sync:
```ts
const themeModeState = atom({
  key: 'theme-mode-state',
  default: 'dark' as Themes,
  effects: [synchronizeWithLocalStorage], // Custom effect syncs to localStorage
});
```

### Routing & Navigation
- Routes defined in `src/routes/index.ts` as a `Routes` object indexed by `Pages` enum
- Route components lazily loaded with `asyncComponentLoader`
- Dynamic routing uses `useParams()`: `/card/:id` 
- `<Pages />` component in `src/routes/Pages/` renders all routes

### Styling Approach
Three styling methods coexist:
1. **MUI `sx` prop** for theme-aware inline styles
2. **`styled()` from `@mui/system`** for component-scoped styles (see `src/components/styled.ts`)
3. **Plain CSS** for complex animations (e.g., `src/components/Card/styles.css`)

Common styled components: `FullSizeCenteredFlexBox`, `FlexBox` from `@/components/styled`

### Error Handling
- **`withErrorHandler(Component, Fallback)` HOC** wraps components for error boundaries
- Main App wrapped: `export default withErrorHandler(App, AppErrorBoundaryFallback);`
- Fallbacks in `src/error-handling/fallbacks/` (App, Loader)
- Custom messages in `src/config/index.ts`

### Notifications System
Uses **notistack** with custom Recoil store integration:
```ts
const [, actions] = useNotifications();
actions.push({ message: 'Hello', options: { variant: 'success' } });
actions.close(key);
```
- `<Notifier />` component syncs Recoil state with notistack
- Config in `src/config/index.ts` → `notifications` object

### Hot Keys
Keyboard shortcuts via `react-hotkeys-hook`:
- `alt+s` - Toggle sidebar
- `alt+t` - Toggle theme
- `alt+/` - Show hot keys dialog

Registered in `src/sections/HotKeys/HotKeys.tsx` using `useHotkeys()`

## Development Workflow

### Available Commands
```bash
npm run dev       # Start dev server (Vite)
npm run build     # TypeScript check + Vite build
npm run preview   # Preview production build
```

### Code Quality
- **Prettier** with import sorting (`@trivago/prettier-plugin-sort-imports`)
- Import order: React → MUI → 3rd party → `@/*` → relative
- **ESLint** with React, TypeScript, and hooks rules
- **Husky + lint-staged** - pre-commit formatting/linting on staged files
- Rule: No deep MUI imports (`'@mui/*/*/*'` forbidden)

### TypeScript
- Strict mode enabled
- `baseUrl: "./"` with `@/*` paths mapping to `src/*`
- Target: `ESNext`, JSX: `react-jsx`

### Component Patterns
- **Barrel exports**: Each folder has `index.ts` re-exporting default
- **Types in separate files**: `types.ts` alongside implementation
- **Functional components only** - no class components
- **Memo** used selectively (e.g., `ContentPlaceholder`)

## Project-Specific Notes

### PWA Configuration
- **vite-plugin-pwa** with custom `manifest.json`
- Service Worker in `src/sections/SW/` handles update notifications
- Dev mode SW disabled by default (`devOptions.enabled: false`)

### Theme System
Two themes (dark/light) in `src/theme/themes.ts`:
- Custom MUI theme extensions with `deepmerge`
- Stored in localStorage via Recoil atom effect
- Access via `useTheme()` hook

### Mobile Detection
`src/utils/is-mobile.ts` exports boolean (not a function) - import directly:
```ts
import isMobile from '@/utils/is-mobile';
```

### Animation Library
**Framer Motion** used for card animations and transitions:
- Spring configs in `src/components/Card/animations.ts`
- Custom scroll constraints in `src/utils/use-scroll-constraints.ts`

### Configuration Central
All app constants in `src/config/index.ts`:
- Messages, email, repository URL
- Loader timing (delay, minimumLoading)
- Notification defaults

## Adding New Features

### New Page
1. Create component in `src/pages/YourPage/`
2. Add to `Pages` enum in `src/routes/types.ts`
3. Add route in `src/routes/index.ts` with `asyncComponentLoader`
4. Icon from `@mui/icons-material`

### New Global State
1. Create `src/store/yourFeature/index.ts` with Recoil atom
2. Export custom hook: `function useYourFeature(): [State, Actions]`
3. Add types in `src/store/yourFeature/types.ts`
4. Use atom effects for persistence if needed

### New Styled Component
Add to `src/components/styled.ts` using MUI's `styled()` API - keeps reusable styles centralized.
