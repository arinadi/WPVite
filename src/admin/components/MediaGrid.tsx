import { Trash2, Check } from 'lucide-react';
import { useMedia, useDeleteMedia, type MediaItem } from '@/admin/hooks/useMedia';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MediaGridProps {
  onSelect?: (item: MediaItem) => void;
  selectedId?: string;
}

export function MediaGrid({ onSelect, selectedId }: MediaGridProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMedia(page);
  const deleteMutation = useDeleteMedia();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this image?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Image deleted'),
        onError: () => toast.error('Failed to delete image'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  const items = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No images found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item: MediaItem) => (
            <div
              key={item.id}
              onClick={() => onSelect?.(item)}
              className={`
                group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                ${selectedId === item.id ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-transparent hover:border-gray-300'}
              `}
            >
              <img
                src={item.url}
                alt={item.altText || 'Media'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {selectedId === item.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="p-2 bg-white/10 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-500">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
