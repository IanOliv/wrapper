import type { PointerEvent, UIEvent } from 'react';

import { legMs } from './attack';
import { ENEMY_ROWS, NARROW } from './constants';
import { faceOf } from './face';
import { isEnemyZone, slotId, slotIds, slotXY } from './geometry';
import { phaseOf } from './phase';
import type { AimLine, CardFace, Enemy, SlotId } from './types';
import type useDeckBoardSession from './useDeckBoardSession';

type Session = ReturnType<typeof useDeckBoardSession>;

interface SlotView {
  id: SlotId;
  cls: 'enemy' | 'player' | 'player-hint' | 'armed' | 'bad';
  focused: boolean;
  tip: string;
  dropLabel: string;
  labelFg: string;
  onPick: (() => void) | null;
}

interface EnemyView {
  enemy: Enemy;
  targetable: boolean;
  highlighted: boolean;
  transformX: number;
  transformY: number;
  opacity: number;
  dashed: boolean;
  nameFg: string;
  statFg: string;
  badgeBg: string;
  pulseBar: boolean;
  intentText: string | number;
  onEnter: () => void;
  onTarget: (() => void) | null;
}

interface PlayedView {
  id: string;
  face: CardFace;
  x: number;
  y: number;
  ring: string;
  bg: string;
  z: number;
  onEnter: () => void;
  onClick: () => void;
}

interface HandCardView {
  id: string;
  face: CardFace;
  x: number;
  y: number;
  angle: string;
  lifted: boolean;
  z: number;
  ring: string;
  bg: string;
  dragOrigin: boolean;
  onDown: (ev: PointerEvent<HTMLDivElement>) => void;
  onSelect: () => void;
  onEnter: () => void;
}

interface RegistryRow {
  id: string;
  zone: string;
  at: string;
  ring: string;
  fg: string;
}

const ZONE_STYLE: Record<string, { ring: string; fg: string }> = {
  pile: { ring: '#4a4f63', fg: '#a8adc4' },
  hand: { ring: '#9d97e0', fg: '#dcd9f5' },
  board: { ring: '#7fbb9a', fg: '#b8e6c0' },
  discard: { ring: '#5a6070', fg: '#9aa2b4' },
  enemy: { ring: '#9c5340', fg: '#f0c9bd' },
};

const ARC = 25;

/**
 * The presentational view model, rebuilt every render from `state` — the same
 * shape the design reference computed in its own `renderVals()`. Kept
 * side-effect free; all mutation happens through the callbacks it closes
 * over from the hook.
 */
