import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState<any>({});

  const { data, isLoading } = useQuery({
    queryKey: ['options'],
    queryFn: () => api.get('/api/options').then(res => res.data),
  });

  // Sync data on load
  if (data && Object.keys(formData).length === 0) {
    setFormData(data);
  }

  const saveMutation = useMutation({
    mutationFn: (data: any) => api.put('/api/options', data),
    onSuccess: () => toast.success('Settings saved'),
    onError: () => toast.error('Failed to save settings'),
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
          <nav className="flex flex-col">
            {[
              { id: 'identity', label: 'Site Identity' },
              { id: 'discussion', label: 'Discussion' },
              { id: 'theme', label: 'Theme' },
              { id: 'users', label: 'User Manager' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left px-6 py-4 font-medium text-sm border-l-4 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 bg-white text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'identity' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Site Identity</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input
                  type="text"
                  value={formData.site_title || ''}
                  onChange={(e) => handleChange('site_title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <div className="flex gap-2">
                   <input
                    type="text"
                    value={formData.site_logo || ''}
                    onChange={(e) => handleChange('site_logo', e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    placeholder="https://..."
                  />
                  {/* Future: Add Media Manager trigger here */}
                </div>
                {formData.site_logo && (
                  <div className="mt-2 p-2 border rounded w-fit">
                    <img src={formData.site_logo} alt="Logo Preview" className="h-12 object-contain" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Discussion Settings</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
                Configure your comment provider here. Currently supporting Giscus and Disqus.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment Provider</label>
                <select
                  value={formData.comment_provider || 'none'}
                  onChange={(e) => handleChange('comment_provider', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="none">None (Disabled)</option>
                  <option value="giscus">Giscus (GitHub Discussions)</option>
                  <option value="disqus">Disqus</option>
                </select>
              </div>

              {formData.comment_provider === 'giscus' && (
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giscus Repository</label>
                    <input
                      type="text"
                      value={formData.giscus_repo || ''}
                      onChange={(e) => handleChange('giscus_repo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="username/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Repo ID</label>
                    <input
                      type="text"
                      value={formData.giscus_repo_id || ''}
                      onChange={(e) => handleChange('giscus_repo_id', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.giscus_category || ''}
                      onChange={(e) => handleChange('giscus_category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {formData.comment_provider === 'disqus' && (
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disqus Shortname</label>
                    <input
                      type="text"
                      value={formData.disqus_shortname || ''}
                      onChange={(e) => handleChange('disqus_shortname', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="your-site-shortname"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'theme' && (
             <div className="space-y-6 animate-in fade-in duration-200">
               <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Theme Selection</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Default Theme Card */}
                 <div className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${formData.active_theme === 'default' ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => handleChange('active_theme', 'default')}>
                   <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-400">
                     <span className="font-bold text-2xl">Default</span>
                   </div>
                   <div className="p-4">
                     <div className="flex justify-between items-center mb-2">
                       <h4 className="font-bold text-gray-900">Default Theme</h4>
                       {formData.active_theme === 'default' && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">Active</span>}
                     </div>
                     <p className="text-sm text-gray-500">Clean, minimal, high-performance blog theme.</p>
                   </div>
                 </div>

                 {/* Custom Theme Placeholder */}
                 <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-center text-gray-400">
                   <p className="font-medium">More / Custom Themes</p>
                   <p className="text-sm mt-1">Add themes to `src/themes/`</p>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">User Management</h3>
              <p className="text-gray-500 text-sm">
                Managing users here allows them to log in with their Google account.
              </p>
              
              {/* User List & Add Form would go here - using Users API */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
                User management UI coming soon. Use database to manage manually for now or use API directly.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
