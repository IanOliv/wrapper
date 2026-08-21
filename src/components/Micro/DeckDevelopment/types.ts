/** One numeric control: the value plus the bounds its slider is drawn from. */
interface Attribute {
  value: number;
  min: number;
  max: number;
  step: number;
}

/**
 * The same attribute set `Micro/DeckArea` already drives its cards with —
 * `qnt, scale, duration, positionH, positionV` plus the `left`/`top` fan
 * scalars. The workbench re-groups them; it does not add to them.
 */
interface DeckAttributes {
  left: Attribute;
  top: Attribute;
  qnt: Attribute;
  scale: Attribute;
  duration: Attribute;
  positionH: Attribute;
  positionV: Attribute;
}

type AttributeName = keyof DeckAttributes;

interface CardDetails {
  cardName: string;
  cardImage: string;
}

interface SelectOption {
  value: string;
  label: string;
}

/** One of the five spawn actions — a named point in the position field. */
interface SpawnPoint {
  label: string;
  positionH: number;
  positionV: number;
}

/**
 * Values the mockups use that have no home in `theme.shell`, because only this
 * module needs them. Resolved per mode so the workbench survives light too.
 */
interface WorkbenchTokens {
  /** the inspector ground, one step off the page ground */
  inspector: string;
  /** the dot of the stage grid */
  dot: string;
  /** mono readouts and group labels — between text.secondary and text.disabled */
  muted: string;
  /** the ring around a slider knob */
  knobRing: string;
  /** the stage card's placeholder image area */
  imageArea: string;
  /** the halo a focused select carries alongside its accent border */
  selectFocusRing: string;
}

export type {
  Attribute,
  AttributeName,
  CardDetails,
  DeckAttributes,
  SelectOption,
  SpawnPoint,
  WorkbenchTokens,
};
