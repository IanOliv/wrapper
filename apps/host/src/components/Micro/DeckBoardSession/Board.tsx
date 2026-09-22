import { COLS } from './constants';
import {
  BoardGrid,
  BoardWrap,
  CardName,
  CardStats,
  CombatLine,
  CombatLineRule,
  EnemyBox,
  EnemyHeader,
  EnemyHpFill,
  EnemyHpTrack,
  EnemyName,
  EnemyStats,
  EnemyTurnBanner,
  FloatSpan,
  IntentBadge,
  PlayedCardBox,
  RingHighlight,
  Slot,
  SlotCoord,
  SlotLabel,
  SlotTip,
} from './styled';
import type { DeckBoardView } from './view';

interface BoardProps {
  view: DeckBoardView;
}

/** The 5×6 grid: enemy rows, player rows, the combat-line divider, and every
 *  card/enemy/float layered absolutely inside it via `transform: translate()`. */
function Board({ view }: BoardProps) {
  return (
    <BoardWrap>
      {view.banner.map((b, bi) => (
        <EnemyTurnBanner key={bi}>
          <span style={{ fontSize: 10, letterSpacing: '.1em', color: '#ffb69c' }}>
            TURNO INIMIGO
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {b.dots.map((d, di) => (
              <span
                key={di}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: d.active ? '#ffb69c' : 'transparent',
                  border: `1px solid ${d.active ? '#ffb69c' : '#c9705a'}`,
                  boxSizing: 'border-box',
                }}
              />
            ))}
          </span>
        </EnemyTurnBanner>
      ))}

      <BoardGrid
        ref={view.refs.boardRef}
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${view.slotW}px)`,
          gridAutoRows: view.slotH,
          columnGap: view.gap,
          rowGap: view.gap,
        }}
      >
        {view.slots.map((s) => (
          <Slot
            key={s.id}
            $variant={s.cls}
            $focused={s.focused}
            onClick={s.onPick ?? undefined}
            style={{ cursor: s.onPick ? 'pointer' : undefined }}
          >
            <SlotCoord data-role="slot-coord">{s.id}</SlotCoord>
            {/* the tip is only ever visible armed or focused — computed even when
                hidden, same as the reference's opacity-gated `.dbs-slot-tip` */}
            {(s.cls === 'armed' || s.focused) && s.tip && (
              <SlotTip $focused={s.focused}>{s.tip}</SlotTip>
            )}
            <SlotLabel style={{ color: s.labelFg }}>{s.dropLabel}</SlotLabel>
          </Slot>
        ))}

        <CombatLine style={{ top: view.lineY }}>
          <CombatLineRule />
          <span
            style={{
              flex: 'none',
              fontSize: 9,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: '#a8c4ad',
              whiteSpace: 'nowrap',
            }}
          >
            linha de combate
          </span>
          <CombatLineRule />
        </CombatLine>

        {view.enemies.map((ev) => (
          <EnemyBox
            key={ev.enemy.id}
            data-card={ev.enemy.id}
            $targetable={ev.targetable}
            $highlighted={ev.highlighted}
            onClick={ev.onTarget ?? undefined}
            onMouseEnter={ev.onEnter}
            onMouseLeave={view.onLeaveCard}
            style={{
              width: view.slotW,
              height: view.slotH,
              transform: `translate(${ev.transformX}px, ${ev.transformY}px)`,
              opacity: ev.opacity,
              borderStyle: ev.dashed ? 'dashed' : 'solid',
              zIndex: 25,
            }}
          >
            <EnemyHeader>
              <EnemyName style={{ color: ev.nameFg }}>{ev.enemy.name}</EnemyName>
              <IntentBadge style={{ background: ev.badgeBg }}>{ev.intentText}</IntentBadge>
            </EnemyHeader>
            <div style={{ flex: 1 }} />
            <EnemyStats style={{ color: ev.statFg }}>
              <span>atk {ev.enemy.atk}</span>
              <span>hp {ev.enemy.hp}</span>
            </EnemyStats>
            <EnemyHpTrack>
              <EnemyHpFill
                $pulse={ev.pulseBar}
                style={{ width: Math.round((100 * ev.enemy.hp) / ev.enemy.maxHp) + '%' }}
              />
            </EnemyHpTrack>
          </EnemyBox>
        ))}

        {view.ring.map((r, i) => (
          <RingHighlight
            key={i}
            style={{ width: r.w, height: r.h, transform: `translate(${r.x}px, ${r.y}px)` }}
          />
        ))}

        {view.played.map((c) => (
          <PlayedCardBox
            key={c.id}
            data-card={c.id}
            $stripe="#9d97e0"
            onClick={c.onClick}
            onMouseEnter={c.onEnter}
            onMouseLeave={view.onLeaveCard}
            style={{
              width: view.slotW,
              height: view.slotH,
              transform: `translate(${c.x}px, ${c.y}px)`,
              transition: 'none',
              borderColor: c.ring,
              background: c.bg,
              zIndex: c.z,
            }}
          >
            <CardName style={{ fontSize: 10 }}>{c.face.name}</CardName>
            <div style={{ flex: 1 }} />
            <CardStats>
              <span>atk {c.face.atk}</span>
              <span>hp {c.face.hp}</span>
            </CardStats>
          </PlayedCardBox>
        ))}

        {view.floats.map((f) => (
          <FloatSpan key={f.key} style={{ left: f.x, top: f.y, color: f.fg }}>
            {f.text}
          </FloatSpan>
        ))}
      </BoardGrid>
    </BoardWrap>
  );
}

export default Board;
