import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Plus, Edit2, Trash2, Eye, MapPin, DollarSign, Clock, Users, X, Info } from 'lucide-react';

export default function PlacesManagement() {
  const {
    places,
    addPlace,
    editPlace,
    deletePlace,
    togglePlaceStatus,
    setSelectedPlaceId
  } = useContext(DashboardContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Dam & Ecotourism',
    entryFee: 0,
    openingHours: '09:00 AM - 05:00 PM',
    maxCapacity: 500,
    currentStatus: 'Open',
    lat: 11.59,
    lng: 75.80,
    riskLevel: 'Low',
    restrictions: '',
    workersCount: 10,
    reachInstructions: ''
  });

  const categories = [
    'Dam & Ecotourism',
    'Wildlife & Safari',
    'Eco-Park & Conservation',
    'Adventure Water Sports',
    'Trekking & Hiking',
    'Historical Site'
  ];

  const handleOpenAddModal = () => {
    setEditingPlace(null);
    setFormData({
      name: '',
      description: '',
      category: 'Dam & Ecotourism',
      entryFee: 0,
      openingHours: '09:00 AM - 05:00 PM',
      maxCapacity: 500,
      currentStatus: 'Open',
      lat: 11.590,
      lng: 75.800,
      riskLevel: 'Low',
      restrictions: '',
      workersCount: 10,
      reachInstructions: '',
      images: ['/assets/images/default.png']
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      description: place.description,
      category: place.category,
      entryFee: place.entryFee,
      openingHours: place.openingHours,
      maxCapacity: place.maxCapacity,
      currentStatus: place.currentStatus,
      lat: place.lat,
      lng: place.lng,
      riskLevel: place.riskLevel,
      restrictions: place.restrictions || '',
      workersCount: place.workersCount || 10,
      reachInstructions: place.reachInstructions || '',
      images: place.images || ['/assets/images/default.png']
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'entryFee' || name === 'maxCapacity' || name === 'workersCount' ? parseInt(value) || 0 : name === 'lat' || name === 'lng' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlace) {
      editPlace({ ...editingPlace, ...formData });
    } else {
      addPlace(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deletePlace(id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Tourist Places Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>View, add, edit or delete tourist places in the panchayat</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add Tourist Place
        </button>
      </div>

      {/* Grid of Tourist Places */}
      <div className="grid-cards">
        {places.map(p => {
          const occupancyPercent = p.maxCapacity ? Math.min(100, Math.round((p.currentOccupancy / p.maxCapacity) * 100)) : 0;
          return (
            <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={p.images && p.images[0] ? p.images[0] : '/assets/images/default.png'}
                  alt={p.name}
                  className="place-card-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'; }}
                />
                <span className={`badge badge-${p.currentStatus.toLowerCase()}`} style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  {p.currentStatus}
                </span>
                <span className="badge" style={{ position: 'absolute', bottom: '24px', left: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: 'none', color: '#fff' }}>
                  {p.category}
                </span>
              </div>

              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex-between">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{p.name}</h3>
                  <span className={`badge badge-${p.riskLevel.toLowerCase()}-risk`}>{p.riskLevel} Risk</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '52px', lineHeight: '1.4' }}>
                  {p.description}
                </p>

                {/* Place details summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="var(--primary-red)" />
                    <span>Entry: ₹{p.entryFee}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--primary-red)" />
                    <span style={{ whiteSpace: 'nowrap' }}>{p.openingHours}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="var(--primary-red)" />
                    <span>Cap: {p.maxCapacity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary-red)" />
                    <span>{p.lat.toFixed(3)}, {p.lng.toFixed(3)}</span>
                  </div>
                </div>

                {p.currentStatus === 'Open' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div className="flex-between">
                      <span>Occupancy: {p.currentOccupancy} / {p.maxCapacity}</span>
                      <span>{occupancyPercent}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${occupancyPercent}%`, height: '100%', background: 'var(--primary-red)', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
                  onClick={() => setSelectedPlaceId(p.id)}
                >
                  <Eye size={14} /> Details
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px' }}
                  title="Toggle Open/Closed"
                  onClick={() => togglePlaceStatus(p.id)}
                >
                  <Clock size={14} color={p.currentStatus === 'Open' ? 'var(--color-success)' : 'var(--color-danger)'} />
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px' }}
                  title="Edit Place"
                  onClick={() => handleOpenEditModal(p)}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px' }}
                  title="Delete Place"
                  onClick={() => handleDelete(p.id, p.name)}
                >
                  <Trash2 size={14} color="var(--color-danger)" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-fade-in" style={{ width: '100%', maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>{editingPlace ? 'Edit Tourist Place' : 'Add New Tourist Place'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Place Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Risk Level</label>
                  <select
                    name="riskLevel"
                    className="form-control"
                    value={formData.riskLevel}
                    onChange={handleInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  className="form-control"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Entry Fee (₹)</label>
                  <input
                    type="number"
                    name="entryFee"
                    min="0"
                    className="form-control"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Opening Hours</label>
                  <input
                    type="text"
                    name="openingHours"
                    placeholder="e.g. 09:00 AM - 05:00 PM"
                    className="form-control"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Max Capacity</label>
                  <input
                    type="number"
                    name="maxCapacity"
                    min="1"
                    className="form-control"
                    value={formData.maxCapacity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Latitude (Coordinates)</label>
                  <input
                    type="number"
                    name="lat"
                    step="0.0001"
                    className="form-control"
                    value={formData.lat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Longitude (Coordinates)</label>
                  <input
                    type="number"
                    name="lng"
                    step="0.0001"
                    className="form-control"
                    value={formData.lng}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Staff/Workers Count</label>
                  <input
                    type="number"
                    name="workersCount"
                    min="0"
                    className="form-control"
                    value={formData.workersCount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Safety Restrictions / Rules</label>
                <input
                  type="text"
                  name="restrictions"
                  placeholder="e.g. Life jackets mandatory, No plastics"
                  className="form-control"
                  value={formData.restrictions}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>How to Reach (Instructions)</label>
                <input
                  type="text"
                  name="reachInstructions"
                  placeholder="e.g. 60km from Kozhikode town..."
                  className="form-control"
                  value={formData.reachInstructions}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Upload Images (Enter image paths separated by comma)</label>
                <input
                  type="text"
                  name="images"
                  placeholder="e.g. /assets/images/dam_1.png, /assets/images/dam_2.png"
                  className="form-control"
                  value={Array.isArray(formData.images) ? formData.images.join(', ') : ''}
                  onChange={(e) => {
                    const paths = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    setFormData(prev => ({ ...prev, images: paths }));
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Info size={12} /> Separate multiple local asset paths with commas.
                </span>
              </div>

              <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlace ? 'Save Changes' : 'Create Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
