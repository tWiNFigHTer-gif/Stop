import React, { useContext, useState } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Check, X, ShieldAlert, Eye, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function VerificationModule() {
  const { businesses, updateBusinessVerification } = useContext(DashboardContext);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const pendingBusinesses = businesses.filter(b => b.verificationStatus === 'Pending');

  const handleDocumentInspect = (bizName, docName) => {
    setSelectedDoc({
      bizName,
      docName,
      serialNumber: `${docName.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: '2025-05-12',
      expiryDate: '2028-05-12',
      issuer: 'Kerala Department of Tourism / Grama Panchayat'
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-24">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Panchayat Verification Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Review credentials and approve/reject tourism permits for local operators</p>
        </div>
      </div>

      {pendingBusinesses.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', marginBottom: '16px' }}>
            <CheckCircle size={24} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Queue is Clear</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No businesses in Chakkittapara are pending verification currently.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pendingBusinesses.map(biz => {
            // Determine documents required based on category
            const requiredDocs = [
              { name: 'Business License', key: 'businessLicense' },
              { name: 'Tourism Permit', key: 'tourismPermit' }
            ];

            if (biz.category === 'Jeep Operator') {
              requiredDocs.push(
                { name: 'Driver License', key: 'driverLicense' },
                { name: 'Vehicle Registration (RC)', key: 'vehicleRegistration' },
                { name: 'Identity Verification (Aadhaar)', key: 'identityVerification' }
              );
            } else {
              requiredDocs.push({ name: 'Identity Verification', key: 'identityVerification' });
            }

            return (
              <div key={biz.id} className="glass-card" style={{ border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-pending" style={{ marginBottom: '6px' }}>{biz.category}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{biz.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Owner: <strong>{biz.owner}</strong> • Phone: {biz.phone}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm(`Reject permit for ${biz.name}?`)) {
                          updateBusinessVerification(biz.id, 'Rejected');
                        }
                      }}
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <X size={16} /> Reject Application
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (window.confirm(`Approve permit and activate license for ${biz.name}?`)) {
                          updateBusinessVerification(biz.id, 'Approved');
                        }
                      }}
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <Check size={16} /> Approve Permit
                    </button>
                  </div>
                </div>

                {/* Documents Checklist */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                    Required Documentation Check ({requiredDocs.length} files)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {requiredDocs.map(doc => {
                      const hasDoc = biz.details?.documents?.[doc.key];
                      return (
                        <div
                          key={doc.key}
                          style={{
                            padding: '12px',
                            background: 'rgba(0,0,0,0.15)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={16} color={hasDoc ? 'var(--color-success)' : 'var(--color-warning)'} />
                            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{doc.name}</span>
                          </div>
                          
                          {hasDoc ? (
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleDocumentInspect(biz.name, doc.name)}
                              style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                            >
                              <Eye size={12} className="mr-8" /> Inspect
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>Missing</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Inspection Overlay (Mock PDF Modal) */}
      {selectedDoc && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '0px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(227, 6, 19, 0.08)', padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--primary-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Document Inspector</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{selectedDoc.docName}</h3>
              </div>
              <button className="modal-close" onClick={() => setSelectedDoc(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ border: '1px dashed var(--border-glass)', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', position: 'relative' }}>
                {/* Visual Stamp */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  border: '2px solid var(--color-success)',
                  color: 'var(--color-success)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  transform: 'rotate(12deg)'
                }}>
                  Digitally Signed
                </div>

                <FileText size={48} color="var(--primary-red)" style={{ margin: '0 auto 12px' }} />
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedDoc.bizName}</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Chakkittapara Panchayat Digital Vault</p>
              </div>

              <div className="info-list" style={{ fontSize: '0.85rem' }}>
                <div className="info-item">
                  <span className="info-label">Certificate ID</span>
                  <span className="info-value" style={{ fontFamily: 'monospace' }}>{selectedDoc.serialNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Issuing Authority</span>
                  <span className="info-value">{selectedDoc.issuer}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Issue Date</span>
                  <span className="info-value">{selectedDoc.issueDate}</span>
                </div>
                <div className="info-item" style={{ borderBottom: 'none' }}>
                  <span className="info-label">Expiry Date</span>
                  <span className="info-value">{selectedDoc.expiryDate}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
              <button className="btn btn-primary" onClick={() => setSelectedDoc(null)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
