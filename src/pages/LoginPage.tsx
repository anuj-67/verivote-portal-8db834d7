import { useState } from 'react';
import { Shield, UserCircle, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useEnrollment } from '../context/EnrollmentContext';

const LoginPage = () => {
  const { setCurrentPage } = useEnrollment();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState(false);

  const handleLogin = () => {
    const errs: Record<string, string> = {};
    if (!officerId.trim()) errs.officerId = 'Officer ID is required';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (officerId === 'wrong') {
      setLoginError(true);
      return;
    }

    setLoginError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPage('dashboard');
    }, 1800);
  };

  return (
    <Layout showOfficerBadge={false}>
      <div
        className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8"
        style={{
          backgroundColor: 'hsl(214,33%,93%)',
          backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(208,216,232,0.3) 40px,rgba(208,216,232,0.3) 41px)',
        }}
      >
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-center" style={{ backgroundColor: '#1a237e' }}>
              <Shield className="mx-auto mb-2 text-white" size={32} />
              <h1 className="font-heading text-xl font-bold text-white">Enrollment Officer Login</h1>
              <p className="text-xs text-white/70 mt-1">Authorized Personnel Only</p>
            </div>

            <div className="p-8 space-y-5">
              {/* Officer ID */}
              <div>
                <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">
                  Officer ID / Badge Number <span className="text-red-error">*</span>
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    placeholder="ECI/KA/OFF/2024/0042"
                    value={officerId}
                    onChange={(e) => { setOfficerId(e.target.value); setErrors(p => ({ ...p, officerId: '' })); }}
                    className={`w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-md outline-none transition-all duration-200 font-body ${
                      errors.officerId ? 'border-red-error focus:ring-2 focus:ring-red-error/20' : 'border-border-color focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20'
                    }`}
                  />
                </div>
                {errors.officerId && <p className="text-xs text-red-error mt-1">{errors.officerId}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">
                  Password <span className="text-red-error">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-md outline-none transition-all duration-200 font-body ${
                      errors.password ? 'border-red-error' : 'border-border-color focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20'
                    }`}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-error mt-1">{errors.password}</p>}
              </div>

              {/* Constituency */}
              <div>
                <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Assigned Constituency</label>
                <input readOnly className="w-full px-3.5 py-2.5 text-sm border border-border-color rounded-md bg-gray-50 text-text-muted font-body" placeholder="Auto-filled from Officer ID" />
                <p className="text-xs text-text-muted mt-1">As per your ECI appointment letter</p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-error">
                  ❌ Invalid credentials. This attempt has been logged.
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full font-heading font-bold rounded-md px-6 py-2.5 transition-all duration-200 mt-6 ${
                  loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-primary hover:bg-blue-dark text-white hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} />Authenticating...</span> : 'Login to Enrollment Portal →'}
              </button>

              <p className="text-xs text-text-muted text-center mt-4 hover:underline cursor-pointer">Forgot credentials?</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex gap-2 items-start">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-text-muted">
              This is a restricted government terminal. All login attempts are recorded and monitored. Unauthorized access is punishable under IT Act 2000.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
