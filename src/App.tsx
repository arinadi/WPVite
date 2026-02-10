import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Login } from './admin/pages/Login';
import { Setup } from './admin/pages/Setup';
import { Dashboard } from './admin/pages/Dashboard';
import { PostList } from './admin/pages/PostList';
import { PostEditor } from './admin/pages/PostEditor';
import { Media } from './admin/pages/Media';
import { Settings } from './admin/pages/Settings';
import { AdminLayout } from './admin/components/AdminLayout';
import { ProtectedRoute } from './admin/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/setup" element={<Setup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/posts" element={<PostList />} />
              <Route path="/admin/posts/:id" element={<PostEditor />} />
              <Route path="/admin/media" element={<Media />} />
              <Route path="/admin/settings" element={<Settings />} />
              {/* Fallback for admin routes */}
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          {/* Fallback for root to admin login for now (Phase 4 will add public routes) */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
