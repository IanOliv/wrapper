import { useTheme } from '@mui/material/styles';

import { motion, useReducedMotion } from 'framer-motion';

import type { ActiveRuleProps } from './types';

// The 2px accent rule *slides* between modules rather than cutting — the shell
// saying "same frame, different room". Under `prefers-reduced-motion` it
// cross-fades instead of sliding.
function ActiveRule({ orientation, layoutId }: ActiveRuleProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();

  const geometry =
    orientation === 'vertical'
      ? { left: 0, top: 8, bottom: 8, width: 2 }
      : { top: 0, left: 12, right: 12, height: 2 };

  return (
    <motion.div
      // sharing a layoutId across items is what makes the rule travel
      layoutId={reduceMotion ? undefined : layoutId}
      initial={reduceMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'absolute',
        borderRadius: 2,
        backgroundColor: theme.palette.primary.main,
        ...geometry,
      }}
    />
  );
}

export default ActiveRule;
