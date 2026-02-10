import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, User } from 'lucide-react';
import { api } from '@/lib/api';

export function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: () => api.get('/api/auth/me').then(res => res.user) });

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/api/auth/logout', {}),
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      navigate('/admin/login');
    },
  });

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          {user?.avatar ? (
             <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-gray-100" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        <button
          onClick={() => logoutMutation.mutate()}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
