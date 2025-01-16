import { atom, useRecoilState } from 'recoil';

import type { Actions } from './types';
import { BeerPongTeam } from './types';

// import { BeerPongState, BeerPongTeam } from './types';
// import { BeerPongChampionship, BeerPongGame } from './types';

// const beerPongState = atom<boolean>({
//   key: 'beerpong-state',
//   default: false,
// });

// const beerPongState = atom<boolean>({
//   key: 'beerpong-state',
//   default: false,
// });

const beerPongTeamsState = atom<BeerPongTeam[]>({
  key: 'beerpong-teams-state',
  default: [],
});

// const beerPongChampionshipState = atom<BeerPongChampionship[]>({
//   key: 'beerpong-championship-state',
//   default: [],
// });

// const beerPongGameState = atom<boolean>({
//   key: 'beerpong-game-state',
//   default: false,
// });

function useBeerPongTeamState(): [BeerPongTeam[], Actions] {
  const [beerPongTeams, setBeerPongTeamsState] = useRecoilState(beerPongTeamsState);

  function addTeam(team: BeerPongTeam) {
    setBeerPongTeamsState([...beerPongTeams, team]);
  }

  return [beerPongTeams, { addTeam }];
}

// function useBeerPong(): [boolean, Actions] {
//   const [isOpen, setIsOpen] = useRecoilState(beerPongState);

//   function toggle() {
//     setIsOpen((isOpen: boolean) => !isOpen);
//   }

//   function close() {
//     setIsOpen(false);
//   }

//   function open() {
//     setIsOpen(true);
//   }

//   return [isOpen, { toggle, close, open }];
// }

export { useBeerPongTeamState };
