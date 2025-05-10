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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-xl mx-auto">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
                <p className="text-red-600">{error}</p>
                <button 
                    className="mt-4 btn-secondary"
                    onClick={() => window.location.href = '/'}
                >
                    Return to Homepage
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-lg shadow-custom p-6">
                <h1 className="text-2xl font-bold text-secondary-900 mb-6 text-center">Download File</h1>
                
                {fileData ? (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-medium text-green-800">File ready for download</h3>
                            <p className="text-sm text-green-700">Your file has been found and is ready to download.</p>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-secondary-700 mb-1">File name:</p>
                            <p className="text-secondary-800 font-medium truncate">{fileData.name}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-secondary-700 mb-1">Size:</p>
                            <p className="text-secondary-600">{fileData.size}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-secondary-700 mb-1">Type:</p>
                            <p className="text-secondary-600">{fileData.mimeType}</p>
                        </div>
                        
                        <a
                            href={fileData.url}
                            download
                            className="w-full flex items-center justify-center btn-primary py-3"
                        >
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Download Now
                        </a>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-secondary-600">No file found for this ID.</p>
                        <button 
                            className="mt-4 btn-secondary"
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