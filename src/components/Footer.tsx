'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const [year] = React.useState(() => new Date().getFullYear());
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            <span className="ml-2 text-lg font-bold text-gray-900">FileVault</span>
          </div>
          
          <nav className="flex space-x-8 mt-4 md:mt-0">
            <Link href="/" className="text-sm text-gray-600 hover:text-primary-600">
              Home
            </Link>
            <Link href="/upload" className="text-sm text-gray-600 hover:text-primary-600">
              Upload
            </Link>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
              Terms of Service
            </a>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {year} FileVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
