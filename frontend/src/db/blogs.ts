import { BlogPost, Site, User } from "@/components/blogs/types";

export const mockSites: Site[] = [
    { id: 1, name: 'TechNova', domain: 'technova.com', logo: 'https://placehold.co/40x40/7c3aed/ffffff?text=T' },
    { id: 2, name: 'EcoWorld', domain: 'ecoworld.org', logo: 'https://placehold.co/40x40/16a34a/ffffff?text=E' },
    { id: 3, name: 'FinanceFeed', domain: 'financefeed.net', logo: 'https://placehold.co/40x40/db2777/ffffff?text=F' },
];

export const mockUsers: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

export const mockPosts: BlogPost[] = [
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