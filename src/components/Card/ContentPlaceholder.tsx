import * as React from 'react';

import { motion, useMotionValue } from 'framer-motion';

import { Base } from '@/components/Base';

interface ContentPlaceholderProps {
  isSelected: boolean;
  isFull: boolean;
}

const ContentPlaceholderComponent = ({ isSelected }: ContentPlaceholderProps) => {
  // const inverted = useDeprecatedInvertedScale();
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  // const className = isSelected ? () : 'content-container';

  return (
    <motion.div
      className={isSelected ? 'content-container-open' : 'content-container'}
      style={{ scaleY, scaleX, originY: 0, originX: 0 }}
    >
      <Base />
    </motion.div>
  );
};

ContentPlaceholderComponent.displayName = 'ContentPlaceholder';

export const ContentPlaceholder = React.memo(ContentPlaceholderComponent);
