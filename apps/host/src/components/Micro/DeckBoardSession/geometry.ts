import { COLS, ENEMY_ROWS, ROWS } from './constants';
import type { SlotId } from './types';

interface RowCol {
  r: number;
  c: number;
}

function slotId(row: number, col: number): SlotId {
  return 'r' + row + 'c' + col;
}

function rc(slot: SlotId | null | undefined): RowCol | null {
  const m = /^r(\d+)c(\d+)$/.exec(slot || '');

  return m ? { r: +m[1], c: +m[2] } : null;
}

function isEnemyZone(slot: SlotId): boolean {
  const a = rc(slot);

  return !!a && a.r <= ENEMY_ROWS;
}

function slotIds(): SlotId[] {
  return Array.from({ length: COLS * ROWS }, (_, i) =>
    slotId(Math.floor(i / COLS) + 1, (i % COLS) + 1),
  );
}

interface Point {
  x: number;
  y: number;
}

function slotXY(slot: SlotId | null | undefined, slotW: number, slotH: number, gap: number): Point {
  const m = rc(slot);

  if (!m) return { x: 0, y: 0 };

  return { x: (m.c - 1) * (slotW + gap), y: (m.r - 1) * (slotH + gap) };
}

interface ReachTunables {
  reach: number;
  reachX: number;
  reachY: number;
  reachDiag: number;
}

/** Legality caps: an overall Chebyshev reach, plus per-axis and diagonal caps. */
function inReach(fromSlot: SlotId | null, slot: SlotId, tunables: ReachTunables): boolean {
  if (!fromSlot) return true;

  const a = rc(fromSlot);
  const b = rc(slot);

  if (!a || !b) return false;

  const dy = Math.abs(a.r - b.r);
  const dx = Math.abs(a.c - b.c);

  if (Math.max(dx, dy) > tunables.reach) return false;
  if (dx && dy) return dx === dy && dx <= tunables.reachDiag;

  return dx ? dx <= tunables.reachX : dy <= tunables.reachY;
}

export { inReach, isEnemyZone, rc, slotId, slotIds, slotXY };
export type { Point, ReachTunables, RowCol };
