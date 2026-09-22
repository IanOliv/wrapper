import { animationPresets, layerPresets } from './animations';
import { defaultEasing } from './bezier';
import {
  cardLayers,
  childrenOf,
  clamp,
  createDocument,
  groupLayers,
  isVec2,
  isVec3,
  keysOf,
  makeKey,
  makeLayer,
  makeTracks,
  nextId,
  trackOf,
  trackProperties,
} from './model';
import type {
  BaseTransform,
  Bezier,
  DeckDocument,
  Key,
  KeyValue,
  Repeat,
  TrackProperty,
  Trigger,
  Vec2,
  WorkbenchState,
} from './types';

type Action =
  | { type: 'select-layers'; ids: string[]; additive?: boolean }
  | { type: 'toggle-hidden'; id: string }
  | { type: 'toggle-solo'; id: string }
  | { type: 'toggle-collapsed'; id: string }
  | { type: 'add-layer' }
  | { type: 'set-quantity'; count: number }
  | { type: 'set-base'; property: TrackProperty; value: KeyValue }
  | { type: 'spawn'; positionH: number; positionV: number }
  | { type: 'reset-transform' }
  | { type: 'set-left' }
  | { type: 'add-key'; property?: TrackProperty }
  | { type: 'add-key-at'; trackId: string; t: number }
  | { type: 'move-keys'; ids: string[]; delta: number; duplicate?: boolean }
  | { type: 'set-key-value'; id: string; value: KeyValue }
  | { type: 'set-tangent'; id: string; side: 'in' | 'out'; value: Vec2 }
  | { type: 'select-keys'; ids: string[]; additive?: boolean }
  | { type: 'delete-keys' }
  | { type: 'set-easing'; bezier: Bezier; ids?: string[] }
  | { type: 'edit-bezier'; keyId: string | null }
  | { type: 'apply-animation'; value: string; previous?: string }
  | { type: 'apply-preset'; value: string }
  | { type: 'set-duration'; value: number }
  | { type: 'set-number'; field: 'delay' | 'stagger' | 'speed' | 'perspective'; value: number }
  | { type: 'set-repeat'; value: Repeat }
  | { type: 'set-trigger'; value: Trigger }
  | { type: 'set-playhead'; value: number }
  | { type: 'toggle-view'; field: 'grid' | 'motionPath' | 'three' | 'onionSkin' | 'recording' }
  | { type: 'set-zoom'; value: number }
  | { type: 'set-playing'; value: boolean }
  | { type: 'reset-stage' };

const initialState = (): WorkbenchState => {
  const doc = createDocument();

  return {
    doc,
    selection: { layerIds: [cardLayers(doc)[0].id], keyIds: [] },
    view: {
      zoom: 100,
      grid: true,
      motionPath: false,
      three: false,
      onionSkin: false,
      playing: false,
      recording: false,
      activePreset: null,
      bezierKeyId: null,
    },
  };
};

/** The layers an edit applies to: the selection, or the one card if none. */
const targets = (state: WorkbenchState) =>
  state.selection.layerIds.length
    ? state.selection.layerIds
    : cardLayers(state.doc)
        .slice(0, 1)
        .map((layer) => layer.id);

const baseFor = (doc: DeckDocument, layerId: string) =>
  doc.layers.find((layer) => layer.id === layerId)?.base;

/** Replace every key on a track, used when an animation is (re)applied. */
const withoutTrack = (keys: Key[], trackId: string) =>
  keys.filter((key) => key.trackId !== trackId);

const writeKey = (
  doc: DeckDocument,
  layerId: string,
  property: TrackProperty,
  t: number,
  value: KeyValue,
) => {
  const track = trackOf(doc, layerId, property);

  if (!track) return doc;

  const existing = doc.keys.find(
    (key) => key.trackId === track.id && Math.abs(key.t - t) < 1 / 120,
  );

  if (existing) {
    return {
      ...doc,
      keys: doc.keys.map((key) => (key.id === existing.id ? { ...key, value } : key)),
    };
  }

  return { ...doc, keys: [...doc.keys, makeKey(track.id, t, value)] };
};

/**
 * Resolve one relative stop against the pose the layer is actually holding:
 * offsets for the two spatial properties, factors for the two scalar ones.
 * This is what keeps "Ambient" a hover in place rather than a jump to 0,0.
 */
