import { supabase } from '../lib/supabase';

export const storageService = {
  /**
   * Uploads a file to a Supabase storage bucket.
   * @param bucket The name of the storage bucket.
   * @param path The path within the bucket (e.g., 'challenges/my-image.png').
   * @param file The file object to upload.
   * @returns The public URL of the uploaded file.
   */
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  },

  /**
   * Helper to upload a challenge image.
   */
  async uploadChallengeImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    return this.uploadFile('challenges', fileName, file);
  },

  /**
   * Helper to upload a submission image.
   */
  async uploadSubmissionImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    return this.uploadFile('submissions', fileName, file);
  }
};
