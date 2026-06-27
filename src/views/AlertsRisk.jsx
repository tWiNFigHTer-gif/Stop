import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { AlertTriangle, Plus, BellRing, X, Calendar, MapPin, Check } from 'lucide-react';

export default function AlertsRisk() {
  const { alerts, addAlert, resolveAlert, places } = useContext(DashboardContext);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Heavy Rain Alert',
    message: '',
    destinationId: '',
    riskLevel: 'Medium'
  });

  const alertTypes = [
    'Heavy Rain Alert',
    'Landslide Alert',
    'Wildlife Movement',
    'Road Closure',
    'Restricted Zone',
    'Maintenance Notice',
    'Safety Advisory'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    addAlert(formData);
    setFormData({
      type: 'Heavy Rain Alert',
      message: '',
      destinationId: '',
      riskLevel: 'Medium'
    });
    setIsFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getRiskBorder = (level) => {
    switch (level) {
      case 'Critical': return '4px solid var(--color-critical)';
      case 'High': return '4px solid var(--color-danger)';
      case 'Medium': return '4px solid var(--color-warning)';
      case 'Low': return '4px solid var(--color-success)';
      default: return '1px solid var(--border-glass)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Alerts & Risk Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Publish safety bulletins, weather warnings, and zone restrictions</p>
        </div>
        {!isFormOpen && (
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={16} /> Broadcast New Alert
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isFormOpen ? '1.2fr 1fr' : '1fr', gap: '24px' }}>
        
        {/* Alerts Bulletin Board */}
        <div>
          <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellRing size={18} color="var(--primary-red)" />
            Active safety bulletins
          </h3>

          {alerts.filter(a => a.isActive).length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active safety advisories currently published.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {alerts.filter(a => a.isActive).map(alert => {
                const targetPlace = places.find(p => p.id === alert.destinationId);
                return (
                  <div
                    key={alert.id}
                    className="glass-card"
                    style={{
                      borderLeft: getRiskBorder(alert.riskLevel),
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px'
                    }}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{alert.type}</strong>
                          <span className={`badge badge-${alert.riskLevel.toLowerCase()}-risk`}>
                            {alert.riskLevel}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Published: {new Date(alert.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {alert.message}
                      </p>

                      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> Target: {targetPlace ? targetPlace.name : 'All Destinations'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> Date: {new Date(alert.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.8rem', borderColor: 'var(--color-success)30', color: 'var(--color-success)' }}
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <Check size={14} className="mr-8" /> Resolve
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Archive / History list */}
          {alerts.filter(a => !a.isActive).length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 className="mb-16" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Resolved Bulletins Archive
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.filter(a => !a.isActive).map(alert => (
                  <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{alert.type}</span>
                      <span className="badge badge-low-risk" style={{ fontSize: '0.65rem' }}>Resolved</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Archived: {new Date(alert.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Broadcasting Form */}
        {isFormOpen && (
          <div className="glass-card animate-fade-in" style={{ height: 'fit-content' }}>
            <div className="flex-between mb-24">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Broadcast Safety Notice</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setIsFormOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Alert / Advisory Type</label>
                <select
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {alertTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Risk / Hazard Level</label>
                <select
                  name="riskLevel"
                  className="form-control"
                  value={formData.riskLevel}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low (Safety Advisory)</option>
                  <option value="Medium">Medium (Attention Required)</option>
                  <option value="High">High (Immediate Risk)</option>
                  <option value="Critical">Critical (Immediate Evacuation/Closure)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Attraction / Zone</label>
                <select
                  name="destinationId"
                  className="form-control"
                  value={formData.destinationId}
                  onChange={handleInputChange}
                >
                  <option value="">All Destinations (Panchayat-wide)</option>
                  {places.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Safety Advisory Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  placeholder="Describe the hazard, recommended actions, and duration..."
                  className="form-control"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Bulletin
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
