import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useNotifications from '@/store/notifications';

import { HOME, pieces as seed } from './data';
import type {
  ARfitiActions,
  ARfitiState,
  Detent,
  Filter,
  Flow,
  PermissionState,
  Permissions,
  Piece,
  Sort,
  View,
} from './types';
import { centreOf, uploadPiece, visiblePieces, zoomBy } from './utils';

/**
 * The whole module's state, in one hook.
 *
 * There is exactly one `selectedId`. The pin, the row and the sheet all read it
 * and all write it through `select` — a pin tap and a row tap are the same event
 * arriving from different places, so neither can drift from the other.
 */
function useARfiti(): [ARfitiState, ARfitiActions] {
  const [, notifications] = useNotifications();

  const [pieces, setPieces] = useState<Piece[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('nearby');
  const [query, setQuery] = useState('');
  const [sheetDetent, setSheetDetent] = useState<Detent>('half');
  const [flow, setFlow] = useState<Flow>('browse');
  const [view, setView] = useState<View>(HOME);
  const [permissions, setPermissions] = useState<Permissions>({
    location: 'prompt',
    camera: 'prompt',
  });

  const inserts = useRef(0);

  // --- permissions -------------------------------------------------------
  // Real state, not a mock: if the browser already knows the answer we honour
  // it, and a denied answer is what dims the map.
  useEffect(() => {
    let cancelled = false;

    const read = async () => {
      if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;

      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });

        if (!cancelled) {
          setPermissions((current) => ({ ...current, location: status.state as PermissionState }));
        }
      } catch {
        // Safari and friends refuse to answer for geolocation — leave it at
        // `prompt` and let the status pill ask.
      }
    };

    read();

    return () => {
      cancelled = true;
    };
  }, []);

  const enableLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setPermissions((current) => ({ ...current, location: 'denied' }));

      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => setPermissions((current) => ({ ...current, location: 'granted' })),
      () => setPermissions((current) => ({ ...current, location: 'denied' })),
      { timeout: 8000 },
    );
  }, []);

  const setCamera = useCallback((state: PermissionState) => {
    setPermissions((current) => ({ ...current, camera: state }));
  }, []);

  // --- selection ---------------------------------------------------------
  // Selecting pans the map to the piece. The row scrolls itself into view off
  // the same id, in `PieceRow`.
  const select = useCallback(
    (id: string | null) => {
      const next = selectedId === id ? null : id;
      const piece = next ? pieces.find((item) => item.id === next) : undefined;

      setSelectedId(next);

      if (!piece) return;

      // tapping a row pans the map to the pin — the other direction of the same
      // `selectedId`; the row scrolls itself into view in `PieceRow`
      setView((current) => ({ ...current, lat: piece.lat, lng: piece.lng }));
      // a selection made from the map has to be readable, so the sheet comes up
      // far enough to show the row it just selected
      setSheetDetent((detent) => (detent === 'peek' ? 'half' : detent));
    },
    [pieces, selectedId],
  );

  const zoom = useCallback((direction: 1 | -1) => {
    setView((current) => ({ ...current, zoom: zoomBy(current.zoom, direction) }));
  }, []);

  const recenter = useCallback(() => setView((current) => ({ ...HOME, zoom: current.zoom })), []);

  // --- the scan → claim flow --------------------------------------------
  // Two steps of one flow. Nothing here touches the router: the map stays
  // mounted underneath the whole time.
  const startScan = useCallback(() => setFlow('scan'), []);
  const cancelFlow = useCallback(() => setFlow('browse'), []);
  const matched = useCallback(() => setFlow('claim'), []);

  const claim = useCallback(() => {
    setPieces((current) =>
      current.map((piece) => (piece.id === selectedId ? { ...piece, state: 'claimed' } : piece)),
    );
    setFlow('browse');
    notifications.push({
      message: 'Piece claimed. The pin is green for everyone now.',
      options: { variant: 'success' },
    });
  }, [notifications, selectedId]);

  // --- inserting ---------------------------------------------------------
  // The row goes in as a skeleton at the top of the list and the pin drops
  // amber at the centre of the view, then both are swapped for the real thing
  // when the upload resolves. On failure the row stays, with a Retry.
  const runUpload = useCallback((id: string) => {
    uploadPiece()
      .then(() => {
        setPieces((current) =>
          current.map((piece) =>
            piece.id === id
              ? { ...piece, state: 'default', failed: false, title: 'Your new piece' }
              : piece,
          ),
        );
      })
      .catch(() => {
        setPieces((current) =>
          current.map((piece) => (piece.id === id ? { ...piece, failed: true } : piece)),
        );
      });
  }, []);

  const insert = useCallback(() => {
    inserts.current += 1;

    const id = `insert-${inserts.current}`;
    const point = centreOf(view);

    setPieces((current) => [
      {
        id,
        title: 'Uploading piece',
        author: 'you',
        lat: point.lat,
        lng: point.lng,
        distanceM: 0,
        accent: '#E5B769',
        state: 'inserting',
      },
      ...current,
    ]);

    runUpload(id);
  }, [runUpload, view]);

  const retryInsert = useCallback(
    (id: string) => {
      setPieces((current) =>
        current.map((piece) => (piece.id === id ? { ...piece, failed: false } : piece)),
      );
      runUpload(id);
    },
    [runUpload],
  );

  const visible = useMemo(
    () => visiblePieces(pieces, filter, query, sort),
    [filter, pieces, query, sort],
  );

  const selected = useMemo(
    () => pieces.find((piece) => piece.id === selectedId) ?? null,
    [pieces, selectedId],
  );

  const state: ARfitiState = {
    pieces,
    visible,
    selectedId,
    selected,
    filter,
    sort,
    query,
    sheetDetent,
    permissions,
    flow,
    view,
  };

  const actions: ARfitiActions = {
    select,
    setFilter,
    setSort,
    setQuery,
    setSheetDetent,
    zoom,
    recenter,
    enableLocation,
    startScan,
    cancelFlow,
    matched,
    claim,
    insert,
    retryInsert,
    setCamera,
  };

  return [state, actions];
}

export default useARfiti;
