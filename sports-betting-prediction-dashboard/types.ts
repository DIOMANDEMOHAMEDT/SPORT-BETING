export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  odds: number;
  modelProbability: number; // e.g., 0.65 for 65%
}

export interface Parlay {
  id: string;
  title: string;
  matches: Match[];
  totalOdds: number;
  modelProbability: number;
  recommendedStake: number; // In percentage of bankroll
}

export interface BankrollDataPoint {
  date: string;
  value: number;
}

export interface HistoryMetrics {
  roi: number; // Return on Investment in %
  yield: number; // Yield in %
  profit: number; // Profit in units
  totalBets: number;
  winningBets: number;
}

export interface HistoryData {
  metrics: HistoryMetrics;
  bankrollHistory: BankrollDataPoint[];
}