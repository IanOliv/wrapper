import { forwardRef } from 'react';

interface BeerPongButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

// interface BeerPonInputProps {
//   name: string;
//   ref: React.Ref<HTMLInputElement>;
// }

interface BeerPongItemProps {
  name: string;
}

interface BeerPongListProps {
  items: BeerPongItemProps[];
}

function BeerPongButton({ children, onClick }: BeerPongButtonProps) {
  return (
    <button className="beer-pong-button" onClick={onClick}>
      {children}
    </button>
  );
}

// eslint-disable-next-line react/display-name
const BeerPongInput = forwardRef<HTMLInputElement, { name: string }>(({ name }, ref) => {
  return <input ref={ref} placeholder={name} className="beer-pong-input" />;
});

function BeerPongItem({ name }: BeerPongItemProps) {
  return (
    <div className="beer-pong-item-container">
      <span className="beer-pong-item-icon"></span>
      <span className="beer-pong-item">{name}</span>
    </div>
  );
}

function BeerPongList({ items }: BeerPongListProps) {
  return (
    <>
      {items.map((item) => (
        <BeerPongItem key={item.name} name={item.name} />
      ))}
    </>
  );
}

export { BeerPongInput, BeerPongButton, BeerPongItem, BeerPongList };
