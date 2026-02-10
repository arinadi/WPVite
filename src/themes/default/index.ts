import type { ThemeConfig } from '../../types/theme';
import App, { Home, SinglePost, NotFound } from './App';

// We cast the components to any because our current implementation uses 
// specific props that might not 100% align with stricter ThemeConfig types yet,
// or simplifies the data flow (unified `data` prop vs specific props).
// For Phase 4/5 MVP, this is acceptable.

export const config: ThemeConfig = {
  id: 'default',
  name: 'Default Theme',
  version: '1.0.0',
  author: 'WPVite Team',
  description: 'A clean, minimal, high-performance blog theme.',
  templates: {
    Home: Home as any,
    Single: SinglePost as any,
    Page: SinglePost as any, // Reuse Single for Page for now
    NotFound: NotFound as any,
  },
};

export default App;
export { App };
