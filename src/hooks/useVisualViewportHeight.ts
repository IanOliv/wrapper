import { useEffect } from 'react';

/**
 * Keeps `--app-height` in sync with `visualViewport.height`.
 *
 * On iOS, focusing an input under an on-screen keyboard doesn't shrink the
 * layout viewport — Safari instead pans the whole page up to keep the caret
 * visible, dragging fixed chrome (header, bottom bar) along with it. Sizing
 * the shell off this variable instead of `100%`/`100dvh` makes it actually
 * shrink to the space above the keyboard, so there's nothing left to pan.
 */
function useVisualViewportHeight() {
  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return undefined;

    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${viewport.height}px`);
    };

    setAppHeight();
    viewport.addEventListener('resize', setAppHeight);

    return () => viewport.removeEventListener('resize', setAppHeight);
  }, []);
}

export default useVisualViewportHeight;
