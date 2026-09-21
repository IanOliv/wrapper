import { NAMES, TEXTS } from './constants';
import type { CardFace } from './types';

/**
 * A card's face is derived entirely from its id (`0x1`, `0x2`, ...) — there is
 * no separate card database, so any id is always renderable.
 */
function faceOf(id: string): CardFace {
  const n = parseInt(id.replace('0x', ''), 16) || 1;

  return {
    name: NAMES[(n - 1) % NAMES.length],
    cost: (n % 3) + 1,
    atk: (n % 4) + 1,
    hp: (n % 5) + 2,
    text: TEXTS[(n - 1) % TEXTS.length],
  };
}

export { faceOf };
