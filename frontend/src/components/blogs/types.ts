export interface BlogPost {
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

export interface Site {
    id: number;
    name: string;
    domain: string;
    logo?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface BlogPostCardProps {
    post: BlogPost;
    site?: Site;
    author?: User;
    openMenuId: number | null;
    setOpenMenuId: (id: number | null) => void;
}