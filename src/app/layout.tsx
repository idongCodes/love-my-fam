import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import AutoLogout from "@/components/AutoLogout"; // <--- IMPORT THIS
import FeedbackSection from "@/components/FeedbackSection";
import FeedbackWidget from "@/components/FeedbackWidget";
import { cookies } from "next/headers";           // <--- IMPORT THIS
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveMyFam",
  description: "A safe space for family.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('session_id')

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        
        <Navbar />
        {isLoggedIn && <AutoLogout />}
        
        <main className="flex-1 pt-16"> 
          {children}
        </main>

        {/* 3. "WHAT DO YOU LOVE" SECTION (Sits above footer) */}
        <FeedbackSection />

        {/* 4. GLOBAL FOOTER */}
        <footer className="bg-slate-800 text-brand-sky py-8 text-center border-t border-slate-700">
          
          {/* "ISSUES" LINK (Sits inside footer at the top) */}
          <div className="container mx-auto px-4 mb-6 border-b border-slate-700/50 pb-6">
            <FeedbackWidget />
          </div>

          <p className="font-medium">© {new Date().getFullYear()} LoveMyFam.</p>
          <p className="text-sm text-slate-500 mt-2">
            Built with ❤️ by{' '}
            <a 
              href="https://instagram.com/idongcodes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-brand-pink transition-colors"
            >
              idongCodes
            </a>
          </p>
        </footer>

      </body>
    </html>
  );
}