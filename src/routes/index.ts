import AddTaskIcon from '@mui/icons-material/AddTask';
import BadgeIcon from '@mui/icons-material/Badge';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import HotTubIcon from '@mui/icons-material/HotTub';
import LoginIcon from '@mui/icons-material/Login';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StyleIcon from '@mui/icons-material/Style';
import YardIcon from '@mui/icons-material/Yard';

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
    icon: DashboardIcon,
  },
  [Pages.CardDetail]: {
    component: asyncComponentLoader(() => import('@/pages/Card')),
    path: '/card/:id',
    title: 'Card',
    icon: AddTaskIcon,
  },
  [Pages.DeckBoard]: {
    component: asyncComponentLoader(() => import('@/pages/DeckBoard')),
    path: '/Deck',
    title: 'DeckBoard',
    icon: StyleIcon,
  },
  [Pages.Chat]: {
    component: asyncComponentLoader(() => import('@/pages/Chat')),
    path: '/Chat',
    title: 'Chat',
    icon: QuestionAnswerIcon,
  },
  [Pages.Stage]: {
    component: asyncComponentLoader(() => import('@/pages/Stage')),
    path: '/stage',
    title: 'Stage',
    icon: HotTubIcon,
  },
  [Pages.Login]: {
    component: asyncComponentLoader(() => import('@/pages/Login')),
    path: '/Login',
    title: 'Login',
    icon: LoginIcon,
  },
  [Pages.Register]: {
    component: asyncComponentLoader(() => import('@/pages/Register')),
    path: '/Register',
    title: 'Register',
    icon: LoginIcon,
  },
  [Pages.Profile]: {
    component: asyncComponentLoader(() => import('@/pages/Profile')),
    path: '/Profile',
    title: 'Profile',
    icon: BadgeIcon, // Assuming BadgeIcon is imported from somewhere
  },
  [Pages.SmartToir]: {
    component: asyncComponentLoader(() => import('@/pages/SmartToir')),
    path: '/SmartToir',
    title: 'SmartToir',
    icon: YardIcon,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
