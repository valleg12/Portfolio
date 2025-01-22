'use client';

import { useState } from 'react';

export function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload?filename=${filename}`, {
      method: 'POST',
      body: file,
    });
    const blob = await res.json();
    setUrl(blob.url);
    setUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {url && (
        <div>
          <p>Uploaded! URL: {url}</p>
          <img src={url} alt="Uploaded" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
} 