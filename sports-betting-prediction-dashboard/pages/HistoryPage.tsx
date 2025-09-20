import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import { HistoryData } from '../types';
import Card from '../components/Card';
import BankrollChart from '../components/BankrollChart';
import { ChartPieIcon, ArrowTrendingUpIcon, CheckBadgeIcon, ScaleIcon, ChartBarIcon } from '../components/icons';

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="p-4 flex items-start space-x-4">
        <div className="bg-gray-700 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </Card>
);

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to fetch history data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-800 rounded-xl"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-800 rounded-xl animate-pulse"></div>
        </>
      );
    }

    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }

    if (!history) {
      return <p className="text-center">No history data available.</p>;
    }

    const { metrics, bankrollHistory } = history;
    const winRate = ((metrics.winningBets / metrics.totalBets) * 100).toFixed(1);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <MetricCard title="ROI" value={`${metrics.roi}%`} icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-400"/>} />
          <MetricCard title="Yield" value={`${metrics.yield}%`} icon={<ChartPieIcon className="h-6 w-6 text-blue-400"/>} />
          <MetricCard title="Profit" value={`${metrics.profit.toFixed(2)} u`} icon={<ScaleIcon className="h-6 w-6 text-yellow-400"/>} />
          <MetricCard title="Taux de réussite" value={`${winRate}%`} icon={<CheckBadgeIcon className="h-6 w-6 text-purple-400"/>} />
        </div>
        <Card>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Évolution de la Bankroll</h3>
                <div className="h-96">
                    <BankrollChart data={bankrollHistory} />
                </div>
            </div>
        </Card>
      </>
    );
  };
  
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <ChartBarIcon className="h-8 w-8 text-green-400"/>
        <h2 className="text-3xl font-bold tracking-tight text-white">Historique & Performance</h2>
      </div>
      {renderContent()}
    </div>
  );
};

export default HistoryPage;