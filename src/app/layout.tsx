import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gru AI",
  description: "have Gru summarize your files, chat with them, and more!",
};

// src/app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&display=swap');
        `}</style>
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            // defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header> */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
