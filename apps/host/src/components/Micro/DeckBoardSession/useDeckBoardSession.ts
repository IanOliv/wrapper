import { KeyboardEvent, PointerEvent, useEffect, useReducer, useRef } from 'react';

import { runLunge } from './attack';
import { DeckBoardAudio, SfxName } from './audio';
import { CARD_H, CARD_W, COLS, GAP, ROWS } from './constants';
import { faceOf } from './face';
import { FlipTimers, flipMove } from './flip';
import { inReach, isEnemyZone, rc, slotId, slotIds, slotXY } from './geometry';
import { phaseOf } from './phase';
import reducer, { createInitialCards, createInitialEnemies, createInitialState } from './reducer';
import type { DeckBoardState, DeckBoardTunables, Enemy, FloatEntity, SlotId } from './types';
import { canDrop, validate } from './validate';

/**
 * All game logic for the DeckBoardSession board, ported from the design
 * reference's `Component` logic class into a reducer + a handful of
 * imperative DOM effects (FLIP, the attack lunge, drag).
 *
 * `stateRef` mirrors `state` on every render so long-lived callbacks — window
 * pointer listeners during a drag, timers spanning an attack or the enemy
 * turn sequence — always read the latest values, the same way a class
 * component's `this.state` would; a plain closure over `state` would freeze
 * at whatever render created the callback.
 */
