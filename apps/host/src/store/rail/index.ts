import { atom, useRecoilState } from 'recoil';

import type { AtomEffectParams } from '../types';
import type { Actions } from './types';

const STORAGE_KEY = 'rail-expanded';

// The desktop rail is pinnable — one boolean, persisted, nothing else.
const railIsExpandedState = atom<boolean>({
  key: 'rail-expanded-state',
  default: false,
  effects: [synchronizeWithLocalStorage],
});

function synchronizeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) setSelf(stored === 'true');
  onSet((value: boolean) => localStorage.setItem(STORAGE_KEY, String(value)));
}

function useRail(): [boolean, Actions] {
  const [isExpanded, setIsExpanded] = useRecoilState(railIsExpandedState);

  function toggle() {
    setIsExpanded((expanded: boolean) => !expanded);
  }

  function expand() {
    setIsExpanded(true);
  }

  function collapse() {
    setIsExpanded(false);
  }

  return [isExpanded, { toggle, expand, collapse }];
}

export default useRail;