function buildView(session: Session) {
  const { state, actions, geometry, refs } = session;
  const { cardW, cardH, slotW, slotH, gap } = geometry;
  const all = state.cards;
  const foes = state.enemies;
  const pile = all.filter((c) => c.zone === 'pile');
  const hand = all.filter((c) => c.zone === 'hand');
  const board = all.filter((c) => c.zone === 'board');
  const discardPile = all.filter((c) => c.zone === 'discard');
  const top = discardPile.length
    ? discardPile.reduce((a, b) => ((b.seq || 0) > (a.seq || 0) ? b : a))
    : null;

  const sel = state.selectedId;
  const selCard = sel ? all.find((c) => c.id === sel) : null;
  const fromSlot = selCard && selCard.zone === 'board' ? selCard.slot ?? null : null;
  const taken = new Set(board.map((c) => c.slot));
  const foeSlots = new Set(foes.map((e) => slotId(e.row, e.col)));
  const attacking = !!fromSlot;
  const reachable = (id: SlotId) =>
    !!selCard &&
    !taken.has(id) &&
    !foeSlots.has(id) &&
    !isEnemyZone(id) &&
    actions.inReach(fromSlot, id);

  const ph = phaseOf(state);
  const live = foes.filter((e) => e.status !== 'defeated');
  const pending = live.filter((e) => !e.acted);
  const threat = pending.reduce((n, e) => n + e.intent, 0);
  const hoveredFoe = pending.find((e) => e.id === state.hovered) || null;

  const drag = state.dragging;
  const et = state.enemyTurn;
  const queue = et ? live : [];
  const activeFoe = et ? queue[et.activeIndex] || null : null;
  const inv = state.invalidHint;
  const focus = state.focusedSlot;
  const focusSlot = focus ? slotId(focus.row, focus.col) : null;
  const dropSlot = drag ? drag.targetSlot : null;

  const logText = (l: { kind: string; actor: string; target?: string; amount?: number }) =>
    l.kind === 'play' ? l.actor + ' jogada' : l.actor + ' → ' + l.target + ' · ' + l.amount;

  const pvId = state.previewId;
  const pvActive = !!pvId && pvId === state.hovered;
  const pvFoe = pvId ? foes.find((e) => e.id === pvId) : null;
  const pvCard = pvId && !pvFoe ? all.find((c) => c.id === pvId) : null;
  const pv = pvFoe
    ? {
        name: pvFoe.name,
        cost: pvFoe.intent,
        atk: pvFoe.atk,
        hp: pvFoe.hp,
        foe: true,
        text: 'Prepara um golpe de ' + pvFoe.intent + ' no próximo turno.',
      }
    : pvCard
    ? { ...faceOf(pvCard.id), foe: false }
    : null;

  const STEP = Math.round((66 * state.scale) / 0.55);
  const mid = (hand.length - 1) / 2;
  const per = hand.length > 1 ? ARC / (hand.length - 1) : 0;
  const pct = Math.round((100 * state.hp) / state.maxHp);

  const slots: SlotView[] = slotIds().map((id) => {
    const hinting = ph === 'setup' && id === 'r4c3';
    const drop = id === dropSlot;
    const bad = !!(inv && inv.slot === id);
    const focused = id === focusSlot;
    const armed = drop || reachable(id);
    const cls: SlotView['cls'] = bad
      ? 'bad'
      : armed
      ? 'armed'
      : isEnemyZone(id)
      ? 'enemy'
      : hinting
      ? 'player-hint'
      : 'player';

    return {
      id,
      cls,
      focused,
      tip: bad ? '' : focused && !drop ? '↵' : drop ? '' : '+',
      dropLabel: bad
        ? inv?.reason ?? ''
        : drop
        ? 'soltar aqui'
        : hinting
        ? 'jogue sua primeira carta'
        : '',
      labelFg: bad ? '#ffb69c' : drop ? '#eefaf0' : '#8fb896',
      onPick: reachable(id) && sel ? () => actions.place(sel, id) : null,
    };
  });

  const enemies: EnemyView[] = foes.map((e) => {
    const slot = slotId(e.row, e.col);
    const p = slotXY(slot, slotW, slotH, gap);
    const targetable = attacking && e.status === 'idle' && actions.inReach(fromSlot, slot);
    const highlighted = !targetable && state.pillHover && !e.acted;

    return {
      enemy: e,
      targetable,
      highlighted,
      transformX: p.x,
      transformY: p.y,
      opacity:
        e.status === 'defeated'
          ? 0.35
          : e.status === 'damaged'
          ? 0.55
          : et && (!activeFoe || activeFoe.id !== e.id)
          ? 0.75
          : 1,
      dashed: e.status === 'defeated',
      nameFg: targetable ? '#ffe0d5' : '#f0c9bd',
      statFg: targetable ? '#e0a894' : '#c08b7a',
      badgeBg: targetable ? '#a04034' : '#7a2f24',
      pulseBar: e.status === 'damaged',
      intentText: e.acted ? '—' : e.intent,
      onEnter: () => {
        actions.hoverCard(e.id);
        actions.aimAt(e.id);
      },
      onTarget: targetable && sel ? () => actions.attack(sel, e.id) : null,
    };
  });

  const played: PlayedView[] = board.map((c) => {
    const p = slotXY(c.slot, slotW, slotH, gap);
    const f = faceOf(c.id);
    const striking = !!state.lunge && state.lunge.id === c.id;
    const isSel = c.id === sel;

    return {
      id: c.id,
      face: f,
      x: p.x,
      y: p.y,
      ring: isSel ? '#dcd9f5' : '#9d97e0',
      bg: isSel ? '#3a3668' : '#2f2c55',
      z: striking ? 120 : isSel ? 30 : 20,
      onEnter: () => actions.hoverCard(c.id),
      onClick: () => {
        if (c.id !== sel) {
          session.dispatch({ type: 'patch', value: { selectedId: c.id } });

          return;
        }
        if (state.isDebug) {
          session.dispatch({ type: 'patch', value: { selectedId: null } });
          actions.toHand(c.id);
        } else {
          session.dispatch({ type: 'patch', value: { selectedId: null } });
        }
      },
    };
  });

  const handView: HandCardView[] = hand.map((c, i) => {
    const picked = c.id === sel;
    const f = faceOf(c.id);
    const x = Math.round((i - mid) * STEP);
    const angle = ((i - mid) * per).toFixed(2);
    const lifted = picked || c.id === state.hovered;

    return {
      id: c.id,
      face: f,
      x,
      y: lifted ? -14 : 0,
      angle,
      lifted,
      z: c.id === state.hovered ? 45 : 10 + i,
      ring: lifted ? '#9d97e0' : '#4b4780',
      bg: picked ? '#2f2c55' : '#262444',
      dragOrigin: !!drag && drag.cardId === c.id,
      onDown: (ev) => actions.startDrag(c.id, ev),
      onSelect: () =>
        session.dispatch({
          type: 'patch',
          value: { selectedId: state.selectedId === c.id ? null : c.id },
        }),
      onEnter: () => actions.hoverCard(c.id),
    };
  });

  const registry: RegistryRow[] = [
    ...all.map((c) => ({
      id: c.id,
      zone: c.zone,
      at: c.zone === 'board' ? c.slot ?? '—' : '—',
      ring: ZONE_STYLE[c.zone].ring,
      fg: ZONE_STYLE[c.zone].fg,
    })),
    ...foes.map((e) => ({
      id: e.id,
      zone: 'enemy',
      at: slotId(e.row, e.col),
      ring: ZONE_STYLE.enemy.ring,
      fg: ZONE_STYLE.enemy.fg,
    })),
  ];

  const narrow = !!state.width && state.width <= NARROW;

  return {
    refs,
    cardW,
    cardH,
    slotW,
    slotH,
    gap,
    handH: cardH + 22,
    lineY: ENEMY_ROWS * slotH + (ENEMY_ROWS - 0.5) * gap,
    cols: narrow ? '1fr' : '88px 1fr 152px',
    rows: narrow ? 'auto auto 1fr auto' : 'auto 1fr auto',
    narrow,
    phase: ph,

    turn: state.turn,
    turnShort: 'T' + state.turn,
    hp: state.hp,
    maxHp: state.maxHp,
    hpPct: pct,
    hpFill: pct < 25 ? '#d4614a' : pct < 50 ? '#f0d68a' : '#7fc98d',
    hpPulse: state.hpHitTurn === state.turn,
    threat,
    threatShare: hoveredFoe ? '· ' + hoveredFoe.intent : '',
    onPillEnter: () => session.dispatch({ type: 'patch', value: { pillHover: true } }),
    onPillLeave: () => session.dispatch({ type: 'patch', value: { pillHover: false } }),
    pips: Array.from({ length: state.maxEnergy }, (_, i) =>
      i < state.energy
        ? { bg: '#f0d68a', ring: '#f0d68a' }
        : { bg: 'transparent', ring: '#8fb896' },
    ),
    undoEnabled: state.undoStack.length > 0 && !et,
    onUndo: () => actions.undo(),
    soundOn: actions.soundOn(),
    onToggleSound: () => actions.setSound(!actions.soundOn()),
    endTurnHot: state.energy === 0,
    onEndTurn: () => actions.endTurn(),

    pileCount: pile.length,
    pileTopId: pile.length ? pile[pile.length - 1].id : 'none',
    onDraw: () => actions.draw(),
    discardCount: discardPile.length,
    discardName: top ? faceOf(top.id).name : '',
    discardTop: top ? [{ id: top.id }] : [],
    discardArmed: state.isDebug && !!selCard,
    onDiscard: state.isDebug && selCard ? () => actions.discard(selCard.id) : null,

    banner: et
      ? [{ dots: Array.from({ length: et.total }, (_, i) => ({ active: i <= et.activeIndex })) }]
      : [],
    ring: activeFoe
      ? [
          {
            x: slotXY(slotId(activeFoe.row, activeFoe.col), slotW, slotH, gap).x - 3,
            y: slotXY(slotId(activeFoe.row, activeFoe.col), slotW, slotH, gap).y - 3,
            w: slotW + 6,
            h: slotH + 6,
          },
        ]
      : [],
    slots,
    enemies,
    played,
    floats: state.floats,
    onLeaveCard: actions.onLeaveCard,

    handCount: hand.length,
    handOp: et ? 0.75 : 1,
    hand: handView,
    thumbX: Math.round(state.handScroll * 60) + '%',
    onHandScroll: (e: UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const max = el.scrollWidth - el.clientWidth;

      session.dispatch({ type: 'patch', value: { handScroll: max > 0 ? el.scrollLeft / max : 0 } });
    },
    logCount: state.log.length,

    preview: {
      active: pvActive,
      name: pv ? pv.name : '—',
      cost: pv ? pv.cost : '',
      atk: pv ? pv.atk : '',
      hp: pv ? pv.hp : '',
      text: pv ? pv.text : 'Passe o mouse sobre uma carta.',
      foe: pv ? pv.foe : false,
    },
    logLines: state.log
      .slice(-3)
      .reverse()
      .map((l, i) => ({ key: l.id, text: logText(l), fg: ['#e6f2e8', '#b9cfbd', '#93ab97'][i] })),
    logAll: state.log
      .filter((l) => l.turn === state.turn)
      .slice()
      .reverse()
      .map((l) => ({ key: l.id, text: logText(l) })),
    logOpen: state.logOpen,
    onToggleLog: () => session.dispatch({ type: 'patch', value: { logOpen: !state.logOpen } }),

    debugOpen: state.debugOpen,
    onToggleDebugDrawer: () =>
      session.dispatch({ type: 'patch', value: { debugOpen: !state.debugOpen } }),
    registry,
    isDebug: state.isDebug,
    onIsDebug: (checked: boolean) =>
      session.dispatch({ type: 'patch', value: { isDebug: checked } }),
    scale: state.scale,
    scaleLabel: state.scale.toFixed(2) + '×',
    onScale: (v: number) => session.dispatch({ type: 'patch', value: { scale: v } }),
    moveMs: state.moveMs,
    moveLabel: state.moveMs + 'ms',
    onMoveMs: (v: number) => session.dispatch({ type: 'patch', value: { moveMs: v } }),
    reach: state.reach,
    reachLabel: state.reach + (state.reach === 1 ? ' slot' : ' slots'),
    onReach: (v: number) => session.dispatch({ type: 'patch', value: { reach: v } }),
    reachX: state.reachX,
    reachXLabel: state.reachX + '',
    onReachX: (v: number) => session.dispatch({ type: 'patch', value: { reachX: v } }),
    reachY: state.reachY,
    reachYLabel: state.reachY + '',
    onReachY: (v: number) => session.dispatch({ type: 'patch', value: { reachY: v } }),
    reachDiag: state.reachDiag,
    reachDiagLabel: state.reachDiag + '',
    onReachDiag: (v: number) => session.dispatch({ type: 'patch', value: { reachDiag: v } }),
    volume: state.volume,
    volumeLabel: Math.round(state.volume * 100) + '%',
    onVolume: (v: number) => session.dispatch({ type: 'patch', value: { volume: v } }),
    returnHint: state.isDebug
      ? 'is debug ligado · clique de novo numa carta focada no campo para devolvê-la à mão, ou no Descarte para descartá-la'
      : 'is debug desligado · cartas jogadas não voltam para a mão nem vão para o Descarte',

    aim: state.aim && state.hovered && hoveredFoe ? [state.aim as AimLine] : [],
    ghost: drag
      ? [{ id: drag.cardId, name: faceOf(drag.cardId).name, cost: faceOf(drag.cardId).cost }]
      : [],
    over:
      ph === 'won' || ph === 'lost'
        ? {
            title: ph === 'won' ? 'VITÓRIA' : 'DERROTA',
            fg: ph === 'won' ? '#b8e6c0' : '#f0a68f',
            sub:
              'Turno ' +
              state.turn +
              ' · ' +
              state.taken +
              ' de dano levado · ' +
              state.kills +
              ' inimigos abatidos',
          }
        : null,
    onNewGame: () => actions.newGame(),

    onKey: actions.onKey,
    legMs: legMs(state.moveMs),
  };
}

type DeckBoardView = ReturnType<typeof buildView>;

export { buildView };
export type { DeckBoardView, EnemyView, HandCardView, PlayedView, RegistryRow, SlotView };
