import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function PosterCard({ poster, id }) {
  if (!poster) return null;

  return (
    <div className="poster-card magical-card" id={id}>
      {/* Magical Glowing Orbs */}
      <div className="magical-orb orb-1" />
      <div className="magical-orb orb-2" />
      <div className="magical-orb orb-3" />

      {/* Floating Particles */}
      <div className="particles-container">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={`heart-${i}`}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            <Heart 
              size={Math.random() * 15 + 10} 
              fill={Math.random() > 0.5 ? "var(--color-primary-light)" : "none"}
              color="var(--color-primary-light)"
              style={{ opacity: 0.4 }}
            />
          </div>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`sparkle-${i}`}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            <Sparkles 
              size={Math.random() * 10 + 5} 
              color="#dfb15b"
              style={{ opacity: 0.5 }}
            />
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Header */}
        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Sparkles size={24} className="gold-text-svg" />
            <Sparkles size={16} className="gold-text-svg" style={{ opacity: 0.7 }} />
          </div>
          <h1 className="gold-text" style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Happy Mother's Day <br/>
            <span style={{ fontSize: '5rem', color: 'var(--color-primary-dark)', display: 'inline-block', marginTop: '0.5rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 'normal', WebkitTextFillColor: 'var(--color-primary-dark)' }}>{poster.motherName}</span>
          </h1>
        </div>

        {/* Photo */}
        {poster.photoUrl && (
          <div style={{ margin: '0 auto 3rem auto', position: 'relative', display: 'inline-block' }}>
            <div className="magical-photo-frame">
              <img 
                src={poster.photoUrl} 
                alt="Mother's Day Memory" 
                crossOrigin="anonymous"
                className="magical-photo"
              />
            </div>
            {/* Sparkles around photo */}
            <Sparkles size={30} className="gold-text-svg" style={{ position: 'absolute', top: '-15px', right: '-15px' }} />
            <Heart size={24} fill="var(--color-primary-light)" color="var(--color-primary-light)" style={{ position: 'absolute', bottom: '-10px', left: '-10px' }} />
          </div>
        )}

        {/* Message */}
        <div style={{ margin: '0 auto', maxWidth: '650px', padding: '0 2rem', flex: 1 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.4rem', fontWeight: '500', color: '#333', lineHeight: '1.8', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '3rem', color: 'var(--color-primary-light)', position: 'absolute', top: '-25px', left: '-25px', opacity: 0.3, fontFamily: 'var(--font-serif)', fontWeight: 'bold' }}>"</span>
            {poster.message}
            <span style={{ fontSize: '3rem', color: 'var(--color-primary-light)', position: 'absolute', bottom: '-45px', right: '-25px', opacity: 0.3, fontFamily: 'var(--font-serif)', fontWeight: 'bold' }}>"</span>
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, transparent, var(--color-primary-light))' }} />
            <Heart size={20} fill="var(--color-primary-dark)" color="var(--color-primary-dark)" />
            <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, transparent, var(--color-primary-light))' }} />
          </div>

          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            From your loving <br/>
            <span style={{ fontSize: '2.5rem', color: 'var(--color-primary)', display: 'inline-block', marginTop: '0.5rem', fontWeight: '700' }}>
              {poster.senderName}
            </span>
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '3rem', paddingBottom: '1rem' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '8px 24px', 
            background: 'rgba(255, 107, 129, 0.1)', 
            borderRadius: '50px',
            border: '1px solid rgba(255, 107, 129, 0.3)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-primary-dark)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            Made with love for Maa
          </div>
        </div>
        
      </div>
    </div>
  );
}
