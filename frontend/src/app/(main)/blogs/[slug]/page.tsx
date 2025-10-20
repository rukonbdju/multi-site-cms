'use client';

import { useState, useEffect, useRef, FC, useCallback } from 'react';
import type { NextPage } from 'next';
import {
    ArrowLeft, Eye, Save, Trash2, MoreVertical, Image as ImageIcon,
    Tag as TagIcon, ChevronDown, X, Loader2, AlertCircle, Bold, Italic,
    Underline, List, ListOrdered, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Quote, Strikethrough, Link2,
    Type, Pilcrow, Link2Off, Edit3
} from 'lucide-react';

// --- DATA MODELS --- //
interface BlogPost {
    id: number;
    siteId: number;
    authorId: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
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
    avatar?: string;
}

// --- MOCK DATA --- //
const mockPost: BlogPost = {
    id: 1,
    siteId: 1,
    authorId: 1,
    title: 'Optimizing Performance in Next.js 14',
    slug: 'optimizing-performance-in-nextjs-14',
    excerpt: 'A deep dive into the latest performance optimization techniques available in Next.js 14, from server components to image handling.',
    content: '<h2>Introduction</h2><p>Next.js 14 introduces several groundbreaking features that can significantly boost your application\'s performance. In this post, we will explore:</p><ul><li>Server Components vs. Client Components</li><li>Advanced Image Optimization</li><li>Effective Caching Strategies</li></ul><p>By the end, you\'ll have a solid understanding of how to make your Next.js apps faster than ever.</p>',
    coverImage: `https://placehold.co/1600x900/6366f1/ffffff?text=Blog+Cover`,
    tags: ['Next.js', 'Performance', 'Web Dev', 'TypeScript'],
    status: 'published',
    createdAt: '2025-10-20T08:00:00Z',
    updatedAt: '2025-10-20T14:30:00Z',
};

const mockSite: Site = {
    id: 1,
    name: 'Dev Insights',
    domain: 'devinsights.com',
    logo: `https://placehold.co/100x100/1f2937/ffffff?text=DI`,
};

const mockUser: User = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
};


// --- UTILITY FUNCTIONS --- //
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// --- REUSABLE UI COMPONENTS --- //

const Card: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        {children}
    </div>
);

const Button: FC<{
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ children, onClick, variant = 'secondary', size = 'md', disabled = false, className = '', onMouseDown }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:ring-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-gray-400',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
        <button
            onClick={onClick}
            onMouseDown={onMouseDown}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ''} ${className}`}
        >
            {children}
        </button>
    );
};


const Input: FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
}> = ({ label, value, onChange, name, placeholder, className, icon }) => (
    <div className={`w-full ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

