interface BeerPongTeam {
  name: string;
}

interface BeerPongChampionship {
  id: string;
  name: string;
  teams: BeerPongTeam[];
  games: BeerPongGame[];
}

interface BeerPongGame {
  team1: BeerPongTeam;
  team2: BeerPongTeam;
  score1: number;
  score2: number;
  winner: BeerPongTeam;
  championship: BeerPongChampionship;
}

interface BeerPongState {
  isOpen: boolean;
  teams: BeerPongTeam[];
  games: BeerPongGame[];
  championships: BeerPongChampionship[];
}

type Actions = {
  addTeam: (team: BeerPongTeam) => void;
};

export type { Actions, BeerPongState, BeerPongTeam, BeerPongChampionship, BeerPongGame };
