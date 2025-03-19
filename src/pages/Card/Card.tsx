// import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

// import Typography from '@mui/material/Typography';
import { Card as CardDetail } from '@/components/Card';
import Meta from '@/components/Meta';

// import { FullSizeCenteredFlexBox } from '@/components/styled';

interface CardData {
  id: string;
  category: string;
  title: string;
  pointOfInterest: number;
  backgroundColor: string;
}

const cardData: CardData[] = [
  // Photo by ivan Torres on Unsplash
  {
    id: 'c',
    category: 'Games',
    title: 'Beer Pong',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  // Photo by Dennis Brendel on Unsplash
  {
    id: 'f',
    category: 'How to',
    title: 'Arrange Your Apple Devices for the Gram',
    pointOfInterest: 120,
    backgroundColor: '#959684',
  },
  // Photo by Alessandra Caretto on Unsplash
  {
    id: 'a',
    category: 'Pedal Power',
    title: 'Map Apps for the Superior Mode of Transport',
    pointOfInterest: 260,
    backgroundColor: '#5DBCD2',
  },
  // Photo by Taneli Lahtinen on Unsplash
  {
    id: 'g',
    category: 'Holidays',
    title: 'Our Pick of Apps to Help You Escape From Apps',
    pointOfInterest: 200,
    backgroundColor: '#8F986D',
  },
  // Photo by Simone Hutsch on Unsplash
  {
    id: 'd',
    category: 'Photography',
    title: 'The Latest Ultra-Specific Photography Editing Apps',
    pointOfInterest: 150,
    backgroundColor: '#FA6779',
  },
  // Photo by Siora Photography on Unsplash
  {
    id: 'h',
    category: "They're all the same",
    title: '100 Cupcake Apps for the Cupcake Connoisseur',
    pointOfInterest: 60,
    backgroundColor: '#282F49',
  },
  // Photo by Yerlin Matu on Unsplash
  {
    id: 'e',
    category: 'Cats',
    title: 'Yes, They Are Sociopaths',
    pointOfInterest: 200,
    backgroundColor: '#AC7441',
  },
  // Photo by Ali Abdul Rahman on Unsplash
  {
    id: 'b',
    category: 'Holidays',
    title: 'Seriously the Only Escape is the Stratosphere',
    pointOfInterest: 260,
    backgroundColor: '#CC555B',
  },
];

function Card() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [selectedCard, setSelectedCard] = useState(false);

  return (
    <>
      <Meta title="Card" />
      <div id="card-details" style={{ padding: '20px' }}>
        <ul className="card-list">
          <AnimatePresence>
            {cardData.map((card) => (
              <CardDetail
                key={card.id}
                isSelected={id === card.id}
                history={navigate}
                // onClick={() => handleCardClick(card.id)}
                {...card}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </>
  );
}

export default Card;
