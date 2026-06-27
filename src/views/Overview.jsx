import React, { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import {
  MapPin,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  MessageSquare,
  AlertTriangle,
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function Overview() {
  const {
    places,
    businesses,
    alerts,
    complaints,
    maintenance,
    setActiveTab,
    setSelectedPlaceId
  } = useContext(DashboardContext);

  // Compute stats
  const totalPlaces = places.length;
  const placesOpen = places.filter(p => p.currentStatus === 'Open').length;
  const placesClosed = places.filter(p => p.currentStatus === 'Closed').length;
  const visitorsToday = places.reduce((sum, p) => sum + p.visitorsToday, 0);
  const totalBusinesses = businesses.length;
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;
  const activeAlerts = alerts.filter(a => a.isActive).length;
  const pendingMaintenance = maintenance.filter(m => m.status !== 'Completed').length;

  const stats = [
    { label: 'Total Tourist Places', value: totalPlaces, icon: MapPin, color: 'info', tab: 'places' },
    { label: 'Places Currently Open', value: placesOpen, icon: CheckCircle, color: 'success', tab: 'places' },
    { label: 'Places Closed', value: placesClosed, icon: XCircle, color: 'danger', tab: 'places' },
    { label: 'Visitors Today', value: visitorsToday, icon: Users, color: 'success', tab: 'crowd' },
    { label: 'Registered Businesses', value: totalBusinesses, icon: Briefcase, color: 'info', tab: 'businesses' },
    { label: 'Pending Complaints', value: pendingComplaints, icon: MessageSquare, color: 'warning', tab: 'complaints' },
    { label: 'Active Risk Alerts', value: activeAlerts, icon: AlertTriangle, color: 'danger', tab: 'alerts', isRed: true },
    { label: 'Maintenance Requests', value: pendingMaintenance, icon: Wrench, color: 'warning', tab: 'maintenance' }
  ];

  const handlePlaceClick = (id) => {
    setSelectedPlaceId(id);
    setActiveTab('places');
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card mb-24" style={{
        background: 'linear-gradient(135deg, rgba(227, 6, 19, 0.15) 0%, rgba(18, 20, 27, 0.8) 100%)',
        borderColor: 'rgba(227, 6, 19, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 32px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            Chakkittapara Panchayat Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Smart Tourism Operations Platform (STOP) • Real-time Safety, Business & Crowd Analytics
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="badge badge-open animate-pulse-red" style={{ background: 'var(--primary-red)', color: '#fff', border: 'none', padding: '6px 12px' }}>
            System Live
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Last sync: Just now
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-overview-stats">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`glass-card stat-card ${stat.isRed ? 'accent-red' : ''}`}
              onClick={() => setActiveTab(stat.tab)}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-card-header">
                <span>{stat.label}</span>
                <div className="stat-card-icon">
                  <Icon size={18} />
                </div>
              </div>
              <div className="stat-card-value" style={{ color: stat.isRed ? 'var(--primary-red)' : '#fff' }}>
                {stat.value}
              </div>
              <div className="stat-card-footer">
                Click to view details
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Crowd Status and Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Real-time Attractions Status */}
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--primary-red)" />
              Attractions Live Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {places.map(p => {
                const occupancyPercent = p.maxCapacity ? Math.min(100, Math.round((p.currentOccupancy / p.maxCapacity) * 100)) : 0;
                return (
                  <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '12px' }}>
                    <div className="flex-between">
                      <span
                        onClick={() => handlePlaceClick(p.id)}
                        style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', hover: { color: 'var(--primary-red)' } }}
                        className="hover-red"
                      >
                        {p.name}
                      </span>
                      <div className="gap-12">
                        <span className={`badge badge-${p.crowdLevel.toLowerCase()}`}>{p.crowdLevel} Crowd</span>
                        <span className={`badge badge-${p.currentStatus.toLowerCase()}`}>{p.currentStatus}</span>
                      </div>
                    </div>
                    {p.currentStatus === 'Open' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flexGrow: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${occupancyPercent}%`,
                            height: '100%',
                            background: p.crowdLevel === 'High' ? 'var(--color-danger)' : p.crowdLevel === 'Moderate' ? 'var(--color-warning)' : 'var(--color-success)',
                            borderRadius: '3px'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '70px', textAlign: 'right' }}>
                          {p.currentOccupancy} / {p.maxCapacity} px
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Risk Alerts */}
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--primary-red)" />
              Active Risk Bulletins
            </h3>
            {alerts.filter(a => a.isActive).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active safety or risk alerts published.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {alerts.filter(a => a.isActive).map(alert => {
                  const targetPlace = places.find(p => p.id === alert.destinationId);
                  return (
                    <div key={alert.id} style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: alert.riskLevel === 'Critical' ? 'rgba(153, 27, 27, 0.15)' : 'rgba(227, 6, 19, 0.08)',
                      borderLeft: `4px solid ${alert.riskLevel === 'Critical' ? 'var(--color-critical)' : 'var(--primary-red)'}`,
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <div style={{ marginTop: '2px', color: alert.riskLevel === 'Critical' ? 'var(--color-critical)' : 'var(--primary-red)' }}>
                        <AlertTriangle size={18} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div className="flex-between" style={{ marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{alert.type}</strong>
                          <span className={`badge badge-${alert.riskLevel.toLowerCase()}-risk`}>{alert.riskLevel}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{alert.message}</p>
                        {targetPlace && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> Affects: {targetPlace.name}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Pending Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Pending Verifications */}
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="var(--primary-red)" />
              Pending Business Audits
            </h3>
            {businesses.filter(b => b.verificationStatus === 'Pending').length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All registered businesses have been audited and verified.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {businesses.filter(b => b.verificationStatus === 'Pending').map(biz => (
                  <div key={biz.id} style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div className="flex-between">
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{biz.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{biz.category} • Owner: {biz.owner}</div>
                      </div>
                      <span className="badge badge-pending">Pending</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('verification')}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
                    >
                      Audit Credentials <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent active complaints */}
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--primary-red)" />
              Recent Incidents
            </h3>
            {complaints.filter(c => c.status !== 'Resolved').length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No open tourist complaints reported.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {complaints.filter(c => c.status !== 'Resolved').slice(0, 3).map(comp => {
                  const targetPlace = places.find(p => p.id === comp.destinationId);
                  return (
                    <div key={comp.id} style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div className="flex-between">
                        <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>{comp.category}</span>
                        <span className={`badge badge-${comp.status.toLowerCase()}`}>{comp.status}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineClamp: '2', WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{comp.description}"
                      </p>
                      <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Reported at: {targetPlace ? targetPlace.name : 'Unknown'}</span>
                        <button
                          onClick={() => setActiveTab('complaints')}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-red)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
