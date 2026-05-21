import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, UserCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const ECAdminLogin = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [officerId, setOfficerId] = useState('');
  const [pw, setPw] = useState('');
  const [access, setAccess] = useState('full');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('ec_authed', '1');
      navigate('/analytics/dashboard');
    }, 1800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#0B2E33',
        backgroundImage: 'radial-gradient(rgba(79,124,130,0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="font-heading text-4xl font-bold text-white">VeriVote</div>
          <div className="text-sm text-[#93B1B5] mt-1">Election Commission — Analytics & Results Dashboard</div>
        </div>

        <div className="bg-[#143e44] border border-[#4F7C82] rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-[#0B2E33] p-6 text-center">
            <BarChart2 size={36} className="text-white mx-auto mb-2" />
            <div className="font-heading text-[22px] font-bold text-white">EC Officer Login</div>
            <div className="text-xs text-white/70">Election Commission of India</div>
            <div className="text-xs text-white/50 mt-1">Results & Analytics Portal</div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="text-xs text-[#93B1B5] font-heading uppercase tracking-wider">EC Officer ID</label>
              <div className="relative mt-1">
                <UserCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93B1B5]" />
                <input
                  value={officerId}
                  onChange={e => setOfficerId(e.target.value)}
                  required
                  placeholder="ECI/EC/2025/0001"
                  className="w-full bg-[#0B2E33] border border-[#4F7C82] text-[#B8E3E9] placeholder-[#93B1B5]/50 rounded-lg pl-10 pr-3 py-2.5 focus:border-[#4F7C82] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#93B1B5] font-heading uppercase tracking-wider">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0B2E33] border border-[#4F7C82] text-[#B8E3E9] rounded-lg px-3 py-2.5 pr-10 focus:border-[#4F7C82] outline-none"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#93B1B5]">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#93B1B5] font-heading uppercase tracking-wider">Dashboard Access Level</label>
              <select
                value={access}
                onChange={e => setAccess(e.target.value)}
                className="w-full mt-1 bg-[#0B2E33] border border-[#4F7C82] text-[#B8E3E9] rounded-lg px-3 py-2.5 focus:border-[#4F7C82] outline-none"
              >
                <option value="full">Full Analytics Access</option>
                <option value="constituency">Constituency Observer</option>
                <option value="state">State Observer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F7C82] hover:bg-[#3a5e63] disabled:opacity-70 text-white font-heading font-bold py-3 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (<><Loader2 size={20} className="animate-spin" /> Authenticating...</>) : 'Access Dashboard →'}
            </button>
          </form>
        </div>

        <div className="bg-[#143e44] border border-[#4F7C82] rounded-xl p-4 mt-4">
          <div className="font-heading font-bold text-[#B8E3E9]">🗳️ General Elections 2025 — Karnataka</div>
          <div className="text-xs text-[#93B1B5] mt-1">Polling Date: 7 April 2025 | Results: Live</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Live Data Feed Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECAdminLogin;
