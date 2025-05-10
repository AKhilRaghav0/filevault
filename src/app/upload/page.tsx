'use client';

import FileUploader from '../../components/FileUploader';

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Upload Your Files</h1>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Upload files up to 100MB and share them securely with a unique link and PIN code.
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-teal-400 mx-auto mt-6"></div>
            </div>
            <div className="card shadow-custom border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
                <FileUploader />
            </div>
        </div>
    );
}