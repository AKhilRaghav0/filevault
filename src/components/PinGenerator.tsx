'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const PinGenerator: React.FC = () => {
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const inputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));
    const router = useRouter();

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        
        // Only allow digits
        if (!/^\d*$/.test(value)) return;
        
        // Update the PIN
        const newPin = pin.split('');
        newPin[index] = value;
        setPin(newPin.join(''));
        
        // Move to next input
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        
        // Only accept numbers
        if (!/^\d+$/.test(pastedData)) return;
        
        // Take only the first 6 digits
        const digits = pastedData.slice(0, 6).split('');
        
        // Fill in the inputs
        digits.forEach((digit, index) => {
            if (inputRefs[index].current) {
                inputRefs[index].current!.value = digit;
            }
        });
        
        setPin(digits.join(''));
        
        // Focus the last filled input or the next empty one
        if (digits.length < 6) {
            inputRefs[digits.length].current?.focus();
        }
    };

    const verifyPin = async () => {
        if (pin.length !== 6) {
            setError('Please enter a 6-digit PIN');
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
                body: JSON.stringify({ pin }),
            });
            
            const data = await response.json();
            
            if (response.ok && data.fileId) {
                router.push(`/download/${data.fileId}`);
            } else {
                setError('Invalid PIN. Please check and try again.');
            }
        } catch (err) {
            setError('Failed to verify PIN. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-lg font-medium text-secondary-800 mb-3">Enter 6-Digit PIN</h2>
            
            <div className="flex justify-center space-x-2 mb-4">
                {Array(6).fill(0).map((_, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-xl font-mono border border-secondary-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 font-['JetBrains_Mono', monospace]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        value={pin[index] || ''}
                        onChange={(e) => handlePinChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                    />
                ))}
            </div>
            
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            
            <button
                onClick={verifyPin}
                disabled={pin.length !== 6 || loading}
                className={`w-full btn-primary ${(pin.length !== 6 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Verifying...' : 'Download File'}
            </button>
            
            <p className="text-xs text-secondary-500 mt-4 text-center">
                Enter the 6-digit PIN shared with you to download the file.
            </p>
        </div>
    );
};

export default PinGenerator;