/** A point in the stage's percentage field. */
interface Vec2 {
  x: number;
  y: number;
}

/** Euler rotation in degrees. `z` is the only axis shown until 3D is on. */
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** The four things a track can drive. */
type TrackProperty = 'position' | 'scale' | 'rotate' | 'opacity';

/** `position` carries a point, `rotate` three angles, the rest a single number. */
type KeyValue = number | Vec2 | Vec3;

/** A cubic-bezier as the four numbers CSS itself takes. */
type Bezier = [number, number, number, number];

type Repeat = 'once' | 'loop' | 'yoyo';

type Trigger = 'mount' | 'click' | 'hover' | 'state';

/** The static pose a layer holds on any property that has no keys. */
interface BaseTransform {
  position: Vec2;
  scale: number;
  rotate: Vec3;
  opacity: number;
}

interface Layer {
  id: string;
  name: string;
  /** groups nest one level: a child names its parent here */
  parentId: string | null;
  hidden: boolean;
  solo: boolean;
  collapsed: boolean;
  /** the colour chip in the timeline gutter */
  color: string;
  base: BaseTransform;
}

interface Track {
  id: string;
  layerId: string;
  property: TrackProperty;
}

interface Key {
  id: string;
  trackId: string;
  /** seconds from the start of the timeline */
  t: number;
  value: KeyValue;
  /** the curve LEAVING this key — easing is a property of the segment after it */
  easing: Bezier;
  /** spatial handles, position tracks only; absent means a straight segment */
  tangentIn?: Vec2;
  tangentOut?: Vec2;
}

/**
 * The animation document. This is the one genuinely new piece of state — every
 * panel reads from it, and a single rAF loop advances `playhead`.
 */
interface DeckDocument {
  layers: Layer[];
  tracks: Track[];
  keys: Key[];
  duration: number;
  trigger: Trigger;
  repeat: Repeat;
  delay: number;
  stagger: number;
  speed: number;
  playhead: number;
  /** not animated — the depth the stage renders 3D rotations through */
  perspective: number;
}

interface Selection {
  layerIds: string[];
  keyIds: string[];
}

/** Everything that is about looking at the document rather than being it. */
interface ViewState {
  zoom: number;
  grid: boolean;
  motionPath: boolean;
  three: boolean;
  onionSkin: boolean;
  playing: boolean;
  recording: boolean;
  activePreset: string | null;
  /** the segment whose bezier the inspector is editing, as a key id */
  bezierKeyId: string | null;
}

interface WorkbenchState {
  doc: DeckDocument;
  selection: Selection;
  view: ViewState;
}

/** A layer's pose at one instant, ready to be turned into a transform. */
interface Pose extends BaseTransform {
  hidden: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface EasingOption extends SelectOption {
  /** absent for "Custom bezier", which keeps whatever the editor holds */
  bezier?: Bezier;
}

/** One of the five spawn actions — a named point in the position field. */
interface SpawnPoint {
  label: string;
  positionH: number;
  positionV: number;
}

/** A named motion, expressed as keys rather than as CSS. */
interface AnimationPreset {
  value: string;
  label: string;
  property: TrackProperty;
  /** normalised stops, 0..1, scaled to the document duration when applied */
  stops: { at: number; value: KeyValue }[];
}

/**
 * Values the mockups use that have no home in `theme.shell`, because only this
 * module needs them. Resolved per mode so the workbench survives light too.
 */
interface WorkbenchTokens {
  /** the panel ground, one step off the page ground */
  panel: string;
  /** the dot of the stage grid */
  dot: string;
  /** mono readouts and group labels — between text.secondary and text.disabled */
  muted: string;
  /** the ring around a slider knob, and the summarised timeline bar */
  knobRing: string;
  /** the stage card's placeholder image area */
  imageArea: string;
  /** the halo a focused select carries alongside its accent border */
  selectFocusRing: string;
}

export type {
  AnimationPreset,
  BaseTransform,
  Bezier,
  DeckDocument,
  EasingOption,
  Key,
  KeyValue,
  Layer,
  Pose,
  Repeat,
  SelectOption,
  Selection,
  SpawnPoint,
  Track,
  TrackProperty,
  Trigger,
  Vec2,
  Vec3,
  ViewState,
  WorkbenchState,
  WorkbenchTokens,
};
