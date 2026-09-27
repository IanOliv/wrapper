import type { DeckBoardState, Phase } from './types';

function phaseOf(state: DeckBoardState): Phase {
  if (state.hp <= 0) return 'lost';
  if (state.enemies.length === 0) return 'won';
  if (state.turn === 1 && !state.cards.some((c) => c.zone === 'board')) return 'setup';

  return 'playing';
}

export { phaseOf };
