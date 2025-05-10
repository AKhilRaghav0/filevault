import Link from 'next/link';
import { FileIcon, DownloadIcon } from '../components/Icons';
import ClientFileDownloader from '../components/ClientFileDownloader';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto text-center py-12">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-500 to-blue-600 text-transparent bg-clip-text">
          Secure File Sharing Made Simple
        </h1>
        <p className="text-xl text-secondary-600 mb-10 max-w-2xl mx-auto">
          Upload, share, and download files with temporary access via secure links or 6-digit PINs.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Link href="/upload" className="flex items-center justify-center gap-2 btn-primary py-3 px-8 text-lg">
            <FileIcon className="w-5 h-5" />
            Upload a File
          </Link>
          
          <div className="relative">
            <ClientFileDownloader />
          </div>
        </div>
      </div>
      
      <div className="w-full bg-secondary-50 py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-custom">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload Your File</h3>
              <p className="text-secondary-600">Simply drag and drop your file or select it from your device.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-custom">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Get Secure Access</h3>
              <p className="text-secondary-600">Receive a unique link or 6-digit PIN to share with others.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-custom">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Download Anywhere</h3>
              <p className="text-secondary-600">Access and download files using the PIN or direct link.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}