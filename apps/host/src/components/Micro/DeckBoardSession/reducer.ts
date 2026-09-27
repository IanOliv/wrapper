import { DEFAULT_MOVE_MS, INITIAL_FOES } from './constants';
import { faceOf } from './face';
import type {
  CardEntity,
  DeckBoardState,
  DeckBoardTunables,
  Enemy,
  FloatEntity,
  LogEntry,
  Snapshot,
} from './types';

function createInitialCards(pileCount: number, handCount: number): CardEntity[] {
  return [
    ...Array.from({ length: pileCount }, (_, i) => ({ id: '0x' + (i + 1), zone: 'pile' as const })),
    ...Array.from({ length: handCount }, (_, i) => ({
      id: '0x' + (pileCount + i + 1),
      zone: 'hand' as const,
    })),
  ];
}

function createInitialEnemies(): Enemy[] {
  return INITIAL_FOES.map((foe) => ({ ...foe, status: 'idle' as const, acted: false }));
}

/**
 * The demo opens mid-fight (hp under max, one energy already spent) so the HUD's
 * threshold colours and pip states are visible without any input — "Nova
 * partida" resets to a clean full-health game instead.
 */
function createInitialState(tunables: DeckBoardTunables): DeckBoardState {
  return {
    cards: createInitialCards(tunables.pileCount ?? 9, tunables.handCount ?? 0),
    enemies: createInitialEnemies(),
    scale: tunables.scale ?? 0.55,
    moveMs: tunables.moveMs ?? DEFAULT_MOVE_MS,
    isDebug: tunables.isDebug ?? false,
    reach: tunables.reach ?? 2,
    reachX: tunables.reachX ?? 2,
    reachY: tunables.reachY ?? 2,
    reachDiag: tunables.reachDiag ?? 1,
    selectedId: null,
    debugOpen: false,
    lunge: null,
    turn: 1,
    hp: 18,
    maxHp: 25,
    energy: 3,
    maxEnergy: 5,
    hpHitTurn: null,
    hovered: null,
    previewId: null,
    log: [],
    floats: [],
    logOpen: false,
    taken: 0,
    kills: 0,
    pillHover: false,
    dragging: null,
    handScroll: 0,
    soundEnabled: null,
    volume: 0.6,
    focusedSlot: null,
    enemyTurn: null,
    invalidHint: null,
    undoStack: [],
    aim: null,
    width: null,
  };
}

function snapshotOf(state: DeckBoardState): Snapshot {
  return {
    cards: state.cards.map((c) => ({ ...c })),
    enemies: state.enemies.map((e) => ({ ...e })),
    hp: state.hp,
    energy: state.energy,
    log: state.log.slice(),
    taken: state.taken,
    kills: state.kills,
  };
}

type Action =
  | { type: 'patch'; value: Partial<DeckBoardState> }
  | { type: 'draw' }
  | { type: 'place'; id: string; slot: string; logId: number }
  | { type: 'discard'; id: string; seq: number }
  | { type: 'to-hand'; id: string }
  | { type: 'attack-start'; attackerId: string }
  | { type: 'attack-clear-lunge' }
  | {
      type: 'attack-mark-damaged';
      foeId: string;
      logId: number;
      attackerName: string;
      foeName: string;
      atk: number;
    }
  | { type: 'attack-apply-hit'; foeId: string; atk: number }
  | { type: 'remove-defeated'; foeId: string }
  | { type: 'end-turn-start'; total: number }
  | {
      type: 'enemy-act';
      foeId: string;
      foeName: string;
      index: number;
      total: number;
      damage: number;
      logId: number;
    }
  | { type: 'finish-turn' }
  | { type: 'skip-enemy-turn'; pending: { foeName: string; damage: number; logId: number }[] }
  | { type: 'undo' }
  | { type: 'new-game'; cards: CardEntity[]; enemies: Enemy[] }
  | { type: 'add-float'; float: FloatEntity }
  | { type: 'remove-float'; key: number };

