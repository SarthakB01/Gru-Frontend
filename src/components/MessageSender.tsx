import { useState, FormEvent, ChangeEvent } from 'react';

type FileResponse = {
  success: boolean;
  serverResponse: string;
  fileDetails?: {
    name: string;
    type: string;
    size: number;
    path: string;
  };
};

type TextResponse = {
  success: boolean;
  serverResponse: string;
};

export default function MessageSender() {
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle text input change
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Handle text message submission
  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data: TextResponse = await res.json();
      setResponse(data.serverResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Failed to connect to backend');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file submission
  const handleFileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setResponse('Please select a file');
      return;
    }
    
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data: FileResponse = await res.json();
      setResponse(data.serverResponse);
      
      // For images, display the uploaded file link
      if (data.fileDetails?.type.startsWith('image/')) {
        setResponse(response => response + 
          `\nView uploaded image: http://localhost:5000${data.fileDetails?.path}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponse('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-6">Communication with Backend</h2>
      
      {/* Text Message Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Send Text Message</h3>
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Your Message:
            </label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={handleMessageChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Text'}
          </button>
        </form>
      </div>
      
      {/* File Upload Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Upload File (PDF/Image)</h3>
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-1">
              Select File:
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          
          {filePreview && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <img 
                src={filePreview} 
                alt="Preview" 
                className="max-h-40 rounded border border-gray-200" 
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !file}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
      
      {/* Response Display */}
      {response && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Response from Backend:</h3>
          <p className="whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
}