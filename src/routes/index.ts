import {
  Broadcast,
  Camera,
  Cards,
  ChatTeardropDots,
  Columns,
  SignIn,
  Stack,
  Swatches,
  UserCircle,
  UserPlus,
} from '@phosphor-icons/react';

import asyncComponentLoader from '@/utils/loader';

import { NavGroup, Pages, Routes } from './types';

// Icons are semantic: a broadcast tower for the sensor panel, a camera for the
// camera module. Regular weight for idle, fill for active — see `Rail`/`BottomBar`.
const routes: Routes = {
  [Pages.Card]: {
    component: asyncComponentLoader(() => import('@/pages/Card')),
    path: '/card',
    title: 'Cards',
    icon: Cards,
    group: NavGroup.Modules,
    description: 'The feed',
    aliases: ['home', 'feed', 'deck of cards', 'start'],
  },
  [Pages.SmartToir]: {
    component: asyncComponentLoader(() => import('@/pages/SmartToir')),
    path: '/SmartToir',
    title: 'Sensors',
    icon: Broadcast,
    group: NavGroup.Modules,
    description: 'SmartToir readings',
    aliases: ['smarttoir', 'toir', 'readings', 'telemetry', 'iot'],
  },
  [Pages.Chat]: {
    component: asyncComponentLoader(() => import('@/pages/Chat')),
    path: '/Chat',
    title: 'Chat',
    icon: ChatTeardropDots,
    group: NavGroup.Modules,
    description: 'Conversations',
    aliases: ['messages', 'talk', 'dm'],
  },
  [Pages.ARfiti]: {
    component: asyncComponentLoader(() => import('@/pages/ARfiti')),
    path: '/ARfiti',
    title: 'ARfiti',
    icon: Camera,
    group: NavGroup.Labs,
    experimental: true,
    fullBleed: true,
    description: 'Camera + map · asks for permission',
    aliases: ['ar', 'camera', 'graffiti'],
  },
  [Pages.DeckBoard]: {
    component: asyncComponentLoader(() => import('@/pages/DeckBoard')),
    path: '/Deck',
    title: 'DeckBoard',
    icon: Stack,
    group: NavGroup.Labs,
    experimental: true,
    description: 'Physics playground',
    aliases: ['deck', 'cards physics', 'playground'],
  },
  [Pages.Stage]: {
    component: asyncComponentLoader(() => import('@/pages/Stage')),
    path: '/Stage',
    title: 'Stage',
    icon: Columns,
    group: NavGroup.Labs,
    experimental: true,
    description: 'A column layout test',
    aliases: ['layout', 'columns', 'grid test'],
  },
  [Pages.Profile]: {
    component: asyncComponentLoader(() => import('@/pages/Profile')),
    path: '/Profile',
    title: 'Profile',
    icon: UserCircle,
    group: NavGroup.Account,
    description: 'Your account',
    aliases: ['account', 'me', 'user'],
  },
  [Pages.Login]: {
    component: asyncComponentLoader(() => import('@/pages/Login')),
    path: '/Login',
    title: 'Sign in',
    icon: SignIn,
    group: NavGroup.Account,
    description: 'One shell. Every module.',
    aliases: ['login', 'log in', 'sign on', 'auth'],
  },
  // Register is a link inside Login, not a peer.
  [Pages.Register]: {
    component: asyncComponentLoader(() => import('@/pages/Register')),
    path: '/Register',
    title: 'Create account',
    icon: UserPlus,
    group: NavGroup.Hidden,
    paletteGroup: 'Account',
    aliases: ['register', 'sign up', 'signup', 'join'],
  },
  // A detail state of the feed, reached by tapping a card. The title is what the
  // header reads — you are still in Cards, so it says Cards.
  [Pages.CardDetail]: {
    component: asyncComponentLoader(() => import('@/pages/Card')),
    path: '/card/:id',
    title: 'Cards',
    icon: Cards,
    group: NavGroup.Hidden,
  },
  [Pages.Tokens]: {
    component: asyncComponentLoader(() => import('@/pages/Tokens')),
    path: '/__tokens',
    title: 'Design tokens',
    icon: Swatches,
    group: NavGroup.Hidden,
    paletteGroup: 'Actions',
    devOnly: true,
    description: 'Every token and component state',
    aliases: ['tokens', 'design system', 'palette', 'styleguide'],
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
    group: NavGroup.Hidden,
  },
};

export default routes;
