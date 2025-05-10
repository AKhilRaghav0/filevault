'use client';

import React, { useState } from 'react';
import { DownloadIcon } from './Icons';

// Implement the component directly in this file instead of importing
export default function ClientFileDownloader() {
  const [pin, setPin] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ fileName: string; fileSize: string; fileUrl: string } | null>(null);
  const [error, setError] = useState('');

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyPin = async () => {
    const pinString = pin.join('');
    if (pinString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pinString }),
      });

      if (!response.ok) {
        throw new Error('Invalid PIN or file not found');
      }

      const data = await response.json();
      setDownloadInfo({
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto card shadow-custom border border-slate-200 dark:border-slate-700">
      <div className="flex items-center mb-6">
        <div className="gradient-bg rounded-full p-2 mr-3 shadow-lg">
          <DownloadIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Download File</h2>
      </div>

      {!downloadInfo ? (
        <>
          <div className="space-y-6">
            <div className="text-center mb-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Enter the 6-digit PIN code to access your file
              </label>
            </div>
            
            <div className="pin-input-group mb-6">
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  id={`pin-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={pin[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}                  className="w-10 h-12 text-center text-xl font-mono border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 font-['JetBrains_Mono', monospace]"
                  aria-label={`PIN digit ${index + 1}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              ))}
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex items-center mb-4">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
              <div className="flex justify-center">
              <button
                onClick={verifyPin}
                disabled={loading || pin.join('').length !== 6}
                className={`flex items-center justify-center btn-primary py-3 px-8 shadow-custom ${loading || pin.join('').length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download File
                  </span>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-800 border-l-4 border-green-500 mb-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-500 p-1.5 mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 dark:text-white">File found!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Your file is ready to download.</p>
              </div>
            </div>
          </div>
          
          <div className="card card-hover border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <div className="mr-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <svg className="w-6 h-6 text-slate-500 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 dark:text-white truncate">{downloadInfo.fileName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{downloadInfo.fileSize}</p>
              </div>
            </div>
            
            <a
              href={downloadInfo.fileUrl}
              download
              className="w-full flex items-center justify-center btn-primary py-3 shadow-custom"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download Now
            </a>
          </div>
          
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setDownloadInfo(null);
                setPin(Array(6).fill(''));
              }}
              className="btn-ghost text-sm"
            >
              Download another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
