'use client'

import FileUpload from "@/components/file-upload";
import * as Tabs from '@radix-ui/react-tabs';
import { Send, Menu, User, SunMoon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
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

              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">About</a>
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
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">Features</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">Pricing</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-zinc-800">About</a>
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

      {/* Main content */}
      <main className="flex flex-col items-center p-4 md:p-12 lg:p-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gray-400 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gray-300 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center">AI Document Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">
            Upload your documents and chat with an AI that understands your content
          </p>

          <div className="w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
            <Tabs.Root defaultValue="upload" className="w-full">
              <Tabs.List className="grid w-full grid-cols-2 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700">
                <Tabs.Trigger
                  value="upload"
                  className="px-6 py-4 font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-tl-lg"
                >
                  Upload Document
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="chat"
                  className="px-6 py-4 font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-tr-lg"
                >
                  Chat with Document
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="upload" className="p-6 md:p-8">
                <div className="flex flex-col items-center space-y-8">
                  <FileUpload />
                </div>
              </Tabs.Content>

              <Tabs.Content value="chat" className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="w-full md:w-1/2 flex justify-center">
                    {/* Character placeholder */}
                    <div className="h-64 w-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-zinc-600 shadow-inner">
                      <span className="text-gray-500 dark:text-gray-300 font-medium">AI Assistant</span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <ChatInterface />
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>

          <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400 text-center">
            Powered by advanced AI technology to help you interact with your documents
          </footer>
        </div>
      </main>
    </div>
  )
}

function ChatInterface() {
  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 p-4 h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent px-2">
        <div className="py-16 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-300 italic text-center">Upload a document first to start chatting</p>
        </div>
      </div>
      <div className="flex gap-2 bg-white dark:bg-zinc-700 p-2 rounded-lg border border-gray-200 dark:border-zinc-600 shadow-sm">
        <input
          type="text"
          placeholder="Ask about your document..."
          className="flex-1 p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-500 rounded-md placeholder-gray-400 dark:placeholder-gray-300 text-gray-900 dark:text-white"
          disabled
        />
        <button
          className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-300 text-white dark:text-black p-2 rounded-md disabled:bg-gray-300 dark:disabled:bg-zinc-600 disabled:text-gray-500 dark:disabled:text-zinc-400 transition-colors"
          disabled
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
