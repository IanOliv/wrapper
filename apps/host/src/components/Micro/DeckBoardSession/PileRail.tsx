import { CardFace, DesktopOnly, PLabel, Rail, Slot, SlotTip } from './styled';
import type { DeckBoardView } from './view';

interface PileRailProps {
  view: DeckBoardView;
}

/** Draw pile + discard slot — the left column on desktop, a row on mobile. */
function PileRail({ view }: PileRailProps) {
  return (
    <Rail>
      <DesktopOnly>
        <PLabel>Pilhas</PLabel>
      </DesktopOnly>

      <div
        onClick={view.onDraw}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          cursor: 'pointer',
        }}
      >
        <CardFace
          data-card={view.pileTopId}
          style={{ width: view.cardW, height: view.cardH, padding: 9 }}
        >
          <div
            style={{ width: '100%', height: '100%', borderRadius: 6, border: '1px solid #4b4780' }}
          />
        </CardFace>
        <div style={{ fontSize: 12, color: '#cfe0d2' }}>Compra · {view.pileCount}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
        <Slot
          $variant={view.discardArmed ? 'armed' : 'player'}
          $focused={false}
          onClick={view.onDiscard ?? undefined}
          style={{
            width: view.cardW,
            height: view.cardH,
            cursor: view.discardArmed ? 'pointer' : 'default',
          }}
        >
          {view.discardTop.map((d) => (
            <CardFace
              key={d.id}
              data-card={d.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: view.cardW,
                height: view.cardH,
                borderColor: '#4b4780',
                background: '#262444',
                padding: 9,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 6,
                  border: '1px solid #4b4780',
                }}
              />
            </CardFace>
          ))}
          {view.discardArmed && <SlotTip>+</SlotTip>}
        </Slot>
        <div style={{ fontSize: 12, color: '#a8c4ad' }}>Descarte · {view.discardCount}</div>
        <div style={{ fontSize: 10, color: '#8fb896' }}>{view.discardName}</div>
      </div>
    </Rail>
  );
}

export default PileRail;
