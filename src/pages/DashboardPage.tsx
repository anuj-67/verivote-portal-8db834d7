import { useEffect, useState } from 'react';
import { Users, Clock, XCircle, BarChart2, UserPlus, ClipboardList, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useEnrollment } from '../context/EnrollmentContext';

const recentData = [
  { id: 'KA/04/2025/001230', name: 'Ramesh B.', constituency: 'Shivajinagar', time: '10:42 AM', status: 'Enrolled' },
  { id: 'KA/04/2025/001229', name: 'Meena S.', constituency: 'Shivajinagar', time: '10:28 AM', status: 'Enrolled' },
  { id: 'KA/04/2025/001228', name: 'Arjun K.', constituency: 'Shivajinagar', time: '10:15 AM', status: 'Pending' },
  { id: 'KA/04/2025/001227', name: 'Lakshmi R.', constituency: 'Shivajinagar', time: '09:58 AM', status: 'Enrolled' },
  { id: 'KA/04/2025/001226', name: 'Suresh M.', constituency: 'Shivajinagar', time: '09:41 AM', status: 'Rejected' },
];

const statusPill = (s: string) => {
  if (s === 'Enrolled') return <span className="bg-green-100 text-green-700 rounded-full px-3 py-0.5 text-xs font-semibold">✅ Enrolled</span>;
  if (s === 'Pending') return <span className="bg-orange-100 text-orange-700 rounded-full px-3 py-0.5 text-xs font-semibold">⏳ Pending</span>;
  return <span className="bg-red-100 text-red-700 rounded-full px-3 py-0.5 text-xs font-semibold">❌ Rejected</span>;
};

const useCountUp = (target: number, duration = 800) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(start);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return val;
};

const DashboardPage = () => {
  const { setCurrentPage, resetEnrollment, dashboardStats } = useEnrollment();
  const e = useCountUp(dashboardStats.enrollmentsToday);
  const p = useCountUp(dashboardStats.pendingVerification);
  const r = useCountUp(dashboardStats.rejectedToday);
  const t = useCountUp(dashboardStats.totalThisWeek);

  const stats = [
    { label: 'ENROLLMENTS TODAY', value: e, sub: '+3 in last hour', icon: Users, color: 'border-blue-primary', iconBg: 'bg-blue-100 text-blue-primary' },
    { label: 'PENDING VERIFICATION', value: p, sub: 'Awaiting biometric', icon: Clock, color: 'border-saffron', iconBg: 'bg-orange-100 text-saffron' },
    { label: 'REJECTED TODAY', value: r, sub: 'Duplicate Aadhaar', icon: XCircle, color: 'border-red-error', iconBg: 'bg-red-100 text-red-error' },
    { label: 'TOTAL THIS WEEK', value: t, sub: 'Target: 200', icon: BarChart2, color: 'border-green-success', iconBg: 'bg-green-100 text-green-success', showProgress: true },
  ];

  return (
    <Layout>
      <div className="animate-fade-in-up">
        {/* Welcome Bar */}
        <div className="bg-white px-4 md:px-8 py-4 border-b border-border-color flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h1 className="font-heading text-xl font-bold" style={{ color: '#1a237e' }}>Good Morning, Priya Sharma 👋</h1>
            <p className="text-sm text-text-muted">Enrollment Drive — Shivajinagar | Tuesday, 7 April 2025</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-xs text-green-700">
            🟢 Session Active | Booth KA-04-007
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mx-4 md:mx-8">
          {stats.map((s) => (
            <div key={s.label} className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${s.color} flex justify-between items-start`}>
              <div>
                <p className="text-xs text-text-muted font-heading uppercase tracking-wide">{s.label}</p>
                <p className="text-3xl font-bold font-heading text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.sub}</p>
                {s.showProgress && (
                  <div className="h-1.5 bg-gray-200 rounded-full mt-2 w-24 overflow-hidden">
                    <div className="h-full bg-green-success rounded-full transition-all duration-700" style={{ width: `${(dashboardStats.totalThisWeek / 200) * 100}%` }} />
                  </div>
                )}
              </div>
              <div className={`w-10 h-10 rounded-full ${s.iconBg} flex items-center justify-center`}>
                <s.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 md:mx-8 mt-6">
          <button
            onClick={() => { resetEnrollment(); setCurrentPage('personal'); }}
            className="bg-blue-primary rounded-xl p-6 text-left hover:bg-blue-dark transition-all hover:-translate-y-1 hover:shadow-lg group"
          >
            <UserPlus className="text-white mb-3" size={32} />
            <h2 className="font-heading text-xl font-bold text-white">Enroll New Voter</h2>
            <p className="text-sm text-white/80">Start new Form 6 voter registration</p>
            <ArrowRight className="text-white mt-2 transition-transform group-hover:translate-x-1" size={20} />
          </button>
          <button className="bg-white border-2 border-blue-primary rounded-xl p-6 text-left hover:bg-blue-light transition-all hover:-translate-y-1 hover:shadow-md">
            <ClipboardList className="text-blue-primary mb-3" size={32} />
            <h2 className="font-heading text-xl font-bold text-blue-primary">View Enrolled Voters</h2>
            <p className="text-sm text-text-muted">Browse today's enrollment records</p>
          </button>
        </div>

        {/* Recent Table */}
        <div className="mx-4 md:mx-8 mt-6 mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border-color flex justify-between items-center">
            <h3 className="font-heading text-base font-bold text-text-primary">Recent Enrollments</h3>
            <span className="text-sm text-blue-primary hover:underline cursor-pointer">View All →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['Voter ID', 'Full Name', 'Constituency', 'Enrolled At', 'Status'].map(h => (
                    <th key={h} className="text-xs font-heading font-semibold uppercase text-text-muted tracking-wide px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentData.map((row, i) => (
                  <tr key={row.id} className={`${i % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-light transition-colors`}>
                    <td className="px-6 py-3 font-mono text-xs">{row.id}</td>
                    <td className="px-6 py-3">{row.name}</td>
                    <td className="px-6 py-3">{row.constituency}</td>
                    <td className="px-6 py-3">{row.time}</td>
                    <td className="px-6 py-3">{statusPill(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