const resolve = (property: TrackProperty, base: BaseTransform, stop: KeyValue): KeyValue => {
  if (property === 'position' && isVec2(stop)) {
    return { x: base.position.x + stop.x, y: base.position.y + stop.y };
  }

  if (property === 'rotate' && isVec3(stop)) {
    return {
      x: base.rotate.x + stop.x,
      y: base.rotate.y + stop.y,
      z: base.rotate.z + stop.z,
    };
  }

  if (property === 'scale') return base.scale * (stop as number);

  return base.opacity * (stop as number);
};

/** Lay an animation's stops down as real keys on one layer. */
const applyAnimation = (doc: DeckDocument, layerId: string, value: string): DeckDocument => {
  const preset = animationPresets.find((candidate) => candidate.value === value);
  const track = preset ? trackOf(doc, layerId, preset.property) : undefined;
  const base = baseFor(doc, layerId);

  if (!preset || !track || !base) return doc;

  const laid = preset.stops.map((stop) =>
    makeKey(track.id, stop.at * doc.duration, resolve(preset.property, base, stop.value)),
  );

  return { ...doc, keys: [...withoutTrack(doc.keys, track.id), ...laid] };
};

/** Take back what a named animation laid down, leaving hand-made keys alone. */
const clearAnimation = (doc: DeckDocument, layerId: string, value: string): DeckDocument => {
  const preset = animationPresets.find((candidate) => candidate.value === value);
  const track = preset ? trackOf(doc, layerId, preset.property) : undefined;

  if (!track) return doc;

  return { ...doc, keys: withoutTrack(doc.keys, track.id) };
};

