import type { Enemy } from './types';

/** Base (unscaled) card size in px. Everything else scales off this. */
const CARD_W = 132;
const CARD_H = 186;
const GAP = 16;
const COLS = 5;
const ROWS = 6;
const ENEMY_ROWS = 2;

/** Widget breakpoint, measured against the component's own box, not the viewport. */
const NARROW = 1100;

const TEXTS = [
  'Alveja um inimigo. Dobra o dano se ele já estiver ferido.',
  'Ao entrar em campo, empurra o alvo uma linha para trás.',
  'Enquanto estiver no campo, absorve o primeiro golpe do turno.',
  'Compra uma carta ao ser jogada. Descarta ao fim do turno.',
  'Atinge todos os inimigos na mesma coluna.',
  'Ganha +1 de atk por carta descartada neste turno.',
];

const NAMES = [
  'Sentinela',
  'Eco',
  'Fenda',
  'Ruína',
  'Vigília',
  'Marca',
  'Guarda',
  'Arqueira',
  'Cinza',
  'Presságio',
  'Limiar',
  'Vigia',
];

const INITIAL_FOES: Omit<Enemy, 'status' | 'acted'>[] = [
  { id: 'e1', name: 'Carniçal', atk: 3, hp: 8, maxHp: 8, intent: 2, row: 1, col: 2 },
  { id: 'e2', name: 'Vigia', atk: 1, hp: 4, maxHp: 4, intent: 1, row: 1, col: 3 },
  { id: 'e3', name: 'Bruxo', atk: 5, hp: 2, maxHp: 6, intent: 5, row: 1, col: 4 },
  { id: 'e4', name: 'Aríete', atk: 4, hp: 12, maxHp: 12, intent: 4, row: 2, col: 2 },
];

/** Move duration default (also the debug-drawer slider's max). */
const DEFAULT_MOVE_MS = 1200;
const FLIP_EASING = 'cubic-bezier(.22,.9,.26,1)';
const FLOAT_MS = 600;
const PULSE_MS = 150;
const DRAWER_MS = 200;
const HINT_S = 2;

export {
  CARD_H,
  CARD_W,
  COLS,
  DEFAULT_MOVE_MS,
  DRAWER_MS,
  ENEMY_ROWS,
  FLIP_EASING,
  FLOAT_MS,
  GAP,
  HINT_S,
  INITIAL_FOES,
  NAMES,
  NARROW,
  PULSE_MS,
  ROWS,
  TEXTS,
};
