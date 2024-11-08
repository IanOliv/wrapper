import * as React from 'react';

import { motion, useMotionValue } from 'framer-motion';

import { closeSpring } from './animations';

interface ImageProps {
  // id: string;
  isSelected: boolean;
  pointOfInterest?: number;
  backgroundColor?: string;
}

export const Image: React.FC<ImageProps> = ({
  isSelected,
  pointOfInterest = 0,
  backgroundColor,
}) => {
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  // const inverted = useInvertedScale();

  return (
    <motion.div
      className="card-image-container"
      style={{ scaleY, scaleX, backgroundColor, originX: 0, originY: 0 }}
    >
      <motion.img
        className="card-image"
        // src={`images/${id}.jpg`}
        alt=""
        initial={false}
        animate={isSelected ? { x: -20, y: -20 } : { x: -pointOfInterest, y: 0 }}
        transition={closeSpring}
      />
    </motion.div>
  );
};
