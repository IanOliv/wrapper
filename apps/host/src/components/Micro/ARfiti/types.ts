import type { Dispatch, SetStateAction } from 'react';

/**
 * The state of a piece on the map. `selected` is never stored — it is derived
 * from the single `selectedId`, so the pin, the row and the sheet can never
 * disagree. See `resolveState` in `./utils`.
 */
type PieceState = 'default' | 'selected' | 'inserting' | 'claimed' | 'out-of-range';

interface Piece {
  id: string;
  title: string;
  author: string;
  lat: number;
  lng: number;
  distanceM: number;
  thumbUrl?: string;
  /** ground for the placeholder thumb while there is no `thumbUrl` */
  accent?: string;
  state: Exclude<PieceState, 'selected'>;
  /** an insert whose upload rejected — the row keeps a Retry */
  failed?: boolean;
}

type Filter = 'all' | 'unclaimed' | 'mine';

type Sort = 'nearby' | 'recent';

type Detent = 'peek' | 'half' | 'full';

type Flow = 'browse' | 'scan' | 'claim';

type PermissionState = 'prompt' | 'granted' | 'denied';

interface Permissions {
  location: PermissionState;
  camera: PermissionState;
}

/** the map viewport — one centre, one zoom, panned by selecting a piece */
interface View {
  lat: number;
  lng: number;
  zoom: number;
}

interface Size {
  width: number;
  height: number;
}

interface ARfitiState {
  pieces: Piece[];
  visible: Piece[];
  selectedId: string | null;
  selected: Piece | null;
  filter: Filter;
  sort: Sort;
  query: string;
  sheetDetent: Detent;
  permissions: Permissions;
  flow: Flow;
  view: View;
}

interface ARfitiActions {
  select: (id: string | null) => void;
  setFilter: (filter: Filter) => void;
  setSort: (sort: Sort) => void;
  setQuery: (query: string) => void;
  setSheetDetent: Dispatch<SetStateAction<Detent>>;
  zoom: (direction: 1 | -1) => void;
  recenter: () => void;
  enableLocation: () => void;
  startScan: () => void;
  cancelFlow: () => void;
  matched: () => void;
  claim: () => void;
  insert: () => void;
  retryInsert: (id: string) => void;
  setCamera: (state: PermissionState) => void;
}

type PieceRowProps = {
  piece: Piece;
  state: PieceState;
  /** whether this row holds the one filled accent element, or an outline */
  emphasis: 'filled' | 'outlined';
  /** the desktop panel's tighter action row: "Scan" at 30px, not "Scan to claim" */
  compact: boolean;
  onSelect: (id: string) => void;
  onScan: () => void;
  onRetry: (id: string) => void;
};

export type {
  ARfitiActions,
  ARfitiState,
  Detent,
  Filter,
  Flow,
  PermissionState,
  Permissions,
  Piece,
  PieceRowProps,
  PieceState,
  Size,
  Sort,
  View,
};
