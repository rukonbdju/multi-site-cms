//user schema
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    address?: string;
    status: 'Active' | 'Inactive';
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

//site schema
export interface Site {
    id: number;
    userId: number; //FK
    name: string;
    domain: string; //unique
    logo?: string;
    icon?: string;
    title: string;
    description: string;
    status: string; //default disable
    createdAt: string; //auto on create
    updatedAt: string; //auto on update
}

//site layout 
export interface SiteLayout {
    id: number;
    siteId: number; // FK
    column: number; // default  1
    navbar?: number; // FK section id
    footer?: number; // FK section id
}

//page schema
export interface Page {
    id: number;
    userId: number; // FK
    siteId: number; // FK
    slug: string;
    label: string;
    status: string; //default disable
    createdAt: string; //auto on create
    updatedAt: string; //auto on update
}

//component group
export interface ComponentGroup {
    id: number
    group: string;
}

//component
export interface Component {
    id: number;
    groupId: number;
    defaultContent: Record<string, unknown>;
}

//section 
export interface Section {
    id: number;
    componentId: number;
    content: Record<string, unknown>
}

//page section
export interface PageSection {
    id: number;
    pageId: number;
    order: number;
    sectionId: number;
}

//media
export interface Media {
    id: number;
    siteId: number;         // Which site this media belongs to
    userId: number;         // Who uploaded it
    fileName: string;       // hero-banner.jpg
    fileType: string;       // image/jpeg
    url: string;            // https://cdn.example.com/uploads/hero-banner.jpg
    storagePath: string     // /uploads/2025/hero-banner.jpg
    size: number;           // bytes
    width: number;          // optional for images/videos
    height: number;         // optional for images/videos
    duration: null,         // optional for videos/audio
    altText: string;        // Hero banner showing main product
    caption: string;        //'Our main hero banner image',
    tags: string[];         //['homepage', 'banner']
    isPublic: boolean,
    createdAt: string;      //auto on create
    updatedAt: string;      //auto on update
}

