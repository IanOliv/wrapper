import { faceOf } from './face';
import { isEnemyZone, slotId } from './geometry';
import type { DeckBoardState, SlotId } from './types';

/** One reason at a time, checked in the order the spec fixes. */
function validate(state: DeckBoardState, id: string, slot: SlotId): string | null {
  const card = state.cards.find((c) => c.id === id);

  if (card && card.zone === 'hand' && faceOf(id).cost > state.energy) return 'energia insuficiente';

  const occupied =
    state.cards.some((c) => c.zone === 'board' && c.slot === slot) ||
    state.enemies.some((e) => slotId(e.row, e.col) === slot);

  if (occupied) return 'slot ocupado';
  if (isEnemyZone(slot)) return 'fora da sua zona';
  if (state.enemyTurn) return 'não é seu turno';

  return null;
}

function canDrop(state: DeckBoardState, slot: SlotId): boolean {
  if (isEnemyZone(slot)) return false;

  const taken = state.cards.some((c) => c.zone === 'board' && c.slot === slot);
  const foe = state.enemies.some((e) => slotId(e.row, e.col) === slot);

  return !taken && !foe;
}

export { canDrop, validate };
