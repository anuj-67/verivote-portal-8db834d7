import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLiveData } from '../../hooks/useLiveData';

const navItems = [
  { label: '📊 Overview', path: '/analytics/dashboard' },
  { label: '🏛️ Constituencies', path: '/analytics/constituency' },
  { label: '🗳️ Booths', path: '/analytics/booths' },
  { label: '🏆 Results', path: '/analytics/results' },
];

interface Props { children: ReactNode; }

const AnalyticsLayout = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lastUpdated, isLive, toggleLive, bulkSimulate } = useLiveData();

  return (
    <div
      className="min-h-screen text-[#0B2E33]"
      style={{
        backgroundColor: '#e8f0f1',
        backgroundImage: 'radial-gradient(rgba(79,124,130,0.18) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top Navbar */}
      <nav className="bg-[#0B2E33] border-b border-[#4F7C82] px-4 md:px-8 py-3 flex flex-wrap justify-between items-center gap-3 no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="font-heading text-2xl font-bold text-white">VeriVote</button>
          <span className="text-xs text-[#5a7a7e] hidden md:inline">Analytics Dashboard</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path ||
              (item.path === '/analytics/constituency' && location.pathname.startsWith('/analytics/constituency'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-1.5 text-xs md:text-sm transition-colors ${
                  active ? 'bg-[#4F7C82] text-white' : 'text-[#5a7a7e] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className={`text-xs font-semibold ${isLive ? 'text-green-400' : 'text-gray-400'}`}>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
          <span className="text-xs text-[#5a7a7e] hidden md:inline">Updated: {lastUpdated.toLocaleTimeString()}</span>
          <button
            onClick={toggleLive}
            className={`relative w-10 h-5 rounded-full transition-colors ${isLive ? 'bg-green-500' : 'bg-gray-600'}`}
            title="Auto refresh"
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isLive ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </nav>

      <main>{children}</main>

      {/* Demo badge */}
      <div className="fixed bottom-4 right-4 bg-[#ffffff] border border-[#4F7C82] text-[#0B2E33] text-xs px-3 py-2 rounded-full shadow-lg z-50 no-print flex items-center gap-2">
        🔧 Demo | Simulating live vote data
        <button
          onClick={() => bulkSimulate(50)}
          className="ml-2 bg-[#4F7C82] hover:bg-[#3a5e63] text-white rounded-full px-3 py-0.5 text-xs"
        >
          Simulate 50 votes
        </button>
      </div>
    </div>
  );
};

export default AnalyticsLayout;
