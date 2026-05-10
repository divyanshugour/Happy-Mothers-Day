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
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* The Beautiful Poster Container */}
      <div className="glass-panel" style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        padding: '3rem 2rem', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
          <Heart size={200} fill="var(--color-primary)" />
        </div>
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', opacity: 0.1, transform: 'rotate(15deg)' }}>
          <Heart size={150} fill="var(--color-secondary)" />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Happy Mother's Day
          </h2>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem', color: 'var(--color-primary-dark)' }}>
            {poster.motherName}
          </h1>

          {/* Photo Wall / Polaroid Style */}
          {poster.photoUrl && (
            <div style={{ 
              background: '#fff', 
              padding: '1rem 1rem 3rem 1rem', 
              borderRadius: '2px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              display: 'inline-block',
              transform: 'rotate(-2deg)',
              marginBottom: '3rem',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(-2deg)'}
            >
              <img 
                src={poster.photoUrl} 
                alt="Mother's Day Memory" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </div>
          )}

          {/* Message Section */}
          <div style={{ margin: '0 auto', maxWidth: '600px' }}>
            <p style={{ 
              fontSize: '1.4rem', 
              lineHeight: '1.8', 
              fontStyle: 'italic', 
              color: 'var(--color-text-main)',
              marginBottom: '2rem',
              whiteSpace: 'pre-wrap'
            }}>
              "{poster.message}"
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-primary)' }}>
              With all my love, <br/> {poster.senderName}
            </p>
          </div>
        </div>
      </div>
      
      {/* Small footer */}
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Made with ❤️ for {poster.motherName}
      </div>
    </div>
  );
}
