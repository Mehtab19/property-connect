-- Create storage bucket for listing uploads (brochures, images, documents)
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-uploads', 'listing-uploads', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload listing files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own listing files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own listing files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'listing-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to listing files
CREATE POLICY "Anyone can view listing files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'listing-uploads');