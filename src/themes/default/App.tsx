import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function App({ type, data, siteOptions }: any) {
  const { site_title, tagline, site_logo } = siteOptions || {};

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Helmet>
        <title>{site_title ? `${site_title} - ${tagline}` : 'WPVite'}</title>
        <meta name="description" content={tagline || 'A WPVite Site'} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={site_title || 'WPVite'} />
        <meta property="og:description" content={tagline || 'A WPVite Site'} />
        {site_logo && <meta property="og:image" content={site_logo} />}
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={site_title || 'WPVite'} />
        <meta name="twitter:description" content={tagline || 'A WPVite Site'} />
        {site_logo && <meta name="twitter:image" content={site_logo} />}
      </Helmet>

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {site_logo ? (
              <img src={site_logo} alt={site_title} className="w-10 h-10 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                {site_title?.charAt(0) || 'W'}
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">{site_title || 'WPVite'}</h1>
              {tagline && <p className="text-xs text-gray-500">{tagline}</p>}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">About</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {type === 'home' && <Home posts={data.posts} />}
        {type === 'post' && <SinglePost post={data.post} />}
        {type === '404' && <NotFound />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {site_title}. Powered by WPVite.</p>
        </div>
      </footer>
    </div>
  );
}

export function Home({ posts }: any) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-20 text-gray-500">No posts found.</div>;
  }

  return (
    <div className="space-y-12">
      {posts.map((post: any) => (
        <article key={post.id} className="group">
          <Link to={`/p/${post.slug}`} className="block space-y-4">
            {post.featuredImage && (
              <div className="aspect-[2/1] bg-gray-100 rounded-2xl overflow-hidden">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                <span>&bull;</span>
                <span>{post.authorName}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function SinglePost({ post }: any) {
  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt || post.title} />
        
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        {post.featuredImage && <meta name="twitter:image" content={post.featuredImage} />}
      </Helmet>

      <header className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-500">
             {post.authorAvatar && <img src={post.authorAvatar} className="w-8 h-8 rounded-full" />}
             <span className="font-medium text-gray-900">{post.authorName}</span>
             <span>&bull;</span>
             <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {post.featuredImage && (
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
             <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="prose prose-lg prose-blue mx-auto">
         <BlockRenderer blocks={post.content} />
      </div>
    </article>
  );
}

export function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-500 mb-8">Page not found.</p>
      <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
    </div>
  );
}

function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!Array.isArray(blocks)) return null;

  return (
    <div className="space-y-4">
      {blocks.map((block: any) => {
        if (block.type === 'paragraph') {
          return <p key={block.id}>{renderInline(block.content)}</p>;
        }
        if (block.type === 'heading') {
           const Tag = `h${Math.min(block.props.level, 3)}` as any;
           return <Tag key={block.id}>{renderInline(block.content)}</Tag>;
        }
        if (block.type === 'image') {
          return (
            <figure key={block.id} className="my-8">
              <img src={block.props.url} alt={block.props.name} className="rounded-lg w-full" />
              {block.props.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.props.caption}</figcaption>}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}

function renderInline(content: any[]) {
  if (!content) return null;
  return content.map((span: any, i: number) => {
    if (span.type === 'text') {
      let text = <span key={i}>{span.text}</span>;
      if (span.styles.bold) text = <strong key={i}>{text}</strong>;
      if (span.styles.italic) text = <em key={i}>{text}</em>;
      return text;
    }
    if (span.type === 'link') {
      return <a key={i} href={span.href} className="text-blue-600 hover:underline">{span.content.map((c: any) => c.text).join('')}</a>;
    }
    return null;
  });
}
