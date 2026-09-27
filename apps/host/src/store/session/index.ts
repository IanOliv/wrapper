import { atom, useRecoilState } from 'recoil';

import type { AtomEffectParams } from '../types';
import type { Actions, WrapperSession } from './types';

const STORAGE_KEY = 'wrapper-session';

const wrapperSessionState = atom<WrapperSession>({
  key: 'wrapper-session-state',
  default: {} as WrapperSession,
  effects: [synchronizeWithLocalStorage],
});

function synchronizeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      setSelf(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  onSet((value: WrapperSession) => {
    if (value.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  });
}

function useWrapperSessionState(): [WrapperSession, Actions] {
  const [wrapperSession, setWSession] = useRecoilState(wrapperSessionState);

  function addSession(wSession: WrapperSession) {
    setWSession(wSession);
  }

  // "Sign out" in the account menu needs one place to undo this.
  function clearSession() {
    setWSession({} as WrapperSession);
  }

  return [wrapperSession, { addSession, clearSession }];
}

export { useWrapperSessionState };
