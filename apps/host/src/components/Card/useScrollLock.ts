import { RefObject, useEffect } from 'react';

/** The nearest ancestor that actually scrolls — in this app, the shell's `<main>`. */
function findScrollParent(node: HTMLElement | null): HTMLElement | null {
  let element = node?.parentElement ?? null;

  while (element) {
    const { overflowY } = getComputedStyle(element);
    if (overflowY === 'auto' || overflowY === 'scroll') return element;
    element = element.parentElement;
  }

  return null;
}

/**
 * Freeze the surface the module sits on while a modal is open.
 *
 * MUI's own scroll lock only knows about `document.body`, and this shell scrolls
 * an inner `<main>` instead — so without this the feed slides around behind the
 * centred detail. The element is found by walking up from the module's own root
 * rather than by querying for shell chrome, so the module never has to know what
 * the shell's layout looks like.
 */
function useScrollLock(ref: RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scroller = findScrollParent(ref.current);
    if (!scroller) return;

    const previous = scroller.style.overflow;
    scroller.style.overflow = 'hidden';

    return () => {
      scroller.style.overflow = previous;
    };
  }, [ref, active]);
}

export default useScrollLock;
