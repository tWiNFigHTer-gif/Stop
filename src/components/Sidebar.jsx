import React, { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import {
  LayoutDashboard,
  MapPin,
  Briefcase,
  ShieldCheck,
  Users,
  AlertTriangle,
  MessageSquare,
  Wrench,
  Map,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    setSelectedPlaceId,
    alerts,
    complaints,
    businesses,
    logoutUser
  } = useContext(DashboardContext);

  // Dynamic counts for sidebar notification badges
  const activeAlertsCount = alerts.filter(a => a.isActive).length;
  const pendingComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
  const pendingVerificationsCount = businesses.filter(b => b.verificationStatus === 'Pending').length;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'places', label: 'Tourist Places', icon: MapPin },
    { id: 'businesses', label: 'Businesses', icon: Briefcase },
    {
      id: 'verification',
      label: 'Verification',
      icon: ShieldCheck,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : null
    },
    { id: 'crowd', label: 'Crowd Monitoring', icon: Users },
    {
      id: 'alerts',
      label: 'Alerts & Risk',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: MessageSquare,
      badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : null
    },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'map', label: 'Interactive Map', icon: Map }
  ];

  const handleNavClick = (tabId) => {
    setSelectedPlaceId(null); // Clear detailed view when switching tabs
    setActiveTab(tabId);
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="logo-container">
        <div className="logo-circle">S</div>
        <div className="logo-text">
          <h1>STOP</h1>
          <span>Chakkittapara</span>
        </div>
      </div>

      <nav style={{ flexGrow: 1 }}>
        <ul className="nav-list">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                >
                  <div className="nav-item-left">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </button>
              </li>
            );
          })}
          
          <li style={{ marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
            <button
              onClick={logoutUser}
              className="nav-item"
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: 'var(--color-danger)' }}
            >
              <div className="nav-item-left">
                <LogOut size={18} />
                <span>Log Out</span>
              </div>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p>STOP Platform v1.1</p>
        <p style={{ fontSize: '0.7rem', marginTop: '4px' }}>Chakkittapara Grama Panchayat</p>
      </div>
    </aside>
  );
}
