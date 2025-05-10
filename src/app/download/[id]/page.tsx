'use client';

import { useEffect, useState } from 'react';
import { DownloadIcon } from '@/components/Icons';

type Props = {
  params: {
    id: string;
  };
};

const DownloadPage = ({ params }: Props) => {
    const { id } = params;
    const [fileData, setFileData] = useState<{
      name: string;
      size: string;
      mimeType: string;
      url: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFileData = async () => {
            try {
                const response = await fetch(`/api/file-info/${id}`);
                if (!response.ok) {
                    throw new Error('File not found or no longer available');
                }
                const data = await response.json();
                setFileData({
                    name: data.name,
                    size: (data.size / (1024 * 1024)).toFixed(2) + ' MB',
                    mimeType: data.mimeType,
                    url: `/api/download/${id}`
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load file information');
            } finally {
                setLoading(false);
            }
        };

        fetchFileData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Loading file information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border-l-4 border-red-500 max-w-xl mx-auto">
                <div className="flex items-center mb-4">
                    <div className="mr-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Error</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                <div className="flex justify-center">
                    <button 
                        className="btn-primary"
                        onClick={() => window.location.href = '/'}
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="card shadow-custom border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-8">
                    <div className="gradient-bg rounded-full p-2 mr-3 shadow-lg">
                        <DownloadIcon className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Download File</h1>
                </div>
                
                {fileData ? (
                    <div className="space-y-6">
                        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-800 border-l-4 border-green-500 mb-6">
                            <div className="flex items-center">
                                <div className="rounded-full bg-green-500 p-1.5 mr-3 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800 dark:text-white">File ready for download</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">Your file has been found and is ready to download.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card card-hover border border-slate-200 dark:border-slate-700 p-0">
                            <div className="flex items-center mb-4">
                                <div className="mr-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    {/* Choose icon based on file type */}
                                    {fileData.mimeType.includes('image') ? (
                                        <svg className="w-6 h-6 text-slate-500 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    ) : fileData.mimeType.includes('pdf') ? (
                                        <svg className="w-6 h-6 text-slate-500 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-slate-500 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-slate-800 dark:text-white truncate">{fileData.name}</h3>
                                    <div className="flex flex-wrap items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="mr-3">{fileData.size}</span>
                                        <span>{fileData.mimeType}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <a
                                href={fileData.url}
                                download
                                className="w-full flex items-center justify-center btn-primary py-3 shadow-custom mt-6"
                            >
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Download Now
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex items-center mb-6">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 dark:text-red-300">No file found for this ID.</p>
                        </div>
                        <button 
                            className="btn-primary"
                            onClick={() => window.location.href = '/'}
                        >
                            Return to Homepage
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DownloadPage;