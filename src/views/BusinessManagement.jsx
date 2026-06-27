import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { ShieldCheck, Phone, Check, X, FileText, User, MapPin, List, Award, Calendar, DollarSign } from 'lucide-react';

export default function BusinessManagement() {
  const { businesses } = useContext(DashboardContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedBizId, setExpandedBizId] = useState(null);

  const categories = [
    'All',
    'Homestay',
    'Resort',
    'Jeep Operator',
    'Boat Services',
    'Kayaking',
    'Restaurants',
    'Cafes',
    'Guides',
    'Camping',
    'Adventure activities'
  ];

  const filteredBusinesses = selectedCategory === 'All'
    ? businesses
    : businesses.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleToggleExpand = (id) => {
    setExpandedBizId(expandedBizId === id ? null : id);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Business Management Registry</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monitor registered local business availability, verification status, and licenses</p>
        </div>
      </div>

      {/* Category Tab Bar */}
      <div className="tabs-header">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setExpandedBizId(null);
            }}
            className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* Grid of Business Cards */}
      {filteredBusinesses.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No businesses registered under "{selectedCategory}" in Chakkittapara.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBusinesses.map(biz => {
            const isExpanded = expandedBizId === biz.id;
            return (
              <div
                key={biz.id}
                className="glass-card"
                style={{
                  borderLeft: biz.verificationStatus === 'Approved' ? '4px solid var(--color-success)' : biz.verificationStatus === 'Pending' ? '4px solid var(--color-warning)' : '4px solid var(--color-danger)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* General Summary Layout */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{biz.name}</h3>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem', border: 'none' }}>
                        {biz.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} color="var(--primary-red)" /> Owner: {biz.owner}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={14} color="var(--primary-red)" /> {biz.phone}
                      </span>
                      {biz.lat && biz.lng && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="var(--primary-red)" /> Loc: {biz.lat.toFixed(3)}, {biz.lng.toFixed(3)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status column */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>License</div>
                      <span className={`badge badge-${biz.licenseStatus === 'Active' ? 'open' : 'closed'}`} style={{ fontSize: '0.7rem' }}>
                        {biz.licenseStatus}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verification</div>
                      <span className={`badge badge-${biz.verificationStatus.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                        {biz.verificationStatus}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Availability</div>
                      <span className="badge badge-open" style={{
                        background: biz.currentAvailability === 'Available' || biz.currentAvailability === 'Rooms Available' || biz.currentAvailability === 'Operating' || biz.currentAvailability === 'Open Now' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: biz.currentAvailability === 'Available' || biz.currentAvailability === 'Rooms Available' || biz.currentAvailability === 'Operating' || biz.currentAvailability === 'Open Now' ? 'var(--color-success)' : 'var(--color-danger)',
                        border: 'none',
                        fontSize: '0.7rem'
                      }}>
                        {biz.currentAvailability}
                      </span>
                    </div>
                    
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      onClick={() => handleToggleExpand(biz.id)}
                    >
                      {isExpanded ? 'Hide Specs' : 'View Specs'}
                    </button>
                  </div>
                </div>

                {/* Specific details category-wise (Expanded view) */}
                {isExpanded && (
                  <div style={{
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border-glass)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    animation: 'fade-in 0.3s ease-out'
                  }}>
                    
                    {/* Left block of specs */}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-red)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={16} /> Category Specific Profile
                      </h4>

                      {/* Jeep Operators */}
                      {biz.category === 'Jeep Operator' && biz.details && (
                        <div className="info-list">
                          <div className="info-item">
                            <span className="info-label">Driver Name</span>
                            <span className="info-value">{biz.details.driverName}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Driving License No.</span>
                            <span className="info-value">{biz.details.drivingLicense}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Vehicle Registration</span>
                            <span className="info-value">{biz.details.vehicleNumber}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Passenger Capacity</span>
                            <span className="info-value">{biz.details.vehicleCapacity} Persons</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Current Stand Location</span>
                            <span className="info-value">{biz.details.currentLocation}</span>
                          </div>
                        </div>
                      )}

                      {/* Homestays & Resorts */}
                      {(biz.category === 'Homestay' || biz.category === 'Resorts') && biz.details && (
                        <div className="info-list">
                          <div className="info-item">
                            <span className="info-label">Stay Name</span>
                            <span className="info-value">{biz.details.stayName}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Property Type</span>
                            <span className="info-value">{biz.details.type}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Rooms Available</span>
                            <span className="info-value">{biz.details.roomsAvailable} / {biz.details.totalRooms} rooms</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Base Tariff</span>
                            <span className="info-value" style={{ color: 'var(--color-success)', fontWeight: 700 }}>{biz.details.pricing}</span>
                          </div>
                          <div className="info-item" style={{ flexDirection: 'column', gap: '4px', borderBottom: 'none' }}>
                            <span className="info-label">Amenities</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                              {biz.details.amenities && biz.details.amenities.map((a, i) => (
                                <span key={i} className="badge" style={{ background: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', textTransform: 'none', border: 'none' }}>{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Boat Services */}
                      {biz.category === 'Boat Services' && biz.details && (
                        <div className="info-list">
                          <div className="info-item">
                            <span className="info-label">Boat Name</span>
                            <span className="info-value">{biz.details.boatName}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Safe Passenger Capacity</span>
                            <span className="info-value">{biz.details.capacity} pax</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Operational Hours</span>
                            <span className="info-value">{biz.details.timings}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Current Occupancy</span>
                            <span className="info-value">{biz.details.currentOccupancy} passengers on board</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Safety Certificate</span>
                            <span className="info-value" style={{ color: 'var(--color-success)' }}>{biz.details.safetyCertificate}</span>
                          </div>
                        </div>
                      )}

                      {/* Kayaking */}
                      {biz.category === 'Kayaking' && biz.details && (
                        <div className="info-list">
                          <div className="info-item">
                            <span className="info-label">Instructor Availability</span>
                            <span className="info-value" style={{ color: 'var(--color-success)' }}>{biz.details.instructorAvailability}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Inventory Available Kayaks</span>
                            <span className="info-value">{biz.details.availableKayaks} units</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Operating Hours</span>
                            <span className="info-value">{biz.details.timings}</span>
                          </div>
                          <div className="info-item" style={{ flexDirection: 'column', gap: '4px', borderBottom: 'none' }}>
                            <span className="info-label">Safety & Rescue Equipment</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                              {biz.details.safetyEquipment && biz.details.safetyEquipment.split(',').map((item, i) => (
                                <span key={i} className="badge" style={{ background: 'rgba(239, 68, 68, 0.05)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.1)', fontSize: '0.75rem', textTransform: 'none' }}>
                                  {item.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Standard Restaurant/Other */}
                      {!['Jeep Operator', 'Homestay', 'Resorts', 'Boat Services', 'Kayaking'].includes(biz.category) && biz.details && (
                        <div className="info-list">
                          {biz.details.cuisine && (
                            <div className="info-item">
                              <span className="info-label">Cuisine Spec</span>
                              <span className="info-value">{biz.details.cuisine}</span>
                            </div>
                          )}
                          {biz.details.seatingCapacity && (
                            <div className="info-item">
                              <span className="info-label">Seating Capacity</span>
                              <span className="info-value">{biz.details.seatingCapacity} Seats</span>
                            </div>
                          )}
                          {biz.details.pricing && (
                            <div className="info-item">
                              <span className="info-label">Pricing Range</span>
                              <span className="info-value">{biz.details.pricing}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right block of specs (Stay register or rules or licenses) */}
                    <div>
                      {/* Homestay guest register */}
                      {biz.category === 'Homestay' && biz.details && biz.details.stayRegister && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} /> Guest Check-in Register (Live)
                          </h4>
                          {biz.details.stayRegister.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No guests checked in currently.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {biz.details.stayRegister.map((guest, i) => (
                                <div key={i} style={{ padding: '10px', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                                    <strong style={{ color: '#fff' }}>{guest.name}</strong>
                                    <span style={{ color: 'var(--primary-red)' }}>{guest.room}</span>
                                  </div>
                                  <div style={{ color: 'var(--text-secondary)' }}>
                                    Check In: {guest.checkIn} | Est. Check Out: {guest.checkOut}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {biz.details.rules && (
                            <div style={{ marginTop: '16px' }}>
                              <strong style={{ fontSize: '0.8rem', color: '#fff' }}>House Rules:</strong>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>"{biz.details.rules}"</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* File auditor logs for license details */}
                      {biz.details && biz.details.documents && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} /> Audited Documents
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {Object.entries(biz.details.documents).map(([key, docPath]) => (
                              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                                <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                  <Check size={14} /> Verified
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
