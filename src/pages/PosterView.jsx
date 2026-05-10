import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Heart, Share2, Copy, Home, Loader2 } from 'lucide-react';

export default function PosterView() {
  const { id } = useParams();
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const docRef = doc(db, 'posters', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPoster(docSnap.data());
        } else {
          setError("We couldn't find this poster. It might have been removed.");
        }
      } catch (err) {
        console.error("Error fetching poster:", err);
        setError("Something went wrong while loading the poster.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoster();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Mother's Day!",
          text: `A special Mother's Day message for ${poster?.motherName}`,
          url: url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>Loading Love...</p>
      </div>
    );
  }

  if (error || !poster) {
    return (
      <div className="container flex-center text-center animate-fade-in" style={{ minHeight: '100vh', flexDirection: 'column' }}>
        <Heart size={64} color="var(--color-text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '1rem' }}>Oops!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>{error}</p>
        <Link to="/" className="btn btn-primary"><Home size={18} /> Create a New Poster</Link>
      </div>
    );
  }

  return (
    <div className="poster-container animate-fade-in">
      
      <div className="poster-card">
        {/* Soft Decorative Blobs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,107,129,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(243,104,224,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          
          <h2 className="gold-text" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '1rem' }}>
            A Special Tribute
          </h2>
          
          <h1 className="cursive-title" style={{ color: 'var(--color-primary-dark)', marginBottom: '3rem' }}>
            {poster.motherName}
          </h1>

          {poster.photoUrl && (
            <div style={{ marginBottom: '4rem' }}>
              <div className="polaroid-frame">
                <img 
                  src={poster.photoUrl} 
                  alt="Mother's Day Memory" 
                  style={{ 
                    width: '100%', 
                    maxWidth: '450px',
                    height: 'auto',
                    maxHeight: '500px', 
                    objectFit: 'cover',
                    display: 'block',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }} 
                />
              </div>
            </div>
          )}

          <div style={{ margin: '0 auto', maxWidth: '600px', padding: '0 2rem' }}>
            <p className="serif-body" style={{ fontStyle: 'italic', marginBottom: '3rem' }}>
              "{poster.message}"
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ height: '1px', width: '40px', background: 'var(--color-primary-light)' }} />
              <Heart size={20} fill="var(--color-primary-light)" color="var(--color-primary-light)" />
              <div style={{ height: '1px', width: '40px', background: 'var(--color-primary-light)' }} />
            </div>

            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-text-main)', marginTop: '2rem' }}>
              With Endless Love,<br/>
              <span style={{ fontFamily: 'var(--font-cursive)', fontSize: '2.5rem', color: 'var(--color-primary)', display: 'inline-block', marginTop: '0.5rem' }}>
                {poster.senderName}
              </span>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
