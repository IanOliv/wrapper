import {
  CardName,
  CardStats,
  CostBadge,
  EndTurnButton,
  Fan,
  HandCardBox,
  HandRow,
  HandThumbTrack,
  MobileOnly,
} from './styled';
import type { DeckBoardView } from './view';

interface HandFanProps {
  view: DeckBoardView;
}

/** The fanned hand. Below 1100px it becomes a horizontal scroll-snap row —
 *  the fan's rotation/lift transforms are neutralised by the container query
 *  on `HandCardBox` itself, so no branching is needed here. */
function HandFan({ view }: HandFanProps) {
  return (
    <HandRow>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: '#cfe0d2',
          }}
        >
          Sua mão · {view.handCount}
        </span>
        <MobileOnly>
          <span style={{ fontSize: 10, color: '#8fb896' }}>toque longo = preview</span>
        </MobileOnly>
        <MobileOnly>
          <span
            onClick={view.onToggleLog}
            style={{
              marginLeft: 'auto',
              height: 22,
              display: 'flex',
              alignItems: 'center',
              padding: '0 9px',
              borderRadius: 6,
              border: '1px solid rgba(127,169,135,.5)',
              fontSize: 10,
              color: '#cfe0d2',
              cursor: 'pointer',
            }}
          >
            log {view.logCount}
          </span>
        </MobileOnly>
      </div>

      <Fan onScroll={view.onHandScroll} style={{ height: view.handH, opacity: view.handOp }}>
        {view.hand.map((c) => (
          <HandCardBox
            key={c.id}
            $dragOrigin={c.dragOrigin}
            data-card={c.id}
            onPointerDown={c.onDown}
            onClick={c.onSelect}
            onMouseEnter={c.onEnter}
            onMouseLeave={view.onLeaveCard}
            style={{
              width: view.cardW,
              height: view.cardH,
              transform: `translateX(-50%) translate(${c.x}px, ${c.y}px) rotate(${c.angle}deg)`,
              zIndex: c.z,
              borderColor: c.ring,
              background: c.bg,
            }}
          >
            <CostBadge>{c.face.cost}</CostBadge>
            <div
              style={{
                flex: 1,
                display: 'grid',
                placeItems: 'center',
                width: '100%',
                paddingTop: 8,
              }}
            >
              <CardName style={{ fontSize: 10 }}>{c.face.name}</CardName>
            </div>
            <CardStats>
              <span>atk {c.face.atk}</span>
              <span>hp {c.face.hp}</span>
            </CardStats>
          </HandCardBox>
        ))}
      </Fan>

      <HandThumbTrack>
        <div
          style={{
            width: '40%',
            height: '100%',
            borderRadius: 999,
            background: '#cfe0d2',
            transform: `translateX(${view.thumbX})`,
          }}
        />
      </HandThumbTrack>

      <MobileOnly>
        <EndTurnButton
          type="button"
          onClick={view.onEndTurn}
          $hot={view.endTurnHot}
          style={{ marginTop: 4, height: 40, width: '100%', justifyContent: 'center' }}
        >
          Encerrar turno
        </EndTurnButton>
      </MobileOnly>
    </HandRow>
  );
}

export default HandFan;
