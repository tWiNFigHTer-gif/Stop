import React, { useContext, useState, useEffect } from 'react';
import { DashboardProvider, DashboardContext } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Overview from './views/Overview';
import PlacesManagement from './views/PlacesManagement';
import PlaceDetail from './views/PlaceDetail';
import BusinessManagement from './views/BusinessManagement';
import VerificationModule from './views/VerificationModule';
import CrowdMonitoring from './views/CrowdMonitoring';
import AlertsRisk from './views/AlertsRisk';
import ComplaintsDashboard from './views/ComplaintsDashboard';
import MaintenanceDashboard from './views/MaintenanceDashboard';
import InteractiveMapView from './views/InteractiveMapView';
import { Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import Login from './views/Login';

function DashboardContent() {
  const { activeTab, selectedPlaceId, alerts, isLoggedIn } = useContext(DashboardContext);
  const [time, setTime] = useState(new Date());

  // Live clock update in header
  useEffect(() => {
    if (!isLoggedIn) return;
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoggedIn]);

  // Compute active alert warning in header
  const activeAlertsCount = alerts.filter(a => a.isActive).length;

  if (!isLoggedIn) {
    return <Login />;
  }

  const renderActiveView = () => {
    // If we have selected a tourist place detailed view, override places view
    if (activeTab === 'places' && selectedPlaceId !== null) {
      return <PlaceDetail />;
    }

    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'places':
        return <PlacesManagement />;
      case 'businesses':
        return <BusinessManagement />;
      case 'verification':
        return <VerificationModule />;
      case 'crowd':
        return <CrowdMonitoring />;
      case 'alerts':
        return <AlertsRisk />;
      case 'complaints':
        return <ComplaintsDashboard />;
      case 'maintenance':
        return <MaintenanceDashboard />;
      case 'map':
        return <InteractiveMapView />;
      default:
        return <Overview />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'places' && selectedPlaceId !== null) {
      return "Destination Detailed Profile";
    }

    switch (activeTab) {
      case 'overview': return "Panchayat Command Centre";
      case 'places': return "Tourist Attraction Control";
      case 'businesses': return "Business Registry Directory";
      case 'verification': return "Audit & Verification Gate";
      case 'crowd': return "Ecotourism Crowd Analytics";
      case 'alerts': return "Public Safety Broadcaster";
      case 'complaints': return "Tourist Incident Desk";
      case 'maintenance': return "Civic Maintenance Tracker";
      case 'map': return "Interactive Spatial Grid";
      default: return "Command Centre";
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <main className="main-content">
        
        {/* Header bar */}
        <header className="header glass-panel">
          <div className="header-title">
            <h2>{getHeaderTitle()}</h2>
            <p>STOP • Chakkittapara Grama Panchayat</p>
          </div>

          <div className="header-meta">
            {/* Active alerts warnings */}
            {activeAlertsCount > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-danger)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <AlertTriangle size={14} className="animate-pulse-red" />
                <span>{activeAlertsCount} Safety Alerts Active</span>
              </div>
            )}

            {/* System Status */}
            <div className="pulse-indicator">
              <div className="pulse-dot"></div>
              <span>Panchayat Node: Active</span>
            </div>

            {/* Time Widget */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              <Clock size={16} color="var(--primary-red)" />
              <span>
                {time.toLocaleDateString([], { month: 'short', day: 'numeric' })} • {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic View Frame */}
        <section className="content-frame">
          {renderActiveView()}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
