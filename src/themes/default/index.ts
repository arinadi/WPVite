import type { ThemeConfig } from '@/types/theme';

// Placeholder templates — will be replaced with real implementations in Phase 4
const Placeholder = () => null;

const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default Theme',
  version: '1.0.0',
  author: 'ATechAsync',
  description: 'The default WPVite theme — clean, minimal, and SEO-optimized.',
  templates: {
    Home: Placeholder,
    Single: Placeholder,
    Page: Placeholder,
    NotFound: Placeholder,
  },
};

export default defaultTheme;
