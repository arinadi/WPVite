import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useCreatePost, useUpdatePost } from '@/admin/hooks/usePosts';
import { toast } from 'react-hot-toast';
import { Editor } from '@/admin/components/Editor';
import { MediaManager } from '@/admin/components/MediaManager';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';

export function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  
  const { data: post, isLoading: isPostLoading } = usePost(id || '');
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'private';
    excerpt: string;
    featuredImage: string;
    allowComments: boolean;
    content: any;
  }>({
    title: '',
    slug: '',
    status: 'draft',
    excerpt: '',
    featuredImage: '',
    allowComments: true,
    content: [],
  });

  const [isMediaOpen, setIsMediaOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        status: post.status,
        excerpt: post.excerpt || '',
        featuredImage: post.featuredImage || '',
        allowComments: post.allowComments,
        content: post.content || [],
      });
    }
  }, [post]);

  const handleSave = () => {
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    if (isNew) {
      createMutation.mutate(formData, {
        onSuccess: (data) => {
          toast.success('Post created');
          navigate(`/admin/posts/${data.data.id}`);
        },
        onError: () => toast.error('Failed to create post'),
      });
    } else {
      updateMutation.mutate({ id: id!, data: formData }, {
        onSuccess: () => toast.success('Post saved'),
        onError: () => toast.error('Failed to save post'),
      });
    }
  };

  const handleContentChange = (content: any) => {
    setFormData(prev => ({ ...prev, content }));
  };

  if (isPostLoading && !isNew) {
    return <div className="text-center py-12">Loading editor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/posts')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{isNew ? 'New Post' : 'Edit Post'}</h1>
          <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {formData.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFormData(p => ({ ...p, status: 'draft' }))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
          >
            Switch to Draft
          </button>
          <button 
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <input
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            className="w-full text-4xl font-bold border-none outline-none placeholder:text-gray-300"
          />
          
          <Editor initialContent={formData.content} onChange={handleContentChange} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Publishing</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
              <input 
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm font-mono text-gray-600"
                placeholder="auto-generated"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Featured Image</h3>
            {formData.featuredImage ? (
              <div className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img src={formData.featuredImage} alt="Featured" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                   <button 
                     onClick={() => setIsMediaOpen(true)}
                     className="px-3 py-1 bg-white text-gray-800 rounded-md text-sm font-medium"
                   >
                     Replace
                   </button>
                   <button 
                     onClick={() => setFormData(p => ({ ...p, featuredImage: '' }))}
                     className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium"
                   >
                     Remove
                   </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsMediaOpen(true)}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Set featured image</span>
              </button>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Excerpt</h3>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Write a short summary..."
            />
          </div>

          {/* Discussion */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Discussion</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.allowComments}
                onChange={(e) => setFormData(p => ({ ...p, allowComments: e.target.checked }))}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Allow comments</span>
            </label>
          </div>
        </div>
      </div>

      <MediaManager 
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        onSelect={(item) => setFormData(p => ({ ...p, featuredImage: item.url }))}
      />
    </div>
  );
}
