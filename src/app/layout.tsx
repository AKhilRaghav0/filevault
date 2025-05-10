import './globals.css';
import Link from 'next/link';
import Footer from '../components/Footer';
import HydrationSuppressor from '../components/HydrationSuppressor';
import HydrationErrorBoundary from '../components/HydrationErrorBoundary';

export const metadata = {
  title: 'FileVault - Secure File Sharing',
  description: 'A modern file sharing platform with secure, temporary access via PIN codes and direct links.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gray-50">
        <HydrationSuppressor />
        <HydrationErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-gray-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link href="/" className="flex-shrink-0 flex items-center">
                      <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                      </svg>
                      <span className="ml-2 text-xl font-bold text-gray-900">FileVault</span>
                    </Link>
                  </div>
                  <nav className="flex items-center space-x-8">
                    <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary-600 transition duration-150 ease-in-out">
                      Home
                    </Link>
                    <Link href="/upload" className="text-base font-medium text-gray-700 hover:text-primary-600 transition duration-150 ease-in-out">
                      Upload File
                    </Link>
                    <Link 
                      href="/upload" 
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Share a File
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <Footer />
          </div>
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}

