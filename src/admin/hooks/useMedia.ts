import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface MediaItem {
  id: string;
  url: string;
  type: string;
  altText?: string;
  uploadedAt: string;
}

export function useMedia(page = 1, limit = 20) {
  const query = useQuery({
    queryKey: ['media', page, limit],
    queryFn: () => api.get(`/api/media?page=${page}&limit=${limit}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // NOTE: For simplicity we bypass the normal api.post JSON wrapper 
      // and use a direct fetch for binary upload to our server proxy
      // BUT our server proxy expects binary body.
      // Alternatively, we can use FormData if we adjust the server.
      // Let's use `put` from client side? No, we need tokens.
      // Let's use our server endpoint as a proxy:
      // POST /api/media/upload?filename=... Body=FileContent

      const res = await fetch(`/api/media/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        // No Content-Type header locally, let browser set it? 
        // Or set it to file.type? 
        // It's just raw body.
      });
      
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
