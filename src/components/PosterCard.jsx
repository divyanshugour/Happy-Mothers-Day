import React from 'react';
import { Heart } from 'lucide-react';

export default function PosterCard({ poster, id }) {
  if (!poster) return null;

  return (
    <div className="poster-card" id={id}>
      {/* Soft Decorative Blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,107,129,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(243,104,224,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2 className="gold-text" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 1rem 0' }}>
          A Special Tribute
        </h2>
        <h1 className="cursive-title" style={{ color: 'var(--color-primary-dark)', margin: '0 0 3rem 0' }}>
          {poster.motherName}
        </h1>

        {poster.photoUrl && (
          <div style={{ marginBottom: '4rem' }}>
            <div className="polaroid-frame">
              <img 
                src={poster.photoUrl} 
                alt="Mother's Day Memory" 
                crossOrigin="anonymous"
                style={{ width: '100%', maxWidth: '450px', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block', border: '1px solid rgba(0,0,0,0.05)' }} 
              />
            </div>
          </div>
        )}

        <div style={{ margin: '0 auto', maxWidth: '600px', padding: '0 2rem' }}>
          <p className="serif-body" style={{ fontStyle: 'italic', margin: '0 0 3rem 0' }}>
            "{poster.message}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ height: '1px', width: '40px', background: 'var(--color-primary-light)' }} />
            <Heart size={20} fill="var(--color-primary-light)" color="var(--color-primary-light)" />
            <div style={{ height: '1px', width: '40px', background: 'var(--color-primary-light)' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-text-main)', margin: '2rem 0 0 0' }}>
            With Endless Love,<br/>
            <span style={{ fontFamily: 'var(--font-cursive)', fontSize: '2.5rem', color: 'var(--color-primary)', display: 'inline-block', marginTop: '0.5rem' }}>
              {poster.senderName}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
