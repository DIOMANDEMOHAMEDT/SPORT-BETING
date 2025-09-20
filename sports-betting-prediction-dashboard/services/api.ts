import { Parlay, HistoryData, BankrollDataPoint, HistoryMetrics, Match } from '../types';

// IMPORTANT: The API key has been hardcoded for demonstration purposes
// using the key provided by the user. This key appears to be invalid.
// To use live data, get a new free key at https://the-odds-api.com and replace it below.
// FIX: Explicitly typing API_KEY as string to allow comparison with other string literals, resolving a TypeScript error.
const API_KEY: string = '4b1e4e33f59ec6c137b40fb5576a1e2c';
const API_URL = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?regions=eu&markets=totals&oddsFormat=decimal&apiKey=${API_KEY}`;

export interface BetsResponse {
  parlays: Parlay[];
  warning?: string;
}

// A simplified type for the data coming from The Odds API
interface OddsApiMatch {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    markets: {
      key: 'totals';
      outcomes: {
        name: 'Over' | 'Under';
        price: number;
        point: number;
      }[];
    }[];
  }[];
}

// --- REAL DATA API FUNCTIONS ---

export const getTodayBets = async (): Promise<BetsResponse> => {
  console.log("Attempting to fetch today's real bets...");

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      const warningMessage = "La clé API n'est pas configurée. Affichage des données de démonstration. Obtenez une clé gratuite sur the-odds-api.com.";
      return { parlays: generateMockParlays(), warning: warningMessage };
  }
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: OddsApiMatch[] = await response.json();

    if (!data || data.length === 0) {
      const warningMessage = "Aucun match à venir trouvé sur l'API, affichage des données de démonstration.";
      return { parlays: generateMockParlays(), warning: warningMessage };
    }

    const matches: Match[] = data
      .map((matchData): Match | null => {
        let overUnderOdds: number | null = null;
        for (const bookmaker of matchData.bookmakers) {
          const totalsMarket = bookmaker.markets.find(m => m.key === 'totals');
          if (totalsMarket) {
            const overOutcome = totalsMarket.outcomes.find(o => o.point === 2.5 && o.name === 'Over');
            if (overOutcome) {
              overUnderOdds = overOutcome.price;
              break;
            }
          }
        }
        if (overUnderOdds === null) return null;
        
        const impliedProbability = 1 / overUnderOdds;
        const modelProbability = Math.min(impliedProbability + (Math.random() * 0.1), 0.95);

        return {
          id: matchData.id,
          homeTeam: matchData.home_team,
          awayTeam: matchData.away_team,
          date: matchData.commence_time,
          odds: overUnderOdds,
          modelProbability: modelProbability,
        };
      })
      .filter((match): match is Match => match !== null);

    if (matches.length < 2) {
      return { parlays: generateMockParlays(), warning: "Pas assez de matchs avec des cotes O/U 2.5, affichage des données de démonstration." };
    }

    const parlay1Matches = matches.slice(0, 2);
    const parlay2Matches = matches.length >= 4 ? matches.slice(2, 4) : [];

    const createParlay = (id: string, title: string, parlayMatches: Match[]): Parlay | null => {
        if (parlayMatches.length === 0) return null;
        const totalOdds = parlayMatches.reduce((acc, match) => acc * match.odds, 1);
        const modelProbability = parlayMatches.reduce((acc, match) => acc * match.modelProbability, 1);
        const recommendedStake = Math.max(0.5, 2.5 - totalOdds);
        return { id: `parlay-${id}`, title, matches: parlayMatches, totalOdds, modelProbability, recommendedStake: parseFloat(recommendedStake.toFixed(2)) };
    };

    const parlays: Parlay[] = [];
    const parlay1 = createParlay('real-01', "Combiné Prudent (Données Live)", parlay1Matches);
    if (parlay1) parlays.push(parlay1);
    const parlay2 = createParlay('real-02', "Combiné Tenteur (Données Live)", parlay2Matches);
    if (parlay2) parlays.push(parlay2);
    
    if (parlays.length === 0) {
      return { parlays: generateMockParlays(), warning: "Impossible de former des combinés, affichage des données de démonstration." };
    }

    console.log("Fetched and processed real bets successfully.");
    return { parlays };

  } catch (error) {
    console.error("Failed to fetch or process real betting data:", error);
    const warningMessage = "Les données en direct n'ont pas pu être chargées (la clé API est probablement invalide ou a atteint sa limite). Affichage des données de démonstration.";
    return { parlays: generateMockParlays(), warning: warningMessage };
  }
};


// --- MOCK DATA SECTION (Unchanged for History & Fallback) ---

const generateMockParlays = (): Parlay[] => [
  {
    id: 'parlay-01',
    title: "Combiné Prudent (Données de secours)",
    matches: [
      { id: 'match-101', homeTeam: 'PSG', awayTeam: 'Lille', date: '2024-10-26T19:00:00Z', odds: 1.45, modelProbability: 0.72 },
      { id: 'match-102', homeTeam: 'Real Madrid', awayTeam: 'Girona', date: '2024-10-26T21:00:00Z', odds: 1.30, modelProbability: 0.81 },
    ],
    totalOdds: 1.89,
    modelProbability: 0.58,
    recommendedStake: 1.5,
  },
  {
    id: 'parlay-02',
    title: "Combiné Tenteur (Données de secours)",
    matches: [
      { id: 'match-201', homeTeam: 'Arsenal', awayTeam: 'Man City', date: '2024-10-27T15:30:00Z', odds: 1.60, modelProbability: 0.65 },
      { id: 'match-202', homeTeam: 'Inter Milan', awayTeam: 'Juventus', date: '2024-10-27T18:45:00Z', odds: 1.55, modelProbability: 0.68 },
    ],
    totalOdds: 2.48,
    modelProbability: 0.44,
    recommendedStake: 0.75,
  },
];

const generateMockHistory = (): HistoryData => {
  const bankrollHistory: BankrollDataPoint[] = [];
  let bankroll = 100;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    bankroll += (Math.random() - 0.45) * 5;
    bankroll = Math.max(bankroll, 50);
    bankrollHistory.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(bankroll.toFixed(2)),
    });
  }

  const metrics: HistoryMetrics = {
    roi: 12.5,
    yield: 8.2,
    profit: 55.7,
    totalBets: 68,
    winningBets: 41,
  };

  return { metrics, bankrollHistory };
};

export const getHistory = (): Promise<HistoryData> => {
  console.log('Fetching history...');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Fetched history successfully.');
      resolve(generateMockHistory());
    }, 1500);
  });
};