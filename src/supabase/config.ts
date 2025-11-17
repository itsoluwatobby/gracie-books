import { createClient } from '@supabase/supabase-js';
import { nanoid } from "nanoid/non-secure";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_APIKEY;
const supabase = createClient(supabaseUrl, supabaseKey);


async function getSignedUploadURL(file: File) {
  const path = `${nanoid(24)}_${file.name}`;

  const { data, error } = await supabase
    .storage
    .from('book_thumbnail')
    .createSignedUploadUrl(path, { upsert: true });

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  if (!data?.signedUrl) {
    throw new Error(`Signed URL not generated for file: ${file.name}`);
  }

  return data;
}

type SignedUploadProps = {
  signedUrl: string;
  token: string;
  path: string;
}
async function uploadWithSignedURL(file: File, signed: SignedUploadProps) {
  const { data, error } = await supabase
  .storage
  .from('book_thumbnail')
  .uploadToSignedUrl(signed.path, signed.token, file)

  if (error) {
    throw new Error(`Failed to upload to bucket: ${error.message}`);
  }

  return data;
}

async function deleteImageFromStorage(url: string) {
  const urlBreakDown = url.split("/");

  const baseUrl = import.meta.env.VITE_SUPABASE_URL?.split("/");
  if (urlBreakDown[2] !== baseUrl[2]) return;

  const key = urlBreakDown[urlBreakDown.length - 1];
  const { data, error } = await supabase
  .storage
  .from('book_thumbnail')
  .remove([key])

  if (error) {
    throw new Error(`Failed to upload to bucket: ${error.message}`);
  }

  return data;
}
export { getSignedUploadURL, uploadWithSignedURL, deleteImageFromStorage };
