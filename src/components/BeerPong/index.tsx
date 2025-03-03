/* eslint-disable react/prop-types */
import { TeamForm } from './TeamForm';
// import { MatchForm } from './MatchForm';
// import { ChampionshipForm } from './ChampionshipForm';
import './styles.css';

type BeerPongView = 'teams' | 'championships' | 'games' | 'match';

export function BeerPong() {
  const view: BeerPongView = 'teams';

  return (
    <div className="beer-pong-component">
      {view === 'teams' && <TeamForm />}
      {/* {view === 'championships' && <ChampionshipForm />}
      {view === 'games' && <MatchForm />}
      {view === 'match' && <MatchForm />} */}
    </div>
  );
}

// function BeerPongMain() {
//   return (
//     <div className="beer-pong-main">
//       <h1>Base</h1>
//       <Button>
//         <h1>Base</h1>
//       </Button>
//       <Button>
//         <h1>Base</h1>
//       </Button>
//     </div>
//   );
// }
