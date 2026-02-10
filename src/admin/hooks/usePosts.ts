import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any;
  status: 'published' | 'draft' | 'private';
  excerpt?: string;
  featuredImage?: string;
  allowComments: boolean;
  authorId: string;
  updatedAt: string;
}

export function usePosts(status?: string, page = 1) {
  return useQuery({
    queryKey: ['posts', status, page],
    queryFn: () => api.get(`/api/posts?page=${page}&status=${status || 'all'}`),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => api.get(`/api/posts/${id}`).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Post>) => api.post('/api/posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) => api.put(`/api/posts/${id}`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', data.data.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
