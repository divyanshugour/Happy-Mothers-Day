import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UploadCloud, Image as ImageIcon, Heart, Loader2 } from 'lucide-react';

export default function CreatePoster() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    motherName: '',
    senderName: '',
    message: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!photo) {
      setError('Please select a beautiful photo to share!');
      return;
    }
    if (!formData.motherName || !formData.message || !formData.senderName) {
      setError('Please fill out all the fields to make it special.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Photo to Cloudflare R2 (via Vercel Function)
      // Send raw file bytes instead of FormData so S3 can save it directly
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': photo.type
        },
        body: photo
      });

      let photoUrl = '';
      let publicId = '';
      if (!uploadRes.ok) {
        throw new Error('Image upload to Cloudinary failed');
      } else {
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          photoUrl = uploadData.url;
          publicId = uploadData.public_id;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // 2. Save Data to Firebase
      const posterData = {
        motherName: formData.motherName,
        senderName: formData.senderName,
        message: formData.message,
        photoUrl: photoUrl,
        publicId: publicId,
        createdAt: Date.now() // Use timestamp for easier querying in cron
      };

      const docRef = await addDoc(collection(db, 'posters'), posterData);

      // 3. Navigate to Success Page
      navigate(`/success/${docRef.id}`);
      
    } catch (err) {
      console.error(err);
      setError('Something went wrong while creating the poster. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <Heart size={48} color="var(--color-primary)" fill="var(--color-primary-light)" style={{ marginBottom: '1rem' }} />
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Happy Mother's Day</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Create a beautiful digital poster and a wall of love to share with the most special woman in your life.
        </p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="motherName">Mother's Name</label>
            <input 
              type="text" 
              id="motherName" 
              name="motherName" 
              className="input-field" 
              placeholder="e.g. Mom, Mommy, Jane" 
              value={formData.motherName}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="photo">Upload a Photo</label>
            <div 
              style={{
                border: '2px dashed var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.3s ease'
              }}
              onClick={() => document.getElementById('photo-upload').click()}
            >
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              {photoPreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ marginTop: '1rem', color: 'var(--color-primary)', fontWeight: '500' }}>Click to change photo</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <UploadCloud size={40} color="var(--color-primary-light)" />
                  <p>Click to browse and upload a photo</p>
                </div>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="message">Your Message</label>
            <textarea 
              id="message" 
              name="message" 
              className="input-field" 
              placeholder="Write a heartfelt message to your mother..." 
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="senderName">Your Name</label>
            <input 
              type="text" 
              id="senderName" 
              name="senderName" 
              className="input-field" 
              placeholder="e.g. John, Your loving daughter" 
              value={formData.senderName}
              onChange={handleInputChange}
            />
          </div>

          {error && <div style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', background: 'rgba(255, 107, 129, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <strong>Note:</strong> As a free service, your photo and poster will be permanently deleted after 48 hours.
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={20} /> Creating Magic...</>
            ) : (
              <><ImageIcon size={20} /> Create Beautiful Poster</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
