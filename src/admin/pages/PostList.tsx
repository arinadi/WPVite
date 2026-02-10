import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts, useDeletePost } from '@/admin/hooks/usePosts';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';


export function PostList() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts(statusFilter, page);
  const deleteMutation = useDeletePost();

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Post deleted'),
        onError: () => toast.error('Failed to delete post'),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex gap-4 bg-gray-50/50">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {/* Search could rely on client-side filtering or new API param */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading posts...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No posts found.
                  </td>
                </tr>
              ) : (
                data?.data?.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/admin/posts/${post.id}`} className="font-medium text-gray-900 hover:text-blue-600 block mb-1">
                        {post.title}
                      </Link>
                      <div className="text-xs text-gray-400 font-mono hidden group-hover:block transition-all">
                        /p/{post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200" />
                        )}
                        <span className="text-sm text-gray-700">{post.authorName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${post.status === 'published' ? 'bg-green-100 text-green-800' : 
                          post.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/api/preview/${post.id}`} // Placeholder for preview
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/posts/${post.id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {data?.pagination?.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
             <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-gray-500">
              Page {page} of {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
