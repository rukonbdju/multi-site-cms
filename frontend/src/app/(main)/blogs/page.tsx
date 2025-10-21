'use client';

import { useState, useMemo } from 'react';
import {
    Plus,
    Filter,
    Search,
    Eye,
    Edit,
    Archive,
    Trash2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import StatusBadge from '@/components/shared/status-badge';
import EmptyState from '@/components/blogs/empty-state';
import { mockPosts, mockSites, mockUsers } from '@/db/blogs';
import BlogPostCard from '@/components/blogs/blog-card';

// --- MAIN PAGE COMPONENT ---
export default function BlogManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [siteFilter, setSiteFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
                    <div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
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
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                        {paginatedPosts.map(post => {
                                            const site = getSite(post.siteId);
                                            const author = getUser(post.authorId);
                                            return (
                                                <tr key={post.id} className="hover:bg-gray-50/75 dark:hover:bg-slate-700/50 transition-colors group">
                                                    <td className="px-6 py-4 ">
                                                        <img className="h-10 w-16 object-cover rounded-md" src={post.coverImage} alt={post.title} />
                                                    </td>
                                                    <td className="px-6 py-4 max-w-sm">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.title}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.excerpt}</div>
                                                    </td>
                                                    <td className="px-6 py-4 ">
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
                                                        <div className="flex items-center justify-end gap-1">
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
                            <nav className="flex items-center justify-between border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6">
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

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {paginatedPosts.map(post => {
                                const site = getSite(post.siteId);
                                const author = getUser(post.authorId);
                                return (
                                    <BlogPostCard
                                        key={post.id}
                                        post={post}
                                        site={site}
                                        author={author}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                    />
                                );
                            })}
                            <nav className="flex items-center justify-between border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6 rounded-b-lg">
                                <div className="flex flex-1 justify-between">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Previous
                                    </button>
                                    <div className='flex items-center'>
                                        <p className="text-sm text-gray-700 dark:text-gray-400">
                                            <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> / <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                                        </p>
                                    </div>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Next
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>
                ) : (
                    <EmptyState onCreate={() => console.log('Create new post clicked!')} />
                )}

            </div>
        </div>
    );
}


