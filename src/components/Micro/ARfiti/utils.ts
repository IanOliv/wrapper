import { HOME } from './data';
import type { Filter, Piece, PieceState, Sort, View } from './types';

// ---------------------------------------------------------------------------
// Projection
// ---------------------------------------------------------------------------

/**
 * A neighbourhood is small enough that a flat projection is honest: pixels per
 * degree, latitude flipped because screen y grows downward. Everything is
 * measured from `HOME`, so a pin's world position never depends on the view —
 * only the layer's offset does, and that is what pans.
 */
const PX_PER_DEG = 42000;

function worldOf(point: { lat: number; lng: number }, zoom: number) {
  return {
    x: (point.lng - HOME.lng) * PX_PER_DEG * zoom,
    y: -(point.lat - HOME.lat) * PX_PER_DEG * zoom,
  };
}

/** a point's offset in pixels from the centre of the map viewport */
function project(point: { lat: number; lng: number }, view: View) {
  const world = worldOf(point, view.zoom);
  const centre = worldOf(view, view.zoom);

  return { x: world.x - centre.x, y: world.y - centre.y };
}

/** the lat/lng under the centre of the viewport — where an insert drops */
function centreOf(view: View) {
  return { lat: view.lat, lng: view.lng };
}

const ZOOM_MIN = 0.45;
const ZOOM_MAX = 2.6;
const ZOOM_STEP = 1.35;

function zoomBy(zoom: number, direction: 1 | -1) {
  const next = direction === 1 ? zoom * ZOOM_STEP : zoom / ZOOM_STEP;

  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(next.toFixed(3))));
}

// ---------------------------------------------------------------------------
// Piece state
// ---------------------------------------------------------------------------

/**
 * The one place `selected` is decided. A piece stores what it *is*; being the
 * subject of the moment is a property of the screen, not of the piece.
 */
function resolveState(piece: Piece, selectedId: string | null): PieceState {
  if (piece.state === 'inserting') return 'inserting';
  if (piece.id === selectedId) return 'selected';

  return piece.state;
}

function isMine(piece: Piece) {
  return piece.state === 'claimed';
}

function matchesFilter(piece: Piece, filter: Filter) {
  // an insert in flight is always yours and always shown, whatever the filter
  if (piece.state === 'inserting') return true;
  if (filter === 'mine') return isMine(piece);
  if (filter === 'unclaimed') return !isMine(piece);

  return true;
}

function matchesQuery(piece: Piece, query: string) {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) return true;

  return (
    piece.title.toLowerCase().includes(trimmed) || piece.author.toLowerCase().includes(trimmed)
  );
}

function sortPieces(pieces: Piece[], sort: Sort) {
  const ordered = [...pieces];

  // an insert in flight stays at the top of the list whatever the sort
  ordered.sort((a, b) => {
    if (a.state === 'inserting' && b.state !== 'inserting') return -1;
    if (b.state === 'inserting' && a.state !== 'inserting') return 1;
    if (sort === 'nearby') return a.distanceM - b.distanceM;

    return 0;
  });

  return ordered;
}

function visiblePieces(pieces: Piece[], filter: Filter, query: string, sort: Sort) {
  return sortPieces(
    pieces.filter((piece) => matchesFilter(piece, filter) && matchesQuery(piece, query)),
    sort,
  );
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function formatDistance(metres: number) {
  if (metres < 1000) return `${Math.round(metres)} m`;

  return `${(metres / 1000).toFixed(1)} km`;
}

/** "Unclaimed · 18 m" — the row's meta line */
function metaFor(piece: Piece) {
  const distance = formatDistance(piece.distanceM);

  if (piece.state === 'inserting') return piece.failed ? 'Upload failed' : 'Uploading…';
  if (piece.state === 'claimed') return `Claimed · ${distance}`;
  if (piece.state === 'out-of-range') return `Out of range · ${distance}`;

  return `Unclaimed · ${distance}`;
}

/** a stable placeholder ground when a piece has no thumb yet */
function thumbGround(piece: Piece) {
  const accent = piece.accent ?? '#5A5E78';

  return `linear-gradient(135deg, ${accent}44 0%, ${accent}22 46%, #10121C 100%)`;
}

// ---------------------------------------------------------------------------
// The insert upload
// ---------------------------------------------------------------------------

/**
 * Stands in for the real upload until there is one. It fails while the browser
 * is offline, which is both the honest failure and a deterministic way to see
 * the Retry row.
 */
function uploadPiece(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        reject(new Error('offline'));

        return;
      }

      resolve();
    }, 2400);
  });
}

export {
  centreOf,
  formatDistance,
  isMine,
  metaFor,
  project,
  resolveState,
  thumbGround,
  uploadPiece,
  visiblePieces,
  zoomBy,
};
