import { useRef } from 'react';

import { useBeerPongTeamState } from '@/store/beerPong';
import { BeerPongTeam } from '@/store/beerPong/types';

import { BeerPongButton, BeerPongInput, BeerPongList } from './Items';

// import { beerPongTeamsState } from '../../store/beerPong';

export function TeamForm() {
  //   const [teams, setTeams] = useRecoilState(beerPongTeamsState);
  const [beerPongTeams, { addTeam }] = useBeerPongTeamState();
  const teamNameRef = useRef<HTMLInputElement>(null);
  const addNewTeam = () => {
    const newTeamName = teamNameRef.current?.value;
    const beerPongTeam = { name: newTeamName } as BeerPongTeam;

    addTeam(beerPongTeam);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    teamNameRef.current.value = '';
  };
  console.log(beerPongTeams);

  return (
    <>
      <BeerPongList items={beerPongTeams} />
      <BeerPongInput ref={teamNameRef} name="Team name" />
      <br />
      <BeerPongButton onClick={() => addNewTeam()}>Add Team</BeerPongButton>
    </>
  );
}
