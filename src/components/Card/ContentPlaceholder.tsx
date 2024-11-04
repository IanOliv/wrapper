import * as React from 'react';
import { LoremIpsum } from 'react-lorem-ipsum';

import { motion, useDeprecatedInvertedScale } from 'framer-motion';

const ContentPlaceholderComponent = () => {
  const inverted = useDeprecatedInvertedScale();
  return (
    <motion.div className="content-container" style={{ ...inverted, originY: 0, originX: 0 }}>
      <LoremIpsum p={6} avgWordsPerSentence={6} avgSentencesPerParagraph={4} />
      {/* <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum, enim odit, quaerat repellat voluptas numquam sequi eos laboriosam maiores aspernatur dolor pariatur temporibus debitis atque autem, iusto aliquam sunt possimus.

      </p> */}
    </motion.div>
  );
};

ContentPlaceholderComponent.displayName = 'ContentPlaceholder';

export const ContentPlaceholder = React.memo(ContentPlaceholderComponent);