import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Copy, Eye, Home } from 'lucide-react';

export default function Success() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  // Construct the view URL
  const posterUrl = `${window.location.origin}/p/${id}`;

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="glass-panel text-center" style={{ maxWidth: '600px', width: '100%', padding: '3rem 2rem' }}>
        <Heart size={64} fill="var(--color-primary)" color="var(--color-primary-dark)" style={{ marginBottom: '1rem' }} />
        <h1 className="text-gradient" style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Magic Created!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Your beautiful Mother's Day poster is ready. <br/> Copy the link below and send it to her!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          <label style={{ fontWeight: '500', color: 'var(--color-primary-dark)', textAlign: 'left' }}>Shareable Link:</label>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius-sm)', border: '2px solid var(--color-primary-light)', overflow: 'hidden' }}>
            <input 
              type="text" 
              readOnly 
              value={posterUrl} 
              style={{ flex: 1, padding: '1rem', border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-main)', fontSize: '1rem' }}
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(posterUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              style={{ background: 'var(--color-primary)', border: 'none', padding: '0 1.5rem', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-dark)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/p/${id}`} className="btn btn-primary" style={{ flex: 1, minWidth: '200px' }}>
            <Eye size={18} /> View Poster Now
          </Link>
          <Link to="/" className="btn btn-secondary" style={{ flex: 1, minWidth: '200px' }}>
            <Home size={18} /> Create Another
          </Link>
        </div>
      </div>
    </div>
  );
}
