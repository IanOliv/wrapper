// import { Card } from '@/components/Card';
import { useNavigate } from 'react-router-dom';

import Meta from '@/components/Meta';
// import { FullSizeCenteredFlexBox } from '@/components/styled';
// import useOrientation from '@/hooks/useOrientation';
import useScreenSize from '@/hooks/useScreenSize';

import {
  Container,
  Grid, // Image,
  RoundSkeleton,
  Slot,
  SlotDescription,
  SlotMain,
  StyledH6,
} from './styled';

// const maxWidth = 1666;
// const maxHeight = 938;

const items = [
  {
    id: 'c1',
    category: 'Library',
    title: 'React Router',
    description: 'A collection of navigational components',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  {
    id: 'c2',
    category: 'Tool',
    title: 'Vite',
    description: 'A fast build tool for modern web projects',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  {
    id: 'c3',
    category: 'Language',
    title: 'TypeScript',
    description: 'A typed superset of JavaScript',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  {
    id: 'c4',
    category: 'Library',
    title: 'React',
    description: 'A JavaScript library for building user interfaces',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  {
    id: 'c5',
    category: 'Library',
    title: 'MUI',
    description: 'React components for faster and easier web development',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  {
    id: 'c6',
    category: 'Library',
    title: 'Recoil',
    description: 'A state management library for React',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  {
    id: 'c7',
    category: 'Technology',
    title: 'PWA',
    description: 'Progressive Web Apps',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
];

function Welcome() {
  // const isPortrait = useOrientation();
  const screen = useScreenSize();
  const navigate = useNavigate();

  // const width = isPortrait ? '80%' : '80%';
  // const height = isPortrait ? '20%' : '30%';

  const roundSkeletonSize = '1.5em';
  const colorSlotBG = '#444444';
  const colorSlotTitleBG = '#919191';

  const handleSlotClick = (item: { id: string }) => {
    console.log('Slot clicked:', item);
    navigate(`/card/${item.id}`);
  };

  return (
    <>
      <Meta title="Welcome" />
      <Container>
        <Grid width={screen.width}>
          {items.map((item, index) => (
            <Slot
              key={index}
              title={item.title}
              backgroundColor={colorSlotBG}
              onClick={() => handleSlotClick(item)}
            >
              <SlotMain backgroundColor={colorSlotBG}>
                <div style={{ marginRight: '10px' }}>
                  <RoundSkeleton size={roundSkeletonSize} />
                </div>

                <StyledH6 color={colorSlotTitleBG}>{item.title}</StyledH6>
              </SlotMain>
              <SlotDescription backgroundColor={colorSlotBG}>{item.description}</SlotDescription>
            </Slot>
          ))}
          {/* <ul className="card-list">
            {items.map((card) => (
              <Card
                key={card.id}
                isSelected={false}
                // history={history}
                {...card}
              />
            ))}
          </ul> */}
        </Grid>
      </Container>
    </>
  );
}

// const List = ({ match, history }) => (
//   <ul className="card-list">
//     {items.map((card) => (
//       <Card
//         key={card.id}
//         isSelected={false}
//         // history={history}
//         {...card}
//       />
//     ))}
//   </ul>
// );

export default Welcome;
