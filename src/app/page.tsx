import Link from 'next/link';
import { FileIcon, DownloadIcon } from '../components/Icons';
import ClientFileDownloader from '../components/ClientFileDownloader';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-5xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 gradient-text">
          Secure File Sharing <br className="hidden sm:block" />Made Simple
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          Upload, share, and download files with temporary access via secure links or 6-digit PINs.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Link href="/upload" className="flex items-center justify-center gap-2 btn-primary py-3 px-8 text-lg shadow-custom">
            <FileIcon className="w-5 h-5" />
            Upload a File
          </Link>
          
          <div className="relative">
            <ClientFileDownloader />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="w-full bg-slate-50 dark:bg-slate-800/50 py-20 mt-12 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">How It Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-teal-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-hover border border-slate-200 dark:border-slate-700">
              <div className="mb-6 flex items-center">
                <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg mr-4">1</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Upload Your File</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Simply drag and drop your file or select it from your device. Supports files up to 100MB.</p>
            </div>
            
            <div className="card card-hover border border-slate-200 dark:border-slate-700">
              <div className="mb-6 flex items-center">
                <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg mr-4">2</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Get Secure Access</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Receive a unique link and 6-digit PIN to share with others. Your files remain private and secure.</p>
            </div>
            
            <div className="card card-hover border border-slate-200 dark:border-slate-700">
              <div className="mb-6 flex items-center">
                <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg mr-4">3</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Download Anywhere</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">Access and download files using the PIN or direct link. No account required to download shared files.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="w-full max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-teal-400 mx-auto"></div>
        </div>
        
        <div className="space-y-6">
          <div className="card border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">How long are files available for download?</h3>
            <p className="text-slate-600 dark:text-slate-300">Files are available for 7 days after upload, after which they are automatically deleted from our servers.</p>
          </div>
          
          <div className="card border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">Is my data secure?</h3>
            <p className="text-slate-600 dark:text-slate-300">Yes! Files can only be accessed with the unique download link or PIN code. All uploads and downloads are encrypted.</p>
          </div>
          
          <div className="card border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">What file types can I upload?</h3>
            <p className="text-slate-600 dark:text-slate-300">You can upload any type of file up to 100MB in size. We support documents, images, videos, archives, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
}