import { defaultEasing, ease } from './bezier';
import type {
  BaseTransform,
  DeckDocument,
  Key,
  KeyValue,
  Layer,
  Pose,
  Track,
  TrackProperty,
  Vec2,
  Vec3,
} from './types';

/** Ids only have to be unique within one document, which lives in one page. */
let counter = 0;
const nextId = (prefix: string) => {
  counter += 1;

  return `${prefix}-${counter}`;
};

/** The colour chips in the timeline gutter, cycled as layers are added. */
const layerColors = ['#B5ABFC', '#79B8E0', '#67C99A', '#E5B769', '#F2777A', '#9690C9'];

const trackProperties: TrackProperty[] = ['position', 'scale', 'rotate', 'opacity'];

const propertyLabels: Record<TrackProperty, string> = {
  position: 'Position',
  scale: 'Scale',
  rotate: 'Rotate',
  opacity: 'Opacity',
};

/**
 * The pose a new card holds. `scale` and the position field keep the ranges the
 * existing deck page uses, so a value dialled in here means the same thing there.
 */
const baseTransform = (): BaseTransform => ({
  position: { x: 0, y: 0 },
  scale: 0.5,
  rotate: { x: 0, y: 0, z: 0 },
  opacity: 1,
});

const makeLayer = (name: string, index: number, parentId: string | null = null): Layer => ({
  id: nextId('layer'),
  name,
  parentId,
  hidden: false,
  solo: false,
  collapsed: false,
  color: layerColors[index % layerColors.length],
  base: baseTransform(),
});

const makeTracks = (layerId: string): Track[] =>
  trackProperties.map((property) => ({ id: nextId('track'), layerId, property }));

const makeKey = (trackId: string, t: number, value: KeyValue): Key => ({
  id: nextId('key'),
  trackId,
  t,
  value,
  easing: defaultEasing,
});

/** A document with one group holding one card — enough to see, nothing to undo. */
const createDocument = (): DeckDocument => {
  const group = makeLayer('Deck', 0);
  const card = makeLayer('Card 1', 1, group.id);

  // A group is a neutral multiplier, not a card: scale 1 so it composes
  // cleanly with whatever its children hold.
  group.base.scale = 1;

  return {
    layers: [group, card],
    tracks: [...makeTracks(group.id), ...makeTracks(card.id)],
    keys: [],
    duration: 1,
    trigger: 'mount',
    repeat: 'loop',
    delay: 0,
    stagger: 0.06,
    speed: 1,
    playhead: 0,
    perspective: 900,
  };
};

// ---------------------------------------------------------------------------
// Reading the document
// ---------------------------------------------------------------------------

const isVec2 = (value: KeyValue): value is Vec2 =>
  typeof value === 'object' && value !== null && !('z' in value);

const isVec3 = (value: KeyValue): value is Vec3 =>
  typeof value === 'object' && value !== null && 'z' in value;

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/**
 * A position segment is a cubic in space when either end carries a tangent, so
 * the motion path's handles bend the actual route rather than only its timing.
 */
const spatial = (from: Key, to: Key, u: number): Vec2 => {
  const p0 = from.value as Vec2;
  const p3 = to.value as Vec2;
  const out = from.tangentOut;
  const into = to.tangentIn;

  if (!out && !into) return { x: lerp(p0.x, p3.x, u), y: lerp(p0.y, p3.y, u) };

  const p1 = { x: p0.x + (out?.x ?? 0), y: p0.y + (out?.y ?? 0) };
  const p2 = { x: p3.x + (into?.x ?? 0), y: p3.y + (into?.y ?? 0) };
  const v = 1 - u;
  const [a, b, c, d] = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u];

  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

const blend = (from: Key, to: Key, u: number): KeyValue => {
  const a = from.value;
  const b = to.value;

  if (isVec2(a) && isVec2(b)) return spatial(from, to, u);

  if (isVec3(a) && isVec3(b)) {
    return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u) };
  }

  return lerp(a as number, b as number, u);
};

/** Keys of one track, in time order. */
const keysOf = (doc: DeckDocument, trackId: string) =>
  doc.keys.filter((key) => key.trackId === trackId).sort((a, b) => a.t - b.t);

const trackOf = (doc: DeckDocument, layerId: string, property: TrackProperty) =>
  doc.tracks.find((track) => track.layerId === layerId && track.property === property);

