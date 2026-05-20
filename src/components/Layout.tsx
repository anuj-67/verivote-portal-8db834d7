import { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import AshokaChakra from './AshokaChakra';
import { useEnrollment } from '../context/EnrollmentContext';

interface LayoutProps {
  children: ReactNode;
  showOfficerBadge?: boolean;
}

const navLinks = [
  { label: 'Home', page: 'dashboard' },
  { label: 'Enrollment', page: 'personal' },
  { label: 'Booth Login', page: 'login' },
  { label: '📊 Analytics', page: '__analytics' },
  { label: 'Help', page: 'dashboard' },
];

const Layout = ({ children, showOfficerBadge = true }: LayoutProps) => {
  const { currentPage, setCurrentPage } = useEnrollment();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      {/* Top Utility Bar */}
      <div className="bg-navy text-white text-xs py-1 px-4 md:px-8 flex justify-between items-center no-print">
        <span>Government of India — Election Commission of India</span>
        <span className="hidden sm:inline">Help | Contact | English ▾</span>
      </div>

      {/* Main Header */}
      <div className="bg-white px-4 md:px-8 py-3 border-b border-page-bg no-print">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AshokaChakra size={48} />
            <div>
              <div className="font-heading text-2xl font-bold" style={{ color: '#0B2E33' }}>VeriVote</div>
              <div className="text-xs text-text-muted">National Voter Registration Portal</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-text-muted text-right">
            <span>Ministry of Law and Justice | Election Commission of India</span>
            <span className="text-lg">🇮🇳</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-blue-primary px-4 md:px-8 no-print">
        <div className="flex justify-between items-center">
          <div className="hidden md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => setCurrentPage(link.page)}
                className={`font-heading font-medium text-white text-sm py-3 px-4 transition-colors hover:bg-blue-dark ${
                  currentPage === link.page ? 'border-b-2 border-saffron' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <button className="md:hidden text-white py-3" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {showOfficerBadge && (
            <div className="hidden md:block bg-blue-dark rounded px-3 py-1 text-xs text-white">
              👤 Officer: Priya Sharma | Booth KA-04
            </div>
          )}
        </div>
        {mobileOpen && (
          <div className="md:hidden pb-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => { setCurrentPage(link.page); setMobileOpen(false); }}
                className="block w-full text-left font-heading text-white text-sm py-2 px-4 hover:bg-blue-dark"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-navy text-white px-4 md:px-8 py-5 no-print">
        <div className="flex flex-col md:flex-row justify-between text-xs text-white/70">
          <span>VeriVote © 2025 | Election Commission of India</span>
          <span className="hidden md:inline">Powered by Biometric Authentication Technology</span>
          <span>Version 2.1.0 | Last Updated: Jan 2025</span>
        </div>
      </footer>

      {/* Demo Badge */}
      <div className="fixed bottom-4 right-4 bg-navy text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-50 no-print">
        🔧 Demo Mode — No real data submitted
      </div>
    </div>
  );
};

export default Layout;
