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
    <div className="w-full max-w-md mx-auto bg-white shadow-custom rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Download File</h2>

      {!downloadInfo ? (
        <>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-secondary-700">
              Enter 6-digit PIN code
            </label>
            
            <div className="flex justify-between mb-4">
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  id={`pin-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={pin[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 text-center text-xl font-mono border border-secondary-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                />
              ))}
            </div>
            
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            
            <button
              onClick={verifyPin}
              disabled={loading || pin.join('').length !== 6}
              className={`w-full flex items-center justify-center btn-primary py-2.5 ${loading || pin.join('').length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download File
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800">File found!</h3>
            <p className="text-sm text-green-700">Your file is ready to download.</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-1">File name:</p>
            <p className="text-secondary-800 font-medium truncate">{downloadInfo.fileName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-1">Size:</p>
            <p className="text-secondary-600">{downloadInfo.fileSize}</p>
          </div>
          
          <a
            href={downloadInfo.fileUrl}
            download
            className="w-full flex items-center justify-center btn-primary py-3"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download Now
          </a>
          
          <button
            onClick={() => {
              setDownloadInfo(null);
              setPin(Array(6).fill(''));
            }}
            className="w-full text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Download another file
          </button>
        </div>
      )}
    </div>
  );
}