function reducer(state: DeckBoardState, action: Action): DeckBoardState {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.value };

    case 'draw': {
      const pile = state.cards.filter((c) => c.zone === 'pile');
      const top = pile[pile.length - 1];

      if (!top) return state;

      return {
        ...state,
        cards: state.cards.map((c) => (c.id === top.id ? { id: c.id, zone: 'hand' } : c)),
      };
    }

    case 'discard': {
      if (!state.cards.some((c) => c.id === action.id)) return state;

      return {
        ...state,
        selectedId: null,
        cards: state.cards.map((c) =>
          c.id === action.id ? { id: c.id, zone: 'discard', seq: action.seq } : c,
        ),
      };
    }

    case 'to-hand': {
      if (!state.cards.some((c) => c.id === action.id)) return state;

      return {
        ...state,
        cards: state.cards.map((c) => (c.id === action.id ? { id: c.id, zone: 'hand' } : c)),
      };
    }

    case 'place': {
      const moving = state.cards.find((c) => c.id === action.id);

      if (!moving) return state;
      if (state.cards.some((c) => c.zone === 'board' && c.slot === action.slot)) return state;

      const fromHand = moving.zone === 'hand';
      const face = faceOf(action.id);
      const energy = fromHand ? Math.max(0, state.energy - face.cost) : state.energy;
      const log: LogEntry[] = fromHand
        ? [...state.log, { id: action.logId, turn: state.turn, actor: face.name, kind: 'play' }]
        : state.log;

      return {
        ...state,
        undoStack: [...state.undoStack, snapshotOf(state)].slice(-20),
        energy,
        log,
        selectedId: null,
        cards: state.cards.map((c) =>
          c.id === action.id ? { id: c.id, zone: 'board', slot: action.slot } : c,
        ),
      };
    }

    case 'attack-start':
      return { ...state, selectedId: null, lunge: { id: action.attackerId } };

    case 'attack-clear-lunge':
      return { ...state, lunge: null };

    case 'attack-mark-damaged':
      return {
        ...state,
        enemies: state.enemies.map((e) =>
          e.id === action.foeId ? { ...e, status: 'damaged' } : e,
        ),
        log: [
          ...state.log,
          {
            id: action.logId,
            turn: state.turn,
            actor: action.attackerName,
            target: action.foeName,
            amount: action.atk,
            kind: 'hit',
          },
        ],
      };

    case 'attack-apply-hit':
      return {
        ...state,
        enemies: state.enemies.map((e) => {
          if (e.id !== action.foeId) return e;
          const hp = Math.max(0, e.hp - action.atk);

          return { ...e, hp, status: hp === 0 ? 'defeated' : 'idle' };
        }),
      };

    case 'remove-defeated': {
      const gone = state.enemies.some((e) => e.id === action.foeId && e.hp === 0);

      if (!gone) return state;

      return {
        ...state,
        kills: state.kills + 1,
        enemies: state.enemies.filter((e) => e.id !== action.foeId),
      };
    }

    case 'end-turn-start':
      return {
        ...state,
        enemyTurn: { activeIndex: 0, total: action.total },
        undoStack: [],
        selectedId: null,
        focusedSlot: null,
      };

    case 'enemy-act':
      return {
        ...state,
        enemyTurn: { activeIndex: action.index, total: action.total },
        hp: Math.max(0, state.hp - action.damage),
        taken: state.taken + action.damage,
        hpHitTurn: state.turn,
        enemies: state.enemies.map((e) => (e.id === action.foeId ? { ...e, acted: true } : e)),
        log: [
          ...state.log,
          {
            id: action.logId,
            turn: state.turn,
            actor: action.foeName,
            target: 'você',
            amount: action.damage,
            kind: 'hit',
          },
        ],
      };

    case 'finish-turn':
      return {
        ...state,
        turn: state.turn + 1,
        energy: state.maxEnergy,
        selectedId: null,
        enemyTurn: null,
        undoStack: [],
        enemies: state.enemies.map((e) => ({ ...e, acted: false })),
      };

    case 'skip-enemy-turn': {
      const dmg = action.pending.reduce((n, p) => n + p.damage, 0);
      const log = action.pending.reduce<LogEntry[]>(
        (list, p) => [
          ...list,
          {
            id: p.logId,
            turn: state.turn,
            actor: p.foeName,
            target: 'você',
            amount: p.damage,
            kind: 'hit',
          },
        ],
        state.log,
      );

      return { ...state, hp: Math.max(0, state.hp - dmg), taken: state.taken + dmg, log };
    }

    case 'undo': {
      if (!state.undoStack.length || state.enemyTurn) return state;

      const prev = state.undoStack[state.undoStack.length - 1];

      return {
        ...state,
        ...prev,
        undoStack: state.undoStack.slice(0, -1),
        selectedId: null,
        lunge: null,
        invalidHint: null,
      };
    }

    case 'new-game':
      return {
        ...state,
        cards: action.cards,
        enemies: action.enemies,
        selectedId: null,
        lunge: null,
        turn: 1,
        hp: 25,
        maxHp: 25,
        energy: 5,
        maxEnergy: 5,
        taken: 0,
        kills: 0,
        log: [],
        floats: [],
        logOpen: false,
        aim: null,
        dragging: null,
      };

    case 'add-float':
      return { ...state, floats: [...state.floats, action.float] };

    case 'remove-float':
      return { ...state, floats: state.floats.filter((f) => f.key !== action.key) };

    default:
      return state;
  }
}

export { createInitialCards, createInitialEnemies, createInitialState, snapshotOf };
export default reducer;
export type { Action };
