import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Tracker from './pages/Tracker';
import ResearcherDashboard from './pages/ResearcherDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="tracker" element={<Tracker />} />
            <Route path="research" element={<ResearcherDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;  