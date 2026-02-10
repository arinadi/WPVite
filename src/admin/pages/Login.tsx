import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { api } from '@/lib/api';

export function Login() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/api/auth/me').then(res => res.user).catch(() => null),
    retry: false,
  });

  if (isLoading) return null; // Or loading spinner

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center space-y-8">
        <div className="space-y-2">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-blue-600/20">
            W
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to WPVite</h1>
          <p className="text-gray-500">Sign in to access your dashboard</p>
        </div>

        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 group"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          <span>Continue with Google</span>
        </a>

        <p className="text-xs text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
