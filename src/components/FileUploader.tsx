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
        let className = "border-2 border-dashed rounded-lg p-10 text-center transition-colors";
        
        if (isDragActive && isDragAccept) {
            className += " border-primary-500 bg-primary-50";
        } else if (isDragActive && isDragReject) {
            className += " border-red-500 bg-red-50";
        } else {
            className += " border-secondary-300 hover:border-primary-500";
        }
        
        return className;
    };

    return (
        <div className="max-w-2xl mx-auto">
            {uploadStatus === 'success' ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
                >
                    <h3 className="text-xl font-semibold text-green-700 mb-4">File Uploaded Successfully!</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Download Link</label>
                        <div className="flex">
                            <input 
                                type="text" 
                                value={fileLink} 
                                readOnly 
                                className="input rounded-r-none focus:z-10 text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(fileLink)}
                                className="px-3 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
                                title="Copy to clipboard"
                            >
                                {copied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-1">PIN Code</label>
                        <div className="flex items-center space-x-2">
                            <div className="bg-secondary-100 px-4 py-2 rounded-md font-mono text-xl tracking-wider text-secondary-800 flex justify-center">
                                {pin.split('').map((digit, i) => (
                                    <span key={i} className="mx-0.5">{digit}</span>
                                ))}
                            </div>
                            <button
                                onClick={() => copyToClipboard(pin)}
                                className="p-2 text-primary-600 hover:text-primary-800"
                                title="Copy PIN"
                            >
                                <ClipboardIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">Share this PIN with anyone who needs to download the file.</p>
                    </div>
                    
                    <button 
                        onClick={() => {
                            setFile(null);
                            setUploadStatus('idle');
                            setFileLink('');
                            setPin('');
                        }}
                        className="btn-secondary"
                    >
                        Upload Another File
                    </button>
                </motion.div>
            ) : (
                <div>
                    <div {...getRootProps({ className: getDropzoneClassName() })}>
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center">
                            <UploadIcon className="w-12 h-12 text-primary-500 mb-4" />
                            {isDragActive ? (
                                <p className="text-lg font-medium">Drop the file here</p>
                            ) : (
                                <>
                                    <p className="text-lg font-medium text-secondary-800 mb-2">Drag & drop a file here</p>
                                    <p className="text-secondary-500">or click to select a file</p>
                                    <p className="text-xs text-secondary-400 mt-4">Max file size: 100MB</p>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {file && (
                        <div className="mt-4 p-4 bg-secondary-50 rounded-md">
                            <p className="text-sm font-medium">Selected file:</p>
                            <p className="text-secondary-700">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={handleUpload} 
                            disabled={!file || uploading} 
                            className={`btn-primary px-8 py-3 ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                <>Upload File</>
                            )}
                        </button>
                    </div>
                    
                    {uploadStatus === 'error' && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                            <p>There was an error uploading your file. Please try again.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUploader;