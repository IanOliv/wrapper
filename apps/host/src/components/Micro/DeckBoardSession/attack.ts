import { cardNode } from './flip';
import type { Point } from './geometry';

function legMs(moveMs: number): number {
  return Math.max(140, Math.round(moveMs * 0.45));
}

interface LungeTimers {
  lunge?: ReturnType<typeof setTimeout>;
  home?: ReturnType<typeof setTimeout>;
}

/**
 * A single WAAPI keyframe animation on the real node: travel 72% of the way
 * toward the target, hold for impact, travel back. The lunge never touches
 * `cards` state — it's a pure visual round-trip, run entirely off the
 * animation's own clock so a re-render mid-strike can't fight it.
 */
function runLunge(
  container: HTMLElement | null,
  attackerId: string,
  from: Point,
  to: Point,
  moveMs: number,
  timers: LungeTimers,
  onImpact: () => void,
  onFinish: () => void,
) {
  const ms = legMs(moveMs);
  // stop short of the cell, so the hit reads as a strike rather than an overlap
  const x = Math.round(from.x + (to.x - from.x) * 0.72);
  const y = Math.round(from.y + (to.y - from.y) * 0.72);
  const home = `translate(${from.x}px, ${from.y}px)`;
  const strike = `translate(${x}px, ${y}px)`;

  clearTimeout(timers.lunge);
  clearTimeout(timers.home);

  requestAnimationFrame(() => {
    const el = cardNode(container, attackerId);

    if (!el || !el.animate) {
      onImpact();
      timers.home = setTimeout(onFinish, 2 * ms);

      return;
    }

    const anim = el.animate(
      [
        { transform: home, easing: 'cubic-bezier(.3,.7,.2,1)' },
        { transform: strike, offset: 0.5, easing: 'cubic-bezier(.4,0,.5,1)' },
        { transform: home },
      ],
      { duration: 2 * ms },
    );
    const impact = () => {
      timers.lunge = setTimeout(onImpact, ms);
    };

    anim.ready ? anim.ready.then(impact).catch(impact) : impact();
    anim.onfinish = onFinish;
  });
}

export { legMs, runLunge };
export type { LungeTimers };
