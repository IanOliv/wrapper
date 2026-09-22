type Zone = 'pile' | 'hand' | 'board' | 'discard';

/** `r{row}c{col}`, 1-indexed on both axes. */
type SlotId = string;

interface CardEntity {
  id: string;
  zone: Zone;
  slot?: SlotId;
  /** discard-order stamp — registry order is not discard recency */
  seq?: number;
}

type EnemyStatus = 'idle' | 'damaged' | 'defeated';

interface Enemy {
  id: string;
  name: string;
  atk: number;
  hp: number;
  maxHp: number;
  intent: number;
  row: number;
  col: number;
  status: EnemyStatus;
  acted: boolean;
}

type Phase = 'setup' | 'playing' | 'won' | 'lost';

interface LogEntry {
  id: number;
  turn: number;
  actor: string;
  target?: string;
  amount?: number;
  kind: 'play' | 'hit';
}

interface FloatEntity {
  key: number;
  x: number;
  y: number;
  text: string;
  fg: string;
}

interface FocusedSlot {
  row: number;
  col: number;
}

interface DraggingState {
  cardId: string;
  originIndex: number;
  targetSlot: SlotId | null;
  nearest?: SlotId | null;
}

interface LungeState {
  id: string;
}

interface EnemyTurnState {
  activeIndex: number;
  total: number;
}

interface InvalidHint {
  slot: SlotId;
  reason: string;
}

interface AimLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Snapshot {
  cards: CardEntity[];
  enemies: Enemy[];
  hp: number;
  energy: number;
  log: LogEntry[];
  taken: number;
  kills: number;
}

interface CardFace {
  name: string;
  cost: number;
  atk: number;
  hp: number;
  text: string;
}

interface DeckBoardState {
  cards: CardEntity[];
  enemies: Enemy[];
  scale: number;
  moveMs: number;
  isDebug: boolean;
  reach: number;
  reachX: number;
  reachY: number;
  reachDiag: number;
  selectedId: string | null;
  debugOpen: boolean;
  lunge: LungeState | null;
  turn: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  /** turn number the HUD hp bar last pulsed for, so it fires once per hit */
  hpHitTurn: number | null;
  hovered: string | null;
  previewId: string | null;
  log: LogEntry[];
  floats: FloatEntity[];
  logOpen: boolean;
  taken: number;
  kills: number;
  pillHover: boolean;
  dragging: DraggingState | null;
  handScroll: number;
  soundEnabled: boolean | null;
  volume: number;
  focusedSlot: FocusedSlot | null;
  enemyTurn: EnemyTurnState | null;
  invalidHint: InvalidHint | null;
  undoStack: Snapshot[];
  aim: AimLine | null;
  /** container width, measured via ResizeObserver on the root — a widget
   *  breakpoint, not a viewport one */
  width: number | null;
}

interface DeckBoardTunables {
  pileCount?: number;
  handCount?: number;
  scale?: number;
  moveMs?: number;
  reach?: number;
  reachX?: number;
  reachY?: number;
  reachDiag?: number;
  isDebug?: boolean;
}

export type {
  AimLine,
  CardEntity,
  CardFace,
  DeckBoardState,
  DeckBoardTunables,
  DraggingState,
  Enemy,
  EnemyStatus,
  EnemyTurnState,
  FloatEntity,
  FocusedSlot,
  InvalidHint,
  LogEntry,
  LungeState,
  Phase,
  Snapshot,
  SlotId,
  Zone,
};
