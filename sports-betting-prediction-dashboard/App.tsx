
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import { HomeIcon, ChartBarIcon, BellIcon } from './components/icons';

const App: React.FC = () => {
  const commonLinkClasses = "flex flex-col items-center justify-center w-full h-full text-gray-400 transition-colors duration-200";
  const activeLinkClasses = "bg-gray-800 text-white";
  const inactiveLinkClasses = "hover:bg-gray-700 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">ValueBet AI</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <BellIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 text-center p-4 text-xs text-gray-400 mt-auto">
        <p>Les paris comportent un risque. Ne jouez pas au-delà de vos moyens. Jouer comporte des risques : endettement, isolement, dépendance.</p>
        <p className="mt-1">&copy; 2024 ValueBet AI. All rights reserved.</p>
      </footer>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 grid grid-cols-2 h-16">
        <NavLink to="/" className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
            <HomeIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">Dashboard</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
            <ChartBarIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">Historique</span>
        </NavLink>
      </nav>
      <div className="h-16 md:hidden"></div> {/* Spacer for mobile nav */}
    </div>
  );
};

export default App;
