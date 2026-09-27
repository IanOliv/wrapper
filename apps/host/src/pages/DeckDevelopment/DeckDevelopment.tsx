import Meta from '@/components/Meta';
import Item from '@/components/Micro/DeckDevelopment';

// The redesigned deck workbench. `/Deck` keeps its own layout, untouched, so
// both can run side by side while this one is evaluated.
function DeckDevelopment() {
  return (
    <>
      <Meta title="Deck development" />
      <Item />
    </>
  );
}

export default DeckDevelopment;
