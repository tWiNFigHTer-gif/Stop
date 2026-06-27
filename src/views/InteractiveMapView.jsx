import React, { useContext, useState, useRef } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { staticMapLocations } from '../data/mockData';
import { Map, Layers, CheckSquare, Square, Crosshair, HelpCircle, AlertOctagon, Info, MapPin } from 'lucide-react';

export default function InteractiveMapView() {
  const { places, businesses, alerts } = useContext(DashboardContext);

  const [activeFilters, setActiveFilters] = useState({
    attractions: true,
    businesses: true,
    restricted: true,
    parking: true,
    restaurants: true,
    hospitals: true,
    emergency: true
  });

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [clickedCoords, setClickedCoords] = useState(null);
  const mapRef = useRef(null);

  // Map projections: Convert lat/lng coordinates of Chakkittapara area to SVG canvas coordinates.
  // Bounds: Lat [11.57, 11.615], Lng [75.75, 75.835]
  const projectX = (lng) => {
    const minLng = 75.75;
    const maxLng = 75.835;
    return 60 + ((lng - minLng) / (maxLng - minLng)) * 880;
  };

  const projectY = (lat) => {
    const minLat = 11.57;
    const maxLat = 11.615;
    // North is up, so larger lat should be smaller Y value in SVG
    return 480 - ((lat - minLat) / (maxLat - minLat)) * 420;
  };

  // Convert SVG clicks back to coordinates (to allow pinning/adding new points)
  const handleMapClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixels to SVG coordinate scale (viewBox is 0 0 1000 550)
    const svgX = (clickX / rect.width) * 1000;
    const svgY = (clickY / rect.height) * 550;

    // Convert SVG scale back to Lat/Lng
    const minLng = 75.75;
    const maxLng = 75.835;
    const minLat = 11.57;
    const maxLat = 11.615;

    const clickedLng = minLng + ((svgX - 60) / 880) * (maxLng - minLng);
    const clickedLat = minLat + ((480 - svgY) / 420) * (maxLat - minLat);

    // Limit check to map boundaries
    if (clickedLng >= minLng && clickedLng <= maxLng && clickedLat >= minLat && clickedLat <= maxLat) {
      setClickedCoords({
        lat: clickedLat,
        lng: clickedLng,
        x: svgX,
        y: svgY
      });
    }
  };

  const toggleFilter = (filterKey) => {
    setActiveFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  // Gather all items to plot on the map
  const itemsToPlot = [];

  // 1. Attractions
  if (activeFilters.attractions) {
    places.forEach(p => {
      // Find if this attraction has an active alert
      const hasActiveAlert = alerts.some(a => a.destinationId === p.id && a.isActive);
      itemsToPlot.push({
        id: p.id,
        name: p.name,
        category: 'Attraction',
        subCategory: p.category,
        lat: p.lat,
        lng: p.lng,
        color: p.currentStatus === 'Closed' ? 'var(--color-danger)' : hasActiveAlert ? 'var(--color-warning)' : 'var(--primary-red)',
        status: p.currentStatus,
        details: `Occupancy: ${p.currentOccupancy}/${p.maxCapacity} pax • Fee: ₹${p.entryFee}`,
        alert: hasActiveAlert ? 'Active safety advisory' : null
      });
    });
  }

  // 2. Businesses
  if (activeFilters.businesses) {
    businesses.forEach(b => {
      itemsToPlot.push({
        id: b.id,
        name: b.name,
        category: 'Business',
        subCategory: b.category,
        lat: b.lat,
        lng: b.lng,
        color: 'var(--color-info)',
        status: b.verificationStatus,
        details: `Owner: ${b.owner} • Status: ${b.currentAvailability}`
      });
    });
  }

  // 3. Static Locations (Emergency, Hospitals, Cafe, Parking)
  staticMapLocations.forEach(loc => {
    const isHospital = loc.category === 'Hospitals';
    const isEmergency = loc.category === 'Emergency locations';
    const isParking = loc.category === 'Parking';
    const isCafe = loc.category === 'Cafes';

    if (isHospital && activeFilters.hospitals) {
      itemsToPlot.push({ id: loc.id, name: loc.name, category: 'Hospital', subCategory: 'Health Centre', lat: loc.lat, lng: loc.lng, color: '#ec4899', status: '24/7 Open', details: loc.description });
    }
    if (isEmergency && activeFilters.emergency) {
      itemsToPlot.push({ id: loc.id, name: loc.name, category: 'Emergency', subCategory: 'Rescue Point', lat: loc.lat, lng: loc.lng, color: 'var(--color-critical)', status: 'Active', details: loc.description });
    }
    if (isParking && activeFilters.parking) {
      itemsToPlot.push({ id: loc.id, name: loc.name, category: 'Parking', subCategory: 'Public Parking', lat: loc.lat, lng: loc.lng, color: '#64748b', status: 'Available', details: loc.description });
    }
    if (isCafe && activeFilters.restaurants) {
      itemsToPlot.push({ id: loc.id, name: loc.name, category: 'Cafe', subCategory: 'Kudumbashree Cafe', lat: loc.lat, lng: loc.lng, color: '#f59e0b', status: 'Open', details: loc.description });
    }
  });

  // 4. Restricted Areas (Active alerts with Critical/High risk)
  const activeRestrictions = alerts.filter(a => a.isActive && (a.riskLevel === 'High' || a.riskLevel === 'Critical'));

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Chakkittapara Command Map</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Geographic overview of attractions, active incidents, registered facilities, and restricted zones</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3.5fr 1fr', gap: '24px' }}>
        
        {/* Map Canvas */}
        <div className="map-canvas-container" onClick={handleMapClick}>
          <svg
            viewBox="0 0 1000 550"
            className="map-svg"
            ref={mapRef}
            style={{ cursor: 'crosshair' }}
          >
            {/* Definitions for map styling */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" />
              </pattern>
              <radialGradient id="restricted-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-critical)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-critical)" stopOpacity="0" />
              </radialGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid Pattern overlay */}
            <rect width="1000" height="550" fill="url(#grid)" />

            {/* Stylized River Branches (Peruvannamuzhi Dam reservoir feeding canals) */}
            <path
              d="M 50,480 Q 300,450 480,360 T 820,240 T 950,230"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 50,480 Q 300,450 480,360 T 820,240 T 950,230"
              fill="none"
              stroke="#0284c7"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Peruvannamuzhi Reservoir Water Body body */}
            <ellipse cx="820" cy="240" rx="90" ry="45" fill="#0284c7" opacity="0.3" filter="url(#glow)" />
            <text x="825" y="245" fill="#0369a1" fontSize="12" fontWeight="700" opacity="0.8">Peruvannamuzhi Reservoir</text>

            {/* Eco Forestry boundaries (Janaki Kaad area) */}
            <rect x="120" y="80" width="220" height="150" rx="20" fill="var(--color-success)" opacity="0.08" filter="url(#glow)" />
            <text x="160" y="160" fill="var(--color-success)" fontSize="13" fontWeight="700" opacity="0.6" letterSpacing="1px">JANAKI FOREST ZONE</text>

            {/* Panchayat Major Transit Highway Route */}
            <path
              d="M 80,50 L 260,110 L 490,190 L 800,220 L 810,340 L 780,480"
              fill="none"
              stroke="rgba(15, 23, 42, 0.15)"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <text x="495" y="180" fill="var(--text-muted)" fontSize="9" opacity="0.5">Panchayat Highway Route</text>

            {/* Plot Restricted Zones (Basing on active high/critical alerts) */}
            {activeFilters.restricted && activeRestrictions.map(alert => {
              const targetPlace = places.find(p => p.id === alert.destinationId);
              if (!targetPlace) return null;
              const x = projectX(targetPlace.lng);
              const y = projectY(targetPlace.lat);

              return (
                <g key={alert.id} className="restricted-overlay">
                  <circle cx={x} cy={y} r="85" fill="url(#restricted-glow)" />
                  <circle cx={x} cy={y} r="85" fill="none" stroke="var(--color-danger)" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />
                  <path d={`M ${x-10} ${y-75} L ${x+10} ${y-75}`} stroke="var(--color-danger)" strokeWidth="2" />
                  <text x={x} y={y-80} textAnchor="middle" fill="var(--color-danger)" fontSize="9" fontWeight="800" letterSpacing="0.5px">
                    RESTRICTED: SAFETY THREAT
                  </text>
                </g>
              );
            })}

            {/* Plot All Items (Attractions, Businesses, Health, Rescue) */}
            {itemsToPlot.map(point => {
              const x = projectX(point.lng);
              const y = projectY(point.lat);
              const isHovered = hoveredPoint?.id === point.id;

              return (
                <g
                  key={point.id}
                  transform={`translate(${x}, ${y})`}
                  className="map-pulse-marker"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Glowing pulsing back-ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={point.category === 'Attraction' ? '12' : '8'}
                    fill="none"
                    stroke={point.color}
                    strokeWidth="2"
                    className="map-pulse-circle"
                    opacity={isHovered ? 0.9 : 0.4}
                  />

                  {/* Central Solid Pin */}
                  <circle
                    cx="0"
                    cy="0"
                    r={point.category === 'Attraction' ? '6' : '4'}
                    fill={point.color}
                    style={{ filter: isHovered ? 'url(#glow)' : 'none' }}
                  />

                  {/* Tiny text label under pin */}
                  <text
                    x="0"
                    y={point.category === 'Attraction' ? '20' : '15'}
                    textAnchor="middle"
                    fill={isHovered ? 'var(--primary-red)' : 'var(--text-primary)'}
                    fontSize={point.category === 'Attraction' ? '10' : '8'}
                    fontWeight={point.category === 'Attraction' ? '700' : '500'}
                    opacity={isHovered ? 1 : 0.8}
                    style={{ pointerEvents: 'none' }}
                  >
                    {point.name.length > 18 ? `${point.name.substring(0, 15)}...` : point.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Click to Pin / Coordinates Tooltip */}
          {clickedCoords && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: 'absolute',
                top: `${Math.min(clickedCoords.y, 400)}px`,
                left: `${Math.min(clickedCoords.x, 700)}px`,
                padding: '12px 16px',
                width: '260px',
                zIndex: 20,
                border: '1px solid var(--primary-red)'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-red)', fontWeight: 700 }}>PINNED POINT</span>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setClickedCoords(null); }}
                >
                  <X size={14} />
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Latitude: <strong>{clickedCoords.lat.toFixed(5)}</strong><br />
                Longitude: <strong>{clickedCoords.lng.toFixed(5)}</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Use these coordinates to add a new attraction or business registry.
              </p>
              <button
                className="btn btn-primary"
                style={{ padding: '6px 10px', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Coordinates pinned: ${clickedCoords.lat.toFixed(6)}, ${clickedCoords.lng.toFixed(6)}. Go to Tourist Places or Businesses to add.`);
                  setClickedCoords(null);
                }}
              >
                Use Coordinates
              </button>
            </div>
          )}

          {/* Hover glass overlay card details */}
          {hoveredPoint && (
            <div className="glass-panel map-overlay-card animate-fade-in" style={{ padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <span className="badge" style={{ background: hoveredPoint.color + '20', color: hoveredPoint.color, border: 'none', fontSize: '0.65rem' }}>
                  {hoveredPoint.category.toUpperCase()} • {hoveredPoint.subCategory}
                </span>
                <span className="badge badge-open" style={{ fontSize: '0.65rem' }}>{hoveredPoint.status}</span>
              </div>
              
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{hoveredPoint.name}</h4>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{hoveredPoint.details}</p>
              
              {hoveredPoint.alert && (
                <div style={{ marginTop: '10px', padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertOctagon size={12} /> {hoveredPoint.alert}
                </div>
              )}
              
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                Coordinates: {hoveredPoint.lat.toFixed(4)}, {hoveredPoint.lng.toFixed(4)}
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="map-controls">
            <button className="map-control-btn" title="Map Info" onClick={(e) => { e.stopPropagation(); alert("Interactive Command Map. Click anywhere on grid to drop custom pin and display coordinates."); }}>
              <Info size={16} />
            </button>
            <button className="map-control-btn" title="Recenter View" onClick={(e) => { e.stopPropagation(); setClickedCoords(null); }}>
              <Crosshair size={16} />
            </button>
          </div>
        </div>

        {/* Map Layers & Filter Panel */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 className="mb-16" style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--primary-red)" />
            Map Filters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.attractions}
                onChange={() => toggleFilter('attractions')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.attractions ? 'var(--primary-red)' : 'var(--text-muted)' }}>
                {activeFilters.attractions ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Attractions Pin</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.businesses}
                onChange={() => toggleFilter('businesses')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.businesses ? 'var(--color-info)' : 'var(--text-muted)' }}>
                {activeFilters.businesses ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Registered Businesses</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.restricted}
                onChange={() => toggleFilter('restricted')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.restricted ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                {activeFilters.restricted ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Restricted Zones</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.parking}
                onChange={() => toggleFilter('parking')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.parking ? '#64748b' : 'var(--text-muted)' }}>
                {activeFilters.parking ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Public Parking Lots</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.restaurants}
                onChange={() => toggleFilter('restaurants')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.restaurants ? '#f59e0b' : 'var(--text-muted)' }}>
                {activeFilters.restaurants ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Cafes & Restaurants</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.hospitals}
                onChange={() => toggleFilter('hospitals')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.hospitals ? '#ec4899' : 'var(--text-muted)' }}>
                {activeFilters.hospitals ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Hospitals & Clinics</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={activeFilters.emergency}
                onChange={() => toggleFilter('emergency')}
                style={{ display: 'none' }}
              />
              <span style={{ color: activeFilters.emergency ? 'var(--color-critical)' : 'var(--text-muted)' }}>
                {activeFilters.emergency ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span>Rescue / Emergency</span>
            </label>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} /> Click grid area to drop pin and view coordinates.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
