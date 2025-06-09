import { useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';

export default function TextSummarizer() {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['.pdf', '.docx', '.doc'];
      const fileType = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileType)) {
        setError('Please upload a PDF or Word document');
        setSelectedFile(null);
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSummarize = async () => {
    if (!text.trim() && !selectedFile) {
      setError('Please enter text or upload a document');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      if (selectedFile) {
        // Handle document summarization
        const formData = new FormData();
        formData.append('document', selectedFile);
        
        const response = await fetch('http://localhost:5000/api/ai/summarize-document', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (response.ok) {
          setSummary(data.summary);
        } else {
          setError(data.error || 'Failed to summarize document');
        }
      } else {
        // Handle text summarization
        const response = await fetch('http://localhost:5000/api/ai/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setSummary(data.summary);
        } else {
          setError(data.error || 'Failed to summarize text');
        }
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Text Summarizer</h2>
        
        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to summarize..."
            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Or Upload Document (PDF/Word)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="document-upload"
            />
            <button
              onClick={() => document.getElementById('document-upload')?.click()}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
            >
              <Upload size={20} />
              <span>Choose File</span>
            </button>
            {selectedFile && (
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <FileText size={20} className="text-indigo-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedFile.name}
                </span>
                <button
                  onClick={removeFile}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summarize Button */}
        <button
          onClick={handleSummarize}
          disabled={isLoading || (!text.trim() && !selectedFile)}
          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Summary Display */}
        {summary && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Summary:</h3>
            <div className="prose dark:prose-invert max-w-none">
              <p>{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 