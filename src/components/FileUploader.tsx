'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, ClipboardIcon, CheckIcon } from './Icons';
import { motion } from 'framer-motion';

interface FileUploaderProps {
    onUploadComplete?: (status: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [fileLink, setFileLink] = useState<string>('');
    const [pin, setPin] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setUploadStatus('idle');
            setFileLink('');
            setPin('');
        }
    }, []);
    
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 100 * 1024 * 1024, // 100MB max size
    });

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        setUploading(true);
        setUploadStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUploadStatus('success');
                setFileLink(`${window.location.origin}/download/${data.id}`);
                setPin(data.pin);
                if (onUploadComplete) {
                    onUploadComplete(`File uploaded successfully!`);
                }
            } else {
                setUploadStatus('error');
                if (onUploadComplete) {
                    onUploadComplete('File upload failed. Please try again.');
                }
            }
        } catch (error) {
            setUploadStatus('error');
            if (onUploadComplete) {
                onUploadComplete('An error occurred during the upload. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getDropzoneClassName = () => {
        let className = "upload-drop-zone";
        
        if (isDragActive && isDragAccept) {
            className += " upload-drop-zone-active";
        } else if (isDragActive && isDragReject) {
            className += " border-red-500 bg-red-50 dark:bg-red-900/20";
        }
        
        return className;
    };

    return (
        <div className="max-w-2xl mx-auto">
            {uploadStatus === 'success' ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card shadow-custom bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-800 border-l-4 border-green-500 mb-8"
                >
                    <div className="flex items-center mb-6">
                        <div className="rounded-full bg-green-500 p-2 mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white">File Uploaded Successfully!</h3>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Download Link</label>
                        <div className="flex shadow-sm rounded-lg overflow-hidden">
                            <input 
                                type="text" 
                                value={fileLink} 
                                readOnly 
                                className="border border-secondary-300 dark:border-slate-600 rounded-lg rounded-r-none px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
                                style={{ zIndex: 10 }}
                            />
                            <button
                                onClick={() => copyToClipboard(fileLink)}
                                className="px-4 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors duration-200"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">PIN Code</label>
                        <div className="flex justify-between gap-2 mb-1 max-w-xs">
                            {pin.split('').map((digit, i) => (
                                <div key={i} className="w-10 h-12 flex items-center justify-center text-xl border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 font-['JetBrains_Mono', monospace]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {digit}
                                </div>
                            ))}
                            <button
                                onClick={() => copyToClipboard(pin)}
                                className="p-2 ml-2 text-primary-600 hover:text-primary-800 transition-colors duration-200"
                                title="Copy PIN"
                            >
                                <ClipboardIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Share this PIN with anyone who needs to download the file.</p>
                    </div>
                    
                    <div className="flex justify-center">
                        <button 
                            onClick={() => {
                                setFile(null);
                                setUploadStatus('idle');
                                setFileLink('');
                                setPin('');
                            }}
                            className="btn-primary flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Another File
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div>
                    <div {...getRootProps({ className: getDropzoneClassName() })}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center">
                            <div className="gradient-bg rounded-full p-4 shadow-lg mb-6">
                                <UploadIcon className="w-8 h-8 text-white" />
                            </div>
                            {isDragActive ? (
                                <p className="text-xl font-medium gradient-text">Drop to upload</p>
                            ) : (
                                <>
                                    <p className="text-xl font-medium text-slate-800 dark:text-white mb-2">Drag & drop file here</p>
                                    <p className="text-slate-500 dark:text-slate-400">or click to browse your files</p>
                                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 w-full text-center">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Maximum file size: 100MB
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {file && (
                        <div className="mt-6 p-5 card card-hover border border-slate-200 dark:border-slate-700 flex items-center">
                            <div className="mr-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <svg className="w-6 h-6 text-slate-500 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button 
                                onClick={() => setFile(null)} 
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove file"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    
                    <div className="mt-8 text-center">
                        <motion.button 
                            onClick={handleUpload} 
                            disabled={!file || uploading} 
                            whileHover={file && !uploading ? { scale: 1.03 } : {}}
                            whileTap={file && !uploading ? { scale: 0.98 } : {}}
                            className={`btn-primary px-10 py-3 shadow-custom ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload File
                                </span>
                            )}
                        </motion.button>
                    </div>
                    
                    {uploadStatus === 'error' && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 dark:text-red-300">There was an error uploading your file. Please try again.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUploader;