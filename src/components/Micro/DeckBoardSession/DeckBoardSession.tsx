import Board from './Board';
import DebugDrawer from './DebugDrawer';
import HandFan from './HandFan';
import Hud from './Hud';
import Overlays from './Overlays';
import PileRail from './PileRail';
import SidePanel from './SidePanel';
import { Root } from './styled';
import type { DeckBoardTunables } from './types';
import useDeckBoardSession from './useDeckBoardSession';
import { buildView } from './view';

type DeckBoardSessionProps = DeckBoardTunables;

/**
 * A card-battle board: hand fanned at the bottom, a 5×6 grid split into an
 * enemy zone and a player zone, a draw/discard rail, an enemy row with
 * intents/HP, a HUD, and a debug drawer for tuning scale/reach/timing live.
 *
 * Ported from the `DeckBoardSession` design reference — see
 * `design_handoff_deckboard/README.md` for the full behavioural spec.
 */
function DeckBoardSession(props: DeckBoardSessionProps) {
  const session = useDeckBoardSession(props);
  const view = buildView(session);

  return (
    <Root
      tabIndex={0}
      onKeyDown={view.onKey}
      ref={view.refs.rootRef}
      style={{ gridTemplateColumns: view.cols, gridTemplateRows: view.rows }}
    >
      <Hud view={view} />
      <PileRail view={view} />
      <Board view={view} />
      <SidePanel view={view} />
      <HandFan view={view} />
      <Overlays view={view} />
      <DebugDrawer view={view} />
    </Root>
  );
}

export default DeckBoardSession;
