import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import {
  Party, Constituency,
  partiesInitial, liveTurnoutInitial, constituenciesInitial,
} from '../data/analyticsData';

interface LiveTurnout {
  totalRegistered: number;
  totalVoted: number;
  turnoutPercentage: number;
  votesRemaining: number;
  pollingOpen: boolean;
  pollingEndsAt: string;
  lastUpdated: Date;
}

interface LiveDataContextType {
  parties: Party[];
  liveTurnout: LiveTurnout;
  constituencies: Constituency[];
  isLive: boolean;
  lastUpdated: Date;
  recentIncrease: number;
  toggleLive: () => void;
  addVote: (partyId: number, constituencyId?: number) => void;
  closePolling: () => void;
  bulkSimulate: (n: number) => void;
}

const LiveDataContext = createContext<LiveDataContextType | null>(null);

const WEIGHTS = [0.35, 0.25, 0.2, 0.12, 0.08];

export const LiveDataProvider = ({ children, intervalMs = 30000 }: { children: ReactNode; intervalMs?: number }) => {
  const [parties, setParties] = useState<Party[]>(() => partiesInitial.map(p => ({ ...p })));
  const [liveTurnout, setLiveTurnout] = useState<LiveTurnout>({ ...liveTurnoutInitial });
  const [constituencies, setConstituencies] = useState<Constituency[]>(() =>
    constituenciesInitial.map(c => ({ ...c, partyBreakdown: c.partyBreakdown.map(p => ({ ...p })), booths: c.booths.map(b => ({ ...b })) }))
  );
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [recentIncrease, setRecentIncrease] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = () => {
    const newVotes = Math.floor(Math.random() * 11) + 5;
    setParties(prev => prev.map((p, i) => {
      const added = Math.round(newVotes * WEIGHTS[i]);
      return { ...p, previousVotes: p.votes, votes: p.votes + added };
    }));
    setLiveTurnout(prev => {
      const totalVoted = Math.min(prev.totalRegistered, prev.totalVoted + newVotes);
      return {
        ...prev,
        totalVoted,
        turnoutPercentage: +(totalVoted / prev.totalRegistered * 100).toFixed(1),
        votesRemaining: prev.totalRegistered - totalVoted,
      };
    });
    setConstituencies(prev => {
      const cIdx = Math.floor(Math.random() * prev.length);
      const bIdx = Math.floor(Math.random() * prev[cIdx].booths.length);
      const inc = Math.floor(Math.random() * 5) + 1;
      return prev.map((c, i) => {
        if (i !== cIdx) return c;
        const newBooths = c.booths.map((b, j) => j === bIdx ? {
          ...b,
          voted: Math.min(b.registered, b.voted + inc),
          turnout: +(Math.min(b.registered, b.voted + inc) / b.registered * 100).toFixed(1),
        } : b);
        const pIdx = Math.floor(Math.random() * c.partyBreakdown.length);
        const newBreakdown = c.partyBreakdown.map((pb, k) => k === pIdx ? { ...pb, votes: pb.votes + inc } : pb);
        const totalCast = Math.min(c.totalVoters, c.votesCast + inc);
        return {
          ...c, booths: newBooths, partyBreakdown: newBreakdown,
          votesCast: totalCast, turnout: +(totalCast / c.totalVoters * 100).toFixed(1),
        };
      });
    });
    setRecentIncrease(newVotes);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    if (isLive && liveTurnout.pollingOpen) {
      intervalRef.current = setInterval(tick, intervalMs);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, intervalMs, liveTurnout.pollingOpen]);

  const addVote = (partyId: number, constituencyId?: number) => {
    console.log('[VeriVote] addVote called', { partyId, constituencyId });
    setParties(prev => prev.map(p => p.id === partyId ? { ...p, previousVotes: p.votes, votes: p.votes + 1 } : p));
    setLiveTurnout(prev => ({ ...prev, totalVoted: prev.totalVoted + 1, turnoutPercentage: +((prev.totalVoted + 1) / prev.totalRegistered * 100).toFixed(1) }));
    setLastUpdated(new Date());
  };

  const bulkSimulate = (n: number) => {
    for (let i = 0; i < n; i++) tick();
  };

  const toggleLive = () => setIsLive(v => !v);
  const closePolling = () => setLiveTurnout(prev => ({ ...prev, pollingOpen: false }));

  return (
    <LiveDataContext.Provider value={{ parties, liveTurnout, constituencies, isLive, lastUpdated, recentIncrease, toggleLive, addVote, closePolling, bulkSimulate }}>
      {children}
    </LiveDataContext.Provider>
  );
};

export const useLiveData = () => {
  const ctx = useContext(LiveDataContext);
  if (!ctx) throw new Error('useLiveData must be used within LiveDataProvider');
  return ctx;
};
