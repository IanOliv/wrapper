import type { Piece, View } from './types';

// Plausible placeholder content — wire to the real source when there is one.
// Coordinates sit around Largo da Batata, São Paulo; they only have to be a
// consistent little neighbourhood for the projection to have something to draw.

/** where "you" are — the recentre target and the origin of the projection */
const HOME: View = { lat: -23.5678, lng: -46.6935, zoom: 1 };

const pieces: Piece[] = [
  {
    id: 'p1',
    title: 'Wall of hands',
    author: 'nina.spr',
    lat: -23.5671,
    lng: -46.6928,
    distanceM: 18,
    accent: '#7C6BB0',
    state: 'default',
  },
  {
    id: 'p2',
    title: 'Blue dog on the corner',
    author: 'kadu',
    lat: -23.5684,
    lng: -46.6949,
    distanceM: 64,
    accent: '#4E7FA8',
    state: 'default',
  },
  {
    id: 'p3',
    title: 'Tunnel letters, south face',
    author: 'ferro',
    lat: -23.5662,
    lng: -46.6952,
    distanceM: 120,
    accent: '#9A6E52',
    state: 'claimed',
  },
  {
    id: 'p4',
    title: 'Roof antenna piece',
    author: 'mel.two',
    lat: -23.5695,
    lng: -46.6921,
    distanceM: 210,
    accent: '#5F8F76',
    state: 'default',
  },
  {
    id: 'p5',
    title: 'Viaduct throw-up',
    author: 'zed',
    lat: -23.5651,
    lng: -46.6905,
    distanceM: 380,
    accent: '#8C5A6B',
    state: 'out-of-range',
  },
  {
    id: 'p6',
    title: 'Green stairs',
    author: 'nina.spr',
    lat: -23.5702,
    lng: -46.6963,
    distanceM: 440,
    accent: '#6B8C5A',
    state: 'claimed',
  },
  {
    id: 'p7',
    title: 'Old bakery shutter',
    author: 'tato',
    lat: -23.5666,
    lng: -46.6975,
    distanceM: 520,
    accent: '#A8874E',
    state: 'out-of-range',
  },
  {
    id: 'p8',
    title: 'Parking lot mural, east wall',
    author: 'kadu',
    lat: -23.5711,
    lng: -46.6938,
    distanceM: 610,
    accent: '#57708F',
    state: 'default',
  },
];

/** the handle the profile detent shows */
const you = {
  handle: '@ian.oliv',
  name: 'Ian',
  initials: 'IO',
};

export { HOME, pieces, you };