function reducer(state: WorkbenchState, action: Action): WorkbenchState {
  const { doc, selection, view } = state;

  switch (action.type) {
    case 'select-layers':
      return {
        ...state,
        selection: {
          keyIds: [],
          layerIds: action.additive
            ? Array.from(new Set([...selection.layerIds, ...action.ids]))
            : action.ids,
        },
      };

    case 'toggle-hidden':
      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) =>
            layer.id === action.id ? { ...layer, hidden: !layer.hidden } : layer,
          ),
        },
      };

    case 'toggle-solo':
      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) =>
            layer.id === action.id ? { ...layer, solo: !layer.solo } : layer,
          ),
        },
      };

    case 'toggle-collapsed':
      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) =>
            layer.id === action.id ? { ...layer, collapsed: !layer.collapsed } : layer,
          ),
        },
      };

    case 'add-layer': {
      const group = groupLayers(doc)[0];
      const cards = cardLayers(doc);
      const layer = makeLayer(`Card ${cards.length + 1}`, doc.layers.length, group.id);
      const previous = cards[cards.length - 1]?.base;

      if (previous) {
        layer.base = {
          ...previous,
          rotate: { ...previous.rotate },
          position: { ...previous.position },
        };
      }

      return {
        ...state,
        doc: {
          ...doc,
          layers: [...doc.layers, layer],
          tracks: [...doc.tracks, ...makeTracks(layer.id)],
        },
        selection: { layerIds: [layer.id], keyIds: [] },
      };
    }

    // The `qnt` prop, expressed as how many card layers the document holds.
    case 'set-quantity': {
      const cards = cardLayers(doc);
      const count = Math.max(1, Math.round(action.count));

      if (count === cards.length) return state;

      if (count < cards.length) {
        const dropped = cards.slice(count).map((layer) => layer.id);
        const tracks = doc.tracks.filter((track) => !dropped.includes(track.layerId));
        const trackIds = tracks.map((track) => track.id);

        return {
          ...state,
          doc: {
            ...doc,
            layers: doc.layers.filter((layer) => !dropped.includes(layer.id)),
            tracks,
            keys: doc.keys.filter((key) => trackIds.includes(key.trackId)),
          },
          selection: {
            layerIds: selection.layerIds.filter((id) => !dropped.includes(id)),
            keyIds: [],
          },
        };
      }

      const group = groupLayers(doc)[0];
      // New cards land where the last one sits rather than at 0,0, so raising
      // the quantity stacks the deck instead of flinging cards into the corner.
      const previous = cards[cards.length - 1]?.base;
      const added = Array.from({ length: count - cards.length }, (_, index) => {
        const layer = makeLayer(
          `Card ${cards.length + index + 1}`,
          doc.layers.length + index,
          group.id,
        );

        if (previous)
          layer.base = {
            ...previous,
            rotate: { ...previous.rotate },
            position: { ...previous.position },
          };

        return layer;
      });

      return {
        ...state,
        doc: {
          ...doc,
          layers: [...doc.layers, ...added],
          tracks: [...doc.tracks, ...added.flatMap((layer) => makeTracks(layer.id))],
        },
      };
    }

    /**
     * A slider writes a key when Record is armed, and otherwise moves the
     * layer's base pose — the behaviour every motion tool has, and what keeps
     * the sliders useful before a timeline exists.
     */
    case 'set-base': {
      const ids = targets(state);

      if (view.recording) {
        return {
          ...state,
          doc: ids.reduce(
            (next, id) => writeKey(next, id, action.property, doc.playhead, action.value),
            doc,
          ),
        };
      }

      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) =>
            ids.includes(layer.id)
              ? { ...layer, base: { ...layer.base, [action.property]: action.value } }
              : layer,
          ),
        },
      };
    }

    case 'spawn': {
      const ids = targets(state);
      const value = { x: action.positionH, y: action.positionV };

      if (view.recording) {
        return {
          ...state,
          doc: ids.reduce((next, id) => writeKey(next, id, 'position', doc.playhead, value), doc),
        };
      }

      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) =>
            ids.includes(layer.id) ? { ...layer, base: { ...layer.base, position: value } } : layer,
          ),
        },
      };
    }

    case 'reset-transform': {
      const ids = targets(state);
      const fresh = createDocument().layers[1].base;

      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) =>
            ids.includes(layer.id) ? { ...layer, base: { ...fresh } } : layer,
          ),
        },
      };
    }

    /** The old "set left" button: the 2.6% fan offset between stacked cards. */
    case 'set-left': {
      const ids = targets(state);
      const cards = cardLayers(doc);
      const anchorX = cards[0]?.base.position.x ?? 0;

      return {
        ...state,
        doc: {
          ...doc,
          layers: doc.layers.map((layer) => {
            if (!ids.includes(layer.id)) return layer;

            // The fan offset counts from the first card, not from wherever this
            // layer happens to sit in the document.
            const order = cards.findIndex((card) => card.id === layer.id);

            return {
              ...layer,
              base: {
                ...layer.base,
                position: { ...layer.base.position, x: anchorX + 2.6 * Math.max(0, order) },
              },
            };
          }),
        },
      };
    }

    /** The diamond button: a key at the playhead for every property at once. */
    case 'add-key': {
      const ids = targets(state);
      const properties = action.property ? [action.property] : trackProperties;

      return {
        ...state,
        doc: ids.reduce(
          (next, id) =>
            properties.reduce((inner, property) => {
              const base = baseFor(inner, id);

              if (!base) return inner;

              return writeKey(inner, id, property, inner.playhead, base[property]);
            }, next),
          doc,
        ),
      };
    }

    /** Double-click on empty track: a key at that time, holding the value there. */
    case 'add-key-at': {
      const track = doc.tracks.find((candidate) => candidate.id === action.trackId);
      const base = track ? baseFor(doc, track.layerId) : undefined;

      if (!track || !base) return state;

      const key = makeKey(track.id, action.t, base[track.property]);

      return { ...state, doc: { ...doc, keys: [...doc.keys, key] } };
    }

    case 'move-keys': {
      if (action.duplicate) {
        const copies = doc.keys
          .filter((key) => action.ids.includes(key.id))
          .map((key) => ({
            ...key,
            id: nextId('key'),
            t: clamp(key.t + action.delta, 0, doc.duration),
          }));

        return {
          ...state,
          doc: { ...doc, keys: [...doc.keys, ...copies] },
          selection: { ...selection, keyIds: copies.map((key) => key.id) },
        };
      }

      return {
        ...state,
        doc: {
          ...doc,
          keys: doc.keys.map((key) =>
            action.ids.includes(key.id)
              ? { ...key, t: clamp(key.t + action.delta, 0, doc.duration) }
              : key,
          ),
        },
      };
    }

    case 'set-key-value':
      return {
        ...state,
        doc: {
          ...doc,
          keys: doc.keys.map((key) =>
            key.id === action.id ? { ...key, value: action.value } : key,
          ),
        },
      };

    case 'set-tangent':
      return {
        ...state,
        doc: {
          ...doc,
          keys: doc.keys.map((key) =>
            key.id === action.id
              ? { ...key, [action.side === 'in' ? 'tangentIn' : 'tangentOut']: action.value }
              : key,
          ),
        },
      };

    case 'select-keys':
      return {
        ...state,
        selection: {
          ...selection,
          keyIds: action.additive
            ? Array.from(new Set([...selection.keyIds, ...action.ids]))
            : action.ids,
        },
      };

    case 'delete-keys':
      return {
        ...state,
        doc: { ...doc, keys: doc.keys.filter((key) => !selection.keyIds.includes(key.id)) },
        selection: { ...selection, keyIds: [] },
      };

    case 'set-easing': {
      const ids = action.ids ?? selection.keyIds;

      return {
        ...state,
        doc: {
          ...doc,
          keys: doc.keys.map((key) =>
            ids.includes(key.id) ? { ...key, easing: action.bezier } : key,
          ),
        },
      };
    }

    case 'edit-bezier':
      return { ...state, view: { ...view, bezierKeyId: action.keyId } };

    case 'apply-animation': {
      const ids = targets(state);

      // Only the outgoing animation's own track is cleared, so switching from
      // Flip to Fade does not quietly delete keys you placed by hand.
      const cleaned = action.previous
        ? ids.reduce((next, id) => clearAnimation(next, id, action.previous as string), doc)
        : doc;

      if (!action.value) {
        return { ...state, doc: cleaned, view: { ...view, activePreset: null } };
      }

      return {
        ...state,
        doc: ids.reduce((next, id) => applyAnimation(next, id, action.value), cleaned),
      };
    }

    /**
     * A preset is a whole timeline: it lays each of its parts down across the
     * selection and sets the stagger that makes them read as one move.
     */
    case 'apply-preset': {
      const preset = layerPresets.find((candidate) => candidate.value === action.value);

      if (!preset) return state;

      const ids = targets(state);
      const next = ids.reduce(
        (outer, id) => preset.parts.reduce((inner, part) => applyAnimation(inner, id, part), outer),
        doc,
      );

      return {
        ...state,
        doc: { ...next, stagger: preset.stagger },
        view: { ...view, activePreset: preset.value },
      };
    }

    case 'set-duration': {
      const duration = Math.max(0.1, action.value);
      const factor = duration / doc.duration;

      // Keys hold their place in the animation rather than their raw second.
      return {
        ...state,
        doc: {
          ...doc,
          duration,
          keys: doc.keys.map((key) => ({ ...key, t: key.t * factor })),
          playhead: clamp(doc.playhead * factor, 0, duration),
        },
      };
    }

    case 'set-number':
      return { ...state, doc: { ...doc, [action.field]: action.value } };

    case 'set-repeat':
      return { ...state, doc: { ...doc, repeat: action.value } };

    case 'set-trigger':
      return { ...state, doc: { ...doc, trigger: action.value } };

    case 'set-playhead':
      return { ...state, doc: { ...doc, playhead: clamp(action.value, 0, doc.duration) } };

    case 'toggle-view':
      return { ...state, view: { ...view, [action.field]: !view[action.field] } };

    case 'set-zoom':
      return { ...state, view: { ...view, zoom: action.value } };

    case 'set-playing':
      return { ...state, view: { ...view, playing: action.value } };

    /** The stage's own reset: playback and the view, not the document's values. */
    case 'reset-stage':
      return {
        ...state,
        doc: { ...doc, playhead: 0 },
        view: { ...view, playing: false, zoom: 100, grid: true },
      };

    default:
      return state;
  }
}

/** How many keys a track holds — the timeline asks this a lot. */
const keyCount = (state: WorkbenchState, trackId: string) => keysOf(state.doc, trackId).length;

/** Cards under a group, for the summarised bar and for stagger ordering. */
const orderedCards = (state: WorkbenchState) =>
  groupLayers(state.doc).flatMap((group) => childrenOf(state.doc, group.id));

export type { Action };
export { defaultEasing, initialState, keyCount, orderedCards, reducer };
