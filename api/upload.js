import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing to consume as stream
  },
};

// Configure Cloudinary
// Vercel will automatically load process.env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'Server configuration error: Missing Cloudinary credentials.' });
    }

    // Read the body as buffer since bodyParser is false
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'mothers_day_app' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      // Write the buffer to the stream and end it
      uploadStream.end(bodyBuffer);
    });

    // Cloudinary automatically provides an optimized secure URL
    return res.status(200).json({ success: true, url: uploadResult.secure_url });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
