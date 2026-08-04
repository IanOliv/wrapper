import { useCallback, useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';

import type { AtomEffectParams } from '../types';
import type { Actions } from './types';

const STORAGE_KEY = 'recent-routes';
const LIMIT = 4;

// The empty ⌘K query is not empty: recents come first. Paths only — the route
// table is the source of truth for everything else about them.
const recentRoutesState = atom<string[]>({
  key: 'recent-routes-state',
  default: [],
  effects: [synchronizeWithLocalStorage],
});

function synchronizeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setSelf(parsed.filter((item) => typeof item === 'string'));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  onSet((value: string[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)));
}

function useRecents(): [string[], Actions] {
  const [recents, setRecents] = useRecoilState(recentRoutesState);

  const visit = useCallback(
    (path: string) => {
      setRecents((current) =>
        current[0] === path
          ? current
          : [path, ...current.filter((it) => it !== path)].slice(0, LIMIT),
      );
    },
    [setRecents],
  );

  const actions = useMemo(() => ({ visit }), [visit]);

  return [recents, actions];
}

export default useRecents;
