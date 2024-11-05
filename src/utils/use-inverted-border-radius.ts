import { useEffect } from 'react';

// Revert to using the deprecated name
import { useDeprecatedInvertedScale as useInvertedScale, useMotionValue, useAnimation } from 'framer-motion';
/**
 * Avoid the stretch/squashing of border radius by using inverting them
 * throughout the component's layout transition.
 * in mobile mode from rounded to square for full-screen panels, by passing
 * the calculated inverted transform to `layoutTransition` when set as a function.
 *
 * Those inverted scales could be provided here to act as a `from` value,
 * then we can use Popcorn's `mix` function to get our
 *
 * @param radius
 */
export function useInvertedBorderRadius(radius: number) {
  const controls = useAnimation();
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const borderRadius = useMotionValue(`${radius}px`);
  const inverted = {
    scaleX: useMotionValue(1 / scaleX.get()),
    scaleY: useMotionValue(1 / scaleY.get())
  };

  useEffect(() => {
    controls.start({ x: scaleX, y: scaleY });
  }, [controls, scaleX, scaleY]);

  useEffect(() => {

    function updateRadius() {
      const latestX = inverted.scaleX.get();
      const latestY = inverted.scaleY.get();
      const xRadius = latestX * radius + 'px';
      const yRadius = latestY * radius + 'px';

      borderRadius.set(`${xRadius} ${yRadius}`);
    }

    const unsubscribeX = scaleX.on("change",updateRadius);
    const unsubscribeY = scaleY.on("change",updateRadius);

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [radius, scaleX, scaleY, borderRadius]);

  return borderRadius;
}