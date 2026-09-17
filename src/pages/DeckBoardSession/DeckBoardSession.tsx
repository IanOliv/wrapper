import Meta from '@/components/Meta';
import Item from '@/components/Micro/DeckBoardSession';

// The card-battle board handoff, ported from design_handoff_deckboard/. Kept
// apart from `/Deck` (the physics playground) and `/deck-development` (the
// motion workbench) — a third, unrelated prototype in the same lab.
function DeckBoardSession() {
  return (
    <>
      <Meta title="DeckBoard session" />
      <Item />
    </>
  );
}

export default DeckBoardSession;
