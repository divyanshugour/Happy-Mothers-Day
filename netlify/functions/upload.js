import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: Missing Cloudinary credentials.' }) };
    }

    // Netlify provides binary data as a base64 encoded string if correctly configured,
    // or we parse it conditionally.
    const buffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');

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
      uploadStream.end(buffer);
    });

    // Cloudinary automatically provides an optimized secure URL
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id 
      })
    };
    
  } catch (error) {
    console.error('Server error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
