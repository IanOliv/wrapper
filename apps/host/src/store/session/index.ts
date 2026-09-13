import { atom, useRecoilState } from 'recoil';

import type { Actions } from './types';
import { WrapperSession } from './types';

const wrapperSessionState = atom<WrapperSession>({
  key: 'wrapper-session-state',
  default: {} as WrapperSession,
});

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
