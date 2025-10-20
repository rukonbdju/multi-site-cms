'use client';

import { useState, useMemo } from 'react';
import type { FC, SVGProps } from 'react';
import {
    Plus,
    Filter,
    Search,
    Eye,
    Edit,
    Archive,
    Trash2,
    FileText,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// --- TYPESCRIPT INTERFACES ---
interface BlogPost {
    id: number;
    siteId: number;
    authorId: number;
    title: string;
    slug: string;
    excerpt: string;
    status: 'draft' | 'published' | 'archived';
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
}

interface Site {
    id: number;
    name: string;
    domain: string;
    logo?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

// --- MOCK DATA ---
const mockSites: Site[] = [
    { id: 1, name: 'TechNova', domain: 'technova.com', logo: 'https://placehold.co/40x40/7c3aed/ffffff?text=T' },
    { id: 2, name: 'EcoWorld', domain: 'ecoworld.org', logo: 'https://placehold.co/40x40/16a34a/ffffff?text=E' },
    { id: 3, name: 'FinanceFeed', domain: 'financefeed.net', logo: 'https://placehold.co/40x40/db2777/ffffff?text=F' },
];

const mockUsers: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

const mockPosts: BlogPost[] = [
    { id: 1, siteId: 1, authorId: 1, title: 'The Future of AI in Web Development', slug: 'future-of-ai', excerpt: 'Exploring how AI is reshaping the landscape of web development...', status: 'published', coverImage: 'https://placehold.co/100x60/a78bfa/ffffff', createdAt: '2024-10-26', updatedAt: '2024-10-27' },
    { id: 2, siteId: 2, authorId: 2, title: 'Sustainable Living: 10 Easy Tips', slug: 'sustainable-living', excerpt: 'Simple changes you can make for a more eco-friendly lifestyle.', status: 'published', coverImage: 'https://placehold.co/100x60/86efac/ffffff', createdAt: '2024-10-25', updatedAt: '2024-10-25' },
    { id: 3, siteId: 3, authorId: 3, title: 'Q3 Market Analysis and Predictions', slug: 'q3-market-analysis', excerpt: 'A deep dive into the financial markets of the last quarter.', status: 'draft', coverImage: 'https://placehold.co/100x60/f9a8d4/ffffff', createdAt: '2024-10-24', updatedAt: '2024-10-26' },
    { id: 4, siteId: 1, authorId: 1, title: 'Getting Started with Next.js 14', slug: 'nextjs-14-guide', excerpt: 'A comprehensive guide to the latest features in Next.js.', status: 'published', coverImage: 'https://placehold.co/100x60/a78bfa/ffffff', createdAt: '2024-10-22', updatedAt: '2024-10-23' },
    { id: 5, siteId: 2, authorId: 2, title: 'The Importance of Urban Green Spaces', slug: 'urban-green-spaces', excerpt: 'How parks and gardens improve city life and the environment.', status: 'archived', coverImage: 'https://placehold.co/100x60/86efac/ffffff', createdAt: '2024-09-15', updatedAt: '2024-10-01' },
    { id: 6, siteId: 3, authorId: 3, title: 'Cryptocurrency Trends to Watch in 2025', slug: 'crypto-trends-2025', excerpt: 'What to expect from the volatile world of digital currencies.', status: 'draft', coverImage: 'https://placehold.co/100x60/f9a8d4/ffffff', createdAt: '2024-10-28', updatedAt: '2024-10-28' },
    { id: 7, siteId: 1, authorId: 1, title: 'Mastering TypeScript for Large-Scale Apps', slug: 'mastering-typescript', excerpt: 'Best practices for using TypeScript in enterprise applications.', status: 'published', coverImage: 'https://placehold.co/100x60/a78bfa/ffffff', createdAt: '2024-10-20', updatedAt: '2024-10-21' },
    { id: 8, siteId: 2, authorId: 1, title: 'Community Gardening Initiatives', slug: 'community-gardening', excerpt: 'How local gardening projects are bringing communities together.', status: 'published', coverImage: 'https://placehold.co/100x60/86efac/ffffff', createdAt: '2024-10-18', updatedAt: '2024-10-19' },
    { id: 9, siteId: 1, authorId: 2, title: 'Server Components vs. Client Components', slug: 'server-vs-client-components', excerpt: 'Understanding the key differences in the new React paradigm.', status: 'archived', coverImage: 'https://placehold.co/100x60/a78bfa/ffffff', createdAt: '2024-09-30', updatedAt: '2024-10-05' },
    { id: 10, siteId: 3, authorId: 3, title: 'Retirement Planning for Millennials', slug: 'retirement-planning-millennials', excerpt: 'Strategies for building a solid nest egg in the modern economy.', status: 'published', coverImage: 'https://placehold.co/100x60/f9a8d4/ffffff', createdAt: '2024-10-15', updatedAt: '2024-10-15' },
];


/* // --- ICON COMPONENTS (from lucide-react) ---
// Using inline SVGs for simplicity in a single file component
const Plus: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const Filter: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const Search: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const Eye: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const Edit: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const Archive: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>
);
const Trash2: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const FileText: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);
const ChevronLeft: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRight: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
); */

// --- UI COMPONENTS ---

const StatusBadge: FC<{ status: BlogPost['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const styles = {
        published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return (
        <span className={`${baseClasses} ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const EmptyState: FC<{ onCreate: () => void }> = ({ onCreate }) => (
    <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No blog posts yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first post.</p>
        <div className="mt-6">
            <button
                onClick={onCreate}
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
                <Plus className="h-4 w-4" />
                Create New Post
            </button>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
export default function BlogManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [siteFilter, setSiteFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(true);

    const POSTS_PER_PAGE = 5;

    const filteredPosts = useMemo(() => {
        return mockPosts
            .filter(post => {
                const searchLower = searchTerm.toLowerCase();
                return post.title.toLowerCase().includes(searchLower) || post.excerpt.toLowerCase().includes(searchLower);
            })
            .filter(post => siteFilter === 'all' || post.siteId === parseInt(siteFilter))
            .filter(post => statusFilter === 'all' || post.status === statusFilter);
    }, [searchTerm, siteFilter, statusFilter]);

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // Helper to get site/user info
    const getSite = (id: number) => mockSites.find(s => s.id === id);
    const getUser = (id: number) => mockUsers.find(u => u.id === id);

    return (
        <div className="bg-gray-50/50 dark:bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full mx-auto">

                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Blog Management</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and review all blog posts across your sites.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Plus className="h-4 w-4" />
                            New Post
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex sm:hidden items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </header>

                {/* Filter Bar */}
                <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                        <div className="relative col-span-1 md:col-span-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200"
                            />
                        </div>
                        <select
                            value={siteFilter}
                            onChange={(e) => setSiteFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200"
                        >
                            <option value="all">All Sites</option>
                            {mockSites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200"
                        >
                            <option value="all">All Statuses</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Blog Posts Table / Content Area */}
                {paginatedPosts.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cover</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {paginatedPosts.map(post => {
                                        const site = getSite(post.siteId);
                                        const author = getUser(post.authorId);
                                        return (
                                            <tr key={post.id} className="hover:bg-gray-50/75 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img className="h-10 w-16 object-cover rounded-md" src={post.coverImage} alt={post.title} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{post.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{post.excerpt}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <img className="h-6 w-6 rounded-full" src={site?.logo} alt={site?.name} />
                                                        <span className="text-sm text-gray-800 dark:text-gray-300">{site?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{author?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={post.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.createdAt}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{post.updatedAt}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"><Eye className="h-4 w-4" /></button>
                                                        <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"><Edit className="h-4 w-4" /></button>
                                                        <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"><Archive className="h-4 w-4" /></button>
                                                        <button className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <nav className="flex items-center justify-between border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button onClick={handlePrevPage} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        Showing <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * POSTS_PER_PAGE + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)}</span> of{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">{filteredPosts.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button onClick={handlePrevPage} disabled={currentPage === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-slate-600">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </nav>

                    </div>
                ) : (
                    <EmptyState onCreate={() => console.log('Create new post clicked!')} />
                )}

            </div>
        </div>
    );
}


