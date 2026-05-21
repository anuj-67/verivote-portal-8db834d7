import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AnalyticsLayout from '../../components/analytics/AnalyticsLayout';
import { useLiveData } from '../../hooks/useLiveData';

type SortKey = 'turnoutDesc' | 'turnoutAsc' | 'fraud' | 'id';

const BoothTurnout = () => {
  const { constituencies } = useLiveData();
  const [constFilter, setConstFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Closed'>('all');
  const [turnoutFilter, setTurnoutFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('turnoutDesc');

  const allBooths = useMemo(() =>
    constituencies.flatMap(c => c.booths.map(b => ({ ...b, constituency: c.name }))),
    [constituencies]
  );

  const filteredBooths = useMemo(() => {
    let list = allBooths;
    if (constFilter !== 'all') list = list.filter(b => b.constituency === constFilter);
    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
    if (turnoutFilter !== 'all') {
      list = list.filter(b =>
        turnoutFilter === 'high' ? b.turnout > 70 :
        turnoutFilter === 'mid' ? b.turnout >= 40 && b.turnout <= 70 :
        b.turnout < 40
      );
    }
    list = [...list];
    if (sortBy === 'turnoutDesc') list.sort((a, b) => b.turnout - a.turnout);
    if (sortBy === 'turnoutAsc') list.sort((a, b) => a.turnout - b.turnout);
    if (sortBy === 'fraud') list.sort((a, b) => b.fraudFlags - a.fraudFlags);
    if (sortBy === 'id') list.sort((a, b) => a.boothId.localeCompare(b.boothId));
    return list;
  }, [allBooths, constFilter, statusFilter, turnoutFilter, sortBy]);

  const activeCount = allBooths.filter(b => b.status === 'Active').length;
  const avgTurnout = +(allBooths.reduce((s, b) => s + b.turnout, 0) / allBooths.length).toFixed(1);
  const totalFraud = allBooths.reduce((s, b) => s + b.fraudFlags, 0);

  const resetFilters = () => {
    setConstFilter('all'); setStatusFilter('all'); setTurnoutFilter('all'); setSortBy('turnoutDesc');
  };

  const pill = (active: boolean) =>
    active ? 'bg-[#4F7C82] text-white' : 'bg-[#143e44] border border-[#4F7C82] text-[#93B1B5] hover:text-white';

  return (
    <AnalyticsLayout>
      <div className="px-4 md:px-8 pt-6 pb-12">
        <Link to="/analytics/dashboard" className="text-[#93B1B5] hover:text-white text-sm">← Back to Dashboard</Link>
        <h1 className="font-heading text-3xl font-bold text-[#B8E3E9] mt-3">Booth-wise Turnout Monitor</h1>
        <div className="text-sm text-[#93B1B5]">All polling booths — Live status</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-5">
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Total Booths Active</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-heading text-3xl font-bold text-[#B8E3E9]">{activeCount}</span>
            </div>
          </div>
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-5">
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Average Turnout</div>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm border ${
              avgTurnout > 70 ? 'bg-green-900/50 text-green-400 border-green-800'
              : avgTurnout >= 40 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
              : 'bg-red-900/50 text-red-400 border-red-800'
            }`}>{avgTurnout}%</span>
          </div>
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-5">
            <div className="text-xs uppercase tracking-wide text-[#93B1B5] font-heading">Total Fraud Flags</div>
            <div className="mt-2">
              {totalFraud > 0
                ? <span className="inline-block bg-red-900/50 text-red-400 border border-red-800 rounded-full px-3 py-1 text-sm">⚠️ {totalFraud}</span>
                : <span className="text-[#93B1B5]">—</span>}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <span className="text-xs text-[#93B1B5] font-heading uppercase">Filter by:</span>
          <select value={constFilter} onChange={e => setConstFilter(e.target.value)}
            className="bg-[#0B2E33] border border-[#4F7C82] text-[#B8E3E9] rounded-lg px-3 py-1.5 text-sm">
            <option value="all">All Constituencies</option>
            {constituencies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <div className="flex gap-1">
            {(['all', 'Active', 'Closed'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-full px-3 py-1 text-xs ${pill(statusFilter === s)}`}>{s === 'all' ? 'All' : s}</button>
            ))}
          </div>
          <div className="flex gap-1">
            {([['all', 'All'], ['high', '🟢 High >70%'], ['mid', '🟡 Medium'], ['low', '🔴 Low <40%']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTurnoutFilter(k as any)} className={`rounded-full px-3 py-1 text-xs ${pill(turnoutFilter === k)}`}>{l}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
            className="bg-[#0B2E33] border border-[#4F7C82] text-[#B8E3E9] rounded-lg px-3 py-1.5 text-sm">
            <option value="turnoutDesc">Turnout (High to Low)</option>
            <option value="turnoutAsc">Turnout (Low to High)</option>
            <option value="fraud">Fraud Flags</option>
            <option value="id">Booth ID</option>
          </select>
        </div>

        <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl overflow-hidden mt-4">
          <div className="text-xs text-[#93B1B5] px-6 py-3 border-b border-[#4F7C82]">{filteredBooths.length} booths shown</div>
          {filteredBooths.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-[#93B1B5]">No booths match your filters</div>
              <button onClick={resetFilters} className="mt-4 bg-[#4F7C82] text-white px-4 py-1.5 rounded-lg text-sm">Reset filters</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B2E33] sticky top-0 z-10">
                  <tr>
                    {['Booth ID', 'Location', 'Constituency', 'Registered', 'Voted', 'Turnout %', 'Fraud Flags', 'Status'].map(h => (
                      <th key={h} className="text-xs font-heading uppercase tracking-wide text-[#93B1B5] px-4 py-3 text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBooths.map((b, i) => {
                    const tcls = b.turnout > 70 ? 'bg-green-900/50 text-green-400 border-green-800'
                      : b.turnout >= 40 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
                      : 'bg-red-900/50 text-red-400 border-red-800';
                    const tinnerColor = b.turnout > 70 ? '#22c55e' : b.turnout >= 40 ? '#eab308' : '#ef4444';
                    return (
                      <tr key={b.boothId} className={`${i % 2 === 0 ? 'bg-[#143e44]' : 'bg-[#103a40]'} hover:bg-[#1c4f55]`}>
                        <td className="px-4 py-3 text-[#B8E3E9] text-sm">{b.boothId}</td>
                        <td className="px-4 py-3 text-[#B8E3E9] text-sm">{b.location}</td>
                        <td className="px-4 py-3 text-xs text-[#93B1B5]">{b.constituency}</td>
                        <td className="px-4 py-3 text-[#B8E3E9] text-sm">{b.registered}</td>
                        <td className="px-4 py-3 text-[#B8E3E9] text-sm">{b.voted}<span className="text-xs text-[#93B1B5]"> / {b.registered}</span></td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs border ${tcls}`}>{b.turnout}%</span>
                          <div className="w-16 bg-[#0B2E33] h-1 rounded-full mt-1 overflow-hidden">
                            <div className="h-full" style={{ width: `${b.turnout}%`, backgroundColor: tinnerColor }} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {b.fraudFlags > 3
                            ? <span className="inline-block bg-red-900/60 text-red-300 border border-red-700 rounded-full px-2 py-0.5 text-xs">⚠️ {b.fraudFlags} High</span>
                            : b.fraudFlags > 0
                              ? <span className="inline-block bg-orange-900/50 text-orange-400 border border-orange-800 rounded-full px-2 py-0.5 text-xs">{b.fraudFlags}</span>
                              : <span className="text-[#93B1B5]">—</span>}
                        </td>
                        <td className="px-4 py-3">
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
          )}
        </div>
      </div>
    </AnalyticsLayout>
  );
};

export default BoothTurnout;
