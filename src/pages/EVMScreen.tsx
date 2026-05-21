import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveData } from '../hooks/useLiveData';
import { partiesInitial } from '../data/analyticsData';
import AshokaChakra from '../components/AshokaChakra';

type Stage = 'select' | 'confirm' | 'vvpat' | 'success';

const EVMScreen = () => {
  const navigate = useNavigate();
  const { addVote } = useLiveData();
  const [stage, setStage] = useState<Stage>('select');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [returnIn, setReturnIn] = useState(10);

  const selected = partiesInitial.find(p => p.id === selectedId);

  useEffect(() => {
    if (stage === 'vvpat') {
      const t = setTimeout(() => setStage('success'), 7000);
      return () => clearTimeout(t);
    }
    if (stage === 'success') {
      const i = setInterval(() => setReturnIn(v => v - 1), 1000);
      const t = setTimeout(() => navigate('/'), 10000);
      return () => { clearInterval(i); clearTimeout(t); };
    }
  }, [stage, navigate]);

  const handleConfirm = () => {
    if (selectedId == null) return;
    addVote(selectedId, 1);
    setStage('vvpat');
  };

  return (
    <div className="min-h-screen bg-[#0d1b4b] text-white">
      <div className="bg-[#0B2E33] p-8 text-center">
        <div className="flex justify-center mb-2"><AshokaChakra size={64} /></div>
        <div className="font-heading text-[28px] font-bold">ELECTRONIC VOTING MACHINE</div>
        <div className="text-sm text-white/70 mt-1">Election Commission of India — General Elections 2025</div>
      </div>
      <div className="bg-[#f57f17] text-white text-center py-2 px-8 font-heading font-bold">
        ⚠️ VOTER PRIVACY PROTECTED — Officer must look away while voter makes selection
      </div>

      <div className="text-center mt-6 mb-4 px-4">
        <div className="font-heading text-xl text-white/80">Press the button next to your chosen candidate</div>
        <div className="text-sm text-white/60 mt-1">Your vote is secret and cannot be changed after confirmation</div>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto px-8 pb-12">
        {partiesInitial.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedId(p.id); setStage('confirm'); }}
            className="bg-[#143e44] border-2 border-[#4F7C82] rounded-xl p-4 cursor-pointer flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] text-left"
            style={{ '--c': p.color } as any}
            onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.backgroundColor = '#1c4f55'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#4F7C82'; e.currentTarget.style.backgroundColor = '#143e44'; }}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full text-4xl"
              style={{ backgroundColor: p.color + '33', border: `2px solid ${p.color}` }}>
              {p.emoji}
            </div>
            <div className="flex-1">
              <div className="font-heading text-xl font-bold text-white">{p.abbreviation}</div>
              <div className="text-sm text-[#93B1B5]">{p.name}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1c4f55] border-2 border-[#4F7C82] flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[#4F7C82]" />
            </div>
          </button>
        ))}
      </div>

      {/* Confirmation Modal */}
      {stage === 'confirm' && selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#143e44] border border-[#4F7C82] rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-2">{selected.emoji}</div>
            <div className="text-sm text-[#93B1B5]">You have selected</div>
            <div className="font-heading text-2xl font-bold text-white mt-1">{selected.name}</div>
            <div className="font-heading text-lg font-medium mt-1" style={{ color: selected.color }}>{selected.abbreviation}</div>
            <div className="text-sm text-amber-400 mt-4">⚠️ This action cannot be undone.</div>
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={handleConfirm} className="w-full text-white font-heading font-bold py-3 rounded-xl text-lg" style={{ backgroundColor: selected.color }}>
                ✓ Confirm Vote
              </button>
              <button onClick={() => { setStage('select'); setSelectedId(null); }} className="w-full bg-[#1c4f55] border border-[#4F7C82] text-[#93B1B5] rounded-xl py-3">
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VVPAT */}
      {stage === 'vvpat' && selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center px-4">
          <div className="text-sm text-white/70 mb-3">Your paper trail — visible for 7 seconds</div>
          <div
            className="bg-white text-black p-2 text-center"
            style={{
              width: 200, height: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              animation: 'slipUp 500ms ease-out forwards',
            }}
          >
            <div className="text-2xl">{selected.emoji}</div>
            <div className="text-xs">{selected.name}</div>
            <div className="text-sm font-bold">{selected.abbreviation}</div>
            <div className="text-[10px] text-green-600">✓ Vote Recorded</div>
            <div className="text-[10px] text-gray-500">{new Date().toLocaleTimeString()}</div>
          </div>
          <div className="mt-4 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-green-400" style={{ animation: 'countdown 7s linear forwards' }} />
          </div>
          <style>{`
            @keyframes slipUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes countdown { from { width: 100%; } to { width: 0%; } }
          `}</style>
        </div>
      )}

      {/* Success */}
      {stage === 'success' && (
        <div className="fixed inset-0 bg-[#0a2e0a] z-50 flex flex-col items-center justify-center text-center px-4">
          <svg width={120} height={120} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#4caf50" strokeWidth="4" fill="none" className="animate-draw-circle" />
            <path d="M 30 50 L 45 65 L 70 35" stroke="#4caf50" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check" />
          </svg>
          <div className="font-heading text-3xl font-bold text-white mt-6">YOUR VOTE HAS BEEN</div>
          <div className="font-heading text-3xl font-bold" style={{ color: '#4caf50' }}>CAST SUCCESSFULLY</div>
          <div className="text-base text-white/70 mt-4">Thank you for participating in democracy 🇮🇳</div>
          <div className="text-sm text-white/50 mt-6">Returning in {Math.max(returnIn, 0)} seconds...</div>
        </div>
      )}
    </div>
  );
};

export default EVMScreen;
