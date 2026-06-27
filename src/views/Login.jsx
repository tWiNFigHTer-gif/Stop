import React, { useState, useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Key, User, ShieldAlert, LogIn } from 'lucide-react';

export default function Login() {
  const { loginUser } = useContext(DashboardContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = loginUser(username, password);
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 50% 30%, rgba(227, 6, 19, 0.08) 0%, rgba(248, 250, 252, 1) 80%)',
      fontFamily: 'var(--font-main)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '36px',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.15)'
      }}>
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--primary-red)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.5rem',
            marginBottom: '12px'
          }}>
            S
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1px' }}>
            STOP
          </h1>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary-red)' }}>
            Chakkittapara Panchayat
          </span>
        </div>

        {/* Error Bulletin */}
        {error && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group" style={{ marginBottom: '0px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="var(--primary-red)" /> Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} color="var(--primary-red)" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Helper Credentials Box */}
          <div style={{
            padding: '12px',
            background: 'rgba(15, 23, 42, 0.03)',
            border: '1px dashed var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4'
          }}>
            <strong>Demo Operator Credentials:</strong>
            <div style={{ marginTop: '4px' }}>Username: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>chakkittaparapanchayat</span></div>
            <div>Password: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>admin@123</span></div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
            <LogIn size={16} className="mr-8" /> Access Command Center
          </button>
        </form>
      </div>
    </div>
  );
}
