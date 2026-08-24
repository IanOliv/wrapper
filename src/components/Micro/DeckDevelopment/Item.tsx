import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Inspector from './Inspector';
import Layers from './Layers';
import Stage from './Stage';
import Timeline from './Timeline';
import { toCss } from './codegen';
import { clamp } from './model';
import { initialState, reducer } from './reducer';
import { Workbench } from './styled';
import { cardBox } from './utils';

/**
 * The deck motion workbench.
 *
 * One document, one rAF loop, three panels reading from it. The controls the
 * deck page has always had — `qnt`, `scale`, `duration`, `positionH`,
 * `positionV`, `animation`, `easing` and the five spawn actions — are all still
 * here; they now write into a timeline instead of into seven loose variables,
 * which is what lets several cards move differently within one motion.
 */
function Item() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [animation, setAnimation] = useState('');
  const [copied, setCopied] = useState(false);

  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));

  const stageRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef(state.doc.playhead);

  playheadRef.current = state.doc.playhead;

  const { playing } = state.view;
  const { duration, speed, repeat, delay } = state.doc;

  /**
   * The one loop. It advances by real elapsed time rather than counting frames,
   * so the playhead, the cards and the timeline can never drift apart.
   *
   * Reduced motion is deliberately not consulted here: playback is the content
   * of this page, not decoration. The shell's own transitions are what the
   * global reduced-motion rule turns off.
   */
  useEffect(() => {
    if (!playing || duration <= 0) return;

    let frame = 0;
    let previous = performance.now();
    let direction = 1;
    // Held here rather than read back from the ref each frame: if React batches
    // a render away, reading the ref would replay the same delta twice.
    let current = playheadRef.current;

    const tick = (now: number) => {
      const elapsed = ((now - previous) / 1000) * speed * direction;

      previous = now;

      let next = current + elapsed;

      if (repeat === 'yoyo') {
        if (next >= duration) {
          next = duration - (next - duration);
          direction = -1;
        } else if (next <= 0) {
          next = -next;
          direction = 1;
        }
      } else if (next > duration) {
        if (repeat === 'once') {
          dispatch({ type: 'set-playhead', value: duration });
          dispatch({ type: 'set-playing', value: false });

          return;
        }

        next -= duration;
      }

      current = clamp(next, 0, duration);
      dispatch({ type: 'set-playhead', value: current });
      frame = requestAnimationFrame(tick);
    };

    // `delay` holds the start back the way it will in the app.
    const start = window.setTimeout(
      () => {
        previous = performance.now();
        current = playheadRef.current;
        frame = requestAnimationFrame(tick);
      },
      playheadRef.current === 0 ? delay * 1000 : 0,
    );

    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(frame);
    };
  }, [playing, duration, speed, repeat, delay]);

  /** Delete removes the selected keys, wherever focus happens to be. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        dispatch({ type: 'delete-keys' });
      }

      if (event.key === ' ') {
        event.preventDefault();
        dispatch({ type: 'set-playing', value: !playing });
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playing]);

  /** Measured, not guessed — the card is scaled and the stage is fluid. */
  const centre = useCallback(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const toPercent = (available: number, size: number) =>
      available > 0 ? ((available - size) / 2 / available) * 100 : 0;

    dispatch({
      type: 'set-base',
      property: 'position',
      value: {
        x: toPercent(stage.clientWidth, cardBox.width),
        y: toPercent(stage.clientHeight, cardBox.height),
      },
    });
  }, []);

  // The stage opens with the card centred rather than in the corner.
  const hasCentred = useRef(false);

  useEffect(() => {
    if (hasCentred.current) return;

    hasCentred.current = true;
    centre();
  }, [centre]);

  const applyAnimation = (value: string) => {
    dispatch({ type: 'apply-animation', value, previous: animation });
    setAnimation(value);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toCss(state.doc));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access is refused often enough that failing loudly here would
      // only be noise; the code is regenerated on every click anyway.
      setCopied(false);
    }
  };

  return (
    <Workbench>
      <Layers state={state} dispatch={dispatch} />
      <Stage state={state} dispatch={dispatch} stageRef={stageRef} onCenter={centre} />
      <Inspector
        state={state}
        dispatch={dispatch}
        animation={animation}
        onAnimation={applyAnimation}
      />
      <Timeline
        state={state}
        dispatch={dispatch}
        onCopy={copy}
        copied={copied}
        compact={isCompact}
      />
    </Workbench>
  );
}

export default Item;
