import { FLIP_EASING } from './constants';

function cardNode(container: HTMLElement | null, id: string): HTMLElement | null {
  return container?.querySelector<HTMLElement>(`[data-card="${id}"]`) ?? null;
}

interface FlipTimers {
  flip?: ReturnType<typeof setTimeout>;
}

/**
 * FLIP: measure the node's rect before a zone-changing mutation, run the
 * mutation, then on the next frame diff the rects and animate `transform`
 * imperatively on the real node. Ordinary React re-renders can't reliably
 * animate a node whose position changed for structural (zone/index) reasons —
 * the DOM is measured directly instead of trusted to transition on its own.
 */
function flipMove(
  container: HTMLElement | null,
  id: string,
  moveMs: number,
  mutate: () => void,
  timers: FlipTimers,
) {
  const prevRect = cardNode(container, id)?.getBoundingClientRect() ?? null;

  mutate();

  requestAnimationFrame(() => {
    const el = cardNode(container, id);

    if (!prevRect || !el) return;

    const nextRect = el.getBoundingClientRect();
    const dx = Math.round(prevRect.left - nextRect.left);
    const dy = Math.round(prevRect.top - nextRect.top);

    if (!dx && !dy) return;

    // never release to an empty transform — matrix → none is not interpolated
    const authored = el.style.transform || 'translate(0px, 0px)';
    const authoredZ = el.style.zIndex;

    el.style.zIndex = '90';
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px) ${authored}`;
    void el.offsetWidth;
    el.style.transition = `transform ${moveMs}ms ${FLIP_EASING}`;
    el.style.transform = authored;

    clearTimeout(timers.flip);
    timers.flip = setTimeout(() => {
      el.style.transition = '';
      el.style.zIndex = authoredZ;
      el.style.transform = el.style.transform === 'translate(0px, 0px)' ? '' : el.style.transform;
    }, moveMs + 40);
  });
}

export { cardNode, flipMove };
export type { FlipTimers };
