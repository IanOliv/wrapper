import { cssBezier } from './bezier';
import { cardLayers, isVec2, isVec3, keysOf, trackOf, trackProperties } from './model';
import type { DeckDocument, KeyValue, TrackProperty } from './types';

/** How each property reads inside a keyframe block. */
const declaration = (property: TrackProperty, value: KeyValue): string => {
  if (property === 'opacity') return `opacity: ${Number(value).toFixed(2)};`;

  if (property === 'position' && isVec2(value)) {
    return `translate: ${value.x.toFixed(2)}% ${value.y.toFixed(2)}%;`;
  }

  if (property === 'rotate' && isVec3(value)) {
    return `rotate: ${value.z.toFixed(1)}deg;\n    transform: rotateX(${value.x.toFixed(
      1,
    )}deg) rotateY(${value.y.toFixed(1)}deg);`;
  }

  if (property === 'scale') return `scale: ${Number(value).toFixed(3)};`;

  return '';
};

const iteration = (doc: DeckDocument) => {
  if (doc.repeat === 'once') return '1';

  return 'infinite';
};

const direction = (doc: DeckDocument) => (doc.repeat === 'yoyo' ? 'alternate' : 'normal');

/**
 * The timeline as CSS. Per-segment easing is emitted as an
 * `animation-timing-function` inside each stop, which is exactly how CSS lets a
 * single animation change curve partway through — so the paste is the animation,
 * not an approximation of it.
 */
const toCss = (doc: DeckDocument): string => {
  const cards = cardLayers(doc);
  const blocks: string[] = [];

  cards.forEach((layer, index) => {
    // Read each track's keys once: this runs on every "Copy code" click and the
    // lookups are the expensive part.
    const keyed = trackProperties.flatMap((property) => {
      const track = trackOf(doc, layer.id, property);
      const keys = track ? keysOf(doc, track.id) : [];

      return keys.length ? [{ property, keys }] : [];
    });

    if (!keyed.length) return;

    // Collect every distinct time this layer has a key at, so one @keyframes
    // block can carry all of its properties.
    const times = Array.from(
      new Set(keyed.flatMap((entry) => entry.keys.map((key) => key.t))),
    ).sort((a, b) => a - b);

    const name = `deck-${layer.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const stops = times.map((t) => {
      const percent = doc.duration > 0 ? (t / doc.duration) * 100 : 0;
      const lines = keyed
        .map((entry) => {
          const key = entry.keys.find((candidate) => candidate.t === t);

          return key ? declaration(entry.property, key.value) : '';
        })
        .filter(Boolean);

      const leaving = keyed
        .map((entry) => entry.keys.find((candidate) => candidate.t === t))
        .find(Boolean);

      if (leaving) lines.push(`animation-timing-function: ${cssBezier(leaving.easing)};`);

      return `  ${percent.toFixed(2)}% {\n    ${lines.join('\n    ')}\n  }`;
    });

    const delay = doc.delay + index * doc.stagger;
    const shorthand = [
      `${name}`,
      `${(doc.duration / doc.speed).toFixed(2)}s`,
      'linear',
      `${delay.toFixed(2)}s`,
      iteration(doc),
      direction(doc),
      'both',
    ].join(' ');

    blocks.push(`@keyframes ${name} {\n${stops.join('\n')}\n}`);
    blocks.push(`.${name} {\n  animation: ${shorthand};\n}`);
  });

  if (!blocks.length) return '/* No keys yet — add one with the diamond button. */';

  const note = `/* ${cards.length} card${cards.length === 1 ? '' : 's'} · fires ${
    doc.trigger === 'mount' ? 'on mount' : `on ${doc.trigger}`
  } */`;

  return [note, ...blocks].join('\n\n');
};

export { toCss };
