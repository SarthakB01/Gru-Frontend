'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/config';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a file');
      return;
    }
  
    setUploading(true);
    setMessage('');
  
    const formData = new FormData();
    formData.append('file', file);
  
    const token = localStorage.getItem('token'); // 👈 get the token
    console.log("Token is: ", token);
  
    try {
      const res = await fetch(API_ENDPOINTS.LEGACY_UPLOAD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // 👈 include token here
        },
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Uploaded: ${data.fileName}`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="p-2 border rounded"
        accept=".pdf,.doc,.docx"
      />
      {fileName && <p className="text-sm text-gray-600">Selected: {fileName}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`px-4 py-2 rounded text-white ${uploading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  );
}
