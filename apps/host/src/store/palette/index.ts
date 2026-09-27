import { atom, useRecoilState } from 'recoil';

import type { Actions } from './types';

// Only openness is global — the query and the selected index stay local to the
// palette, which is the only thing that reads them.
const paletteIsOpenState = atom<boolean>({
  key: 'command-palette-openness-state',
  default: false,
});

function useCommandPalette(): [boolean, Actions] {
  const [isOpen, setIsOpen] = useRecoilState(paletteIsOpenState);

  function toggle() {
    setIsOpen((isOpen: boolean) => !isOpen);
  }

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return [isOpen, { toggle, open, close }];
}

export default useCommandPalette;
