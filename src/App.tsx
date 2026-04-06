import { EnrollmentProvider, useEnrollment } from './context/EnrollmentContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PersonalPage from './pages/PersonalPage';
import AddressPage from './pages/AddressPage';
import DocumentsPage from './pages/DocumentsPage';
import SuccessPage from './pages/SuccessPage';

const PageRouter = () => {
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

const App = () => (
  <EnrollmentProvider>
    <PageRouter />
  </EnrollmentProvider>
);

export default App;
