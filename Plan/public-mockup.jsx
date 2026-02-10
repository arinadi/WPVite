import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Twitter, 
  Github, 
  Linkedin, 
  ChevronRight, 
  Calendar, 
  User, 
  ArrowLeft,
  Moon,
  Sun,
  MessageSquare,
  Clock
} from 'lucide-react';

// --- 1. MOCK DATA ---

const MOCK_SETTINGS = {
  title: 'WPVite',
  tagline: 'Modern Serverless CMS',
  logoUrl: null, 
  menus: {
    primary: [
      { label: 'Home', url: '/' },
      { label: 'Features', url: '/features' },
      { label: 'Blog', url: '/blog' },
      { label: 'About', url: '/about' },
    ],
    footer: [
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Terms of Service', url: '/tos' },
      { label: 'Contact', url: '/contact' },
    ]
  },
  socials: { twitter: '#', github: '#' }
};

const MOCK_POSTS = [
  {
    id: '1',
    title: 'Membangun CMS Serverless dengan React & Vite',
    slug: 'membangun-cms-serverless',
    excerpt: 'Panduan lengkap bagaimana kami merancang arsitektur WPVite menggunakan Vercel Functions dan Neon Database untuk performa maksimal.',
    content: `
      <p>Serverless architecture telah mengubah cara kita membangun web. Tidak ada lagi server yang harus di-maintain 24/7, kita hanya membayar apa yang kita gunakan.</p>
      <h3>Kenapa Serverless?</h3>
      <p>Alasan utamanya adalah skalabilitas dan biaya. Dengan menggunakan <strong>Vercel Functions</strong>, aplikasi kita bisa menangani traffic spike tanpa konfigurasi load balancer manual.</p>
      <blockquote>"Fokus pada kode, bukan infrastruktur." - Filosofi Modern DevOps</blockquote>
      <h3>Stack Teknologi</h3>
      <ul>
        <li>Frontend: React + Vite</li>
        <li>Database: Neon (PostgreSQL)</li>
        <li>ORM: Drizzle</li>
      </ul>
      <p>Arsitektur ini memungkinkan kita mencapai skor Lighthouse 100 karena konten di-render di server (SSR) dan dikirim sebagai HTML statis.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=1000',
    author: { name: 'Arinadi', avatar: 'https://i.pravatar.cc/150?u=arinadi' },
    publishedAt: '2023-10-25T10:00:00Z',
    category: 'Engineering',
    tags: ['Serverless', 'React', 'Vercel']
  },
  {
    id: '2',
    title: 'Masa Depan Web Development di 2024',
    slug: 'masa-depan-web-dev',
    excerpt: 'Trend terbaru dalam ekosistem JavaScript, pergeseran dari SPA ke Hybrid Rendering, dan kebangkitan AI dalam coding.',
    content: '<p>Lorem ipsum dolor sit amet...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000',
    author: { name: 'Sarah Tech', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    publishedAt: '2023-10-20T08:30:00Z',
    category: 'Trends',
    tags: ['JavaScript', 'AI', 'Future']
  },
  {
    id: '3',
    title: 'Optimasi SEO untuk Aplikasi React',
    slug: 'seo-react-app',
    excerpt: 'Mengapa Client-Side Rendering (CSR) buruk untuk SEO dan bagaimana Server-Side Rendering (SSR) menyelesaikan masalah tersebut.',
    content: '<p>Content SEO...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&q=80&w=1000',
    author: { name: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
    publishedAt: '2023-10-15T14:15:00Z',
    category: 'SEO',
    tags: ['Optimization', 'Google']
  },
  {
    id: '4',
    title: 'Minimalism in UI Design',
    slug: 'minimalism-ui',
    excerpt: 'Less is more. How to declutter your interface and focus on what matters most for your users.',
    content: '<p>Design content...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000',
    author: { name: 'Designer One', avatar: 'https://i.pravatar.cc/150?u=design' },
    publishedAt: '2023-10-10T09:00:00Z',
    category: 'Design',
    tags: ['UI/UX', 'Minimalism']
  }
];

// --- 2. SHARED COMPONENTS (Header, Footer, Sidebar) ---

const Header = ({ settings, isDarkMode, toggleTheme, onNavigate, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            W
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">
              {settings.title}
            </h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
              {settings.tagline}
            </p>
          </div>
        </div>

        {/* Right Side Wrapper: Nav + Search + Actions */}
        <div className="flex items-center gap-6 flex-grow justify-end">
          
          {/* Desktop Menu (Aligned Right) */}
          <nav className="hidden lg:flex items-center gap-6">
            {settings.menus.primary.map((item) => (
              <a 
                key={item.url} 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative group">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-1.5 bg-gray-100 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 w-48 transition-all group-hover:w-64"
            />
            <button type="submit" className="absolute right-3 top-1.5 text-gray-400 hover:text-blue-600">
              <Search size={16} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="p-2 text-gray-900 dark:text-white lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 p-4 shadow-xl z-50">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative md:hidden">
             <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-neutral-900 rounded-lg text-sm"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
          </form>
          <nav className="flex flex-col gap-4">
            {settings.menus.primary.map((item) => (
              <a 
                key={item.url} 
                href="#" 
                className="text-lg font-medium text-gray-800 dark:text-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer = ({ settings }) => (
  <footer className="bg-white dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 pt-16 pb-8 transition-colors duration-300">
    <div className="container mx-auto px-4">
      {/* Footer content simplified for brevity, same as before */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{settings.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            A modern, serverless CMS built for performance and developer experience. Powered by Vercel and Neon.
          </p>
        </div>
        {/* ... other columns */}
      </div>
      <div className="border-t border-gray-100 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>© 2023 {settings.title}. All rights reserved.</p>
        <p>Designed with <span className="text-red-500">♥</span> by ATechAsync</p>
      </div>
    </div>
  </footer>
);

const Sidebar = ({ posts, title = "Related Posts", onSearch, onPostClick }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(onSearch && query) onSearch(query);
  };

  return (
    <aside className="space-y-8 w-full">
      {/* Widget 1: Search */}
      <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Search size={18} /> Search
        </h3>
        <form onSubmit={handleSubmit} className="relative">
           <input 
             type="text" 
             placeholder="Type and hit enter..." 
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             className="w-full pl-4 pr-10 py-3 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
           />
           <button type="submit" className="absolute right-3 top-3 text-gray-400 hover:text-blue-600">
             <ArrowLeft size={18} className="rotate-180" />
           </button>
        </form>
      </div>

      {/* Widget 2: Post List */}
      <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
         <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-neutral-800 pb-2">
           {title}
         </h3>
         <div className="space-y-6">
           {posts.map(post => (
             <div key={post.id} className="group cursor-pointer flex gap-4 items-start" onClick={() => onPostClick(post)}>
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1">
                    {post.title}
                  </h4>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
             </div>
           ))}
         </div>
      </div>

      {/* Widget 3: Categories (Static) */}
      <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
         <h3 className="font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
         <div className="flex flex-wrap gap-2">
           {['Engineering', 'Design', 'SEO', 'Trends', 'Tutorials'].map(cat => (
             <span key={cat} className="px-3 py-1 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">
               {cat}
             </span>
           ))}
         </div>
      </div>
    </aside>
  );
};

// --- 3. TEMPLATES ---

const HomeTemplate = ({ posts, onPostClick }) => {
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      {/* Hero / Featured Section */}
      <section className="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Featured Post
              </div>
              <h2 
                className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onPostClick(featuredPost)}
              >
                {featuredPost.title}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-neutral-800" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white">{featuredPost.author.name}</p>
                    <p className="text-gray-500">{new Date(featuredPost.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div 
              className="order-1 md:order-2 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 cursor-pointer group"
              onClick={() => onPostClick(featuredPost)}
            >
              <img 
                src={featuredPost.featuredImage} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h3>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View Archive <ChevronRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map(post => (
            <article key={post.id} className="group bg-gray-50 dark:bg-neutral-950 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full">
              <div 
                className="aspect-video overflow-hidden cursor-pointer"
                onClick={() => onPostClick(post)}
              >
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">{post.category}</div>
                <h4 
                  className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onPostClick(post)}
                >
                  {post.title}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 mt-auto flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><User size={14} /> {post.author.name}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

const SingleTemplate = ({ post, onBack, onSearch, onPostClick, allPosts }) => {
  if (!post) return null;
  
  // Mock Related Posts: take 3 posts that aren't the current one
  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <article className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      
      {/* 1. Article Header (Full Width) */}
      <header className="pt-20 pb-16 container mx-auto px-4 text-left max-w-4xl">
        <button 
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex items-center justify-start gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest mb-6">
          <span>{post.category}</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-start gap-6 text-gray-500 dark:text-gray-400 text-sm">
           <div className="flex items-center gap-2">
             <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
             <span className="font-medium text-gray-900 dark:text-white">{post.author.name}</span>
           </div>
           <span>•</span>
           <time>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
      </header>

      {/* 2. Main Layout (Grid) */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            
            {/* Featured Image */}
            <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-xl mb-12">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              {/* Mock Filler */}
              <p>
                (Mock Content filler) Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-neutral-800">
               <div className="flex flex-wrap gap-2">
                 {post.tags.map(tag => (
                   <span key={tag} className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                     #{tag}
                   </span>
                 ))}
               </div>
            </div>

            {/* Author Box */}
            <div className="mt-12 p-8 bg-gray-50 dark:bg-neutral-950 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
               <img src={post.author.avatar} alt={post.author.name} className="w-20 h-20 rounded-full ring-4 ring-white dark:ring-neutral-900" />
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">About {post.author.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tech enthusiast and lead developer at WPVite. Loves building serverless applications and sharing knowledge with the community.</p>
               </div>
            </div>

            {/* Comments */}
            <div id="comments-wrapper" className="mt-16 pt-10 border-t border-gray-200 dark:border-neutral-800">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>
               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-6 text-center text-gray-600 dark:text-blue-200">
                  <MessageSquare className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Comments Widget (Giscus/Disqus) will be injected here.</p>
               </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
             <div className="sticky top-24">
                <Sidebar 
                   posts={relatedPosts} 
                   title="Related Posts" 
                   onSearch={onSearch} 
                   onPostClick={onPostClick}
                />
             </div>
          </div>

        </div>
      </div>
    </article>
  );
};

const SearchTemplate = ({ searchQuery, allPosts, onPostClick, onSearch }) => {
  // Simple Mock Filter
  const results = allPosts.filter(post => 
     post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sidebar data: "Most Read" (just random slice for mock)
  const mostReadPosts = allPosts.slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
       <div className="bg-gray-50 dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 py-16">
          <div className="container mx-auto px-4 text-center">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Search Results
             </h1>
             <p className="text-gray-500 dark:text-gray-400">
                Found {results.length} result(s) for "{searchQuery}"
             </p>
          </div>
       </div>

       <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             
             {/* Results List */}
             <div className="lg:col-span-2 space-y-8">
                {results.length > 0 ? (
                  results.map(post => (
                    <article key={post.id} className="flex flex-col md:flex-row gap-6 group cursor-pointer" onClick={() => onPostClick(post)}>
                       <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden">
                          <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                       </div>
                       <div className="flex-1 py-2">
                          <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">{post.category}</div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                             <User size={12} /> {post.author.name}
                             <span>•</span>
                             <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                       </div>
                    </article>
                  ))
                ) : (
                   <div className="text-center py-20 bg-gray-50 dark:bg-neutral-950 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800">
                      <Search size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
                      <p className="text-gray-500 text-sm">Try different keywords or check spelling.</p>
                   </div>
                )}
             </div>

             {/* Sidebar */}
             <div className="lg:col-span-1">
                <div className="sticky top-24">
                   <Sidebar 
                      posts={mostReadPosts} 
                      title="Most Read" 
                      onSearch={onSearch} 
                      onPostClick={onPostClick}
                   />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- 4. MAIN APP ---

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'single' | 'search'
  const [currentPost, setCurrentPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handlePostClick = (post) => {
    setCurrentPost(post);
    setView('single');
    window.scrollTo(0, 0);
  };

  const handleNavigateHome = () => {
    setView('home');
    setCurrentPost(null);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setView('search');
    window.scrollTo(0, 0);
  };

  return (
    <div className={`font-sans antialiased text-gray-900 dark:text-white ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        settings={MOCK_SETTINGS} 
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onNavigate={handleNavigateHome}
        onSearch={handleSearch}
      />
      
      {view === 'home' && (
        <HomeTemplate 
          posts={MOCK_POSTS} 
          settings={MOCK_SETTINGS} 
          onPostClick={handlePostClick} 
        />
      )}

      {view === 'single' && (
        <SingleTemplate 
          post={currentPost} 
          allPosts={MOCK_POSTS}
          settings={MOCK_SETTINGS}
          onBack={handleNavigateHome}
          onSearch={handleSearch}
          onPostClick={handlePostClick}
        />
      )}

      {view === 'search' && (
        <SearchTemplate 
          searchQuery={searchQuery}
          allPosts={MOCK_POSTS}
          onPostClick={handlePostClick}
          onSearch={handleSearch}
        />
      )}

      <Footer settings={MOCK_SETTINGS} />
    </div>
  );
}