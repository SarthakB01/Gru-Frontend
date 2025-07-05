import { useState } from 'react';
import { FileText, Upload, X, Brain, Volume2 } from 'lucide-react';

type ProcessingType = 'summary' | 'quiz' | 'speech';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: string;
}

interface QuizAnswer {
  questionId: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
}

interface QuizResult {
  summary: {
    score: number;
    total: number;
    percentage: number;
    feedback: string;
  };
  results: {
    isCorrect: boolean;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
  }[];
}

export default function TextSummarizer() {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingType, setProcessingType] = useState<ProcessingType>('summary');

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
    if (!text.trim() && !selectedFile) {
      setError('Please enter text or upload a document');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');
    setQuiz([]);
    setSelectedAnswers({});
    setQuizResults(null);
    setAudioUrl(null);
    
    try {
      let textToProcess = text;
      
      if (selectedFile) {
        // Handle document processing
        const formData = new FormData();
        formData.append('document', selectedFile);
        
        const response = await fetch('http://localhost:5000/api/ai/summarize-document', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          let errorMsg = data.error || 'Failed to process document';
          if (data.details) {
            errorMsg += `\n${data.details}`;
          }
          // Only append char count if not already in details
          const charCountLine = `Your document has ${data.currentCharCount} characters. The maximum allowed is ${data.maxAllowedCharCount}.`;
          if (
            data.currentCharCount && data.maxAllowedCharCount &&
            (!data.details || !data.details.includes('Your document has'))
          ) {
            errorMsg += `\n${charCountLine}`;
          }
          throw new Error(errorMsg);
        }
        textToProcess = data.summary;
      }

      // Process based on selected type
      switch (processingType) {
        case 'summary':
          if (!selectedFile) {
            const response = await fetch('http://localhost:5000/api/ai/summarize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: textToProcess }),
            });
            const data = await response.json();
            if (!response.ok) {
              if (data.actualLength) {
                throw new Error(`${data.error} (Your input: ${data.actualLength} characters)`);
              }
              throw new Error(data.error);
            }
            setSummary(data.summary);
          } else {
            setSummary(textToProcess);
          }
          break;

        case 'quiz':
          const quizResponse = await fetch('http://localhost:5000/api/ai/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToProcess }),
          });
          const quizData = await quizResponse.json();
          if (!quizResponse.ok) {
            if (quizData.actualLength) {
              throw new Error(`${quizData.error} (Your input: ${quizData.actualLength} characters)`);
            }
            throw new Error(quizData.error);
          }
          setQuiz(quizData.quiz.questions);
          break;

        case 'speech':
          const speechResponse = await fetch('http://localhost:5000/api/ai/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToProcess }),
          });
          const speechData = await speechResponse.json();
          if (!speechResponse.ok) throw new Error(speechData.error);
          const audioBlob = new Blob(
            [Buffer.from(speechData.audio, 'base64')],
            { type: speechData.format }
          );
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (quiz.length === 0) return;

    const answers: QuizAnswer[] = quiz.map(q => ({
      questionId: q.id,
      question: q.question,
      selectedAnswer: selectedAnswers[q.id] || '',
      correctAnswer: q.correct
    }));

    try {
      const response = await fetch('http://localhost:5000/api/ai/verify-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setQuizResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify answers');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Text Processor</h2>
        
        {/* Processing Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose Processing Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setProcessingType('summary')}
              className={`p-4 rounded-lg border-2 transition-all ${
                processingType === 'summary'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-indigo-300'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium">Summary</span>
            </button>
            
            <button
              onClick={() => setProcessingType('quiz')}
              className={`p-4 rounded-lg border-2 transition-all ${
                processingType === 'quiz'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-indigo-300'
              }`}
            >
              <Brain className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium">Quiz</span>
            </button>
            
            <button
              onClick={() => setProcessingType('speech')}
              className={`p-4 rounded-lg border-2 transition-all ${
                processingType === 'speech'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-zinc-700 hover:border-indigo-300'
              }`}
            >
              <Volume2 className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
              <span className="text-sm font-medium">Speech</span>
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to process..."
            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="text-xs text-gray-500 mt-1">Character count: {text.length}</div>
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
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={isLoading || (!text.trim() && !selectedFile)}
          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Processing...' : 'Process'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Results Display */}
        {summary && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Summary:</h3>
            <div className="prose dark:prose-invert max-w-none">
              <p>{summary}</p>
            </div>
          </div>
        )}

        {/* Quiz Display */}
        {quiz.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quiz:</h3>
            <div className="space-y-4">
              {quiz.map((question) => (
                <div key={question.id} className="p-4 bg-white dark:bg-zinc-800 rounded-lg">
                  <p className="font-medium mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={selectedAnswers[question.id] === option}
                          onChange={() => handleAnswerSelect(question.id, option)}
                          className="text-indigo-500 focus:ring-indigo-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmitQuiz}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {quizResults && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quiz Results:</h3>
            <div className="space-y-4">
              {quizResults.results.map((result, index) => (
                <div key={index} className="p-4 bg-white dark:bg-zinc-800 rounded-lg">
                  <p className="font-medium mb-2">{result.question}</p>
                  <p className={`mb-1 ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {result.selectedAnswer}
                  </p>
                  {!result.isCorrect && (
                    <p className="text-gray-600">Correct answer: {result.correctAnswer}</p>
                  )}
                </div>
              ))}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <h4 className="font-medium mb-2">Summary</h4>
                <p>Score: {quizResults.summary.score}/{quizResults.summary.total}</p>
                <p>Percentage: {quizResults.summary.percentage}%</p>
                <p className="mt-2">{quizResults.summary.feedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Audio:</h3>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
} 