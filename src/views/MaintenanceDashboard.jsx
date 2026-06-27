import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Wrench, CheckCircle, Clock, Plus, Settings, X, Calendar, User } from 'lucide-react';

export default function MaintenanceDashboard() {
  const { maintenance, addMaintenance, updateMaintenanceStatus, places } = useContext(DashboardContext);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    item: 'Road damage',
    description: '',
    destinationId: '',
    assignedTo: ''
  });

  const assetItems = [
    'Road damage',
    'Broken railings',
    'Toilets',
    'Parking',
    'Street lights',
    'Signboards'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    addMaintenance(formData);
    setFormData({
      item: 'Road damage',
      description: '',
      destinationId: '',
      assignedTo: ''
    });
    setIsFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-completed';
      case 'In Progress': return 'badge-in-progress';
      case 'Pending': return 'badge-pending';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Maintenance & Asset Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Track infrastructure repairs, public restrooms audits, and street light outages</p>
        </div>
        {!isFormOpen && (
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={16} /> Log Repair Ticket
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isFormOpen ? '1.2fr 1fr' : '1fr', gap: '24px' }}>
        
        {/* Ticket List */}
        <div>
          <h3 className="mb-24" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} color="var(--primary-red)" />
            Active Repair Orders
          </h3>

          <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Asset Item</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Assigned Crew</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No active maintenance work orders.
                    </td>
                  </tr>
                ) : (
                  maintenance.map(ticket => {
                    const targetPlace = places.find(p => p.id === ticket.destinationId);
                    return (
                      <tr key={ticket.id}>
                        <td>
                          <strong style={{ color: '#fff' }}>{ticket.item}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Reported: {ticket.reportedDate}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ticket.description}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem' }}>{targetPlace ? targetPlace.name : 'Panchayat Wide'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{ticket.assignedTo ? ticket.assignedTo : 'Unassigned'}</span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {ticket.status === 'Pending' && (
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                onClick={() => updateMaintenanceStatus(ticket.id, 'In Progress')}
                              >
                                Start Work
                              </button>
                            )}
                            {ticket.status === 'In Progress' && (
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--color-success)30', color: 'var(--color-success)' }}
                                onClick={() => updateMaintenanceStatus(ticket.id, 'Completed')}
                              >
                                Complete
                              </button>
                            )}
                            {ticket.status === 'Completed' && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Done ({ticket.completedDate})</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Form */}
        {isFormOpen && (
          <div className="glass-card animate-fade-in" style={{ height: 'fit-content' }}>
            <div className="flex-between mb-24">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Log Infrastructure Damage</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => setIsFormOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Asset Category</label>
                <select
                  name="item"
                  className="form-control"
                  value={formData.item}
                  onChange={handleInputChange}
                >
                  {assetItems.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Destination Location</label>
                <select
                  name="destinationId"
                  className="form-control"
                  value={formData.destinationId}
                  onChange={handleInputChange}
                >
                  <option value="">Panchayat-wide (Roads/Signs)</option>
                  {places.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Work Crew / Agency</label>
                <input
                  type="text"
                  name="assignedTo"
                  required
                  placeholder="e.g. Panchayat Sanitation Team, PWD Road Crew"
                  className="form-control"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Issue Description</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  placeholder="Detail the damage and repairs required..."
                  className="form-control"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Work Ticket
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
