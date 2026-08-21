import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import Inspector from './Inspector';
import Stage from './Stage';
import { Workbench } from './styled';
import type { AttributeName, CardDetails, DeckAttributes } from './types';
import { clamp, defaultAttributes, snap } from './utils';

const cardDetails: CardDetails = {
  cardName: 'cardDetailsExample',
  cardImage: '/assets/iso.jpg',
};

/**
 * The deck workbench. Same controls the deck page has always had — `qnt`,
 * `scale`, `duration`, `positionH`, `positionV`, `animation`, `easing` and the
 * five spawn actions — but the card gets the stage and the controls get a
 * fixed inspector, grouped by what they do. No global state: everything here
 * is local, exactly as it is on `Micro/DeckArea`.
 */
function Item() {
  const [attributes, setAttributes] = useState<DeckAttributes>(defaultAttributes);
  const [animation, setAnimation] = useState('breathing');
  const [easing, setEasing] = useState('ease-in-out');

  // View-only, never handed to a card
  const [zoom, setZoom] = useState(100);
  const [grid, setGrid] = useState(true);

  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const playheadRef = useRef(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const duration = attributes.duration.value;

  const seek = useCallback((value: number) => {
    playheadRef.current = value;
    setPlayhead(value);
  }, []);

  // The playhead is real elapsed time, so the knob and the card never drift.
  useEffect(() => {
    if (!playing || !duration) return;

    const start = performance.now() - playheadRef.current * 1000;
    let frame = requestAnimationFrame(function tick(now) {
      seek(((now - start) / 1000) % duration);
      frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
  }, [playing, duration, seek]);

  const setAttribute = useCallback((name: AttributeName, value: number) => {
    setAttributes((current) => ({ ...current, [name]: { ...current[name], value } }));
  }, []);

  const resetTransform = useCallback(() => {
    setAttributes((current) => ({
      ...current,
      scale: { ...current.scale, value: defaultAttributes.scale.value },
      positionH: { ...current.positionH, value: defaultAttributes.positionH.value },
      positionV: { ...current.positionV, value: defaultAttributes.positionV.value },
      left: { ...current.left, value: 0 },
    }));
  }, []);

  /** The old "set left" button: the 2.6% fan offset between stacked cards. */
  const setLeft = useCallback(
    () => setAttribute('left', defaultAttributes.left.value),
    [setAttribute],
  );

  const spawn = useCallback((positionH: number, positionV: number) => {
    setAttributes((current) => ({
      ...current,
      positionH: { ...current.positionH, value: positionH },
      positionV: { ...current.positionV, value: positionV },
    }));
  }, []);

  /** Measured, not guessed — the card is scaled and the stage is fluid. */
  const centre = useCallback(() => {
    const stage = stageRef.current;
    const card = cardRef.current;

    if (!stage || !card) return;

    const bounds = card.getBoundingClientRect();
    const toPercent = (available: number, size: number) =>
      available > 0 ? ((available - size) / 2 / available) * 100 : 0;

    setAttributes((current) => {
      const { positionH, positionV } = current;

      return {
        ...current,
        positionH: {
          ...positionH,
          value: clamp(
            snap(toPercent(stage.clientWidth, bounds.width), positionH.step),
            positionH.min,
            positionH.max,
          ),
        },
        positionV: {
          ...positionV,
          value: clamp(
            snap(toPercent(stage.clientHeight, bounds.height), positionV.step),
            positionV.min,
            positionV.max,
          ),
        },
      };
    });
  }, []);

  // The stage opens with the card centred, as the mock shows. `positionH` and
  // `positionV` stay a top-left percentage field, which is what makes the spawn
  // points mean the same thing they mean on the existing deck page.
  const hasCentred = useRef(false);

  useLayoutEffect(() => {
    if (hasCentred.current) return;

    hasCentred.current = true;
    centre();
  }, [centre]);

  const togglePlay = useCallback(() => {
    // Reduced motion gets the end state instead of a loop it did not ask for.
    if (prefersReducedMotion) {
      seek(duration);

      return;
    }

    setPlaying((current) => !current);
  }, [prefersReducedMotion, duration, seek]);

  /** The stage's own reset: playback and the view, not the values. */
  const resetStage = useCallback(() => {
    setPlaying(false);
    seek(0);
    setZoom(100);
    setGrid(true);
  }, [seek]);

  const scrub = useCallback(
    (value: number) => {
      setPlaying(false);
      seek(value);
    },
    [seek],
  );

  return (
    <Workbench>
      <Stage
        attributes={attributes}
        animation={animation}
        easing={easing}
        details={cardDetails}
        zoom={zoom}
        grid={grid}
        playing={playing}
        playhead={playhead}
        stageRef={stageRef}
        cardRef={cardRef}
        onZoom={setZoom}
        onToggleGrid={() => setGrid((current) => !current)}
        onCenter={centre}
        onTogglePlay={togglePlay}
        onReset={resetStage}
        onScrub={scrub}
      />

      <Inspector
        attributes={attributes}
        animation={animation}
        easing={easing}
        count={Math.round(attributes.qnt.value)}
        onAttribute={setAttribute}
        onAnimation={setAnimation}
        onEasing={setEasing}
        onResetTransform={resetTransform}
        onSetLeft={setLeft}
        onSpawn={spawn}
      />
    </Workbench>
  );
}

export default Item;
