import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Eye, Home, Download, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import html2canvas from 'html2canvas';
import PosterCard from '../components/PosterCard';

export default function Success() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [poster, setPoster] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const posterUrl = `${window.location.origin}/p/${id}`;

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'posters', id));
        if (docSnap.exists()) {
          setPoster(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching poster data for export:", err);
      }
    };
    fetchPoster();
  }, [id]);

  const handleDownload = async () => {
    const element = document.getElementById('poster-capture-area');
    if (!element) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, // Higher quality export
        backgroundColor: '#ffffff' // White background for the card
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Happy-Mothers-Day-${poster?.motherName.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to download image. It might be due to a network connection issue.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      
      {/* Hidden Poster Container for html2canvas Capture */}
      {poster && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <div id="poster-capture-area" className="export-mode" style={{ width: '900px', padding: '3rem', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
            <PosterCard poster={poster} />
          </div>
        </div>
      )}

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
          <Link to={`/p/${id}`} className="btn btn-primary" style={{ flex: 1, minWidth: '180px' }}>
            <Eye size={18} /> View Live
          </Link>
          
          <button 
            onClick={handleDownload} 
            disabled={downloading || !poster} 
            className="btn btn-primary" 
            style={{ flex: 1, minWidth: '180px', background: 'linear-gradient(135deg, #dfb15b, #b38728)', opacity: (!poster || downloading) ? 0.7 : 1 }}
          >
            {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {downloading ? 'Exporting...' : 'Save as Image'}
          </button>

          <Link to="/" className="btn btn-secondary" style={{ flex: 1, minWidth: '180px' }}>
            <Home size={18} /> Create Another
          </Link>
        </div>
      </div>
    </div>
  );
}