const Textarea: FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name: string;
    placeholder?: string;
    rows?: number;
    className?: string;
}> = ({ label, value, onChange, name, placeholder, rows = 4, className }) => (
    <div className={`w-full ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
    </div>
);

const Select: FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    children: React.ReactNode;
}> = ({ label, value, onChange, name, children }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
                {children}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-5 w-5 text-gray-400" />
            </span>
        </div>
    </div>
);

const TagInput: FC<{
    tags: string[];
    setTags: (tags: string[]) => void;
}> = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1.5 -mr-1 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200">
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag..."
                    className="flex-grow bg-transparent focus:outline-none text-sm p-1 dark:text-white"
                />
            </div>
        </div>
    );
};

const Skeleton: FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
);


// --- NATIVE RICH TEXT EDITOR --- //

const LinkModal: FC<{
    url: string;
    setUrl: (url: string) => void;
    onSave: () => void;
    onClose: () => void;
}> = ({ url, setUrl, onSave, onClose }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the input when the modal is opened
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="absolute top-full mt-1 z-20 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700 p-2 flex gap-2">
            <input
                ref={inputRef}
                type="text" value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onSave();
                    }
                }}
                className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-sm w-48 focus:outline-none" placeholder="Enter URL"
            />
            <Button size="sm" variant="primary" onClick={onSave}>Save</Button>
            <Button size="sm" variant="ghost" onClick={onClose}><X size={16} /></Button>
        </div>
    );
};

const RichTextEditor: FC<{ value: string; onChange: (html: string) => void; }> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [currentLinkNode, setCurrentLinkNode] = useState<HTMLAnchorElement | null>(null);
    const savedRange = useRef<Range | null>(null);

    // Sync editor content with the value prop
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleContentChange = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedRange.current = selection.getRangeAt(0);
        }
    };

    const restoreSelection = () => {
        if (savedRange.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(savedRange.current);
            savedRange.current = null;
        }
    };

    const applyStyle = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateActiveFormats();
        handleContentChange();
    };

    const findParentTag = (tagName: string): Element | null => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        let node = selection.getRangeAt(0).startContainer;
        while (node) {
            if (node.nodeName === tagName) return node as Element;
            if (node === editorRef.current) break;
            node = node.parentNode!;
        }
        return null;
    }

    const updateActiveFormats = useCallback(() => {
        if (isLinkModalOpen) return;

        const formats: Record<string, boolean> = {};
        const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'insertOrderedList', 'insertUnorderedList'];
        commands.forEach(cmd => {
            formats[cmd] = document.queryCommandState(cmd);
        });

        const blockType = document.queryCommandValue('formatBlock');
        formats[blockType] = true;
        formats['blockquote'] = blockType === 'blockquote';

        const linkNode = findParentTag('A');
        formats['link'] = !!linkNode;

        setActiveFormats(formats);
    }, [isLinkModalOpen]);

    useEffect(() => {
        const handleSelectionChange = () => {
            if (document.activeElement === editorRef.current) {
                updateActiveFormats();
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, [updateActiveFormats]);


    const ToolbarButton: FC<{ command: string; icon: React.ReactNode }> = ({ command, icon }) => {
        return (
            <Button
                variant="ghost" size="sm" className={`!p-2 ${activeFormats[command] ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200' : ''}`}
                onMouseDown={e => { e.preventDefault(); applyStyle(command); }}
            >
                {icon}
            </Button>
        );
    };

    const BlockButton: FC<{ format: string, icon: React.ReactNode }> = ({ format, icon }) => {
        const currentFormat = document.queryCommandValue('formatBlock');
        const isActive = currentFormat === format || (format === 'blockquote' && activeFormats.blockquote);

        return (
            <Button
                variant="ghost" size="sm" className={`!p-2 ${isActive ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200' : ''}`}
                onMouseDown={e => { e.preventDefault(); applyStyle('formatBlock', isActive ? 'p' : format); }}
            >
                {icon}
            </Button>
        )
    }

    const HeadingButton: FC<{ level: number, icon: React.ReactNode }> = ({ level, icon }) => {
        const tag = `h${level}`;
        const isActive = activeFormats[tag];
        return (
            <button
                onMouseDown={(e) => { e.preventDefault(); applyStyle('formatBlock', isActive ? 'p' : tag); }}
                className={`flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'text-indigo-600' : ''}`}
            >
                {icon} Heading {level}
            </button>
        )
    };

    const openLinkModal = () => {
        saveSelection();
        const linkNode = findParentTag('A');
        if (linkNode) {
            setCurrentLinkNode(linkNode as HTMLAnchorElement);
            setLinkUrl(linkNode.getAttribute('href') || '');
        } else {
            setCurrentLinkNode(null);
            setLinkUrl('https://');
        }
        setIsLinkModalOpen(true);
    };

    const handleLinkSave = () => {
        restoreSelection();
        editorRef.current?.focus();
        if (currentLinkNode) {
            currentLinkNode.href = linkUrl;
        } else {
            applyStyle('createLink', linkUrl);
        }
        setIsLinkModalOpen(false);
        setLinkUrl('');
        handleContentChange();
    };

    const removeLink = () => {
        applyStyle('unlink');
        updateActiveFormats();
        handleContentChange();
    }

    const Toolbar = () => {
        const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false);
        const ToolbarDivider = () => <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>;

        return (
            <div className="flex flex-wrap items-center p-1 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-t-md space-x-1 relative">
                <div className="relative">
                    <Button variant="ghost" size="sm" className="!p-2" onMouseDown={(e) => { e.preventDefault(); setIsHeadingDropdownOpen(!isHeadingDropdownOpen) }}><Type size={18} /></Button>
                    {isHeadingDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700 z-10 w-48">
                            <button onMouseDown={(e) => { e.preventDefault(); applyStyle('formatBlock', 'p'); setIsHeadingDropdownOpen(false); }} className={`flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}><Pilcrow size={16} className="mr-2" /> Paragraph</button>
                            <HeadingButton level={1} icon={<Heading1 size={16} className="mr-2" />} />
                            <HeadingButton level={2} icon={<Heading2 size={16} className="mr-2" />} />
                            <HeadingButton level={3} icon={<Heading3 size={16} className="mr-2" />} />
                            <HeadingButton level={4} icon={<Heading4 size={16} className="mr-2" />} />
                            <HeadingButton level={5} icon={<Heading5 size={16} className="mr-2" />} />
                            <HeadingButton level={6} icon={<Heading6 size={16} className="mr-2" />} />
                        </div>
                    )}
                </div>
                <ToolbarDivider />
                <ToolbarButton command="bold" icon={<Bold size={18} />} />
                <ToolbarButton command="italic" icon={<Italic size={18} />} />
                <ToolbarButton command="underline" icon={<Underline size={18} />} />
                <ToolbarButton command="strikeThrough" icon={<Strikethrough size={18} />} />
                <ToolbarDivider />
                <BlockButton format="blockquote" icon={<Quote size={18} />} />
                <ToolbarButton command="insertOrderedList" icon={<ListOrdered size={18} />} />
                <ToolbarButton command="insertUnorderedList" icon={<List size={18} />} />
                <ToolbarDivider />
                <div className="relative">
                    {activeFormats.link ? (
                        <div className="flex items-center">
                            <Button variant="ghost" size="sm" className="!p-2" onMouseDown={e => { e.preventDefault(); openLinkModal(); }}><Edit3 size={18} /></Button>
                            <Button variant="ghost" size="sm" className="!p-2" onMouseDown={e => { e.preventDefault(); removeLink(); }}><Link2Off size={18} /></Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="sm" className="!p-2" onMouseDown={e => { e.preventDefault(); openLinkModal(); }}><Link2 size={18} /></Button>
                    )}
                    {isLinkModalOpen && <LinkModal url={linkUrl} setUrl={setLinkUrl} onSave={handleLinkSave} onClose={() => setIsLinkModalOpen(false)} />}
                </div>
            </div>
        )
    };

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-md">
            <Toolbar />
            <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                onBlur={handleContentChange}
                onMouseUp={updateActiveFormats}
                onKeyUp={updateActiveFormats}
                className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
            />
        </div>
    );
};


// --- PAGE COMPONENT --- //
const BlogPostPage: NextPage = () => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Simulate fetching data
    useEffect(() => {
        const timer = setTimeout(() => {
            setPost({ ...mockPost });
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Check for unsaved changes
    useEffect(() => {
        if (!post) return;
        const hasChanged = JSON.stringify(post) !== JSON.stringify(mockPost);
        setHasChanges(hasChanged);
    }, [post]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!post) return;
        const { name, value } = e.target;

        const newPost = { ...post, [name]: value };

        if (name === 'title') {
            const oldSlug = slugify(post.title);
            if (post.slug === oldSlug || post.slug === '') {
                newPost.slug = slugify(value);
            }
        }

        setPost(newPost);
    };

    const handleTagsChange = (newTags: string[]) => {
        if (!post) return;
        setPost({ ...post, tags: newTags });
    };

    const handleContentChange = useCallback((content: string) => {
        setPost(prevPost => prevPost ? { ...prevPost, content } : null);
    }, []);

    const handleSave = () => {
        if (!post?.title || !post?.content) {
            alert("Title and Content cannot be empty.");
            return;
        }
        setIsSaving(true);
        console.log("Saving post:", post);
        setTimeout(() => {
            if (post) Object.assign(mockPost, post);
            setHasChanges(false);
            setIsSaving(false);
        }, 2000);
    };

    const handleCancel = () => {
        setPost({ ...mockPost });
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                <AlertCircle className="w-8 h-8 mr-2 text-red-500" />
                <h2 className="text-xl">Blog post not found.</h2>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .prose h1 {
                  font-size: 2em;
                  font-weight: 700;
                  margin-top: 2rem;
                  margin-bottom: 1.5rem;
                }
                .prose h2 {
                  font-size: 1.5em;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 1rem;
                }
                .prose h3 {
                  font-size: 1.25em;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 1rem;
                }
                .prose h4 {
                  font-size: 1.1em;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 1rem;
                }
                .prose h5 {
                  font-size: 1em;
                  font-weight: 600;
                  margin-top: 1rem;
                  margin-bottom: 0.5rem;
                }
                .prose h6 {
                  font-size: 0.9em;
                  font-weight: 600;
                  margin-top: 1rem;
                  margin-bottom: 0.5rem;
                }
                .prose p {
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                }
                .prose ul {
                  list-style-type: disc;
                  padding-left: 2rem;
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                }
                .prose ol {
                  list-style-type: decimal;
                  padding-left: 2rem;
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                }
                .prose li {
                  margin-top: 0.5rem;
                }
                .prose blockquote {
                  margin-top: 1.5rem;
                  margin-bottom: 1.5rem;
                  border-left: 4px solid #e5e7eb;
                  padding-left: 1rem;
                  font-style: italic;
                  color: #6b7280;
                }
                .prose a {
                  color: #4f46e5;
                  text-decoration: underline;
                }
                .dark .prose-invert h1, .dark .prose-invert h2, .dark .prose-invert h3, .dark .prose-invert h4, .dark .prose-invert h5, .dark .prose-invert h6, .dark .prose-invert p, .dark .prose-invert li, .dark .prose-invert a {
                    color: #d1d5db;
                }
                 .dark .prose-invert blockquote {
                  border-left-color: #4b5563;
                  color: #9ca3af;
                }
                .dark .prose-invert a {
                  color: #818cf8;
                }
            `}</style>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="!p-2">
                                    <ArrowLeft size={20} />
                                </Button>
                                <h1 className="text-xl font-semibold truncate" title={post.title}>{post.title}</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Eye size={16} className="mr-2" /> Preview
                                </Button>
                                <Button variant="secondary" size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
                                    {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button variant="ghost" size="sm" className="!p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                                    <Trash2 size={18} />
                                </Button>
                                <div className="relative">
                                    <Button variant="ghost" size="sm" className="!p-2">
                                        <MoreVertical size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                {post.coverImage ?
                                                    <img src={post.coverImage} alt="Cover" className="mx-auto h-48 w-auto rounded-md object-cover" /> :
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                }
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Input label="Post Title" name="title" value={post.title} onChange={handleInputChange} placeholder="Your Amazing Blog Post Title" />
                                    <Input label="Slug" name="slug" value={post.slug} onChange={handleInputChange} placeholder="your-amazing-post-slug" icon={<TagIcon className="h-4 w-4 text-gray-400" />} />
                                    <Textarea label="Excerpt" name="excerpt" value={post.excerpt} onChange={handleInputChange} placeholder="A short summary of the post..." rows={3} />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                        <RichTextEditor
                                            value={post.content}
                                            onChange={handleContentChange}
                                        />
                                    </div>
                                </div>
                            </Card>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Last updated on {formatDate(post.updatedAt)}</p>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Metadata</h3>
                                <div className="space-y-4">
                                    <Select label="Status" name="status" value={post.status} onChange={handleInputChange}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </Select>
                                    <TagInput tags={post.tags} setTags={handleTagsChange} />
                                </div>
                            </Card>
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Site</h3>
                                <div className="flex items-center gap-4">
                                    <img src={mockSite.logo} alt="Site Logo" className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700" />
                                    <div>
                                        <p className="font-semibold">{mockSite.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{mockSite.domain}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <h3 className="text-lg font-medium mb-4">Author</h3>
                                <div className="flex items-center gap-4">
                                    <img src={mockUser.avatar} alt="Author Avatar" className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{mockUser.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{mockUser.email}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                                    <p><strong>Created:</strong> {formatDate(post.createdAt)}</p>
                                    <p><strong>Updated:</strong> {formatDate(post.updatedAt)}</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>

                {/* Sticky Footer */}
                <footer className={`sticky bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-transform duration-300 ease-in-out border-t border-gray-200 dark:border-gray-700 ${hasChanges ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">You have unsaved changes.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Skeleton */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-6 w-48 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
                        <Skeleton className="h-48 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-24 w-full rounded-md" />
                        <Skeleton className="h-48 w-full rounded-md" />
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                        <Skeleton className="h-6 w-24 mb-4 rounded" />
                        <Skeleton className="h-10 w-full rounded" />
                        <Skeleton className="h-10 w-full rounded" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <Skeleton className="h-12 w-full rounded" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <Skeleton className="h-12 w-full rounded" />
                    </div>
                </div>
            </div>
        </main>
    </div>
);


export default BlogPostPage;

