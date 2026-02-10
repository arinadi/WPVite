import { useState } from 'react';

import { MediaGrid } from '@/admin/components/MediaGrid';
import { UploadZone } from '@/admin/components/UploadZone';

export function Media() {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'library' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload New
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
        {activeTab === 'library' ? (
          <MediaGrid />
        ) : (
          <div className="max-w-xl mx-auto py-12">
            <UploadZone onUploadSuccess={() => setActiveTab('library')} />
          </div>
        )}
      </div>
    </div>
  );
}
