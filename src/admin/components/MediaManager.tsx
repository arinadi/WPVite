import { useState } from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';
import { MediaGrid } from './MediaGrid';
import { UploadZone } from './UploadZone';
import type { MediaItem } from '@/admin/hooks/useMedia';

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: MediaItem) => void;
}

export function MediaManager({ isOpen, onClose, onSelect }: MediaManagerProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selectedItem && onSelect) {
      onSelect(selectedItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Media Manager</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'library'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === 'library' ? (
            <MediaGrid
              onSelect={onSelect ? setSelectedItem : undefined}
              selectedId={selectedItem?.id}
            />
          ) : (
            <UploadZone onUploadSuccess={() => setActiveTab('library')} />
          )}
        </div>

        {/* Footer (only if selection mode) */}
        {onSelect && (
          <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedItem}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Insert Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
