import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    PaintBucket,
    Users,
    Settings,
    Plus,
    Search,
    Filter,
    MessageSquare,
    ExternalLink,
    Menu as MenuIcon,
    ChevronDown,
    ChevronRight,
    Bold,
    Italic,
    List,
    Heading,
    Link as LinkIcon,
    Upload,
    X,
    Globe,
    Monitor
} from 'lucide-react';

// --- Mock Data ---

const MOCK_POSTS = [
    { id: 1, title: 'Hello World!', author: 'Admin', category: 'Uncategorized', date: '2023-10-25', status: 'Published' },
    { id: 2, title: 'Cara Deploy WPVite ke Vercel', author: 'Arinadi', category: 'Tutorial', date: '2023-10-26', status: 'Published' },
    { id: 3, title: 'Kenapa Serverless?', author: 'Arinadi', category: 'Opinion', date: '2023-10-27', status: 'Draft' },
    { id: 4, title: 'React vs PHP untuk SEO', author: 'Admin', category: 'Tech', date: '2023-10-28', status: 'Published' },
    { id: 5, title: 'Setup Neon Database', author: 'Dev', category: 'Database', date: '2023-10-29', status: 'Trash' },
];

const MOCK_MEDIA = [
    { id: 1, url: 'https://placehold.co/150x150/222/white?text=Img1', name: 'hero-bg.jpg' },
    { id: 2, url: 'https://placehold.co/150x150/333/white?text=Img2', name: 'logo.png' },
    { id: 3, url: 'https://placehold.co/150x150/444/white?text=Img3', name: 'screenshot.jpg' },
    { id: 4, url: 'https://placehold.co/150x150/555/white?text=Img4', name: 'avatar.png' },
    { id: 5, url: 'https://placehold.co/150x150/666/white?text=Img5', name: 'banner.png' },
    { id: 6, url: 'https://placehold.co/150x150/777/white?text=Img6', name: 'icon.svg' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, isActive, onClick, hasSubmenu, isOpen, children }) => (
    <div>
        <div
            onClick={onClick}
            className={`
        group flex items-center justify-between px-3 py-2 cursor-pointer text-sm font-medium transition-colors
        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-neutral-800 hover:text-blue-400'}
      `}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{label}</span>
            </div>
            {hasSubmenu && (
                <div className={`text-[10px] text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={14} />
                </div>
            )}
        </div>
        {/* Submenu rendering */}
        {hasSubmenu && isOpen && (
            <div className="bg-neutral-950 pl-10 py-1 space-y-1">
                {children}
            </div>
        )}
    </div>
);

const SubmenuItem = ({ label, active, onClick }) => (
    <div
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`
      cursor-pointer text-xs py-1 transition-colors
      ${active ? 'text-white font-medium' : 'text-gray-500 hover:text-blue-400'}
    `}
    >
        {label}
    </div>
);

const Button = ({ children, primary, className, ...props }) => (
    <button
        className={`
      px-3 py-1.5 text-sm font-medium rounded border transition-colors flex items-center gap-2
      ${primary
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-500'
                : 'bg-neutral-800 border-neutral-700 text-blue-400 hover:border-blue-500 hover:text-blue-300'}
      ${className}
    `}
        {...props}
    >
        {children}
    </button>
);

const Input = ({ className, ...props }) => (
    <input
        className={`
      bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
      ${className}
    `}
        {...props}
    />
);

const Select = ({ className, children, ...props }) => (
    <select
        className={`
      bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-1.5 
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
      ${className}
    `}
        {...props}
    >
        {children}
    </select>
);

// --- Pages ---

const DashboardPage = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-light text-gray-100">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* At a Glance Widget */}
            <div className="col-span-1 md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-sm p-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 bg-neutral-800">
                    At a Glance
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                            <FileText size={16} /> <span>12 Posts</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FileText size={16} /> <span>3 Pages</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                            <MessageSquare size={16} /> <span>45 Comments</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            WPVite 1.0 running on Vercel
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Draft Widget */}
            <div className="col-span-1 md:col-span-2 bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-700 font-semibold text-gray-300 bg-neutral-800">
                    Quick Draft
                </div>
                <div className="p-4 space-y-3">
                    <Input placeholder="Title" className="w-full" />
                    <textarea
                        className="w-full bg-neutral-900 border border-neutral-700 text-gray-200 text-sm rounded px-3 py-2 h-24 focus:outline-none focus:border-blue-500"
                        placeholder="What's on your mind?"
                    ></textarea>
                    <Button>Save Draft</Button>
                </div>
            </div>
        </div>
    </div>
);

const PostsPage = ({ onNavigate }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl font-light text-gray-100">Posts</h1>
            <Button onClick={() => onNavigate('editor')} primary className="!py-1 !px-2 text-xs">Add New</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-800 p-2 rounded-sm border border-neutral-700">
            <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium">All (12)</span> |
                <span className="cursor-pointer hover:text-blue-300">Published (10)</span> |
                <span className="cursor-pointer hover:text-blue-300">Drafts (1)</span> |
                <span className="cursor-pointer hover:text-blue-300 text-red-400">Trash (1)</span>
            </div>
            <div className="flex items-center gap-2">
                <Input placeholder="Search posts..." />
                <Button>Search</Button>
            </div>
        </div>

        {/* Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-neutral-900 text-gray-200 uppercase text-xs font-semibold">
                    <tr>
                        <th className="p-3 w-8"><input type="checkbox" className="accent-blue-600" /></th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Author</th>
                        <th className="p-3">Categories</th>
                        <th className="p-3">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                    {MOCK_POSTS.map(post => (
                        <tr key={post.id} className="group hover:bg-neutral-750 transition-colors">
                            <td className="p-3"><input type="checkbox" className="accent-blue-600" /></td>
                            <td className="p-3">
                                <div className="text-blue-400 font-medium text-base mb-1 cursor-pointer hover:underline" onClick={() => onNavigate('editor')}>{post.title}</div>
                                <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-blue-400 cursor-pointer hover:underline">Edit</span> |
                                    <span className="text-blue-400 cursor-pointer hover:underline">Quick Edit</span> |
                                    <span className="text-red-400 cursor-pointer hover:underline">Trash</span> |
                                    <span className="text-blue-400 cursor-pointer hover:underline">View</span>
                                </div>
                            </td>
                            <td className="p-3 text-blue-400">{post.author}</td>
                            <td className="p-3 text-blue-400">{post.category}</td>
                            <td className="p-3">
                                <div className={`text-xs ${post.status === 'Published' ? 'text-green-400' : 'text-yellow-500'}`}>{post.status}</div>
                                <div>{post.date}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const EditorPage = () => (
    <div className="flex flex-col h-full overflow-hidden">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-light text-gray-100">Edit Post</h1>
        </div>

        <div className="flex gap-6 h-full">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                <Input
                    className="text-3xl font-bold bg-neutral-900 border-none px-4 py-3 placeholder-gray-600"
                    placeholder="Add title"
                />

                {/* Editor Toolbar */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-t-md p-2 flex gap-2 sticky top-0 z-10">
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Plus size={18} /></button>
                    <div className="w-px h-6 bg-neutral-700 mx-1"></div>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Bold size={18} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Italic size={18} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><LinkIcon size={18} /></button>
                    <div className="w-px h-6 bg-neutral-700 mx-1"></div>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><Heading size={18} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><List size={18} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded"><ImageIcon size={18} /></button>
                </div>

                {/* Editor Body (Visual Placeholder for BlockNote) */}
                <div className="bg-neutral-900 border border-neutral-700 border-t-0 rounded-b-md p-8 min-h-[500px] text-gray-300 font-serif text-lg leading-relaxed cursor-text">
                    <p className="mb-4">Welcome to the new editing experience. Use <code className="bg-neutral-800 px-1 rounded text-sm text-blue-300">/</code> to trigger the command menu.</p>
                    <p className="mb-4 text-gray-500 italic">Start writing or type '/' to choose a block</p>

                    <div className="border border-blue-500/30 bg-blue-500/10 p-4 rounded my-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-gray-400">
                            <ImageIcon size={16} />
                        </div>
                        <span className="text-gray-400 text-sm">Image block placeholder</span>
                    </div>
                </div>
            </div>

            {/* Sidebar Settings */}
            <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">

                {/* Publish Panel */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                    <div className="px-3 py-2 border-b border-neutral-700 font-medium text-sm text-gray-200">Publish</div>
                    <div className="p-3 space-y-3 text-sm text-gray-400">
                        <div className="flex justify-between items-center">
                            <span>Status:</span>
                            <span className="font-bold text-gray-200">Draft</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Visibility:</span>
                            <span className="font-bold text-gray-200">Public</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Revisions:</span>
                            <span className="font-bold text-gray-200">3</span>
                        </div>
                    </div>
                    <div className="px-3 py-2 border-t border-neutral-700 bg-neutral-800/50 flex justify-between items-center">
                        <button className="text-red-400 text-sm hover:underline">Move to Trash</button>
                        <Button primary>Publish</Button>
                    </div>
                </div>

                {/* Categories Panel */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                    <div className="px-3 py-2 border-b border-neutral-700 font-medium text-sm text-gray-200">Categories</div>
                    <div className="p-3 max-h-40 overflow-y-auto space-y-2">
                        {['Uncategorized', 'Technology', 'Tutorial', 'News', 'Opinion'].map(cat => (
                            <label key={cat} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer">
                                <input type="checkbox" className="accent-blue-600 rounded bg-neutral-700 border-neutral-600" />
                                {cat}
                            </label>
                        ))}
                    </div>
                    <div className="px-3 py-2 border-t border-neutral-700">
                        <button className="text-blue-400 text-sm underline flex items-center gap-1">+ Add New Category</button>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                    <div className="px-3 py-2 border-b border-neutral-700 font-medium text-sm text-gray-200">Featured Image</div>
                    <div className="p-3">
                        <div className="bg-neutral-900 border-2 border-dashed border-neutral-700 rounded h-32 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 cursor-pointer transition-colors">
                            <ImageIcon size={24} className="mb-2" />
                            <span className="text-xs">Set featured image</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

const MediaPage = () => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl font-light text-gray-100">Media Library</h1>
            <Button primary className="!py-1 !px-2 text-xs">Add New</Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-800 p-2 rounded-sm border border-neutral-700">
            <div className="flex items-center gap-2">
                <button className="p-1 text-gray-200"><LayoutDashboard size={18} /></button>
                <button className="p-1 text-gray-500 hover:text-gray-200"><List size={18} /></button>
                <div className="w-px h-4 bg-neutral-600 mx-2"></div>
                <select className="bg-neutral-900 text-gray-300 border border-neutral-700 text-xs p-1 rounded">
                    <option>All media items</option>
                    <option>Images</option>
                    <option>Audio</option>
                </select>
                <select className="bg-neutral-900 text-gray-300 border border-neutral-700 text-xs p-1 rounded">
                    <option>All dates</option>
                    <option>October 2023</option>
                </select>
                <Button className="!py-1 !px-2 text-xs">Bulk Select</Button>
            </div>
            <Input placeholder="Search media items..." className="!py-1" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {/* Upload Placeholder */}
            <div className="aspect-square border-2 border-dashed border-neutral-700 rounded bg-neutral-800 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-400 cursor-pointer group">
                <Upload size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                <span className="text-xs font-medium">Drop files to upload</span>
            </div>

            {MOCK_MEDIA.map(media => (
                <div key={media.id} className="relative aspect-square bg-neutral-800 border border-neutral-700 cursor-pointer group overflow-hidden">
                    <img src={media.url} alt={media.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 border-4 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {media.name}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MenusPage = () => (
    <div className="space-y-4">
        <h1 className="text-2xl font-light text-gray-100">Menus</h1>

        <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-sm flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-400">Select a menu to edit:</span>
            <select className="bg-neutral-900 text-gray-300 border border-neutral-700 text-sm p-1 rounded w-48">
                <option>Main Menu (Primary)</option>
                <option>Footer Menu</option>
            </select>
            <Button>Select</Button>
            <span className="text-sm text-gray-400 ml-4">or <a href="#" className="text-blue-400 hover:underline">create a new menu</a>.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* (Simplified for brevity as this page was complete) */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-neutral-800 border border-neutral-700">
                    <div className="flex justify-between items-center p-3 bg-neutral-800 border-b border-neutral-700">
                        <span className="font-semibold text-sm text-gray-300">Pages</span>
                    </div>
                    <div className="p-3 bg-neutral-900">
                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                            <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" className="accent-blue-600" /> Home</label>
                            <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" className="accent-blue-600" /> About</label>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-neutral-700">
                            <Button className="!py-1 !px-2 text-xs">Add to Menu</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
                    <div className="bg-neutral-800 p-3 border-b border-neutral-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-300">Menu Name</span>
                            <Input defaultValue="Main Menu" className="!py-1 !w-40" />
                        </div>
                        <Button primary className="!py-1 !px-3">Save Menu</Button>
                    </div>
                    <div className="p-4 bg-neutral-900 min-h-[300px] flex items-center justify-center text-gray-500">
                        Menu Structure Area
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SettingsPage = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-light text-gray-100">Settings</h1>

        {/* General Settings */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
            <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                General Settings
            </div>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400">Site Title</label>
                    <div className="md:col-span-2">
                        <Input defaultValue="WPVite" className="w-full md:w-1/2" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="text-sm text-gray-400">Tagline</label>
                    <div className="md:col-span-2">
                        <Input defaultValue="Just another WPVite site" className="w-full md:w-2/3" />
                    </div>
                </div>
            </div>
        </div>

        {/* Discussion Settings (New Request) */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
            <div className="px-4 py-3 border-b border-neutral-700 font-medium text-gray-200">
                Discussion Settings
            </div>
            <div className="p-4 space-y-6">

                {/* Enable/Disable Toggle */}
                <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 accent-blue-600 w-4 h-4" defaultChecked />
                    <div>
                        <label className="text-sm text-gray-200 font-medium">Allow people to submit comments on new posts</label>
                        <p className="text-xs text-gray-500 mt-1">
                            (These settings may be overridden for individual posts.)
                        </p>
                    </div>
                </div>

                <hr className="border-neutral-700" />

                {/* Comment Provider Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="text-sm text-gray-400 pt-2">Comment Service</label>
                    <div className="md:col-span-2 space-y-4">
                        <Select className="w-full md:w-1/2">
                            <option value="giscus">Giscus (GitHub Discussions)</option>
                            <option value="disqus">Disqus</option>
                        </Select>
                        <p className="text-xs text-gray-500">
                            Choose the external service to handle comments. Giscus is recommended for developer blogs (no tracking). Disqus is better for general audiences.
                        </p>
                    </div>
                </div>

                {/* Conditional Config (Visual only) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="text-sm text-gray-400 pt-2">Giscus Configuration</label>
                    <div className="md:col-span-2 space-y-2">
                        <Input placeholder="username/repo" className="w-full" />
                        <p className="text-xs text-gray-500">
                            Enter your GitHub repository (e.g., <code>atechasync/wpvite-comments</code>). Ensure the Giscus app is installed on the repo.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
                    <label className="text-sm text-gray-400 pt-2">Disqus Shortname</label>
                    <div className="md:col-span-2 space-y-2">
                        <Input placeholder="example-site" className="w-full md:w-1/2" disabled />
                    </div>
                </div>

            </div>
            <div className="px-4 py-3 border-t border-neutral-700 bg-neutral-800 flex justify-end">
                <Button primary>Save Changes</Button>
            </div>
        </div>
    </div>
);

// --- Layout & Main App ---

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for collapsible menus
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleSubmenu = (key) => {
        setExpandedMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Simple Router
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <DashboardPage />;
            case 'posts': return <PostsPage onNavigate={setCurrentPage} />;
            case 'editor': return <EditorPage />;
            case 'media': return <MediaPage />;
            case 'menus': return <MenusPage />;
            case 'settings': return <SettingsPage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col font-sans text-gray-300">

            {/* Admin Top Bar (Fixed) */}
            <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <div className="md:hidden cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <MenuIcon size={20} />
                    </div>
                    <div className="flex items-center gap-2 text-gray-100 font-semibold cursor-pointer hover:text-blue-400 transition-colors">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">W</div>
                        <span className="hidden sm:inline">WPVite</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Visit Site</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-300">Howdy, <span className="font-semibold">Admin</span></span>
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-xs">
                        AD
                    </div>
                </div>
            </div>

            <div className="flex pt-12 min-h-screen">

                {/* Sidebar Navigation */}
                <div className={`
          w-40 bg-neutral-950 flex-shrink-0 fixed md:sticky top-12 bottom-0 left-0 h-[calc(100vh-3rem)] overflow-y-auto z-40
          transition-transform duration-300 border-r border-neutral-800
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
                    <div className="py-2">
                        <SidebarItem
                            icon={LayoutDashboard} label="Dashboard"
                            isActive={currentPage === 'dashboard'}
                            onClick={() => setCurrentPage('dashboard')}
                        />
                        <SidebarItem
                            icon={FileText} label="Posts"
                            isActive={currentPage === 'posts' || currentPage === 'editor'}
                            onClick={() => setCurrentPage('posts')}
                            hasSubmenu
                            isOpen={expandedMenus['posts']}
                        >
                            <SubmenuItem label="All Posts" active={currentPage === 'posts'} onClick={() => setCurrentPage('posts')} />
                            <SubmenuItem label="Add New" active={currentPage === 'editor'} onClick={() => setCurrentPage('editor')} />
                            <SubmenuItem label="Categories" onClick={() => { }} />
                        </SidebarItem>

                        <SidebarItem
                            icon={ImageIcon} label="Media"
                            isActive={currentPage === 'media'}
                            onClick={() => setCurrentPage('media')}
                        />

                        <SidebarItem icon={FileText} label="Pages" />

                        <div className="my-2 h-px bg-neutral-800"></div>

                        {/* Expanded Logic for Appearance */}
                        <SidebarItem
                            icon={PaintBucket} label="Appearance"
                            isActive={currentPage === 'menus'}
                            // Toggle logic: clicking opens submenu, doesn't necessarily navigate unless item clicked
                            onClick={() => toggleSubmenu('appearance')}
                            hasSubmenu
                            isOpen={expandedMenus['appearance']}
                        >
                            <SubmenuItem label="Themes" onClick={() => { }} />
                            <SubmenuItem label="Menus" active={currentPage === 'menus'} onClick={() => setCurrentPage('menus')} />
                        </SidebarItem>

                        <SidebarItem icon={Users} label="Users" />

                        {/* Expanded Logic for Settings */}
                        <SidebarItem
                            icon={Settings} label="Settings"
                            isActive={currentPage === 'settings'}
                            onClick={() => toggleSubmenu('settings')}
                            hasSubmenu
                            isOpen={expandedMenus['settings']}
                        >
                            <SubmenuItem label="General" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
                            <SubmenuItem label="Reading" onClick={() => setCurrentPage('settings')} />
                            <SubmenuItem label="Discussion" onClick={() => setCurrentPage('settings')} />
                        </SidebarItem>
                    </div>

                    <div className="absolute bottom-0 w-full p-2 border-t border-neutral-800 bg-neutral-950 text-center">
                        <button className="text-gray-500 hover:text-blue-400 text-xs flex items-center justify-center gap-1 w-full">
                            <div className="border border-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-[8px]"><ChevronRight size={10} /></div>
                            <span>Collapse</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-neutral-900 p-4 md:p-8 overflow-x-hidden w-full">
                    {renderPage()}
                </div>

            </div>

            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

        </div>
    );
}