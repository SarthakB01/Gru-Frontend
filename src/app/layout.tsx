import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Gru AI",
  description: "have Gru summarize your files, chat with them, and more!",
  icons: {
    icon: '/appstore.png', // or '/favicon.png'
  }
};

// src/app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&display=swap');
      `}</style>
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
