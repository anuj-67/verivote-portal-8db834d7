import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AnalyticsLayout from '../../components/analytics/AnalyticsLayout';
import { useLiveData } from '../../hooks/useLiveData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const FinalResults = () => {
  const { parties, constituencies, liveTurnout } = useLiveData();

  const sorted = useMemo(() => [...parties].sort((a, b) => b.votes - a.votes), [parties]);
  const winner = sorted[0];
  const totalVotes = parties.reduce((s, p) => s + p.votes, 0);
  const winnerPct = ((winner.votes / totalVotes) * 100).toFixed(1);

  const partyColor = (abbr: string) => parties.find(p => p.abbreviation === abbr)?.color ?? '#5a7a7e';

  const generateCSV = () => {
    const headers = ['Party', 'Abbreviation', 'Votes', 'Percentage'];
    const rows = sorted.map(p => [p.name, p.abbreviation, p.votes, ((p.votes / totalVotes) * 100).toFixed(2) + '%']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'verivote-results-2025.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  const barData = {
    labels: sorted.map(p => p.abbreviation),
    datasets: [{
      data: sorted.map(p => p.votes),
      backgroundColor: sorted.map(p => p.color + 'CC'),
      borderColor: sorted.map(p => p.color),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };
  const barOptions: any = {
    indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#5a7a7e' } },
      y: { grid: { display: false }, ticks: { color: '#0B2E33', font: { family: 'Rajdhani', size: 14 } } },
    },
  };

  const confettiPieces = Array.from({ length: 25 }, (_, i) => i);

  return (
    <AnalyticsLayout>
      <style>{`
        @keyframes confetti-fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(300px) rotate(720deg); opacity: 0; } }
        .confetti { position: absolute; width: 6px; height: 14px; animation: confetti-fall linear infinite; }
        @media print {
          body, .min-h-screen { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          * { color: black !important; background: white !important; border-color: #ccc !important; }
        }
      `}</style>

      <div className="pb-12">
        {/* Winner banner */}
        <div
          className="relative overflow-hidden text-center py-10 px-8"
          style={{
            background: `linear-gradient(135deg, ${winner.color}33, ${winner.color}11)`,
            borderBottom: `3px solid ${winner.color}`,
          }}
        >
          {confettiPieces.map(i => (
            <span key={i} className="confetti no-print" style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              backgroundColor: parties[i % parties.length].color,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }} />
          ))}
          <div className="text-7xl mb-2">🏆</div>
          <div className="text-6xl mb-2">{winner.emoji}</div>
          <div className="font-heading text-4xl font-bold" style={{ color: winner.color, textShadow: `0 0 24px ${winner.color}99` }}>
            {winner.name}
          </div>
          <div className="font-heading text-2xl text-[#0B2E33]/80 mt-2">WINS KARNATAKA CONSTITUENCY</div>
          <div
            className="inline-block mt-4 rounded-full px-6 py-2 font-heading font-bold border"
            style={{ backgroundColor: winner.color + '33', borderColor: winner.color, color: '#fff' }}
          >
            {winner.votes.toLocaleString()} votes | {winnerPct}% of total
          </div>
        </div>

        <div className="px-4 md:px-8">
          <Link to="/analytics/dashboard" className="inline-block mt-6 text-[#5a7a7e] hover:text-white text-sm no-print">← Back to Dashboard</Link>

          {/* Final Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { l: 'Total Valid Votes', v: totalVotes.toLocaleString() },
              { l: 'Turnout %', v: `${liveTurnout.turnoutPercentage}%` },
              { l: 'Polling Duration', v: '11 hours' },
              { l: 'Total Booths', v: constituencies.reduce((s, c) => s + c.booths.length, 0) },
            ].map(s => (
              <div key={s.l} className="bg-[#ffffff] border border-[#4F7C82] rounded-xl p-5">
                <div className="text-xs uppercase tracking-wide text-[#5a7a7e] font-heading">{s.l}</div>
                <div className="font-heading text-3xl font-bold text-[#0B2E33] mt-1">{s.v}</div>
              </div>
            ))}
          </div>

          {/* Results table */}
          <div className="bg-[#ffffff] border border-[#4F7C82] rounded-xl overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-[#4F7C82] font-heading font-bold text-[#0B2E33]">Final Vote Count — All Parties</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B2E33]">
                  <tr>
                    {['Rank', 'Party', 'Symbol', 'Votes', 'Percentage', 'Result', 'Margin'].map(h => (
                      <th key={h} className="text-xs font-heading uppercase tracking-wide text-[#5a7a7e] px-6 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p, i) => {
                    const pct = ((p.votes / totalVotes) * 100).toFixed(2);
                    const rankColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#5a7a7e';
                    const isWinner = i === 0;
                    const margin = isWinner ? '—' : `-${winner.votes - p.votes} votes`;
                    return (
                      <tr key={p.id}
                        className={`${isWinner ? '' : i % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f0f7f8]'} hover:bg-[#e8f4f6]`}
                        style={isWinner ? { backgroundColor: p.color + '1A', borderLeft: `4px solid ${p.color}` } : {}}
                      >
                        <td className="px-6 py-3 font-heading font-bold" style={{ color: rankColor }}>#{i + 1}</td>
                        <td className="px-6 py-3 text-[#0B2E33] font-semibold">{p.name}</td>
                        <td className="px-6 py-3 text-2xl">{p.emoji}</td>
                        <td className="px-6 py-3 text-[#0B2E33]">{p.votes.toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <div className="text-[#0B2E33] text-sm">{pct}%</div>
                          <div className="w-full h-1.5 bg-[#4F7C82] rounded-full mt-1 overflow-hidden">
                            <div className="h-full" style={{ backgroundColor: p.color, width: `${pct}%` }} />
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {isWinner
                            ? <span className="inline-block bg-[#ffd700] text-[#0B2E33] rounded-full px-3 py-0.5 text-xs font-heading font-bold">🏆 WINNER</span>
                            : <span className="text-[#5a7a7e] text-xs">—</span>}
                        </td>
                        <td className="px-6 py-3 text-xs text-red-400">{margin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final bar chart */}
          <div className="bg-[#ffffff] border border-[#4F7C82] rounded-xl p-6 mt-6">
            <div className="font-heading font-bold text-[#0B2E33] mb-3">Final Results — Vote Distribution</div>
            <div style={{ height: 280 }}><Bar data={barData} options={barOptions} /></div>
          </div>

          {/* Constituency winners */}
          <div className="bg-[#ffffff] border border-[#4F7C82] rounded-xl overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-[#4F7C82] font-heading font-bold text-[#0B2E33]">Constituency-wise Winners</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B2E33]">
                  <tr>
                    {['Constituency', 'Winner', 'Votes', 'Runner Up', 'Margin', 'Turnout'].map(h => (
                      <th key={h} className="text-xs font-heading uppercase tracking-wide text-[#5a7a7e] px-6 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {constituencies.map((c, i) => {
                    const pbSorted = [...c.partyBreakdown].sort((a, b) => b.votes - a.votes);
                    const w = pbSorted[0]; const r = pbSorted[1];
                    return (
                      <tr key={c.id} className={i % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f0f7f8]'}>
                        <td className="px-6 py-3 text-[#0B2E33] font-semibold">{c.name}</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
                            style={{ color: partyColor(w.party), borderColor: partyColor(w.party) + '4D', backgroundColor: partyColor(w.party) + '26' }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: partyColor(w.party) }} />{w.party}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-[#0B2E33]">{w.votes}</td>
                        <td className="px-6 py-3 text-[#5a7a7e]">{r?.party ?? '—'}</td>
                        <td className="px-6 py-3 text-xs text-green-400">+{w.votes - (r?.votes ?? 0)}</td>
                        <td className="px-6 py-3 text-[#0B2E33]">{c.turnout}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4 mt-6 no-print">
            <button onClick={() => window.print()} className="border border-[#4F7C82] text-[#0B2E33] hover:bg-[#e8f4f6] rounded-xl px-6 py-3">🖨️ Export as PDF</button>
            <button onClick={generateCSV} className="border border-[#4F7C82] text-[#4F7C82] hover:bg-[#e8f4f6] rounded-xl px-6 py-3">📊 Download CSV</button>
          </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
};

export default FinalResults;
