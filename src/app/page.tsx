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
} from 'lucide-react';

// import SignupModal from '../components/SignupModal';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  const [showSignup, setShowSignup] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    setFileUploaded(true);
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
      avatar: '/api/placeholder/56/56',
      rating: 5,
    },
    {
      name: 'Jamie L.',
      role: 'Biology Major',
      text:
        "Converting my lecture notes into interactive quizzes made studying so much more engaging. I've improved my grades by 15% this semester!",
      avatar: '/api/placeholder/56/56',
      rating: 4,
    },
    {
      name: 'Sam T.',
      role: 'Engineering Student',
      text:
        "The AI actually understands the context of my questions and provides relevant answers. It's like having a personal tutor available 24/7.",
      avatar: '/api/placeholder/56/56',
      rating: 5,
    },
    {
      name: 'Taylor R.',
      role: 'Medical Student',
      text:
        'Gru has transformed how I study complex medical terminologies and concepts. The quiz generation is surprisingly accurate.',
      avatar: '/api/placeholder/56/56',
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
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  ._.
                </div>

                <span className="ml-2 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Gru
                </span>
              </div>
            </div>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-full mr-2">
                <button
                  onClick={() =>
                    setTheme(theme === 'light' ? 'dark' : 'light')
                  }
                  className="text-gray-800 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors"
                  aria-label="Toggle Theme"
                >
                  <SunMoon className="w-6 h-3 scale-150" />
                </button>
              </div>

              <div className="bg-gray-100 dark:bg-zinc-800 rounded-full p-1.5 flex items-center">
                <NavButton
                  href="#problem"
                  label="Problem"
                  isActive={activeTab === 'problem'}
                />
                <NavButton
                  href="#solution"
                  label="Solution"
                  isActive={activeTab === 'solution'}
                />
                <NavButton
                  href="#features"
                  label="Features"
                  isActive={activeTab === 'features'}
                />
                <NavButton
                  href="#demo"
                  label="Demo"
                  isActive={activeTab === 'demo'}
                />
              </div>

              {/* <button onClick={() => setShowLogin(true)} className="ml-4 px-5 py-2.5 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105">
                Login
              </button> */}
              {/* <div className="ml-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 p-1.5 shadow-sm">
                <User size={20} className="text-gray-500 dark:text-gray-300" />
              </div> */}
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
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Features
              </a>
              <a
                href="#demo"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800"
              >
                Demo
              </a>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                {/* <button onClick={() => setShowLogin(true)} className="px-4 py-2 rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Login
                </button> */}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setTheme(theme === 'light' ? 'dark' : 'light')
                    }
                    className="rounded-full bg-gray-100 dark:bg-zinc-800 p-2 text-gray-500 dark:text-gray-300"
                  >
                    <SunMoon size={18} />
                  </button>
                  <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-2">
                    <User size={18} className="text-gray-500 dark:text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

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
            Gru Transforms Your Notes into Knowledge (or Brainrot :P)
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            What if your notes could teach you? <br />
            Turn your study notes into fun, interactive quizzes with Gru AI!
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowSignup(true)}
              className="inline-flex items-center justify-center rounded-full text-md font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 px-8 py-3.5 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-105"
            >
              Get Started - It's Free
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
                src="/api/placeholder/700/400"
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
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 transform transition-all duration-300 hover:scale-105"
              >
                <p className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-white dark:bg-zinc-900">
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

      {/* Solution Section */}
      <section
        id="solution"
        className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-tl-3xl rounded-tr-3xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              The Solution
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Study smarter (or dumber — Gru doesn’t judge). Turn your messy notes
              into fun, interactive quizzes that actually help you remember stuff.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 h-full transform transition-all duration-300 hover:shadow-lg">
                <img
                  src="/api/placeholder/400/300"
                  alt="Student studying with Gru"
                  className="rounded-lg w-full object-cover mb-6 shadow-md"
                />
                <h3 className="text-2xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  How Gru Works
                </h3>
                <div className="space-y-6">
                  {solutions.map((solution, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold mr-3 shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {solution.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 h-full flex flex-col justify-center transform transition-all duration-300 hover:shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Transform Your Study Experience
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full mr-3 shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1.0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      Upload any PDF or DOCX files with your lecture notes or
                      textbooks
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full mr-3 shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1.0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      Gru AI analyzes content to identify key concepts and
                      knowledge gaps
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full mr-3 shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1.0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      Generate customized quizzes that adapt to your learning
                      progress
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full mr-3 shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1.0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      Focus on areas where you need improvement using intelligent
                      spaced repetition
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1.5 rounded-full mr-3 shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1.0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200">
                      Ask questions about your content and get contextually
                      relevant answers
                    </span>
                  </li>
                </ul>
                <div className="mt-8 text-center">
                  <button className="px-6 py-3 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105">
                    Start Using Gru Today
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-zinc-900">
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
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900">
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
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Try Gru Yourself
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Upload a sample document to see how Gru can transform your study
              materials into an interactive learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Upload Your Document
              </h3>
              {!fileUploaded ? (
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragging
                      ? 'border-indigo-500'
                      : 'border-gray-300 dark:border-zinc-700'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <FileUp className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Drag and drop your file here or click to browse
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
                    <svg
                      className="w-8 h-8 text-green-500 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    File Uploaded Successfully!
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Your document is being processed by Gru AI.
                  </p>
                  <button
                    onClick={() => setFileUploaded(false)}
                    className="px-4 py-2 rounded-full text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    Upload Another Document
                  </button>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  What happens next?
                </h4>
                <ol className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex">
                    <span className="mr-2 font-bold">1.</span>
                    <span>
                      Gru analyzes your document to extract key concepts and
                      relationships
                    </span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 font-bold">2.</span>
                    <span>
                      Generates customized quizzes based on the content
                    </span>
                  </li>
                  <li className="flex">
                    <span className="mr-2 font-bold">3.</span>
                    <span>
                      Creates an interactive study environment for maximum
                      retention
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
              <Tabs.Root defaultValue="quiz" className="w-full">
                <Tabs.List className="flex mb-6 bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                  <Tabs.Trigger
                    value="quiz"
                    className="flex-1 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm"
                  >
                    Quiz Demo
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="chat"
                    className="flex-1 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm"
                  >
                    Chat Demo
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="quiz" className="outline-none">
                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Biology Quiz - Cell Structure
                      </h3>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-900">
                      <div className="mb-6">
                        <p className="text-gray-800 dark:text-gray-200 mb-3">
                          What is the primary function of mitochondria in
                          eukaryotic cells?
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="option1"
                              name="answer"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-zinc-600"
                            />
                            <label
                              htmlFor="option1"
                              className="ml-2 text-gray-700 dark:text-gray-300"
                            >
                              Protein synthesis
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="option2"
                              name="answer"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-zinc-600"
                            />
                            <label
                              htmlFor="option2"
                              className="ml-2 text-gray-700 dark:text-gray-300"
                            >
                              Energy production (ATP)
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="option3"
                              name="answer"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-zinc-600"
                            />
                            <label
                              htmlFor="option3"
                              className="ml-2 text-gray-700 dark:text-gray-300"
                            >
                              Lipid storage
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="option4"
                              name="answer"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-zinc-600"
                            />
                            <label
                              htmlFor="option4"
                              className="ml-2 text-gray-700 dark:text-gray-300"
                            >
                              DNA replication
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                          Previous
                        </button>
                        <button className="px-4 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-colors">
                          Check Answer
                        </button>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="chat" className="outline-none">
                  <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-md h-80 flex flex-col">
                    <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Ask about your content
                      </h3>
                    </div>
                    <div className="flex-1 bg-white dark:bg-zinc-900 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 max-w-[80%]">
                            <p className="text-gray-800 dark:text-gray-200">
                              Hi there! I've analyzed your Biology notes. What
                              would you like to know about cell structures?
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-3 max-w-[80%]">
                            <p className="text-gray-800 dark:text-gray-200">
                              Can you explain the difference between mitochondria
                              and chloroplasts?
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 max-w-[80%]">
                            <p className="text-gray-800 dark:text-gray-200">
                              Based on your notes: Mitochondria and chloroplasts
                              are both organelles in eukaryotic cells, but they
                              serve different functions. Mitochondria are present
                              in almost all eukaryotic cells and produce energy
                              through cellular respiration. Chloroplasts are found
                              in plant cells and some algae and conduct
                              photosynthesis to convert light into chemical
                              energy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 p-3">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Ask a question about your notes..."
                          className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="ml-2 p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 relative overflow-hidden">
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
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 py-12 border-t border-gray-200 dark:border-zinc-800">
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
      </footer>
    </div>
  );
}