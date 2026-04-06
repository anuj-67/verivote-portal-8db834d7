import { useState, useEffect } from 'react';
import { Copy, CheckSquare } from 'lucide-react';
import Layout from '../components/Layout';
import { useEnrollment } from '../context/EnrollmentContext';

const SuccessPage = () => {
  const { enrollmentData, resetEnrollment, setCurrentPage } = useEnrollment();
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const voterId = `KA/04/2025/${String(Math.floor(Math.random() * 900000 + 100000))}`;
  const refNo = `VV/2025/APP/${String(Math.floor(Math.random() * 900000 + 100000))}`;

  useEffect(() => {
    setTimeout(() => setShowContent(true), 900);
  }, []);

  const copyId = () => {
    navigator.clipboard.writeText(voterId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const d = enrollmentData;

  const summaryItem = (label: string, value: string) => (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value || '—'}</p>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          {/* Animated Checkmark */}
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#2e7d32" strokeWidth="3" className="animate-draw-circle" />
              <path d="M14 24 L21 31 L34 18" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check" />
            </svg>
          </div>

          {showContent && (
            <div className="animate-fade-in-up">
              <h1 className="font-heading text-3xl font-bold text-green-success">Voter Successfully Enrolled!</h1>
              <p className="text-sm text-text-muted mt-2">The voter has been added to the electoral roll for {d.constituency || 'Shivajinagar'} Assembly Constituency</p>
            </div>
          )}

          {/* Voter ID */}
          <div className="mt-6 bg-blue-light border-2 border-dashed border-blue-primary rounded-xl p-6 text-center">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Generated Voter ID (EPIC Number)</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-heading text-4xl font-bold tracking-widest" style={{ color: '#1a237e' }}>{voterId}</span>
              <button onClick={copyId} className="text-text-muted hover:text-text-primary relative">
                <Copy size={18} />
                {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-navy text-white px-2 py-0.5 rounded whitespace-nowrap">Copied!</span>}
              </button>
            </div>
            <p className="text-xs text-green-success mt-3 flex items-center justify-center gap-1">✅ Confirmation SMS sent to +91-{d.mobile || '9XXXXXXXXX'}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-xl border border-border-color overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-border-color flex items-center gap-2">
            <CheckSquare size={18} className="text-blue-primary" />
            <span className="font-heading font-bold text-text-primary">Enrollment Summary</span>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {summaryItem('Full Name', d.fullName || 'Ramesh Kumar')}
            {summaryItem('State', d.state || 'Karnataka')}
            {summaryItem('Date of Birth', d.dob || '12 May 1990')}
            {summaryItem('District', d.district || 'Bengaluru Urban')}
            {summaryItem('Age', d.age ? `${d.age} years` : '34 years')}
            {summaryItem('Assembly Constituency', d.constituency || 'Shivajinagar (AC #147)')}
            {summaryItem('Gender', d.gender || 'Male')}
            {summaryItem('Parliamentary', d.parliamentaryConstituency || 'Bengaluru Central')}
            {summaryItem("Father's Name", d.relativeName || 'Suresh Kumar')}
            {summaryItem('Polling Booth', d.pollingBooth || 'Booth #7 — Govt. High School, MG Road')}
          </div>
          <div className="px-6 py-3 border-t border-border-color grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summaryItem('🖐 Fingerprint', 'Captured ✅')}
            {summaryItem('📄 Aadhaar', 'Verified & Hashed ✅')}
            {summaryItem('📷 Passport Photo', 'Uploaded ✅')}
            {summaryItem('Enrolled by', 'Officer Priya Sharma | Booth KA-04-007')}
            <div className="sm:col-span-2">
              {summaryItem('Timestamp', '07 April 2025, 11:34:22 AM')}
            </div>
          </div>
        </div>

        {/* Acknowledgement */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-heading font-bold text-sm text-amber-800 mb-2">📋 Voter Acknowledgement Notice</p>
          <p className="text-sm text-amber-900">The voter's physical EPIC card will be delivered to their registered address within 30 working days. This reference number may be used to track application status at voters.eci.gov.in</p>
          <p className="font-heading font-bold mt-2" style={{ color: '#1a237e' }}>Reference No: {refNo}</p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center no-print">
          <button onClick={() => window.print()} className="bg-white border border-blue-primary text-blue-primary font-heading font-semibold rounded-md px-6 py-2.5 hover:bg-blue-light transition-all">
            🖨️ Print Acknowledgement
          </button>
          <button onClick={() => { resetEnrollment(); setCurrentPage('personal'); }} className="bg-blue-primary text-white font-heading font-bold rounded-md px-6 py-2.5 hover:bg-blue-dark hover:-translate-y-0.5 hover:shadow-md transition-all">
            ➕ Enroll Another Voter
          </button>
          <button onClick={() => setCurrentPage('dashboard')} className="bg-white border border-blue-primary text-blue-primary font-heading font-semibold rounded-md px-6 py-2.5 hover:bg-blue-light transition-all">
            🏠 Go to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;
