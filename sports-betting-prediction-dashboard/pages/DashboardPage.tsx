import React, { useState, useEffect } from 'react';
import { getTodayBets } from '../services/api';
import { Parlay } from '../types';
import Card from '../components/Card';
import { TicketIcon, ExclamationTriangleIcon } from '../components/icons';

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
};

const ParlayCard: React.FC<{ parlay: Parlay }> = ({ parlay }) => {
  const probPercent = (parlay.modelProbability * 100).toFixed(1);

  return (
    <Card>
        <div className="p-5">
            <h3 className="text-xl font-bold text-white mb-3">{parlay.title}</h3>
            <div className="space-y-3">
                {parlay.matches.map((match, index) => (
                    <div key={match.id} className={`bg-gray-700/50 p-3 rounded-lg ${index < parlay.matches.length -1 ? 'border-b border-dashed border-gray-600' : ''}`}>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-200">{match.homeTeam} vs {match.awayTeam}</span>
                            <span className="text-green-400 font-bold">{match.odds.toFixed(2)}</span>
                        </div>
                         <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                            <span>
                                Prob. Modèle: <span className="font-medium text-gray-300">{(match.modelProbability * 100).toFixed(1)}%</span>
                            </span>
                             <span className="font-medium text-gray-300">{formatDate(match.date)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-b-xl mt-2 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
            <div>
                <div className="text-xs text-green-400 uppercase font-semibold">Cote Totale</div>
                <div className="text-lg font-bold text-white">{parlay.totalOdds.toFixed(2)}</div>
            </div>
            <div>
                <div className="text-xs text-green-400 uppercase font-semibold">Prob. Succès</div>
                <div className="text-lg font-bold text-white">{probPercent}%</div>
            </div>
            <div>
                <div className="text-xs text-green-400 uppercase font-semibold">Mise Rec.</div>
                <div className="text-lg font-bold text-white">{parlay.recommendedStake.toFixed(2)}%</div>
            </div>
        </div>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const [parlays, setParlays] = useState<Parlay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        setLoading(true);
        setWarning(null);
        const { parlays: data, warning: apiWarning } = await getTodayBets();
        setParlays(data);
        if (apiWarning) {
          setWarning(apiWarning);
        }
      } catch (err) {
        console.error("Unexpected error in DashboardPage:", err);
        setWarning('Une erreur critique est survenue lors de l\'affichage de la page.');
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl h-72"></div>
            ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parlays.map(parlay => (
          <ParlayCard key={parlay.id} parlay={parlay} />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <TicketIcon className="h-8 w-8 text-green-400"/>
        <h2 className="text-3xl font-bold tracking-tight text-white">Combinés du Jour</h2>
      </div>
      
      {warning && (
        <div className="bg-yellow-900/40 border border-yellow-700/60 text-yellow-200 px-4 py-3 rounded-lg relative mb-6 flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 text-yellow-400" />
            <div>
                <strong className="font-bold">Avertissement: </strong>
                <span className="block sm:inline">{warning}</span>
            </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default DashboardPage;