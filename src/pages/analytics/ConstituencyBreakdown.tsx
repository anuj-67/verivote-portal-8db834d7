import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import AnalyticsLayout from '../../components/analytics/AnalyticsLayout';
import { useLiveData } from '../../hooks/useLiveData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ConstituencyBreakdown = () => {
  const [sp] = useSearchParams();
  const { constituencies, parties } = useLiveData();
  const id = parseInt(sp.get('id') ?? '1', 10);
  const c = useMemo(() => constituencies.find(x => x.id === id) ?? constituencies[0], [constituencies, id]);

  const partyMap = (abbr: string) => parties.find(p => p.abbreviation === abbr);
  const sortedPB = [...c.partyBreakdown].sort((a, b) => b.votes - a.votes);
  const winnerMeta = partyMap(sortedPB[0].party);

  const turnoutClass = c.turnout > 70 ? 'bg-green-900/50 text-green-400 border-green-800'
    : c.turnout >= 40 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
    : 'bg-red-900/50 text-red-400 border-red-800';

  const barData = {
    labels: c.partyBreakdown.map(p => p.party),
    datasets: [{
      data: c.partyBreakdown.map(p => p.votes),
      backgroundColor: c.partyBreakdown.map(p => (partyMap(p.party)?.color ?? '#93B1B5') + 'CC'),
      borderColor: c.partyBreakdown.map(p => partyMap(p.party)?.color ?? '#93B1B5'),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };
  const barOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#B8E3E9', font: { family: 'Rajdhani', size: 14 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#93B1B5' } },
    },
  };
  const donutData = {
    labels: c.partyBreakdown.map(p => p.party),
    datasets: [{
      data: c.partyBreakdown.map(p => p.votes),
      backgroundColor: c.partyBreakdown.map(p => (partyMap(p.party)?.color ?? '#93B1B5') + 'DD'),
      borderColor: c.partyBreakdown.map(p => partyMap(p.party)?.color ?? '#93B1B5'),
      borderWidth: 2,
    }],
  };
  const donutOptions: any = {
    responsive: true, maintainAspectRatio: false, cutout: '65%',
    plugins: { legend: { position: 'bottom', labels: { color: '#93B1B5' } } },
  };

  return (
    <AnalyticsLayout>
      <div className="px-4 md:px-8 pt-6 pb-12">
        <Link to="/analytics/dashboard" className="text-[#93B1B5] hover:text-white text-sm">← Back to Dashboard</Link>
        <h1 className="font-heading text-3xl font-bold text-[#B8E3E9] mt-3">{c.name}</h1>
        <div className="text-sm text-[#93B1B5]">{c.name} Assembly Constituency — Live Results</div>

        {/* Constituency selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {constituencies.map(co => (
            <Link
              key={co.id}
              to={`/analytics/constituency?id=${co.id}`}
              className={`text-xs rounded-full px-3 py-1 border ${
                co.id === c.id ? 'bg-[#4F7C82] text-white border-[#4F7C82]' : 'border-[#4F7C82] text-[#93B1B5] hover:text-white'
              }`}
            >
              {co.name}
            </Link>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#143e44] border border-[#4F7C82] border-l-4 !border-l-[#93B1B5] rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Total Voters</div>
            <div className="font-heading text-3xl font-bold text-[#B8E3E9] mt-1">{c.totalVoters.toLocaleString()}</div>
          </div>
          <div className="bg-[#103a40] border border-[#4F7C82] rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Votes Cast</div>
            <div className="font-heading text-3xl font-bold text-[#4F7C82] mt-1">{c.votesCast.toLocaleString()}</div>
          </div>
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Turnout</div>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm border ${turnoutClass}`}>{c.turnout}%</span>
          </div>
          <div className="bg-[#143e44] border-2 rounded-xl p-4" style={{ borderColor: winnerMeta?.color }}>
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Leading Party</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl">{winnerMeta?.emoji}</span>
              <div>
                <div className="font-heading font-bold text-lg" style={{ color: winnerMeta?.color }}>{sortedPB[0].party}</div>
                <div className="text-xs text-[#93B1B5]">{sortedPB[0].votes} votes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-6">
            <div className="font-heading font-bold text-[#B8E3E9] mb-3">Party-wise Votes — {c.name}</div>
            <div style={{ height: 260 }}><Bar data={barData} options={barOptions} /></div>
          </div>
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-6">
            <div className="font-heading font-bold text-[#B8E3E9] mb-3">Vote Share — {c.name}</div>
            <div style={{ height: 260 }}><Doughnut data={donutData} options={donutOptions} /></div>
          </div>
        </div>

        {/* Booth Table */}
        <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-[#4F7C82] font-heading font-bold text-[#B8E3E9]">Booth-wise Turnout — {c.name}</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B2E33]">
                <tr>
                  {['Booth ID', 'Location', 'Registered', 'Voted', 'Turnout %', 'Fraud Flags', 'Status'].map(h => (
                    <th key={h} className="text-xs font-heading uppercase tracking-wide text-[#93B1B5] px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.booths.map((b, i) => {
                  const tcls = b.turnout > 70 ? 'bg-green-900/50 text-green-400 border-green-800'
                    : b.turnout >= 40 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
                    : 'bg-red-900/50 text-red-400 border-red-800';
                  return (
                    <tr key={b.boothId} className={`${i % 2 === 0 ? 'bg-[#143e44]' : 'bg-[#103a40]'} hover:bg-[#1c4f55] transition-colors`}>
                      <td className="px-6 py-3 text-[#B8E3E9] text-sm">{b.boothId}</td>
                      <td className="px-6 py-3 text-[#B8E3E9] text-sm">{b.location}</td>
                      <td className="px-6 py-3 text-[#B8E3E9] text-sm">{b.registered}</td>
                      <td className="px-6 py-3 text-[#B8E3E9] text-sm">{b.voted}</td>
                      <td className="px-6 py-3"><span className={`inline-block px-3 py-1 rounded-full text-xs border ${tcls}`}>{b.turnout}%</span></td>
                      <td className="px-6 py-3">
                        {b.fraudFlags > 0
                          ? <span className="inline-block bg-red-900/50 text-red-400 border border-red-800 rounded-full px-2 py-0.5 text-xs">{b.fraudFlags}</span>
                          : <span className="text-[#93B1B5]">—</span>}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-block rounded-full px-3 py-0.5 text-xs border ${
                          b.status === 'Active' ? 'bg-green-900/50 text-green-400 border-green-800' : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnalyticsLayout>
  );
};

export default ConstituencyBreakdown;
