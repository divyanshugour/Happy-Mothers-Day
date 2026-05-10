import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Heart, Home, Loader2 } from 'lucide-react';
import PosterCard from '../components/PosterCard';

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
      
      {/* Dynamic Full-screen Background Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Heart 
            key={`bg-heart-${i}`}
            className="particle"
            size={Math.random() * 30 + 10}
            fill={Math.random() > 0.5 ? "var(--color-primary-light)" : "transparent"}
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <PosterCard poster={poster} />
    </div>
  );
}
