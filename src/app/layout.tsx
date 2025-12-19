import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        
        {/* GLOBAL NAVBAR */}
        <Navbar />
        
        {/* Main Content: flex-1 makes it stretch to fill empty space */}
        <main className="flex-1 pt-16"> 
          {children}
        </main>

        {/* GLOBAL FOOTER */}
        <footer className="bg-slate-800 text-brand-sky py-10 text-center border-t border-slate-700">
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