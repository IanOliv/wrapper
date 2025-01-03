import AddTaskIcon from '@mui/icons-material/AddTask';
// import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';

// import TerrainIcon from '@mui/icons-material/Terrain';
import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Card')),
    path: '/',
    title: 'Welcome',
    icon: HomeIcon,
  },
  [Pages.ARfiti]: {
    component: asyncComponentLoader(() => import('@/pages/ARfiti')),
    path: '/ARfiti',
    title: 'ARfiti',
    icon: GitHubIcon,
  },
  [Pages.Card]: {
    component: asyncComponentLoader(() => import('@/pages/Card')),
    path: '/card',
    title: 'Card',
    icon: AddTaskIcon,
  },
  [Pages.CardDetail]: {
    component: asyncComponentLoader(() => import('@/pages/Card')),
    path: '/card/:id',
    title: 'Card',
    icon: AddTaskIcon,
  },

  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
