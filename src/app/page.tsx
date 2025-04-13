'use client'

import FileUpload from "@/components/file-upload";
import * as Tabs from '@radix-ui/react-tabs';
import { Send, Menu, User, SunMoon, FileText, Brain, Sparkles, Clock, BookOpen, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Button } from "@/components/ui/button"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const { theme, setTheme } = useTheme();

  // Mock testimonials
  const testimonials = [
    { name: "Alex K.", role: "Computer Science Student", text: "Gru helped me prepare for my finals in half the time!" },
    { name: "Jamie L.", role: "Biology Major", text: "Converting my lecture notes into interactive quizzes made studying so much more engaging." },
    { name: "Sam T.", role: "Engineering Student", text: "The AI actually understands the context of my questions and provides relevant answers." }
  ];

  // Mock features
  const features = [
    { 
      icon: <FileText className="w-8 h-8 mb-4 text-black dark:text-white" />, 
      title: "Document Analysis", 
      description: "Upload your notes and Gru will analyze them instantly" 
    },
    { 
      icon: <Brain className="w-8 h-8 mb-4 text-black dark:text-white" />, 
      title: "Smart Quizzes", 
      description: "Generate personalized quizzes based on your content" 
    },
    { 
      icon: <Sparkles className="w-8 h-8 mb-4 text-black dark:text-white" />, 
      title: "AI Chat", 
      description: "Ask questions about your notes and get instant answers" 
    }
  ];

  // Mock statistics
  const stats = [
    { value: "70%", label: "Students waste time with inefficient study methods" },
    { value: "3x", label: "Higher retention with interactive learning" },
    { value: "45%", label: "Students report reduced study stress with Gru" }
  ];

  // Problems and solutions
  const problems = [
    {
      icon: <Clock className="w-12 h-12 mb-4 text-black dark:text-white" />,
      title: "Overwhelming Workload",
      description: "Students are buried under piles of notes, struggling to organize and review them efficiently."
    },
    {
      icon: <BookOpen className="w-12 h-12 mb-4 text-black dark:text-white" />,
      title: "Low Retention Rates",
      description: "Despite hours spent studying, many students find that they retain only a fraction of the material."
    },
    {
      icon: <X className="w-12 h-12 mb-4 text-black dark:text-white" />,
      title: "High Stress and Burnout",
      description: "Ineffective study methods cause frustration, leaving students feeling unprepared."
    }
  ];

  const solutions = [
    {
      title: "Upload & Analyze",
      description: "Simply upload your PDF or Word documents and let Gru analyze the content."
    },
    {
      title: "Generate Quizzes",
      description: "Transform your notes into interactive quizzes that boost retention."
    },
    {
      title: "Ask Questions",
      description: "Have questions about your material? Just ask Gru for instant clarity."
    },
    {
      title: "Create Summaries",
      description: "Get concise summaries of complex topics to reinforce understanding."
    }
  ];

  const handleFileUpload = () => {
    // Mock function to simulate file upload
    setFileUploaded(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo placeholder */}
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-black dark:bg-white rounded-md flex items-center justify-center text-white dark:text-black font-bold">
                  ._.
                </div>

                <span className="ml-2 text-4xl special-gothic-expanded-one-regular text-gray-900 dark:text-white">
                  Gru
                </span>
              </div>
            </div>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-gray-800 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle Theme"
              >
                <SunMoon className="w-5 h-5" />
              </button>

              <a href="#problem" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Problem</a>
              <a href="#solution" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Solution</a>
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Features</a>
              <a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Demo</a>
              <button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Login
              </button>
              <div className="ml-2 rounded-full bg-gray-100 dark:bg-zinc-800 p-1">
                <User size={20} className="text-gray-500 dark:text-gray-300" />
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
          <div className="md:hidden border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <a href="#problem" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">Problem</a>
              <a href="#solution" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">Solution</a>
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">Features</a>
              <a href="#demo" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">Demo</a>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Login
                </button>
                <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-1">
                  <User size={20} className="text-gray-500 dark:text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gray-400 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gray-300 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Study Smarter! (or dumber)</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Gru Does Both</h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            What if your notes could teach you? <br />
            Turn your study notes into fun, interactive quizzes with Gru AI!
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-12">
            <a
              href="https://gru-ai.vercel.app/signup"
              className="inline-flex items-center justify-center rounded-md text-md font-semibold bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Get Started - It's Free
              <ChevronRight className="w-5 h-5 ml-2 transition-all duration-300" />
            </a>
          </div>
          
          {/* Browser mockup */}
          <div className="rounded-lg bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-700 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gray-100 dark:bg-zinc-700 px-4 py-2 flex items-center border-b border-gray-200 dark:border-zinc-600">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-300">gru-ai.vercel.app</div>
            </div>
            <div className="p-4">
              <img src="/api/placeholder/700/400" alt="Gru AI Interface" className="rounded border border-gray-200 dark:border-zinc-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md">
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <button className="text-3xl font-bold mb-4">The Problem</button>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              70% of students waste time with inefficient study habits. Overwhelmed by information, students face low retention, stress, and burnout with traditional study methods.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-zinc-600 text-center">
                <div className="flex justify-center">{problem.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-16 bg-gray-50 dark:bg-zinc-800 rounded-tl-3xl rounded-tr-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Solution</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform how you study with Gru. Discover a smarter, stress-free way to study by converting your notes into engaging, interactive quizzes that boost retention and confidence.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
              <div className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md h-full">
                <img src="/api/placeholder/400/300" alt="Student studying with Gru" className="rounded-lg w-full object-cover mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-center">How Gru Works</h3>
                <div className="space-y-4">
                  {solutions.map((solution, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1 bg-black dark:bg-white text-white dark:text-black rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{solution.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{solution.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <div className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md h-full flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-6">Transform Your Study Experience</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="bg-black dark:bg-white p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Upload any PDF or DOCX files with your lecture notes or textbooks</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-black dark:bg-white p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Generate custom quizzes tailored to your learning needs</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-black dark:bg-white p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Ask questions directly about the content to deepen understanding</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-black dark:bg-white p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Create summaries and flashcards to reinforce key concepts</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-black dark:bg-white p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Track your progress and focus on areas that need improvement</span>
                  </li>
                </ul>
                <div className="mt-8 text-center">
                  <a
                    href="https://gru-ai.vercel.app/signup"
                    className="inline-flex items-center justify-center rounded-md text-md font-semibold bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 ease-in-out shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Transform Your Study Experience
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How Gru AI Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-md border border-gray-100 dark:border-zinc-600 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Try It Yourself</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
            Upload your study materials and see how Gru can help you learn better. <br/> Ask questions about your content and get instant answers.
          </p>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700">
            <Tabs.Root defaultValue="upload">
              <Tabs.List className="flex border-b border-gray-200 dark:border-zinc-700 mb-6">
                <Tabs.Trigger 
                  value="upload"
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:text-black data-[state=active]:dark:text-white"
                >
                  1. Upload Document
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="chat"
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:dark:border-white data-[state=active]:text-black data-[state=active]:dark:text-white"
                >
                  2. Chat with Your Document
                </Tabs.Trigger>
              </Tabs.List>
              
              <Tabs.Content value="upload" className="focus:outline-none">
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg text-center">
                  <FileUpload onUpload={handleFileUpload} />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Supported formats: PDF, DOCX, TXT (Max: 10MB)
                  </p>
                </div>
              </Tabs.Content>
              
              <Tabs.Content value="chat" className="focus:outline-none">
                <ChatInterface fileUploaded={fileUploaded} />
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow border border-gray-100 dark:border-zinc-600">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-600 flex items-center justify-center mr-3">
                    <User size={20} className="text-gray-500 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-black dark:bg-white rounded-md flex items-center justify-center text-white dark:text-black font-bold">
                  ._.
                </div>
                <span className="ml-2 text-2xl special-gothic-expanded-one-regular">Gru</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Powered by advanced AI technology to help you interact with your documents and learn more effectively.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Terms</a></li></ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Gru AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChatInterface({ fileUploaded }) {
  const [message, setMessage] = useState('');
  
  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 p-4 h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent px-2">
        {fileUploaded ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-start">
              <div className="bg-white dark:bg-zinc-700 rounded-lg p-3 max-w-[80%] shadow-sm">
                <p className="text-gray-900 dark:text-white">Hello! I've analyzed your document. What would you like to know about it?</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-300 italic text-center">
              {fileUploaded ? "Type a message to start chatting..." : "Upload a document first to start chatting"}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-2 bg-white dark:bg-zinc-700 p-2 rounded-lg border border-gray-200 dark:border-zinc-600 shadow-sm">
        <input
          type="text"
          placeholder="Ask about your document..."
          className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-500 rounded-md placeholder-gray-400 dark:placeholder-gray-300 text-gray-900 dark:text-white"
          disabled={!fileUploaded}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-300 text-white dark:text-black p-2 rounded-md disabled:bg-gray-300 dark:disabled:bg-zinc-600 disabled:text-gray-500 dark:disabled:text-zinc-400 transition-colors"
          disabled={!fileUploaded || !message.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}