/** The value a track holds at time `t`, or undefined when it has no keys. */
const valueAt = (doc: DeckDocument, trackId: string, t: number): KeyValue | undefined => {
  const keys = keysOf(doc, trackId);

  if (!keys.length) return undefined;
  if (keys.length === 1 || t <= keys[0].t) return keys[0].value;

  const last = keys[keys.length - 1];

  if (t >= last.t) return last.value;

  const index = keys.findIndex((key, i) => keys[i + 1] && t < keys[i + 1].t && t >= key.t);
  const from = keys[Math.max(0, index)];
  const to = keys[Math.max(1, index + 1)];
  const span = to.t - from.t;
  const u = span > 0 ? ease(from.easing, (t - from.t) / span) : 1;

  return blend(from, to, u);
};

/**
 * A layer's pose at time `t`: keyed properties are interpolated, unkeyed ones
 * hold their base value. Stagger walks the cards apart in time so one timeline
 * can describe a deal.
 */
const localPoseAt = (doc: DeckDocument, layer: Layer, t: number, order = 0): Pose => {
  const shifted = t - order * doc.stagger;
  const read = <T extends KeyValue>(property: TrackProperty, fallback: T): T => {
    const track = trackOf(doc, layer.id, property);
    const value = track ? valueAt(doc, track.id, shifted) : undefined;

    return (value as T | undefined) ?? fallback;
  };

  return {
    position: read('position', layer.base.position),
    scale: read('scale', layer.base.scale),
    rotate: read('rotate', layer.base.rotate),
    opacity: read('opacity', layer.base.opacity),
    hidden: layer.hidden,
  };
};

/**
 * A layer's pose at time `t` with its group folded in. A group multiplies its
 * children rather than replacing them, which is what makes "fan out the whole
 * deck" a single edit on one row.
 */
const poseAt = (doc: DeckDocument, layer: Layer, t: number, order = 0): Pose => {
  const own = localPoseAt(doc, layer, t, order);
  const parent = layer.parentId
    ? doc.layers.find((candidate) => candidate.id === layer.parentId)
    : undefined;

  if (!parent) return own;

  const inherited = poseAt(doc, parent, t);

  return {
    position: {
      x: own.position.x + inherited.position.x,
      y: own.position.y + inherited.position.y,
    },
    scale: own.scale * inherited.scale,
    rotate: {
      x: own.rotate.x + inherited.rotate.x,
      y: own.rotate.y + inherited.rotate.y,
      z: own.rotate.z + inherited.rotate.z,
    },
    opacity: own.opacity * inherited.opacity,
    hidden: own.hidden || inherited.hidden,
  };
};

/** Cards are the leaves; groups are structure and never draw. */
const cardLayers = (doc: DeckDocument) => doc.layers.filter((layer) => layer.parentId !== null);

const groupLayers = (doc: DeckDocument) => doc.layers.filter((layer) => layer.parentId === null);

const childrenOf = (doc: DeckDocument, layerId: string) =>
  doc.layers.filter((layer) => layer.parentId === layerId);

/** Solo wins over hidden: if anything is soloed, only soloed branches draw. */
const isVisible = (doc: DeckDocument, layer: Layer) => {
  const soloing = doc.layers.some((candidate) => candidate.solo);
  const parent = layer.parentId
    ? doc.layers.find((candidate) => candidate.id === layer.parentId)
    : undefined;

  if (layer.hidden || parent?.hidden) return false;
  if (!soloing) return true;

  return layer.solo || Boolean(parent?.solo);
};

/** The extent a layer's keys cover, used for the summarised bar in the gutter. */
const extentOf = (doc: DeckDocument, layerId: string): [number, number] | null => {
  const ids = [layerId, ...childrenOf(doc, layerId).map((child) => child.id)];
  const times = doc.tracks
    .filter((track) => ids.includes(track.layerId))
    .flatMap((track) => keysOf(doc, track.id).map((key) => key.t));

  if (!times.length) return null;

  return [Math.min(...times), Math.max(...times)];
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Keys snap to a frame at 60fps unless Shift is held. */
const snapTime = (t: number, free: boolean) => (free ? t : Math.round(t * 60) / 60);

export {
  baseTransform,
  cardLayers,
  childrenOf,
  clamp,
  createDocument,
  extentOf,
  groupLayers,
  isVec2,
  isVec3,
  isVisible,
  keysOf,
  layerColors,
  localPoseAt,
  makeKey,
  makeLayer,
  makeTracks,
  nextId,
  poseAt,
  propertyLabels,
  snapTime,
  trackOf,
  trackProperties,
  valueAt,
};
