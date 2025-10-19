"use client";

import React, { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import { Edit, Settings, Trash2, Eye, Plus, Image as ImageIcon, ExternalLink } from 'lucide-react';

// --- DATA STRUCTURES & MOCK DATA ---

interface Site {
    id: number;
    name: string;
    domain: string;
    logo?: string;
    icon?: string;
    title: string;
    description: string;
    status: 'active' | 'disabled';
    createdAt: string;
    updatedAt: string;
}

interface Page {
    id: number;
    userId: number;
    siteId: number;
    slug: string;
    label: string;
    title?: string;
    description?: string;
    status: 'active' | 'disabled';
    createdAt: string;
    updatedAt: string;
}

const mockSite: Site = {
    id: 1,
    name: 'QuantumLeap',
    domain: 'quantumleap.ai',
    logo: undefined, // Let's use a placeholder
    title: 'QuantumLeap AI - The Future of Computation',
    description: 'A leading platform for next-generation AI research and development, providing tools and resources for developers.',
    status: 'active',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-27T14:30:00Z',
};

const mockPages: Page[] = [
    { id: 1, userId: 1, siteId: 1, label: 'Homepage', slug: '/', title: 'Welcome to QuantumLeap AI', description: 'The main landing page for our AI platform, showcasing key features and testimonials.', status: 'active', createdAt: '2023-10-26T11:00:00Z', updatedAt: '2023-10-27T09:00:00Z' },
    { id: 2, userId: 1, siteId: 1, label: 'About Us', slug: '/about', title: 'Our Mission and Team', description: 'Learn more about the team behind QuantumLeap and our vision for the future of artificial intelligence.', status: 'active', createdAt: '2023-10-26T12:00:00Z', updatedAt: '2023-10-26T18:00:00Z' },
    { id: 3, userId: 1, siteId: 1, label: 'Careers', slug: '/careers', title: 'Join Our Team', description: 'Explore open positions and discover why QuantumLeap is a great place to work.', status: 'disabled', createdAt: '2023-10-26T13:00:00Z', updatedAt: '2023-10-26T13:00:00Z' },
    { id: 4, userId: 1, siteId: 1, label: 'Blog', slug: '/blog', title: 'Latest News and Insights', description: 'Read our latest articles on AI trends, company updates, and technical deep dives.', status: 'active', createdAt: '2023-10-27T08:00:00Z', updatedAt: '2023-10-27T12:45:00Z' },
    { id: 5, userId: 1, siteId: 1, label: 'Contact', slug: '/contact', title: 'Get In Touch', description: 'Have a question? Reach out to our team through our contact form.', status: 'active', createdAt: '2023-10-27T10:00:00Z', updatedAt: '2023-10-27T10:00:00Z' },
];

// To test the empty state, you can use this instead:
// const mockPages: Page[] = [];

// --- HELPER FUNCTIONS ---

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// --- REUSABLE UI COMPONENTS ---

const Card: FC<{ children: ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader: FC<{ children: ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

const CardTitle: FC<{ children: ReactNode }> = ({ children }) => (
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">{children}</h2>
);

const CardDescription: FC<{ children: ReactNode }> = ({ children }) => (
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{children}</p>
);

const CardContent: FC<{ children: ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`p-4 sm:p-6 ${className}`}>{children}</div>
);

const Button: FC<{ children: ReactNode, variant?: 'default' | 'destructive' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'icon', className?: string, onClick?: () => void }> = ({ children, variant = 'default', size = 'md', className = '', onClick }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variantClasses = {
        default: "bg-gray-900 text-white hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        outline: "border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    const sizeClasses = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        icon: "h-10 w-10",
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

const Badge: FC<{ children: ReactNode, variant: 'active' | 'disabled' }> = ({ children, variant }) => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    const variantClasses = {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        disabled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return <span className={`${baseClasses} ${variantClasses[variant]}`}>{children}</span>;
};

// --- MAIN PAGE COMPONENT ---

export default function SiteDetailsPage({ params }: { params: { id: string } }) {
    // In a real app, you would fetch site and pages data based on params.id
    const site = mockSite;
    const pages = mockPages;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

                {/* Section 1: Site Information */}
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                {site.logo ? (
                                    <img src={site.logo} alt={`${site.name} logo`} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center flex-wrap gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold">{site.title}</h1>
                                    <Badge variant={site.status}>
                                        {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                                    </Badge>
                                </div>
                                <a
                                    href={`https://${site.domain}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                >
                                    {site.domain}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-0 sm:mr-2" />
                                <span className="hidden sm:inline">Edit Site</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Settings className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{site.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-500 dark:text-gray-400">Site Name</span>
                                <p className="font-medium">{site.name}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-500 dark:text-gray-400">Status</span>
                                <p className="font-medium capitalize">{site.status}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-500 dark:text-gray-400">Created Date</span>
                                <p className="font-medium">{formatDate(site.createdAt)}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                                <p className="font-medium">{formatDate(site.updatedAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Pages List */}
                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full">
                            <CardTitle>Pages</CardTitle>
                            <CardDescription>A list of all pages associated with this site.</CardDescription>
                        </div>
                        <Button className="self-end sm:self-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            New Page
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {pages.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {pages.map(page => (
                                    <div key={page.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col justify-between space-y-3 transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{page.label}</p>
                                                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400" title={`${site.domain}${page.slug}`}>{`${site.domain}${page.slug}`}</p>
                                                </div>
                                                <Badge variant={page.status}>
                                                    {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={page.title}>{page.title || 'No title'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 h-8">{page.description || 'No description provided.'}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {formatDate(page.updatedAt)}</p>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View Page"><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit Page"><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 h-8 w-8" aria-label="Delete Page"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No pages found for this site.</h3>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating your first page.</p>
                                <Button className="mt-6">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Page
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

// Note: In a real Next.js 14 App router project, you might want to add metadata
// export const metadata: Metadata = {
//   title: 'Site Details | CMS Dashboard',
//   description: 'Manage your site details and pages.',
// };

