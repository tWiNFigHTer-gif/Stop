import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { MessageSquare, User, Phone, Check, Settings, ShieldAlert, ArrowRight, ShieldCheck, X } from 'lucide-react';

export default function ComplaintsDashboard() {
  const { complaints, updateComplaintStatus, places } = useContext(DashboardContext);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Local state for edit/assignment form
  const [assignedDepartment, setAssignedDepartment] = useState('Waste Management');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('Pending');

  const departments = [
    'Waste Management',
    'Public Works (PWD)',
    'Revenue & Licensing',
    'Traffic Police Liaison',
    'Forest Range Office',
    'General Sanitation'
  ];

  const handleOpenAssignModal = (comp) => {
    setSelectedComplaint(comp);
    setAssignedDepartment(comp.department || 'Waste Management');
    setResolutionNotes(comp.resolutionNotes || '');
    setComplaintStatus(comp.status);
  };

  const handleSaveResolution = (e) => {
    e.preventDefault();
    updateComplaintStatus(
      selectedComplaint.id,
      complaintStatus,
      assignedDepartment,
      resolutionNotes
    );
    setSelectedComplaint(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved': return 'badge-completed';
      case 'In Progress': return 'badge-in-progress';
      case 'Pending': return 'badge-pending';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Tourist Complaints Incident Tracker</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Review tourist incident reports, assign departments, and track resolution timelines</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Incident Category</th>
              <th>Reporter / Contact</th>
              <th>Affected Location</th>
              <th>Routed Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No tourist complaints logged.
                </td>
              </tr>
            ) : (
              complaints.map(comp => {
                const targetPlace = places.find(p => p.id === comp.destinationId);
                return (
                  <tr key={comp.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{comp.category}</span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'normal', lineClamp: '2', WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          "{comp.description}"
                        </p>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{comp.reporter}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.phone}</span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.85rem' }}>
                        {targetPlace ? targetPlace.name : 'Panchayat Wide'}
                      </strong>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.03)', color: '#fff', border: 'none', fontSize: '0.75rem', textTransform: 'none' }}>
                        {comp.department ? comp.department : 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusClass(comp.status)}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleOpenAssignModal(comp)}
                      >
                        <Settings size={12} className="mr-8" /> Process
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action / Resolution modal */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-fade-in" style={{ width: '100%', maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>Process Incident Report</h3>
              <button className="modal-close" onClick={() => setSelectedComplaint(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveResolution} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary-red)' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tourist Complaint Category: {selectedComplaint.category}</strong>
                <p style={{ fontSize: '0.9rem', color: '#fff', marginTop: '6px', fontStyle: 'italic' }}>
                  "{selectedComplaint.description}"
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Reported by: {selectedComplaint.reporter} ({selectedComplaint.phone})
                </div>
              </div>

              <div className="form-group">
                <label>Incident Resolution Status</label>
                <select
                  className="form-control"
                  value={complaintStatus}
                  onChange={(e) => setComplaintStatus(e.target.value)}
                >
                  <option value="Pending">Pending Audit</option>
                  <option value="In Progress">In Progress (Assigned)</option>
                  <option value="Resolved">Resolved (Close Ticket)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Route to Action Department</label>
                <select
                  className="form-control"
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {complaintStatus === 'Resolved' && (
                <div className="form-group animate-fade-in">
                  <label>Resolution Summary & Notes</label>
                  <textarea
                    required
                    rows="3"
                    className="form-control"
                    placeholder="Describe what steps the department took to resolve this complaint..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedComplaint(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Incident Routing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