function useDeckBoardSession(tunables: DeckBoardTunables = {}) {
  const [state, dispatch] = useReducer(reducer, tunables, createInitialState);

  const stateRef = useRef(state);

  stateRef.current = state;

  const tunablesRef = useRef(tunables);

  tunablesRef.current = tunables;

  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const hpBarRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  const audioRef = useRef<DeckBoardAudio | null>(null);

  if (!audioRef.current) audioRef.current = new DeckBoardAudio();

  const idsRef = useRef({ log: 0, float: 0, seq: 0 });
  const flipTimers = useRef<FlipTimers>({});
  const lungeTimers = useRef<{
    lunge?: ReturnType<typeof setTimeout>;
    home?: ReturnType<typeof setTimeout>;
  }>({});
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const invalidTimer = useRef<ReturnType<typeof setTimeout>>();
  const hitTimer = useRef<ReturnType<typeof setTimeout>>();
  const deadTimer = useRef<ReturnType<typeof setTimeout>>();
  const turnTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const queueRef = useRef<Enemy[]>([]);
  const resolvingRef = useRef(false);

  // the container's own box, not the viewport — a widget breakpoint
  useEffect(() => {
    const el = rootRef.current;

    if (!el || !window.ResizeObserver) return undefined;

    const ro = new ResizeObserver(() =>
      dispatch({ type: 'patch', value: { width: el.clientWidth } }),
    );

    ro.observe(el);
    dispatch({ type: 'patch', value: { width: el.clientWidth } });

    return () => ro.disconnect();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(flipTimers.current.flip);
      clearTimeout(lungeTimers.current.lunge);
      clearTimeout(lungeTimers.current.home);
      clearTimeout(hoverTimer.current);
      clearTimeout(invalidTimer.current);
      clearTimeout(hitTimer.current);
      clearTimeout(deadTimer.current);
      turnTimers.current.forEach(clearTimeout);
    },
    [],
  );

  const soundOn = (): boolean => {
    if (state.soundEnabled !== null) return state.soundEnabled;
    try {
      return localStorage.getItem('dbs-sound') !== 'off';
    } catch {
      return true;
    }
  };

  const setSound = (on: boolean) => {
    try {
      localStorage.setItem('dbs-sound', on ? 'on' : 'off');
    } catch {
      // storage may be unavailable (private mode, quota) — the toggle still works for the session
    }
    dispatch({ type: 'patch', value: { soundEnabled: on } });
    if (on) audioRef.current?.warm();
  };

  const sfx = (name: SfxName) => {
    if (!soundOn()) return;
    audioRef.current?.play(name, stateRef.current.volume);
  };

  const cardW = Math.round(CARD_W * state.scale);
  const cardH = Math.round(CARD_H * state.scale);
  const slotW = cardW;
  const slotH = Math.round((cardW * 3) / 4);
  const gap = Math.round((GAP * state.scale) / 0.55);

  const showInvalid = (slot: SlotId | null, reason: string | null) => {
    if (!slot || !reason) return;
    dispatch({ type: 'patch', value: { invalidHint: { slot, reason } } });
    clearTimeout(invalidTimer.current);
    invalidTimer.current = setTimeout(
      () => dispatch({ type: 'patch', value: { invalidHint: null } }),
      1500,
    );
  };

  const hoverCard = (id: string) => {
    dispatch({ type: 'patch', value: { hovered: id } });
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(
      () => dispatch({ type: 'patch', value: { previewId: id } }),
      400,
    );
  };

  const onLeaveCard = () => {
    clearTimeout(hoverTimer.current);
    dispatch({ type: 'patch', value: { hovered: null } });
  };

  const addFloat = (slot: SlotId, text: string, fg: string) => {
    idsRef.current.float += 1;
    const key = idsRef.current.float;
    const p = slotXY(slot, slotW, slotH, gap);
    const float: FloatEntity = { key, x: p.x + Math.round(slotW / 2) - 9, y: p.y - 8, text, fg };

    dispatch({ type: 'add-float', float });
    setTimeout(() => dispatch({ type: 'remove-float', key }), 620);
  };

  const place = (id: string, slot: SlotId) => {
    idsRef.current.log += 1;
    sfx('card-play');
    flipMove(
      rootRef.current,
      id,
      stateRef.current.moveMs,
      () => dispatch({ type: 'place', id, slot, logId: idsRef.current.log }),
      flipTimers.current,
    );
  };

  const draw = () => {
    sfx('draw');
    const pile = state.cards.filter((c) => c.zone === 'pile');
    const top = pile[pile.length - 1];

    if (!top) return;

    flipMove(
      rootRef.current,
      top.id,
      state.moveMs,
      () => dispatch({ type: 'draw' }),
      flipTimers.current,
    );
  };

  const discard = (id: string) => {
    idsRef.current.seq += 1;
    const seq = idsRef.current.seq;

    flipMove(
      rootRef.current,
      id,
      state.moveMs,
      () => dispatch({ type: 'discard', id, seq }),
      flipTimers.current,
    );
  };

  const toHand = (id: string) => {
    flipMove(
      rootRef.current,
      id,
      state.moveMs,
      () => dispatch({ type: 'to-hand', id }),
      flipTimers.current,
    );
  };

  const resolveHit = (attackerId: string, foeId: string) => {
    const atk = faceOf(attackerId).atk;
    const hitFoe = stateRef.current.enemies.find((e) => e.id === foeId);

    sfx('damage');
    if (hitFoe) {
      addFloat(slotId(hitFoe.row, hitFoe.col), '-' + atk, '#ff9b7d');
      idsRef.current.log += 1;
      dispatch({
        type: 'attack-mark-damaged',
        foeId,
        logId: idsRef.current.log,
        attackerName: faceOf(attackerId).name,
        foeName: hitFoe.name,
        atk,
      });
    }

    clearTimeout(hitTimer.current);
    hitTimer.current = setTimeout(() => {
      dispatch({ type: 'attack-apply-hit', foeId, atk });
      clearTimeout(deadTimer.current);
      deadTimer.current = setTimeout(() => dispatch({ type: 'remove-defeated', foeId }), 200);
    }, 150);
  };

  const attack = (attackerId: string, foeId: string) => {
    const foe = state.enemies.find((e) => e.id === foeId);
    const card = state.cards.find((c) => c.id === attackerId);

    if (!foe || !card) return;

    const from = slotXY(card.slot, slotW, slotH, gap);
    const to = slotXY(slotId(foe.row, foe.col), slotW, slotH, gap);

    dispatch({ type: 'attack-start', attackerId });
    runLunge(
      rootRef.current,
      attackerId,
      from,
      to,
      state.moveMs,
      lungeTimers.current,
      () => resolveHit(attackerId, foeId),
      () => dispatch({ type: 'attack-clear-lunge' }),
    );
  };

  const finishTurn = () => {
    turnTimers.current.forEach(clearTimeout);
    turnTimers.current = [];
    resolvingRef.current = false;
    dispatch({ type: 'finish-turn' });
  };

  const endTurn = () => {
    if (resolvingRef.current) return;

    const queue = state.enemies.filter((e) => e.status !== 'defeated' && !e.acted);

    resolvingRef.current = true;
    queueRef.current = queue;
    sfx('turn-end');
    dispatch({ type: 'end-turn-start', total: queue.length });

    turnTimers.current = queue.map((foe, i) =>
      setTimeout(() => {
        sfx('damage');
        idsRef.current.log += 1;
        dispatch({
          type: 'enemy-act',
          foeId: foe.id,
          foeName: foe.name,
          index: i,
          total: queue.length,
          damage: foe.intent,
          logId: idsRef.current.log,
        });
      }, i * 250),
    );
    turnTimers.current.push(setTimeout(finishTurn, queue.length * 250 + 320));
  };

  const skipEnemyTurn = () => {
    const pending = queueRef.current
      .filter((e) => !stateRef.current.enemies.find((x) => x.id === e.id)?.acted)
      .map((e) => {
        idsRef.current.log += 1;

        return { foeName: e.name, damage: e.intent, logId: idsRef.current.log };
      });

    dispatch({ type: 'skip-enemy-turn', pending });
    finishTurn();
  };

  const undo = () => {
    if (!state.undoStack.length || state.enemyTurn) return;
    dispatch({ type: 'undo' });
  };

  const newGame = () => {
    turnTimers.current.forEach(clearTimeout);
    turnTimers.current = [];
    resolvingRef.current = false;
    idsRef.current.log = 0;
    dispatch({
      type: 'new-game',
      cards: createInitialCards(
        tunablesRef.current.pileCount ?? 9,
        tunablesRef.current.handCount ?? 0,
      ),
      enemies: createInitialEnemies(),
    });
  };

  // the aim line is measured, not guessed: enemy card top → the HUD hp bar
  const aimAt = (id: string) => {
    const root = rootRef.current;
    const el = root?.querySelector(`[data-card="${id}"]`);
    const bar = hpBarRef.current;

    if (!root || !el || !bar) return;

    const r = root.getBoundingClientRect();
    const a = el.getBoundingClientRect();
    const b = bar.getBoundingClientRect();

    dispatch({
      type: 'patch',
      value: {
        aim: {
          x1: Math.round(a.left + a.width / 2 - r.left),
          y1: Math.round(a.top - r.top),
          x2: Math.round(b.left + b.width * 0.55 - r.left),
          y2: Math.round(b.bottom - r.top + 2),
        },
      },
    });
  };

  const slotAt = (clientX: number, clientY: number): SlotId | null => {
    const board = boardRef.current;

    if (!board) return null;

    const r = board.getBoundingClientRect();
    const stepX = slotW + gap;
    const stepY = slotH + gap;
    const c = Math.round((clientX - r.left - slotW / 2) / stepX) + 1;
    const row = Math.round((clientY - r.top - slotH / 2) / stepY) + 1;

    if (c < 1 || c > COLS || row < 1 || row > ROWS) return null;

    return slotId(row, c);
  };

  const moveGhost = (x: number, y: number) => {
    const root = rootRef.current;
    const g = ghostRef.current;

    if (!root || !g) return;

    const r = root.getBoundingClientRect();

    g.style.transform =
      'translate(' +
      Math.round(x - r.left - cardW / 2) +
      'px, ' +
      Math.round(y - r.top - cardH / 2) +
      'px) rotate(-6deg)';
  };

  const startDrag = (id: string, ev: PointerEvent<HTMLDivElement>) => {
    const ph = phaseOf(stateRef.current);

    if (ph !== 'playing' && ph !== 'setup') return;

    ev.preventDefault();
    const idx = stateRef.current.cards
      .filter((c) => c.zone === 'hand')
      .findIndex((c) => c.id === id);

    dispatch({
      type: 'patch',
      value: { dragging: { cardId: id, originIndex: idx, targetSlot: null }, selectedId: id },
    });

    const move = (e: globalThis.PointerEvent) => {
      moveGhost(e.clientX, e.clientY);
      const slot = slotAt(e.clientX, e.clientY);
      const ok = !!slot && !validate(stateRef.current, id, slot);

      dispatch({
        type: 'patch',
        value: {
          dragging: { cardId: id, originIndex: idx, nearest: slot, targetSlot: ok ? slot : null },
        },
      });
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);

      const d = stateRef.current.dragging;

      dispatch({ type: 'patch', value: { dragging: null } });

      if (d && d.targetSlot) {
        place(d.cardId, d.targetSlot);
      } else {
        // the ghost returns quietly, but the slot says why
        if (d && d.nearest) showInvalid(d.nearest, validate(stateRef.current, d.cardId, d.nearest));
        dispatch({ type: 'patch', value: { selectedId: null } });
      }
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    requestAnimationFrame(() => moveGhost(ev.clientX, ev.clientY));
  };

  const playIndex = (i: number) => {
    const hand = state.cards.filter((c) => c.zone === 'hand');
    const card = hand[i];

    if (!card) return;

    if (state.selectedId !== card.id) {
      dispatch({ type: 'patch', value: { selectedId: card.id } });

      return;
    }

    const focus = state.focusedSlot;
    const slot = focus
      ? slotId(focus.row, focus.col)
      : slotIds().find((id) => !validate(state, card.id, id));

    if (!slot) return;

    const why = validate(state, card.id, slot);

    if (why) {
      showInvalid(slot, why);

      return;
    }

    place(card.id, slot);
  };

  const moveFocus = (dir: number) => {
    const legal = slotIds().filter((id) => !isEnemyZone(id));
    const cur = state.focusedSlot ? slotId(state.focusedSlot.row, state.focusedSlot.col) : null;
    const i = cur ? legal.indexOf(cur) : -1;
    const next = legal[Math.max(0, Math.min(legal.length - 1, i + dir))] || legal[0];
    const m = rc(next);

    if (!m) return;
    dispatch({ type: 'patch', value: { focusedSlot: { row: m.r, col: m.c } } });
  };

  const confirmFocus = () => {
    const sel = state.selectedId;
    const focus = state.focusedSlot;

    if (!sel || !focus) return;

    const slot = slotId(focus.row, focus.col);
    const why = validate(state, sel, slot);

    if (why) showInvalid(slot, why);
    else place(sel, slot);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;

    if (k === 'Escape') {
      if (state.enemyTurn) {
        skipEnemyTurn();

        return;
      }
      dispatch({
        type: 'patch',
        value: { selectedId: null, focusedSlot: null, debugOpen: false, invalidHint: null },
      });

      return;
    }
    if (state.enemyTurn) return;
    if ((e.ctrlKey || e.metaKey) && (k === 'z' || k === 'Z')) {
      e.preventDefault();
      undo();

      return;
    }
    if (k >= '1' && k <= '6') {
      playIndex(parseInt(k, 10) - 1);

      return;
    }
    if (k === 'ArrowRight') {
      e.preventDefault();
      moveFocus(1);

      return;
    }
    if (k === 'ArrowLeft') {
      e.preventDefault();
      moveFocus(-1);

      return;
    }
    if (k === 'Enter') {
      e.preventDefault();
      confirmFocus();

      return;
    }
    if (k === ' ') {
      e.preventDefault();
      endTurn();

      return;
    }
    if (k === 'd' || k === 'D') dispatch({ type: 'patch', value: { debugOpen: !state.debugOpen } });
  };

  return {
    state,
    dispatch,
    refs: { rootRef, boardRef, hpBarRef, ghostRef },
    geometry: { cardW, cardH, slotW, slotH, gap },
    actions: {
      draw,
      discard,
      toHand,
      place,
      attack,
      endTurn,
      undo,
      newGame,
      hoverCard,
      onLeaveCard,
      aimAt,
      startDrag,
      onKey,
      setSound,
      soundOn,
      showInvalid,
      canDrop: (slot: SlotId) => canDrop(state, slot),
      validate: (id: string, slot: SlotId) => validate(state, id, slot),
      inReach: (from: SlotId | null, slot: SlotId) =>
        inReach(from, slot, {
          reach: state.reach,
          reachX: state.reachX,
          reachY: state.reachY,
          reachDiag: state.reachDiag,
        }),
    },
  };
}

export default useDeckBoardSession;
export type { DeckBoardState };
