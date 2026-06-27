import React, { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Users, TrendingUp, Clock, Calendar, CheckCircle } from 'lucide-react';

export default function CrowdMonitoring() {
  const { places } = useContext(DashboardContext);

  // Compute metrics
  const activePlaces = places.filter(p => p.currentStatus === 'Open');
  const totalMaxCapacity = activePlaces.reduce((sum, p) => sum + p.maxCapacity, 0);
  const totalOccupancy = activePlaces.reduce((sum, p) => sum + p.currentOccupancy, 0);
  const occupancyPercent = totalMaxCapacity ? Math.round((totalOccupancy / totalMaxCapacity) * 100) : 0;

  // Find most visited destination
  const mostVisited = places.reduce((max, p) => (p.visitorsToday > (max?.visitorsToday || 0) ? p : max), null);

  const getCrowdColor = (level) => {
    switch (level) {
      case 'High': return 'var(--color-danger)';
      case 'Moderate': return 'var(--color-warning)';
      case 'Low': return 'var(--color-success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Live Crowd Monitoring</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Real-time headcount feeds and visitor density metrics across Chakkittapara</p>
        </div>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid-overview-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        
        {/* Card 1: Aggregate Occupancy */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-glass)'
          }}>
            {/* Visual occupancy percentage ring */}
            <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '80px', height: '80px' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="var(--primary-red)"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - occupancyPercent / 100)}`}
              />
            </svg>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{occupancyPercent}%</span>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aggregate Live Occupancy</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
              {totalOccupancy} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {totalMaxCapacity} pax</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open destinations combined</span>
          </div>
        </div>

        {/* Card 2: Most Visited Destination */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-red-glow)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Most Visited Destination</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
              {mostVisited ? mostVisited.name : 'None'}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {mostVisited ? `${mostVisited.visitorsToday} visitors today` : ''}
            </span>
          </div>
        </div>

        {/* Card 3: Peak Visiting Hours */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0, justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Peak Visiting Hours</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
              11:30 AM - 03:00 PM
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on mobile terminal signals</span>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px' }}>
        
        {/* Live Occupancy Lists */}
        <div className="glass-card">
          <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--primary-red)" />
            Real-Time Destination Occupancy Feeds
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {places.map(p => {
              const capPercent = p.maxCapacity ? Math.round((p.currentOccupancy / p.maxCapacity) * 100) : 0;
              const isClosed = p.currentStatus === 'Closed';

              return (
                <div key={p.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)' }}>
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: '#fff' }}>{p.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                        Limit: {p.maxCapacity} persons
                      </span>
                    </div>

                    <div className="gap-12">
                      {!isClosed ? (
                        <>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: getCrowdColor(p.crowdLevel) + '20',
                            color: getCrowdColor(p.crowdLevel),
                            border: `1px solid ${getCrowdColor(p.crowdLevel)}40`
                          }}>
                            {p.crowdLevel} Crowd
                          </span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                            {p.currentOccupancy} in
                          </span>
                        </>
                      ) : (
                        <span className="badge badge-closed">Closed</span>
                      )}
                    </div>
                  </div>

                  {!isClosed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flexGrow: 1, height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${capPercent}%`,
                          height: '100%',
                          background: getCrowdColor(p.crowdLevel),
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '35px', textAlign: 'right' }}>
                        {capPercent}%
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Sensor tracking off due to destination closure.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Visitor trends graph (CSS styled simulation) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card">
            <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--primary-red)" />
              Daily Visitor Flow Trend
            </h3>
            
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
              {[120, 240, 480, 750, 920, 1100, 650].map((visitors, idx) => {
                const heightPercent = Math.round((visitors / 1200) * 100);
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{visitors}</span>
                    <div style={{
                      width: '16px',
                      height: `${heightPercent}px`,
                      background: idx === 5 ? 'var(--primary-red)' : 'var(--border-focus)',
                      borderRadius: '3px 3px 0 0',
                      boxShadow: '0 0 10px rgba(227,6,19,0.1)'
                    }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>{days[idx]}</span>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} color="var(--color-success)" />
              <span>Weekly trend: +12% increase compared to last week. Peak day: Saturday.</span>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="mb-16" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--primary-red)" />
              Seasonality Report
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Chakkittapara experiences high footfall from October to February (monsoon exit and winter season). Currently in early monsoon phase, ecotourism numbers are stable but adventure sports (kayaking) are monitored closely for river water levels.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
