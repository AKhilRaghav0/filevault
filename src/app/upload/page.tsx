'use client';

import FileUploader from '../../components/FileUploader';

export default function UploadPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-10">Upload Your Files</h1>
            <div className="bg-white rounded-xl shadow-custom p-8">
                <FileUploader />
            </div>
        </div>
    );
}