/* eslint-disable react/prop-types */
import { memo, useRef } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';

import { motion, useMotionValue } from 'framer-motion';

import { useScrollConstraints } from '@/utils/use-scroll-constraints';

import { ContentPlaceholder } from './ContentPlaceholder';
import { Image } from './Image';
import { Title } from './Title';
import { closeSpring, openSpring } from './animations';
import './styles.css';
import { CardData } from './types';

interface Props extends CardData {
  isSelected: boolean;
  history: NavigateFunction;
}

// Distance in pixels a user has to scroll a card down before we recognise
// a swipe-to dismiss action.
const dismissDistance = 150;

const CardComponent = ({
  isSelected,
  id,
  title,
  category,
  history,
  pointOfInterest,
  backgroundColor,
}: Props) => {
  const y = useMotionValue(0);
  // const zIndex = useMotionValue(isSelected ? 2 : 0);

  // Maintain the visual border radius when we perform the layoutTransition by inverting its scaleX/Y
  // const inverted = useInvertedBorderRadius(20);

  // We'll use the opened card element to calculate the scroll constraints
  const cardRef = useRef(null);
  const constraints = useScrollConstraints(cardRef, isSelected);

  function checkSwipeToDismiss() {
    y.get() > dismissDistance && history('/');
  }

  // function checkZIndex(latest: { scaleX: number }) {
  //   if (isSelected) {
  //     zIndex.set(2);
  //   } else if (!isSelected && latest.scaleX < 1.01) {
  //     zIndex.set(0);
  //   }
  // }

  // When this card is selected, attach a wheel event listener
  const containerRef = useRef(null);
  // useWheelScroll(containerRef, y, constraints, checkSwipeToDismiss, isSelected);

  return (
    <li ref={containerRef} className={`card`}>
      <Overlay isSelected={isSelected} />
      <div className={`card-content-container ${isSelected && 'open'}`}>
        <motion.div
          ref={cardRef}
          className="card-content"
          // style={{ ...inverted, zIndex, y }}
          layout
          transition={isSelected ? openSpring : closeSpring}
          drag={isSelected ? 'y' : false}
          dragConstraints={constraints}
          onDrag={checkSwipeToDismiss}
          // onUpdate={checkZIndex}
          onUpdate={(latest) => {
            // console
            console.log('latest:', latest);
          }}
        >
          <Image
            isSelected={isSelected}
            pointOfInterest={pointOfInterest}
            backgroundColor={backgroundColor}
          />
          <Title title={title} category={category} isSelected={isSelected} />
          <ContentPlaceholder />
        </motion.div>
      </div>
      {!isSelected && <Link to={`card/${id}`} className={`card-open-link`} />}
      {/* {!isSelected && <Link to={id} className={`card-open-link`} />} */}
    </li>
  );
};

CardComponent.displayName = 'Card';

export const Card = memo(CardComponent, (prev, next) => prev.isSelected === next.isSelected);

interface OverlayProps {
  isSelected: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ isSelected }) => (
  <motion.div
    initial={false}
    animate={{ opacity: isSelected ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
    className="overlay"
  >
    <Link to="/" />
  </motion.div>
);
