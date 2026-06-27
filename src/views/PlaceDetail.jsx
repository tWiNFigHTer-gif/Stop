import React, { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { ArrowLeft, MapPin, Users, AlertTriangle, Shield, AlertOctagon, HelpCircle, CheckCircle, Clock, Trash2, Settings } from 'lucide-react';

export default function PlaceDetail() {
  const {
    places,
    businesses,
    complaints,
    alerts,
    selectedPlaceId,
    setSelectedPlaceId,
    activeTab
  } = useContext(DashboardContext);

  const place = places.find(p => p.id === selectedPlaceId);

  if (!place) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No tourist place selected.</p>
        <button className="btn btn-primary mt-24" onClick={() => setSelectedPlaceId(null)}>
          Go Back to Places
        </button>
      </div>
    );
  }

  // Calculate nearby businesses (within 0.015 degrees ~ 1.6km)
  const nearbyBusinesses = businesses.filter(b => {
    if (!b.lat || !b.lng || !place.lat || !place.lng) return false;
    const distance = Math.sqrt(Math.pow(b.lat - place.lat, 2) + Math.pow(b.lng - place.lng, 2));
    return distance <= 0.015;
  });

  // Get active alerts affecting this place
  const activePlaceAlerts = alerts.filter(a => a.destinationId === place.id && a.isActive);

  // Get complaints for this place
  const placeComplaints = complaints.filter(c => c.destinationId === place.id);

  // Peak visiting hours mock structure
  const hourlyOccupancyMock = [
    { hour: '8 AM', occupancy: Math.round(place.maxCapacity * 0.1) },
    { hour: '10 AM', occupancy: Math.round(place.maxCapacity * 0.4) },
    { hour: '12 PM', occupancy: Math.round(place.maxCapacity * 0.65) },
    { hour: '2 PM', occupancy: Math.round(place.maxCapacity * 0.8) },
    { hour: '4 PM', occupancy: Math.round(place.maxCapacity * 0.5) },
    { hour: '6 PM', occupancy: Math.round(place.maxCapacity * 0.15) }
  ];

  return (
    <div className="animate-fade-in">
      {/* Detail Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '10px' }}
          onClick={() => setSelectedPlaceId(null)}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Destination Deep-Dive
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{place.name}</h2>
        </div>
      </div>

      <div className="detail-grid">
        
        {/* Left Column: Media, Details, Stats, Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Cover & Gallery */}
          <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            <img
              src={place.images && place.images[0] ? place.images[0] : '/assets/images/default.png'}
              alt={place.name}
              style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; }}
            />
            
            {/* Gallery strip if multiple images */}
            {place.images && place.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(0,0,0,0.4)' }}>
                {place.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${place.name}-${i}`}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', cursor: 'pointer' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* About / Description */}
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700 }}>About Destination</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {place.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="info-item">
                <span className="info-label">Panchayat Sector</span>
                <span className="info-value">Chakkittapara</span>
              </div>
              <div className="info-item">
                <span className="info-label">Risk Level</span>
                <span className={`badge badge-${place.riskLevel.toLowerCase()}-risk`}>{place.riskLevel} Risk</span>
              </div>
              <div className="info-item">
                <span className="info-label">Entry Charge</span>
                <span className="info-value" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>₹{place.entryFee} / person</span>
              </div>
              <div className="info-item">
                <span className="info-label">Opening Hours</span>
                <span className="info-value">{place.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Crowd Monitoring & Peak Visiting Hours */}
          <div className="glass-card">
            <div className="flex-between mb-24">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--primary-red)" />
                Live Occupancy & Crowd Trends
              </h3>
              <span className={`badge badge-${place.crowdLevel.toLowerCase()}`}>{place.crowdLevel} Density</span>
            </div>
            
            {place.currentStatus === 'Open' ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Headcount</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-red)', margin: '8px 0' }}>{place.currentOccupancy}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Capacity: {place.maxCapacity}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Visitors Today</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', margin: '8px 0' }}>{place.visitorsToday}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peak hour checked: 2:00 PM</div>
                  </div>
                </div>

                <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Hourly Occupancy Curve (Average Daily)
                </div>
                {/* Visual bar chart */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  {hourlyOccupancyMock.map((item, idx) => {
                    const heightPercent = place.maxCapacity ? Math.min(100, Math.round((item.occupancy / place.maxCapacity) * 100)) : 0;
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, gap: '8px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.occupancy}</div>
                        <div style={{
                          width: '24px',
                          height: `${Math.max(10, heightPercent * 0.9)}px`,
                          background: heightPercent > 70 ? 'var(--color-danger)' : heightPercent > 40 ? 'var(--color-warning)' : 'var(--color-success)',
                          borderRadius: '4px 4px 0 0',
                          boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.1)',
                          transition: 'height 0.3s ease'
                        }} title={`Occupancy: ${item.occupancy}`}></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.hour}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.03)', border: '1px dashed rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                <AlertOctagon size={24} color="var(--color-danger)" style={{ marginBottom: '8px' }} />
                <p>Crowd tracking suspended. Destination is currently CLOSED.</p>
              </div>
            )}
          </div>

          {/* Maintenance History */}
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary-red)" />
              Maintenance Log & Audit History
            </h3>
            {!place.maintenanceHistory || place.maintenanceHistory.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No logged maintenance history available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {place.maintenanceHistory.map((maint, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyBetween: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{maint.task}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged on: {maint.date}</div>
                    </div>
                    <div>
                      <span className="badge badge-completed">{maint.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Alerts, Restrictions, Nearby, Complaints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* System Warnings & Active Bulletins */}
          {activePlaceAlerts.length > 0 && (
            <div className="glass-card" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
              <h3 className="mb-12" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={18} /> Active Risk Advisories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activePlaceAlerts.map(alert => (
                  <div key={alert.id} style={{ fontSize: '0.85rem', color: '#fff', borderBottom: '1px solid rgba(239,68,68,0.1)', paddingBottom: '8px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>{alert.type}</div>
                    <p style={{ color: 'var(--text-secondary)' }}>{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Restrictions & Workers count */}
          <div className="glass-card">
            <h3 className="mb-16" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--primary-red)" />
              Safety & Regulations
            </h3>
            
            <div className="form-group mb-24">
              <label style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Active Regulations</label>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--primary-red)', lineHeight: '1.4' }}>
                {place.restrictions ? place.restrictions : "Standard tourism safety guidelines apply."}
              </div>
            </div>

            <div className="flex-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Deployments</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On-duty Panchayat Workers</p>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-red)' }}>
                {place.workersCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>staff</span>
              </div>
            </div>
          </div>

          {/* How to Reach */}
          <div className="glass-card">
            <h3 className="mb-12" style={{ fontSize: '1.1rem', fontWeight: 700 }}>How to Reach</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {place.reachInstructions ? place.reachInstructions : "Located within Chakkittapara Panchayat boundary. Consult local transit maps for coordinates."}
            </p>
          </div>

          {/* Nearby Registered Businesses */}
          <div className="glass-card">
            <h3 className="mb-16" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Nearby Services</h3>
            {nearbyBusinesses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No registered businesses nearby.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {nearbyBusinesses.map(biz => (
                  <div key={biz.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{biz.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{biz.category}</div>
                    </div>
                    <span className="badge badge-open" style={{ fontSize: '0.7rem' }}>
                      {biz.currentAvailability}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Complaints */}
          <div className="glass-card">
            <h3 className="mb-16" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Incidents & Complaints</h3>
            {placeComplaints.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reported complaints for this location.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {placeComplaints.map(comp => (
                  <div key={comp.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{comp.category}</strong>
                      <span className={`badge badge-${comp.status.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{comp.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>"{comp.description}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tourist Feedback */}
          <div className="glass-card">
            <h3 className="mb-16" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Visitor Feedback</h3>
            {place.feedback && place.feedback.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {place.feedback.map(f => (
                  <div key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '10px' }}>
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{f.tourist}</strong>
                      <span style={{ color: 'var(--color-warning)', fontSize: '0.8rem' }}>
                        {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{f.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reviews posted yet.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
