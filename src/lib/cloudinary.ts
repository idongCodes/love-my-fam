import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(file: File, folder: string = 'common-room'): Promise<{ url: string, duration?: number }> {
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    // Determine resource type based on file type
    const resourceType = file.type.startsWith('video') ? 'video' : 'image';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        // For videos: Auto-convert to mp4/h264 for max compatibility
        format: resourceType === 'video' ? 'mp4' : undefined,
        // Transformation for videos to ensure compatibility (H.264 codec)
        transformation: resourceType === 'video' ? [
            { video_codec: 'h264', audio_codec: 'aac' } 
        ] : undefined
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          resolve({
            url: result?.secure_url || '',
            duration: result?.duration
          });
        }
      }
    );

    // Write buffer to stream
    uploadStream.end(buffer);
  });
}
