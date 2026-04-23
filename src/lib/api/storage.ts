import { upload } from '@vercel/blob/client';
import api from './api';

export const storageAPI = {
  /**
   * Upload a file directly from the browser to Vercel Blob
   * This is the recommended way as it avoids overloading the backend
   */
  uploadFile: async (file: File): Promise<string> => {
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/proxied-backend/api/uploads/blob',
      });
      
      return newBlob.url;
    } catch (error) {
      console.error('Failed to upload file to Vercel Blob:', error);
      throw new Error('File upload failed');
    }
  },

  /**
   * Alternative: Upload to backend first (server-side upload)
   * Use this for small files or when you need server-side processing
   */
  uploadToBackend: async (file: File, type: string = 'image'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/api/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  }
};
