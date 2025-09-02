import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Tracker from './pages/Tracker';
import ResearcherDashboard from './pages/ResearcherDashboard';

function App() {
  // Force light mode on component mount and prevent dark mode
  useEffect(() => {
    const forceLightMode = () => {
      document.documentElement.setAttribute('data-theme', 'agrisense');
      document.documentElement.style.colorScheme = 'light';
      document.documentElement.classList.remove('dark');
      document.body.style.colorScheme = 'light';
    };
    
    forceLightMode();
    
    // Listen for any theme changes and override them
    const observer = new MutationObserver(() => {
      forceLightMode();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    return () => observer.disconnect();
  }, []);

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