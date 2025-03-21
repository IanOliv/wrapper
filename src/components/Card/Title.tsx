import * as React from 'react';

import { motion, useMotionValue } from 'framer-motion';

import { closeSpring, openSpring } from './animations';

interface TitleProps {
  title: string;
  category: string;
  isSelected: boolean;
}

export const Title: React.FC<TitleProps> = ({ title, category, isSelected }) => {
  // const inverted = useInvertedScale();
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  const x = isSelected ? 30 : 15;
  const y = x;

  return (
    <motion.div
      className="title-container"
      initial={false}
      animate={{ x, y }}
      transition={isSelected ? openSpring : closeSpring}
      transformTemplate={scaleTranslate}
      style={{ scaleY, scaleX, originX: 0, originY: 0 }}
    >
      <span className="category">{category}</span>
      <h2>{title}</h2>
    </motion.div>
  );
};

/**
 * `transform` is order-dependent, so if you scale(0.5) before translateX(100px),
 * the visual translate will only be 50px.
 *
 * The intuitive pattern is to translate before doing things like scale and
 * rotate that will affect the coordinate space. So Framer Motion takes an
const scaleTranslate = ({ x, y, scaleX, scaleY }: { x: number; y: number; scaleX: number; scaleY: number }) =>
 * individually without having to write a whole transform string.
 *
 * However in this component we're doing something novel by inverting
 * the scale of the parent component. Because of this we want to translate
 * through scaled coordinate space, and can use the transformTemplate prop to do so.
 */
const scaleTranslate = ({
  x,
  y,
  scaleX,
  scaleY,
}: {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}) => `scaleX(${scaleX}) scaleY(${scaleY}) translate(${x}, ${y}) translateZ(0)`;
