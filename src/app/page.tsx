'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Send,
  Menu,
  User,
  SunMoon,
  FileText,
  Brain,
  Sparkles,
  Clock,
  BookOpen,
  X,
  ChevronRight,
  Upload,
  FileUp,
  MessageCircle,
  LineChart,
  Users,
  ArrowRight,
} from 'lucide-react';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import MessageSender from '../components/MessageSender';
import DocumentProcessor from '../components/DocumentProcessor';

import { useAuth, useClerk } from '@clerk/nextjs';

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

export default function Home() {

  const { getToken, isSignedIn } = useAuth();
  const clerk = useClerk();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [activeInput, setActiveInput] = useState<'text' | 'upload'>('text');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'gru'; content: string }[]>([]);
  const [chatHasIntroduced, setChatHasIntroduced] = useState(false);
  
  // Quiz state
  const [quiz, setQuiz] = useState<{ id: number; question: string; options: string[]; correct: string }[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setUploadStatus('');
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: FileResponse = await res.json();

      if (data.success) {
        setFileUploaded(true);
        setUploadedFile(file); // Store the file for later use
        setUploadStatus(data.serverResponse);
        resetAllStates(); // Reset states when new file is uploaded
        // For images, you can display the uploaded file
        if (data.fileDetails?.type.startsWith('image/')) {
          setUploadStatus(prev => `${prev}\nView at: http://localhost:5000${data.fileDetails?.path}`);
        }
      } else {
        setUploadError(data.serverResponse || 'Upload failed');
        setFileUploaded(false);
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
      setFileUploaded(false);
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    console.log('File dropped:', e.dataTransfer.files); // ✅ Add this

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    setActiveInput('text');
    
    // Clear uploaded file when user starts typing
    if (newText.trim() && uploadedFile) {
      setUploadedFile(null);
      setFileUploaded(false);
    }
    
    // Reset states when content changes
    if (newText !== inputText) {
      resetAllStates();
    }
  };

  // Reset all states when content changes
  const resetAllStates = () => {
    setSummary('');
    setSummarizeError('');
    setChatMessages([]);
    setChatHasIntroduced(false);
    setQuiz([]);
    setSelectedAnswers({});
    setQuizResults(null);
    setQuizError('');
  };

  const testimonials = [
    {
      name: 'Alex K.',
      role: 'Computer Science Student',
      text:
        'Gru helped me prepare for my finals in half the time! The interactive quizzes made retaining complex algorithms so much easier.',
      avatar: 'https://placehold.co/56x56?text=AK',
      rating: 5,
    },
    {
      name: 'Jamie L.',
      role: 'Biology Major',
      text:
        "Converting my lecture notes into interactive quizzes made studying so much more engaging. I've improved my grades by 15% this semester!",
      avatar: 'https://placehold.co/56x56?text=JL',
      rating: 4,
    },
    {
      name: 'Sam T.',
      role: 'Engineering Student',
      text:
        "The AI actually understands the context of my questions and provides relevant answers. It's like having a personal tutor available 24/7.",
      avatar: 'https://placehold.co/56x56?text=ST',
      rating: 5,
    },
    {
      name: 'Taylor R.',
      role: 'Medical Student',
      text:
        'Gru has transformed how I study complex medical terminologies and concepts. The quiz generation is surprisingly accurate.',
      avatar: 'https://placehold.co/56x56?text=TR',
      rating: 3,
    },
  ];

  const features = [
    {
      icon: (
        <FileText className="w-10 h-10 mb-4 text-indigo-500 dark:text-indigo-400" />
      ),
      title: 'Smart Document Analysis',
      description:
        'Upload your notes and Gru will analyze them instantly, identifying key concepts and relationships between topics.',
    },
    {
      icon: (
        <Brain className="w-10 h-10 mb-4 text-purple-500 dark:text-purple-400" />
      ),
      title: 'Adaptive Quizzes',
      description:
        'Generate personalized quizzes based on your content that adapt to your learning pace and focus on areas needing improvement.',
    },
    {
      icon: (
        <Sparkles className="w-10 h-10 mb-4 text-blue-500 dark:text-blue-400" />
      ),
      title: 'Contextual AI Chat',
      description:
        'Ask questions about your notes and get instant, contextually relevant answers that help deepen your understanding.',
    },
  ];

  const stats = [
    { value: '70%', label: 'Students struggle with inefficient study methods' },
    {
      value: '3x',
      label: 'Higher retention with interactive learning approaches',
    },
    { value: '45%', label: 'Reduced study stress reported by Gru users' },
  ];

  const problems = [
    {
      icon: <Clock className="w-12 h-12 mb-4 text-rose-500 dark:text-rose-400" />,
      title: 'Overwhelming Study Workload',
      description:
        'Students are buried under mountains of notes, struggling to organize and review them effectively before exams.',
    },
    {
      icon: (
        <BookOpen className="w-12 h-12 mb-4 text-amber-500 dark:text-amber-400" />
      ),
      title: 'Poor Information Retention',
      description:
        'Despite hours spent studying, many students find they retain only a fraction of the material due to passive learning methods.',
    },
    {
      icon: <X className="w-12 h-12 mb-4 text-red-500 dark:text-red-400" />,
      title: 'Study Burnout & Anxiety',
      description:
        'Ineffective study approaches lead to frustration, anxiety before exams, and feeling perpetually unprepared despite the effort.',
    },
  ];

  const solutions = [
    {
      title: 'Document Analysis & Quiz Generation',
      description:
        'Upload your study materials and let Gru create tailored quizzes based on the content.',
    },
    {
      title: 'Interactive Learning Path',
      description:
        'Progress through dynamically generated questions that adapt to your performance.',
    },
    {
      title: 'AI-Powered Understanding',
      description:
        'Get instant clarification on complex topics through contextual AI conversations.',
    },
  ];

  const FeatureCard = ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-zinc-700">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );

  const ProblemCard = ({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 text-center transform transition-all duration-300 hover:scale-105">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );

  const TestimonialCard = ({
    testimonial,
    isActive,
  }: {
    testimonial: {
      name: string;
      role: string;
      text: string;
      avatar: string;
      rating: number;
    };
    isActive: boolean;
  }) => (
    <div
      className={`p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 transition-all duration-300 ${isActive
        ? 'opacity-100 transform scale-100'
        : 'opacity-50 transform scale-95'
        }`}
    >
      <div className="flex items-center mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role}
          </p>
        </div>
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < testimonial.rating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic">
        "{testimonial.text}"
      </p>
    </div>
  );

  const NavButton = ({
    href,
    label,
    isActive,
  }: {
    href: string;
    label: string;
    isActive: boolean;
  }) => (
    <a
      href={href}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
        }`}
      onClick={(e) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
          });
        }
        setActiveTab(href.replace('#', ''));
      }}
    >
      {label}
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black text-gray-900 dark:text-gray-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-300 dark:bg-indigo-900 mix-blend-multiply dark:mix-blend-overlay opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-purple-300 dark:bg-purple-900 mix-blend-multiply dark:mix-blend-overlay opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-2/3 right-1/3 w-80 h-80 rounded-full bg-blue-300 dark:bg-blue-900 mix-blend-multiply dark:mix-blend-overlay opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrollY > 10
          ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo placeholder */}
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-start justify-center text-white font-bold shadow-md">
                  ._.
                </div>

                <span className="ml-2 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Gru
                </span>
              </div>
            </div>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme toggle */}
              <div className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-full">
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="text-gray-800 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Toggle Theme"
                >
                  <SunMoon className="w-6 h-3 scale-150" />
                </button>
              </div>

              {/* Nav buttons */}
              <div className="bg-gray-100 dark:bg-zinc-800 rounded-full p-1.5 flex items-center">
                <NavButton href="#problem" label="Problem" isActive={activeTab === 'problem'} />
                <NavButton href="#solution" label="Solution" isActive={activeTab === 'solution'} />
                <NavButton href="#demo" label="Demo" isActive={activeTab === 'demo'} />
                <NavButton href="#features" label="Features" isActive={activeTab === 'features'} />
              </div>

              {/* Auth buttons */}
              <div className="ml-4 flex items-center gap-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-3 py-1.5 rounded-full bg-purple-500 text-white hover:bg-indigo-700 text-sm shadow-sm">
                      Log In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-3 py-1.5 rounded-full bg-purple-700 text-white hover:bg-purple-700 text-sm shadow-sm">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <a
                href="#problem"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Problem
              </a>
              <a
                href="#solution"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Solution
              </a>
              <a
                href="#demo"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Demo
              </a>
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Features
              </a>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setTheme(theme === 'light' ? 'dark' : 'light')
                    }
                    className="rounded-full bg-gray-100  dark:bg-zinc-800  text-gray-500 dark:text-gray-300"
                  >
                    <SunMoon size={18} />
                  </button>
                  <div className="rounded-full  bg-gray-100 dark:bg-zinc-800 p-2">
                    <User size={22} className="text-gray-500 dark:text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">TypeScript Frontend-Backend Communication</h1>
        <MessageSender />
      </div> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400">
            The Ultimate Lazy Student Starter Pack
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Study Smarter, or Dumber🤷
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Gru Transforms Your Notes into Knowledge (or Brainrot!)
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            What if your notes could teach you? <br />
            Turn your study notes into fun, interactive quizzes with Gru AI!
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => {
                if (isSignedIn) {
                  const demoSection = document.getElementById('demo');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  clerk.openSignIn();
                }
              }}
              className="inline-flex items-center justify-center rounded-full text-md font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 px-8 py-3.5 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105"
            >
              Get started - it's free!
              <ChevronRight className="w-5 h-5 ml-2 transition-all duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Browser mockup */}
          <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 overflow-hidden max-w-4xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 px-4 py-2 flex items-center border-b border-gray-200 dark:border-zinc-600">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-300">
                gru-ai.vercel.app
              </div>
            </div>
            <div className="p-4">
              <img
                src="https://placehold.co/56x56?text=Gru"
                alt="Gru AI Interface"
                className="rounded-lg border border-gray-200 dark:border-zinc-600 shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            The Problem
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Most students struggle with inefficient study methods. Overwhelmed by
            information, they face low retention, stress, and burnout with
            traditional approaches.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 text-center transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center">{problem.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {problem.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight max-w-xl mx-auto">
              We poked around the{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                data
              </span>
              . Here's what it coughed up.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 transform transition-transform duration-300 hover:scale-105"
              >
                <p className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  {stat.value}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Merged Solution + Demo Section with Tabs */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-zinc-900 relative overflow-hidden">
        {/* Background Elements */}
        {/* Background Elements for Main Section Emphasis */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400">
              ✨ AI-Powered Study Revolution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              How Gru Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your study materials into interactive learning experiences in just three simple steps
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: FileText,
                title: "Upload or Paste",
                description: "Start by uploading your notes or pasting text directly into our smart editor.",
                color: "from-indigo-500 to-indigo-600",
                bgColor: "from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900",
                iconBg: "from-indigo-500 to-indigo-600"
              },
              {
                icon: Brain,
                title: "Gru Analyzes",
                description: "Our AI extracts key concepts, creates summaries, and generates personalized quizzes.",
                color: "from-purple-500 to-purple-600",
                bgColor: "from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900",
                iconBg: "from-purple-500 to-purple-600"
              },
              {
                icon: Sparkles,
                title: "Learn & Master",
                description: "Take interactive quizzes, chat with AI tutors, and use flashcards to study smarter.",
                color: "from-green-500 to-emerald-600",
                bgColor: "from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900",
                iconBg: "from-green-500 to-emerald-600"
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className={`bg-gradient-to-br ${step.bgColor} p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-700 group-hover:scale-105`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Demo Section */}
          <div className="bg-gradient-to-br from-purple-300 to-gray-50 dark:from-zinc-800 dark:to-zinc-900 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Add your material</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4 items-center">
                <div className="text-center">
                  <span className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">Paste Text</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-400">or</span>
                </div>
                <div className="text-center">
                  <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">Upload Document</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Paste text */}
                <div>
                  <div className={`transition-all duration-300 ${activeInput === 'upload' ? 'opacity-40 blur-sm' : 'opacity-100'}`}>
                    <textarea
                      value={inputText}
                      onChange={handleTextChange}
                      onFocus={() => setActiveInput('text')}
                      placeholder="Paste your notes, articles, or study materials here..."
                      className="w-full h-48 p-6 border-2 border-gray-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4 text-lg resize transition-all duration-300 placeholder:text-gray-400"
                    />
                    <div className="text-xs text-gray-400 text-right">{inputText.length} chars</div>
                  </div>
                </div>
                {/* Upload document */}
                <div>
                  <div
                    className={`flex flex-col items-center justify-center gap-6 p-8 border-2 border-dashed border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl transition-all duration-300 shadow-inner min-h-[220px] text-center relative cursor-pointer ${activeInput === 'text' ? 'opacity-40 blur-sm' : 'opacity-100'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      setActiveInput('upload');
                      fileInputRef.current?.click();
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
                      }}
                    />
                    <Upload className="w-12 h-12 text-purple-500 mb-2" />
                    <div className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-1">Drag & drop or click to upload</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">PDF, Word, or Text files only</div>

                    {isDragging && (
                      <div className="absolute inset-0 bg-purple-200/40 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-2xl font-bold text-purple-700 dark:text-purple-200 z-10 pointer-events-none animate-pulse">
                        Drop to upload
                      </div>
                    )}

                    {isLoading && (
                      <div className="flex items-center gap-2 mt-4 text-purple-700 dark:text-purple-200">
                        <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-700 dark:border-purple-700 dark:border-t-purple-300 rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    )}

                    {uploadStatus && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-lg text-purple-800 dark:text-purple-200 text-sm font-medium border border-purple-200 dark:border-purple-700">
                        {uploadStatus}
                      </div>
                    )}

                    {uploadError && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-700">
                        {uploadError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {(inputText.trim() || uploadedFile) && (
              <Tabs.Root defaultValue="summarize" className="w-full animate-fade-in">
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-1.5 rounded-t-xl shadow-lg">
                  <Tabs.List className="flex bg-white/10 backdrop-blur-sm rounded-lg p-2 gap-2">
                    <Tabs.Trigger
                      value="summarize"
                      className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-300 text-white/90 hover:text-white hover:bg-white/20 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-zinc-900/80 backdrop-blur-md data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="hidden sm:inline">Summarize</span>
                        <span className="sm:hidden">Summary</span>
                      </div>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="chat"
                      className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-300 text-white/90 hover:text-white hover:bg-white/20 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-zinc-900/80 backdrop-blur-md data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Chat with Gru</span>
                        <span className="sm:hidden">Chat</span>
                      </div>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="quiz"
                      className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-300 text-white/90 hover:text-white hover:bg-white/20 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-zinc-900/80 backdrop-blur-md data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="hidden sm:inline">Interactive Quizzes</span>
                        <span className="sm:hidden">Quiz</span>
                      </div>
                    </Tabs.Trigger>
                  </Tabs.List>
                </div>
                <Tabs.Content value="summarize" className="outline-none p-8 bg-white dark:bg-zinc-800 rounded-b-xl shadow-lg">
                  {/* Summarize logic here */}
                  {isSummarizing ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <div className="text-lg text-purple-700 dark:text-purple-200">Summarizing your content...</div>
                      </div>
                    </div>
                  ) : summary ? (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-800 rounded-xl shadow p-6 border border-indigo-100 dark:border-zinc-600">
                      <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Summary
                      </h3>
                      <p className="text-gray-800 dark:text-gray-100 whitespace-pre-line leading-relaxed">{summary}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="text-center mb-6">
                        <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Ready to Summarize</h3>
                        <p className="text-gray-500 dark:text-gray-400">Click the button below to generate a summary of your content</p>
                      </div>
                                              <button
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                        disabled={isSummarizing || (!uploadedFile && !inputText.trim())}
                        onClick={async () => {
                          setIsSummarizing(true);
                          setSummarizeError('');
                          setSummary('');
                          try {
                            let textToSummarize = inputText;
                            if (fileUploaded && uploadedFile) {
                              // Fetch summary from backend for uploaded file
                              const formData = new FormData();
                              formData.append('document', uploadedFile);
                              
                              const res = await fetch('http://localhost:5000/api/ai/summarize-document', {
                                method: 'POST',
                                body: formData,
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Failed to summarize document');
                              setSummary(data.summary);
                            } else if (inputText.trim()) {
                              // Summarize pasted text
                              const res = await fetch('http://localhost:5000/api/ai/summarize', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ text: inputText }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Failed to summarize text');
                              setSummary(data.summary);
                            } else {
                              throw new Error('Please upload a document or enter text to summarize');
                            }
                          } catch (err: any) {
                            setSummarizeError(err.message || 'Failed to summarize');
                          } finally {
                            setIsSummarizing(false);
                          }
                        }}
                      >
                        {isSummarizing ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Summarizing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Summarize Content
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                  {summarizeError && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="text-lg">⚠️</span>
                        <span>{summarizeError}</span>
                      </div>
                    </div>
                  )}
                </Tabs.Content>
                <Tabs.Content value="chat" className="outline-none p-8 bg-white dark:bg-zinc-800 rounded-b-xl shadow-lg">
                  {/* Chat logic here */}
                  <ChatWithGru 
                    inputText={inputText} 
                    uploadedFile={uploadedFile}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                    hasIntroduced={chatHasIntroduced}
                    setHasIntroduced={setChatHasIntroduced}
                  />
                </Tabs.Content>
                <Tabs.Content value="quiz" className="outline-none p-8 bg-white dark:bg-zinc-800 rounded-b-xl shadow-lg">
                  {/* Quiz logic here */}
                  <QuizGenerator 
                    inputText={inputText} 
                    uploadedFile={uploadedFile}
                    quiz={quiz}
                    setQuiz={setQuiz}
                    selectedAnswers={selectedAnswers}
                    setSelectedAnswers={setSelectedAnswers}
                    results={quizResults}
                    setResults={setQuizResults}
                    isLoading={isQuizLoading}
                    setIsLoading={setIsQuizLoading}
                    error={quizError}
                    setError={setQuizError}
                  />
                </Tabs.Content>
              </Tabs.Root>
            )}
          </div>







        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-zinc-900" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Gru is designed to revolutionize how you study, making learning
              efficient, engaging, and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-zinc-700"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real students share their experiences with Gru and how it
              transformed their study habits.
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 transition-all duration-300 ${index === activeTestimonialIndex ||
                    index === (activeTestimonialIndex + 1) % testimonials.length
                    ? 'opacity-100 transform scale-100'
                    : 'opacity-50 transform scale-95'
                    }`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonialIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${activeTestimonialIndex === index
                    ? 'bg-indigo-500'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-indigo-300 dark:hover:bg-indigo-700'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section >



      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 py-12 border-t border-gray-200 dark:border-zinc-800" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                ._.
              </div>
              <span className="ml-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Gru
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:space-x-8 mb-6 md:mb-0">
              <a
                href="#"
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Blog
              </a>
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.0112.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882.344 1.857.047 1.054.058 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          {/* Continuing from the footer section */}
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-6 mt-8">
            <p className="text-center text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Gru Learning, Inc. All rights
              reserved.
            </p>
            <div className="flex justify-center mt-4 space-x-6">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}

// --- ChatWithGru Component ---

type ChatMessage = { role: 'user' | 'gru'; content: string };
function ChatWithGru({ 
  inputText, 
  uploadedFile, 
  messages, 
  setMessages, 
  hasIntroduced, 
  setHasIntroduced 
}: { 
  inputText: string; 
  uploadedFile: File | null;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  hasIntroduced: boolean;
  setHasIntroduced: (introduced: boolean) => void;
}) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Function to clean up repetitive introductions
  const cleanResponse = (response: string, isFirstMessage: boolean) => {
    if (isFirstMessage) {
      return response; // Keep the full response for the first message
    }
    
    // Remove common introduction patterns
    const introPatterns = [
      /^Hi! I'm Gru, your AI tutor\. /i,
      /^Hello! I'm Gru, your AI tutor\. /i,
      /^Hi there! I'm Gru, your AI tutor\. /i,
      /^Greetings! I'm Gru, your AI tutor\. /i,
      /^I'm Gru, your AI tutor\. /i,
      /^As Gru, your AI tutor, /i,
      /^As your AI tutor, /i,
      /^As Gru, /i
    ];
    
    let cleanedResponse = response;
    for (const pattern of introPatterns) {
      cleanedResponse = cleanedResponse.replace(pattern, '');
    }
    
    return cleanedResponse.trim();
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const currentInput = userInput.trim();
    setUserInput(''); // Clear input immediately
    setIsLoading(true);
    setError('');
    setMessages(msgs => [...msgs, { role: 'user', content: currentInput }]);
    
    try {
      let context = inputText;
      
      // If we have an uploaded file but no text, we need to get the file content first
      if (uploadedFile && !inputText.trim()) {
        const formData = new FormData();
        formData.append('document', uploadedFile);
        
        // First, get the document content
        const docRes = await fetch('http://localhost:5000/api/ai/summarize-document', {
          method: 'POST',
          body: formData,
        });
        
        if (!docRes.ok) {
          const docData = await docRes.json();
          throw new Error(docData.error || 'Failed to process document');
        }
        
        const docData = await docRes.json();
        context = docData.summary || docData.content || '';
      }
      
      if (!context.trim()) {
        throw new Error('No content available to chat about. Please upload a document or enter some text.');
      }
      
      // Now send the chat request
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userInput,
          context: context,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get answer');
      
      const isFirstMessage = messages.length === 0;
      const cleanedAnswer = cleanResponse(data.answer, isFirstMessage);
      
      setMessages(msgs => [...msgs, { role: 'gru', content: cleanedAnswer }]);
      setHasIntroduced(true);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div ref={chatContainerRef} className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-700 dark:to-zinc-800 rounded-xl shadow p-4 h-64 overflow-y-auto mb-2 border border-gray-200 dark:border-zinc-600">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Start chatting with Gru about your document!</p>
            <p className="text-sm mt-1">Ask questions, get explanations, or discuss the content.</p>
          </div>
        )}
        {messages.length === 1 && messages[0].role === 'gru' && (
          <div className="text-center text-gray-500 text-sm mb-4">
            💡 <strong>Tip:</strong> You can ask follow-up questions about the content!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}> 
            <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600'
            }`}>
              <div className={`text-xs font-semibold mb-1 ${
                msg.role === 'user' ? 'text-indigo-100' : 'text-purple-600 dark:text-purple-400'
              }`}>
                {msg.role === 'user' ? 'You' : 'Gru'}
              </div>
              <div className={msg.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block max-w-[80%] p-3 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600">
              <div className="text-xs font-semibold mb-1 text-purple-600 dark:text-purple-400">Gru</div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                Thinking...
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-3 dark:bg-zinc-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ask Gru a question about your material..."
          disabled={isLoading}
        />
        <button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg disabled:opacity-50 hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold"
          onClick={sendMessage}
          disabled={isLoading || !userInput.trim()}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </div>
          ) : (
            'Send'
          )}
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- QuizGenerator Component ---
type QuizQuestion = { id: number; question: string; options: string[]; correct: string };
type QuizResult = { summary: { score: number; total: number; percentage: number; feedback: string }; results: { isCorrect: boolean; question: string; selectedAnswer: string; correctAnswer: string }[] };

function QuizGenerator({ 
  inputText, 
  uploadedFile,
  quiz,
  setQuiz,
  selectedAnswers,
  setSelectedAnswers,
  results,
  setResults,
  isLoading,
  setIsLoading,
  error,
  setError
}: { 
  inputText: string; 
  uploadedFile: File | null;
  quiz: QuizQuestion[];
  setQuiz: (quiz: QuizQuestion[] | ((prev: QuizQuestion[]) => QuizQuestion[])) => void;
  selectedAnswers: Record<number, string>;
  setSelectedAnswers: (answers: Record<number, string> | ((prev: Record<number, string>) => Record<number, string>)) => void;
  results: QuizResult | null;
  setResults: (results: QuizResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
}) {

  const generateQuiz = async () => {
    setIsLoading(true);
    setError('');
    setQuiz([]);
    setResults(null);
    
    try {
      let textToProcess = inputText;
      
      // If we have an uploaded file but no text, we need to get the file content first
      if (uploadedFile && !inputText.trim()) {
        const formData = new FormData();
        formData.append('document', uploadedFile);
        
        // First, get the document content
        const docRes = await fetch('http://localhost:5000/api/ai/summarize-document', {
          method: 'POST',
          body: formData,
        });
        
        if (!docRes.ok) {
          const docData = await docRes.json();
          throw new Error(docData.error || 'Failed to process document');
        }
        
        const docData = await docRes.json();
        textToProcess = docData.summary || docData.content || '';
      }
      
      if (!textToProcess.trim()) {
        throw new Error('No content available to generate quiz from. Please upload a document or enter some text.');
      }
      
      const res = await fetch('http://localhost:5000/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');
      setQuiz(data.quiz.questions);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const answers = quiz.map((q: QuizQuestion) => ({
        questionId: q.id,
        question: q.question,
        selectedAnswer: selectedAnswers[q.id] || '',
        correctAnswer: q.correct,
      }));
      const res = await fetch('http://localhost:5000/api/ai/verify-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify answers');
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to verify answers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {quiz.length === 0 && !isLoading && (
        <div className="flex justify-center">
          <button
            className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
            onClick={generateQuiz}
            disabled={isLoading}
          >
            Generate Quiz
          </button>
        </div>
      )}
      {isLoading && <div className="text-center text-lg text-purple-700 dark:text-purple-200">Loading...</div>}
      {quiz.length > 0 && !results && (
        <form
          onSubmit={e => {
            e.preventDefault();
            submitAnswers();
          }}
          className="space-y-6"
        >
          {quiz.map((q: QuizQuestion) => (
            <div key={q.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4">
              <div className="font-semibold mb-2">{q.question}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt: string, idx: number) => (
                  <label key={idx} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedAnswers[q.id] === opt ? 'bg-purple-100 dark:bg-purple-900/40' : ''}`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt}
                      checked={selectedAnswers[q.id] === opt}
                      onChange={() => setSelectedAnswers(a => ({ ...a, [q.id]: opt }))}
                      className="accent-purple-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
            disabled={isLoading}
          >
            Submit Answers
          </button>
        </form>
      )}
      {results && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quiz Results
            </h3>
          </div>
          
          {/* Score Summary */}
          <div className="p-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                  {results.summary.score} / {results.summary.total}
                </div>
                <div className="text-lg text-green-600 dark:text-green-400 mb-2">
                  {Math.round(results.summary.percentage)}% Score
                </div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                  {results.summary.feedback}
                </div>
              </div>
            </div>
            
            {/* Individual Question Results */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Question Breakdown</h4>
              {results.results.map((r: { isCorrect: boolean; question: string; selectedAnswer: string; correctAnswer: string }, idx: number) => (
                <div key={idx} className={`p-4 rounded-lg border ${
                  r.isCorrect 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      r.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {r.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white mb-2">
                        Question {idx + 1}: {r.question}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className={`flex items-center gap-2 ${
                          r.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                        }`}>
                          <span className="font-medium">Your answer:</span>
                          <span>{r.selectedAnswer}</span>
                          {r.isCorrect ? (
                            <span className="text-green-600">✅ Correct!</span>
                          ) : (
                            <span className="text-red-600">❌ Incorrect</span>
                          )}
                        </div>
                        {!r.isCorrect && (
                          <div className="text-green-700 dark:text-green-300 flex items-center gap-2">
                            <span className="font-medium">Correct answer:</span>
                            <span>{r.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <button
                onClick={() => {
                  setQuiz([]);
                  setResults(null);
                  setSelectedAnswers({});
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={generateQuiz}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium"
              >
                New Quiz
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
    </div>
  );
}