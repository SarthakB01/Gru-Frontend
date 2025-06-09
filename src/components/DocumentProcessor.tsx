import { useState } from 'react';
import { FileText, Brain, MessageSquare, Video } from 'lucide-react';

type ProcessingOption = 'summary' | 'quiz' | 'model';

export default function DocumentProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingOption, setProcessingOption] = useState<ProcessingOption>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

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

  const handleProcess = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      const response = await fetch(`http://localhost:5000/api/ai/summarize-document`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({
          type: 'summary',
          content: data.summary
        });
      } else {
        setError(data.error || 'Failed to process document');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Process Your Document</h2>
        
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Document
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
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Choose File
            </button>
            {selectedFile && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Processing Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose Processing Option
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setProcessingOption('summary')}
              className={`p-4 rounded-lg border-2 transition-all ${
                processingOption === 'summary'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-indigo-300'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium">Text Summary</span>
            </button>
            
            <button
              onClick={() => setProcessingOption('quiz')}
              className={`p-4 rounded-lg border-2 transition-all ${
                processingOption === 'quiz'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-indigo-300'
              }`}
            >
              <Brain className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium">MCQ Quiz</span>
            </button>
            
            <button
              onClick={() => setProcessingOption('model')}
              className={`p-4 rounded-lg border-2 transition-all ${
                processingOption === 'model'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-indigo-300'
              }`}
            >
              <Video className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium">3D Model</span>
            </button>
          </div>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={isLoading || !selectedFile}
          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Processing...' : 'Process Document'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Results:</h3>
            {result.type === 'summary' && (
              <div className="prose dark:prose-invert max-w-none">
                <p>{result.content}</p>
              </div>
            )}
            
            {result.type === 'quiz' && (
              <div className="space-y-4">
                {result.content.map((question: any, index: number) => (
                  <div key={index} className="p-4 bg-white dark:bg-zinc-800 rounded-lg">
                    <p className="font-medium mb-3">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <label key={optIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            className="text-indigo-500 focus:ring-indigo-500"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {result.type === 'model' && (
              <div className="aspect-video bg-gray-100 dark:bg-zinc-700 rounded-lg">
                {/* 3D Model Viewer will be integrated here */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {result.content}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 