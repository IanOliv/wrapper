import { styled } from '@mui/system';

interface MapSecondaryButtonProps {
  children: React.ReactNode;
  isSelected: boolean;
}

const MapSecondaryButton = styled('button')<MapSecondaryButtonProps>(({ isSelected }) => ({
  'background-color': isSelected ? '#e49114' : '#f0f0f0',
  padding: '20px',
  'border-radius': '8px',
  width: '6rem',
  'font-size': '.7rem',
  color: '#2b2113',
  height: '100%',
  'margin-top': '0.5rem',
  'margin-bottom': '0.5rem',
  'margin-right': '0.75rem',
  'margin-left': '0.75rem',
}));

// const MapSecondaryButton = styled.button`
//   background-color: #e49114;
//   padding: 20px;
//   border-radius: 8px;
//   width: 45%;
//   color: #2b2113;
//   height: 100%;
//   margin-top: 0.5rem;
//   margin-bottom: 0.5rem;
//   margin-right: 0.75rem;
//   margin-left: 0.75rem;
// `;

export { MapSecondaryButton };
