import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import AnalyticsLayout from '../../components/analytics/AnalyticsLayout';
import AnimatedCounter from '../../components/analytics/AnimatedCounter';
import { useLiveData } from '../../hooks/useLiveData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const useCountdown = (endsAt: string, pollingOpen: boolean) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const [h, m] = endsAt.split(':').map(Number);
  const end = new Date(now); end.setHours(h, m, 0, 0);
  let diff = end.getTime() - now.getTime();
  if (diff < 0 || !pollingOpen) return { closed: true, text: 'POLLING CLOSED' };
  const hh = Math.floor(diff / 3600000); diff -= hh * 3600000;
  const mm = Math.floor(diff / 60000); diff -= mm * 60000;
  const ss = Math.floor(diff / 1000);
  return { closed: false, text: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')} remaining` };
};

const LiveDashboard = () => {
  const navigate = useNavigate();
  const { parties, liveTurnout, constituencies, recentIncrease, closePolling } = useLiveData();

  const totalVotes = parties.reduce((s, p) => s + p.votes, 0);
  const sortedParties = useMemo(() => [...parties].sort((a, b) => b.votes - a.votes), [parties]);
  const countdown = useCountdown(liveTurnout.pollingEndsAt, liveTurnout.pollingOpen);

  const barData = {
    labels: parties.map(p => p.abbreviation),
    datasets: [{
      data: parties.map(p => p.votes),
      backgroundColor: parties.map(p => p.color + 'CC'),
      borderColor: parties.map(p => p.color),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const barOptions: any = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const p = parties[ctx.dataIndex];
            const pct = ((p.votes / totalVotes) * 100).toFixed(1);
            return `${p.name}: ${p.votes.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7986cb' } },
      y: { grid: { display: false }, ticks: { color: '#e8eaf6', font: { family: 'Rajdhani', size: 14 } } },
    },
  };

  const donutData = {
    labels: parties.map(p => p.abbreviation),
    datasets: [{
      data: parties.map(p => p.votes),
      backgroundColor: parties.map(p => p.color + 'DD'),
      borderColor: parties.map(p => p.color),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const donutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#7986cb', usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const p = parties[ctx.dataIndex];
            const pct = ((p.votes / totalVotes) * 100).toFixed(1);
            return `${p.name}: ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <AnalyticsLayout>
      <div className="pb-24">
        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-8 pt-6">
          <div className="bg-[#111530] border border-[#2a2f52] border-l-4 !border-l-[#7986cb] rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wide text-[#7986cb]">
              <Users size={16} /> REGISTERED VOTERS
            </div>
            <div className="font-heading text-4xl font-bold text-[#e8eaf6] mt-2">{liveTurnout.totalRegistered.toLocaleString()}</div>
            <div className="text-xs text-[#7986cb] mt-1">Karnataka State Constituency</div>
          </div>

          <div className="bg-[#0d2240] border border-[#1565c0] rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wide text-[#7986cb]">
              <CheckCircle size={16} className="text-[#1565c0]" /> VOTES CAST
            </div>
            <div className="font-heading text-4xl font-bold mt-2" style={{ color: '#1565c0', textShadow: '0 0 20px rgba(21,101,192,0.5)' }}>
              <AnimatedCounter value={liveTurnout.totalVoted} />
            </div>
            <div className="text-xs text-green-400 mt-1">+{recentIncrease} in last 30s</div>
          </div>

          <div className="bg-[#111530] border border-[#2a2f52] border-l-4 !border-l-[#e65100] rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wide text-[#7986cb]">
              <TrendingUp size={16} className="text-[#e65100]" /> VOTER TURNOUT
            </div>
            <div className="font-heading text-4xl font-bold mt-2" style={{ color: '#e65100' }}>{liveTurnout.turnoutPercentage}%</div>
            <div className="w-full bg-[#2a2f52] h-2 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-[#e65100] transition-all duration-1000" style={{ width: `${liveTurnout.turnoutPercentage}%` }} />
            </div>
          </div>

          <div className="bg-[#111530] border border-[#2a2f52] border-l-4 !border-l-[#546e7a] rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wide text-[#7986cb]">
              <Clock size={16} className="text-[#546e7a]" /> POLLING CLOSES
            </div>
            <div className={`font-heading text-2xl font-bold mt-2 ${countdown.closed ? 'text-red-400' : 'text-[#e8eaf6]'}`}>
              {countdown.text}
            </div>
            <div className="text-xs text-[#7986cb] mt-1">Polling closes at 6:00 PM</div>
          </div>
        </div>

        {/* Party Vote Cards */}
        <div className="px-4 md:px-8 mt-6">
          <div className="font-heading font-bold text-xs uppercase tracking-widest text-[#7986cb] mb-3">LIVE PARTY STANDINGS</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sortedParties.map((p, idx) => {
              const pct = totalVotes ? +((p.votes / totalVotes) * 100).toFixed(1) : 0;
              const diff = p.votes - p.previousVotes;
              return (
                <div
                  key={p.id}
                  className="relative bg-[#111530] border-2 rounded-xl p-5 text-center transition-all duration-500"
                  style={{ borderColor: p.color }}
                >
                  <div
                    className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0a0e27] flex items-center justify-center text-xs"
                    style={{ color: idx === 0 ? '#ffd700' : '#7986cb' }}
                  >
                    #{idx + 1}
                  </div>
                  <div className="text-5xl mb-2">{p.emoji}</div>
                  <div className="font-heading text-2xl font-bold text-white">{p.abbreviation}</div>
                  <div className="text-xs text-[#7986cb] mt-0.5">{p.name}</div>
                  <div
                    className="font-heading text-3xl font-bold mt-3"
                    style={{ color: p.color, textShadow: `0 0 16px ${p.color}66` }}
                  >
                    <AnimatedCounter value={p.votes} />
                  </div>
                  <div className="text-sm text-[#7986cb] mt-1">{pct}%</div>
                  <div className="w-full h-1.5 bg-[#2a2f52] rounded-full mt-2 overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ backgroundColor: p.color, width: `${pct}%` }} />
                  </div>
                  <div className="mt-2 text-xs">
                    {diff > 0 ? <span className="text-green-400">▲ +{diff}</span> : <span className="text-[#7986cb]">— No change</span>}
                  </div>
                  {idx === 0 && (
                    <div className="mt-3 inline-block bg-[#ffd700] text-[#0a0e27] rounded-full px-3 py-0.5 text-xs font-heading font-bold">🏆 LEADING</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="px-4 md:px-8 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-[#111530] border border-[#2a2f52] rounded-xl p-6">
            <div className="font-heading font-bold text-[#e8eaf6]">Party-wise Vote Distribution</div>
            <div className="text-xs text-[#7986cb] mb-3">Live data • Updates every 30 seconds</div>
            <div style={{ height: 280 }}><Bar data={barData} options={barOptions} /></div>
          </div>
          <div className="lg:col-span-2 bg-[#111530] border border-[#2a2f52] rounded-xl p-6">
            <div className="font-heading font-bold text-[#e8eaf6] mb-3">Vote Share %</div>
            <div style={{ height: 280 }}><Doughnut data={donutData} options={donutOptions} /></div>
          </div>
        </div>

        {/* Constituency Table */}
        <div className="px-4 md:px-8 mt-6 mb-8">
          <div className="bg-[#111530] border border-[#2a2f52] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2a2f52] flex justify-between items-center">
              <div className="font-heading font-bold text-[#e8eaf6] text-sm uppercase tracking-wide">CONSTITUENCY-WISE RESULTS</div>
              <div className="text-xs text-[#7986cb]">{constituencies.length} constituencies</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0e27]">
                  <tr>
                    {['Constituency', 'Votes Cast', 'Turnout', 'Leading Party', 'Votes Lead', 'Action'].map(h => (
                      <th key={h} className="text-xs font-heading uppercase tracking-wide text-[#7986cb] px-6 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {constituencies.map((c, i) => {
                    const sortedPB = [...c.partyBreakdown].sort((a, b) => b.votes - a.votes);
                    const winner = sortedPB[0];
                    const runner = sortedPB[1];
                    const partyMeta = parties.find(p => p.abbreviation === winner.party);
                    const turnoutClass = c.turnout > 70 ? 'bg-green-900/50 text-green-400 border-green-800'
                      : c.turnout >= 40 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
                      : 'bg-red-900/50 text-red-400 border-red-800';
                    return (
                      <tr
                        key={c.id}
                        onClick={() => navigate(`/analytics/constituency?id=${c.id}`)}
                        className={`${i % 2 === 0 ? 'bg-[#111530]' : 'bg-[#0d1240]'} hover:bg-[#1a1f3e] cursor-pointer transition-colors`}
                      >
                        <td className="px-6 py-3 text-[#e8eaf6] font-semibold">{c.name}</td>
                        <td className="px-6 py-3 text-[#e8eaf6]">
                          {c.votesCast.toLocaleString()}
                          <div className="w-full h-1 bg-[#2a2f52] rounded mt-1 overflow-hidden">
                            <div className="h-full bg-[#1565c0]" style={{ width: `${c.turnout}%` }} />
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs border ${turnoutClass}`}>{c.turnout}%</span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
                            style={{ color: partyMeta?.color, borderColor: (partyMeta?.color ?? '#7986cb') + '4D', backgroundColor: (partyMeta?.color ?? '#7986cb') + '26' }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: partyMeta?.color }} />
                            {winner.party}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-xs text-green-400">+{winner.votes - (runner?.votes ?? 0)} votes</td>
                        <td className="px-6 py-3 text-[#1565c0] hover:underline text-sm">View →</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d1240] border-t border-[#2a2f52] px-4 md:px-8 py-3 flex flex-wrap justify-between items-center gap-3 no-print z-40">
        <div className="text-xs text-[#7986cb]">Last updated: {new Date().toLocaleTimeString()}</div>
        <button onClick={closePolling} className="text-xs text-[#7986cb] hover:text-white">Simulate Polling Close (Demo)</button>
        <div className="flex gap-3">
          <button onClick={() => navigate('/analytics/booths')} className="border border-[#2a2f52] text-[#7986cb] hover:border-[#1565c0] hover:text-white rounded-lg px-4 py-1.5 text-xs">
            View Booth Turnout →
          </button>
          <button
            onClick={() => !liveTurnout.pollingOpen && navigate('/analytics/results')}
            disabled={liveTurnout.pollingOpen}
            className={`rounded-lg px-4 py-1.5 text-xs border ${
              liveTurnout.pollingOpen
                ? 'opacity-50 cursor-not-allowed text-[#7986cb] border-[#2a2f52]'
                : 'bg-[#2e7d32] text-white border-green-700 animate-pulse'
            }`}
          >
            {liveTurnout.pollingOpen ? 'Results Available After 6 PM' : '🏆 View Final Results →'}
          </button>
        </div>
      </div>
    </AnalyticsLayout>
  );
};

export default LiveDashboard;
