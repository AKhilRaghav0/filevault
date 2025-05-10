import './globals.css';
import '@fontsource/jetbrains-mono';
import Link from 'next/link';
import Footer from '../components/Footer';
import HydrationSuppressor from '../components/HydrationSuppressor';
import HydrationErrorBoundary from '../components/HydrationErrorBoundary';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
import { JetBrains_Mono, Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono'
});

export const metadata = {
  title: 'Next File Share',
  description: 'A file uploading and downloading site with temporary access via links or generated PINs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 font-sans">
        <HydrationSuppressor />
        <HydrationErrorBoundary>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
            <header className="glass-effect sticky top-0 z-10 py-4 shadow-sm border-b border-slate-200 dark:border-slate-700">
              <div className="container mx-auto flex justify-between items-center px-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="gradient-bg rounded-full h-8 w-8 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span className="font-bold text-xl text-slate-800 dark:text-white">FileShare</span>
                </Link>
                <nav className="flex items-center">
                  <ul className="flex space-x-6 mr-4">
                    <li><Link href="/" className="text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition">Home</Link></li>
                    <li><Link href="/upload" className="text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition">Upload</Link></li>
                  </ul>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            
            <Footer />
          </div>
          </ThemeProvider>
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}

