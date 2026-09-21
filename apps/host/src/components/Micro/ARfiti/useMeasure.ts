import { useLayoutEffect, useRef, useState } from 'react';

import type { Size } from './types';

/**
 * The frame's own size. The map needs it to count what is in view, the sheet to
 * work out its detents — both are layout facts, not props anyone can pass down.
 */
function useMeasure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

export default useMeasure;
