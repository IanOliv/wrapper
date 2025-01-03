/* eslint-disable react/prop-types */
import { memo, useRef } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';

// import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
// import Button from '@mui/material/Button';
// import MuiCard from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
import { motion, useMotionValue } from 'framer-motion';

import { useScrollConstraints } from '@/utils/use-scroll-constraints';

import { ContentPlaceholder } from './ContentPlaceholder';
// import { Image } from './Image';
import { Title } from './Title';
import { closeSpring, openSpring } from './animations';
import './styles.css';
import { CardData } from './types';

// function CardAlert() {
//   return (
//     <MuiCard variant="outlined" sx={{ m: 1.5, p: 1.5 }}>
//       <CardContent>
//         <AutoAwesomeRoundedIcon fontSize="small" />
//         <Typography gutterBottom sx={{ fontWeight: 600 }}>
//           Plan about to expire
//         </Typography>
//         <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
//           Enjoy 10% off when renewing your plan today.
//         </Typography>
//         <Button variant="contained" size="small" fullWidth>
//           Get the discount
//         </Button>
//       </CardContent>
//     </MuiCard>
//   );
// }

interface Props extends CardData {
  isSelected: boolean;
  history: NavigateFunction;
}

// Distance in pixels a user has to scroll a card down before we recognise
// a swipe-to dismiss action.
const dismissDistance = 150;

const CardComponent = ({ isSelected, id, title, category, history }: Props) => {
  const y = useMotionValue(0);

  const cardRef = useRef(null);
  const constraints = useScrollConstraints(cardRef, isSelected);

  function checkSwipeToDismiss() {
    y.get() > dismissDistance && history('/');
  }

  const containerRef = useRef(null);

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
          <Title title={title} category={category} isSelected={isSelected} />
          <ContentPlaceholder isSelected={isSelected} />
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
