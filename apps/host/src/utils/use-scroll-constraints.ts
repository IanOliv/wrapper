import { useEffect, useState } from 'react';

interface Constraints {
  top: number;
  bottom: number;
}

/**
 * Calculate the top/bottom scroll constraints of a full-screen element vs the viewport
 */
interface RefObject {
  current: HTMLElement | null;
}

export function useScrollConstraints(ref: RefObject, measureConstraints: boolean): Constraints {
  const [constraints, setConstraints] = useState<Constraints>({
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (!measureConstraints) return;

    const element = ref.current;
    const viewportHeight = window.innerHeight;
    const contentTop = element ? element.offsetTop : 0;
    const contentHeight = element ? element.offsetHeight : 0;
    const scrollableViewport = viewportHeight - contentTop * 2;
    const top = Math.min(scrollableViewport - contentHeight, 0);

    setConstraints({ top, bottom: 0 });
  }, [measureConstraints, ref]);

  return constraints;
}
