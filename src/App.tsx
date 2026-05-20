import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EnrollmentProvider, useEnrollment } from './context/EnrollmentContext';
import { LiveDataProvider } from './hooks/useLiveData';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PersonalPage from './pages/PersonalPage';
import AddressPage from './pages/AddressPage';
import DocumentsPage from './pages/DocumentsPage';
import SuccessPage from './pages/SuccessPage';
import EVMScreen from './pages/EVMScreen';
import ECAdminLogin from './pages/analytics/ECAdminLogin';
import LiveDashboard from './pages/analytics/LiveDashboard';
import ConstituencyBreakdown from './pages/analytics/ConstituencyBreakdown';
import BoothTurnout from './pages/analytics/BoothTurnout';
import FinalResults from './pages/analytics/FinalResults';

const Module1Router = () => {
  const { currentPage } = useEnrollment();
  switch (currentPage) {
    case 'login': return <LoginPage />;
    case 'dashboard': return <DashboardPage />;
    case 'personal': return <PersonalPage />;
    case 'address': return <AddressPage />;
    case 'documents': return <DocumentsPage />;
    case 'success': return <SuccessPage />;
    default: return <LoginPage />;
  }
};

const AnalyticsGuard = ({ children }: { children: React.ReactNode }) => {
  const authed = typeof window !== 'undefined' && sessionStorage.getItem('ec_authed') === '1';
  if (!authed) return <Navigate to="/analytics/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <EnrollmentProvider>
      <LiveDataProvider intervalMs={30000}>
        <Routes>
          <Route path="/" element={<Module1Router />} />
          <Route path="/booth/evm" element={<EVMScreen />} />
          <Route path="/analytics/login" element={<ECAdminLogin />} />
          <Route path="/analytics/dashboard" element={<AnalyticsGuard><LiveDashboard /></AnalyticsGuard>} />
          <Route path="/analytics/constituency" element={<AnalyticsGuard><ConstituencyBreakdown /></AnalyticsGuard>} />
          <Route path="/analytics/booths" element={<AnalyticsGuard><BoothTurnout /></AnalyticsGuard>} />
          <Route path="/analytics/results" element={<AnalyticsGuard><FinalResults /></AnalyticsGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LiveDataProvider>
    </EnrollmentProvider>
  </BrowserRouter>
);

export default App;
