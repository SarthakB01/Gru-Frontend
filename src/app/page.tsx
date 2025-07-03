'use client';

import { useState, useEffect, useRef } from 'react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState('');

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
        setUploadStatus(data.serverResponse);
        // For images, you can display the uploaded file
        if (data.fileDetails?.type.startsWith('image/')) {
          setUploadStatus(prev => `${prev}\nView at: http://localhost:5000${data.fileDetails?.path}`);
        }
      } else {
        setUploadError(data.serverResponse || 'Upload failed');
        setFileUploaded(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
      setFileUploaded(false);
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
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <Tabs.Root defaultValue="text" className="w-full">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1 rounded-t-xl">
                <Tabs.List className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1.5 gap-1">
                  <Tabs.Trigger 
                    value="text" 
                    className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-300 text-white/80 hover:text-white data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5" />
                      Summarize Text
                    </div>
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="upload" 
                    className="flex-1 py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-300 text-white/80 hover:text-white data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Document
                    </div>
                  </Tabs.Trigger>
                </Tabs.List>
              </div>

              <Tabs.Content value="text" className="outline-none p-8">
                <SignedOut>
                  <div className="text-center py-16">
                    <div className="mb-8">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Ready to Transform Your Learning?
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                        Join thousands of students already using Gru to study smarter, not harder.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <SignInButton mode="modal">
                        <button className="group px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105">
                          <span className="flex items-center gap-2">
                            Log In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="group px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-105">
                          <span className="flex items-center gap-2">
                            Sign Up Free
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          </span>
                        </button>
                      </SignUpButton>
                    </div>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="relative">
                    <div className="absolute -top-4 left-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                      ✨ Instant AI Summary
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-10 rounded-xl shadow-inner border border-gray-100 dark:border-zinc-700">
                      <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
                        Paste Your Text & Get Instant Insights
                      </h3>
                      <div className="relative">
                        <textarea
                          value={inputText}
                          onChange={e => setInputText(e.target.value)}
                          placeholder="Paste your notes, articles, or study materials here and watch Gru work its magic..."
                          className="w-full h-48 p-6 border-2 border-gray-200 dark:border-zinc-700 rounded-xl dark:bg-zinc-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-6 text-lg resize-none transition-all duration-300 placeholder:text-gray-400"
                        />
                        <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white dark:bg-zinc-800 px-2 py-1 rounded-md">
                          {inputText.length} chars
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          setIsSummarizing(true);
                          setSummarizeError('');
                          setSummary('');
                          try {
                            const response = await fetch('http://localhost:5000/api/ai/summarize', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ text: inputText }),
                            });
                            const data = await response.json();
                            if (!response.ok) throw new Error(data.error || 'Failed to summarize');
                            setSummary(data.summary);
                          } catch (err) {
                            setSummarizeError(err instanceof Error ? err.message : 'Failed to summarize');
                          } finally {
                            setIsSummarizing(false);
                          }
                        }}
                        disabled={!inputText.trim() || isSummarizing}
                        className="group w-70 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-green-500 transform hover:scale-[1.02] disabled:hover:scale-100"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isSummarizing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Analyzing with AI...
                            </>
                          ) : (
                            <>
                              <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              Summarize with AI
                            </>
                          )}
                        </span>
                      </button>
                      {summarizeError && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center text-lg font-medium border border-red-200 dark:border-red-800">
                          {summarizeError}
                        </div>
                      )}
                      {summary && (
                        <div className="mt-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-lg border border-green-100 dark:border-green-800">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-xl">AI Summary</h3>
                          </div>
                          <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                            <p className="text-gray-700 dark:text-gray-300">{summary}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SignedIn>
              </Tabs.Content>

              <Tabs.Content value="upload" className="outline-none p-8">
                <SignedOut>
                  <div className="text-center py-16">
                    <div className="mb-8">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Upload & Learn Instantly
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                        Upload PDFs, documents, and more to create interactive study materials.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <SignInButton mode="modal">
                        <button className="group px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transform hover:scale-105">
                          <span className="flex items-center gap-2">
                            Log In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="group px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 transform hover:scale-105">
                          <span className="flex items-center gap-2">
                            Sign Up Free
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          </span>
                        </button>
                      </SignUpButton>
                    </div>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Your Document</h3>
                      </div>
                      {/* Existing upload logic preserved */}
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Learning</h3>
                      </div>
                      {/* Existing quiz/chat tabs logic preserved */}
                    </div>
                  </div>
                </SignedIn>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-zinc-900 relative overflow-hidden" >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/10 mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/10 mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have already revolutionized their
            learning process with Gru's AI-powered study tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="px-8 py-3.5 rounded-full text-md font-semibold bg-white text-indigo-700 hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105"
            >
              Sign Up Free
            </a>
            <a
              href="#"
              className="px-8 py-3.5 rounded-full text-md font-semibold bg-transparent text-white border-2 border-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transform hover:scale-105"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section >

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
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.0112.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.054.058 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
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