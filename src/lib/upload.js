import { supabase } from './supabase.js';

export async function uploadFilesToSupabase(fileInput) {
  if (!fileInput?.files?.length) return null;

  const uploadPromises = Array.from(fileInput.files).map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;
    const { error } = await supabase.storage.from('uploads').upload(filePath, file);
    if (error) throw error;
    return supabase.storage.from('uploads').getPublicUrl(filePath).data.publicUrl;
  });

  const urls = await Promise.all(uploadPromises);
  return urls.length > 0 ? JSON.stringify(urls) : null;
}
