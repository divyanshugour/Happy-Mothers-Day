import { v2 as cloudinary } from 'cloudinary';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Vercel securely triggers cron jobs with an authorization header
  // Ensure we are in a cron job or authenticated request
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
    const expirationThreshold = Date.now() - FORTY_EIGHT_HOURS_MS;

    const postersRef = collection(db, 'posters');
    // Query for posters older than 48 hours
    const q = query(postersRef, where('createdAt', '<', expirationThreshold));
    
    const querySnapshot = await getDocs(q);
    
    const deletePromises = [];
    let deletedCount = 0;

    querySnapshot.forEach((document) => {
      const data = document.data();
      const docId = document.id;

      // 1. Delete image from Cloudinary if publicId exists
      if (data.publicId) {
        deletePromises.push(
          cloudinary.uploader.destroy(data.publicId).catch(err => console.error(`Cloudinary deletion failed for ${data.publicId}:`, err))
        );
      }

      // 2. Delete poster document from Firebase
      deletePromises.push(
        deleteDoc(doc(db, 'posters', docId)).catch(err => console.error(`Firebase deletion failed for ${docId}:`, err))
      );

      deletedCount++;
    });

    await Promise.all(deletePromises);

    return res.status(200).json({ success: true, message: `Successfully deleted ${deletedCount} expired posters.` });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
