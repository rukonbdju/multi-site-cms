"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
    Folder, FolderPlus, Upload, Search, LayoutGrid, List,
    ChevronRight, MoreVertical, Image as ImageIcon, FileText,
    Film, Music, FileArchive, File as FileIcon, X, Download,
    Edit3, Trash2, Copy, CheckCircle, AlertTriangle, Info, Loader2,
    HardDriveUpload, GripVertical
} from 'lucide-react';

// --- DATA MODELS ---

interface Media {
    id: number;
    siteId: number;
    userId: number;
    fileName: string;
    fileType: string; // e.g., "image/png", "application/pdf"
    url: string;
    storagePath: string;
    size: number; // in bytes
    width?: number;
    height?: number;
    duration?: number;
    altText?: string;
    caption?: string;
    tags?: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

interface MediaFolder {
    id: number;
    name: string;
    parentId?: number | null; // null for root
    createdAt: string;
    updatedAt: string;
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    icon: React.ReactElement;
}

type ViewMode = 'grid' | 'list';
type MediaItemType = Media | MediaFolder;

// --- MOCK DATA ---

const MOCK_FOLDERS: MediaFolder[] = [
    { id: 1, name: "Documents", parentId: null, createdAt: "2023-10-26T10:00:00Z", updatedAt: "2023-10-26T10:00:00Z" },
    { id: 2, name: "Images", parentId: null, createdAt: "2023-10-26T10:01:00Z", updatedAt: "2023-10-26T10:01:00Z" },
    { id: 3, name: "Reports", parentId: 1, createdAt: "2023-10-26T11:00:00Z", updatedAt: "2023-10-26T11:00:00Z" },
    { id: 4, name: "User Avatars", parentId: 2, createdAt: "2023-10-26T12:00:00Z", updatedAt: "2023-10-26T12:00:00Z" },
    { id: 5, name: "Videos", parentId: null, createdAt: "2023-10-27T09:00:00Z", updatedAt: "2023-10-27T09:00:00Z" },
];

const MOCK_MEDIA: Media[] = [
    {
        id: 101, siteId: 1, userId: 1, fileName: "annual-report-2023.pdf", fileType: "application/pdf",
        url: "https://placehold.co/api/file/pdf", storagePath: "/docs/annual-report-2023.pdf", size: 5242880,
        altText: "2023 Annual Report", createdAt: "2023-10-26T11:05:00Z", updatedAt: "2023-10-26T11:05:00Z", isPublic: false,
        tags: ["report", "finance", "2023"]
    },
    {
        id: 102, siteId: 1, userId: 2, fileName: "mountain-landscape.jpg", fileType: "image/jpeg",
        url: "https://placehold.co/600x400/55689c/ffffff?text=Mountain", storagePath: "/img/mountain-landscape.jpg", size: 2097152,
        width: 1920, height: 1080, altText: "A beautiful mountain landscape", createdAt: "2023-10-26T10:15:00Z", updatedAt: "2023-10-26T10:15:00Z", isPublic: true,
        tags: ["nature", "landscape", "wallpaper"]
    },
    {
        id: 103, siteId: 1, userId: 1, fileName: "user-avatar-jane.png", fileType: "image/png",
        url: "https://placehold.co/400x400/94a3b8/ffffff?text=Jane", storagePath: "/img/avatars/user-avatar-jane.png", size: 512000,
        width: 400, height: 400, altText: "Avatar for Jane Doe", createdAt: "2023-10-26T12:01:00Z", updatedAt: "2023-10-26T12:01:00Z", isPublic: true,
        tags: ["avatar", "user"]
    },
    {
        id: 104, siteId: 1, userId: 1, fileName: "company-logo.svg", fileType: "image/svg+xml",
        url: "https://placehold.co/300x100/f87171/ffffff?text=LOGO", storagePath: "/img/company-logo.svg", size: 15360,
        width: 300, height: 100, altText: "Company Logo", createdAt: "2023-10-26T10:05:00Z", updatedAt: "2023-10-26T10:05:00Z", isPublic: true,
        tags: ["logo", "brand"]
    },
    {
        id: 105, siteId: 1, userId: 3, fileName: "product-demo.mp4", fileType: "video/mp4",
        url: "https://placehold.co/api/file/mp4", storagePath: "/vid/product-demo.mp4", size: 26214400,
        width: 1280, height: 720, duration: 120, altText: "Product demonstration video", createdAt: "2023-10-27T09:05:00Z", updatedAt: "2023-10-27T09:05:00Z", isPublic: false,
        tags: ["demo", "product", "video"]
    },
];

// --- HELPER FUNCTIONS ---

/**
 * Formats file size from bytes to a readable string (KB, MB, GB).
 */
const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Returns a lucide-react icon based on the file's MIME type.
 */
const getFileTypeIcon = (fileType: string): React.ReactElement => {
    if (fileType.startsWith('image/')) {
        return <ImageIcon className="w-full h-full text-blue-500" />;
    }
    if (fileType.startsWith('video/')) {
        return <Film className="w-full h-full text-red-500" />;
    }
    if (fileType.startsWith('audio/')) {
        return <Music className="w-full h-full text-purple-500" />;
    }
    if (fileType === 'application/pdf') {
        return <FileText className="w-full h-full text-red-600" />;
    }
    if (fileType.startsWith('application/zip') || fileType.startsWith('application/x-rar')) {
        return <FileArchive className="w-full h-full text-yellow-600" />;
    }
    return <FileIcon className="w-full h-full text-gray-500" />;
};

/**
 * Simulates an API call with a delay.
 */
const fakeApiCall = (delay = 500) => new Promise(resolve => setTimeout(resolve, delay));

// --- MAIN PAGE COMPONENT ---

export default function MediaPage() {

    // --- STATE ---
    const [folders, setFolders] = useState<MediaFolder[]>(MOCK_FOLDERS);
    const [media, setMedia] = useState<Media[]>(MOCK_MEDIA);
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false); // For file drag-over
    const [toasts, setToasts] = useState<Toast[]>([]);

    // --- DERIVED STATE ---

    /**
     * Calculates the breadcrumb path based on the current folder ID.
     */
    const breadcrumbPath = useMemo(() => {
        const path: MediaFolder[] = [];
        let currentId = currentFolderId;
        while (currentId !== null) {
            const folder = folders.find(f => f.id === currentId);
            if (folder) {
                path.unshift(folder);
                currentId = folder.parentId ?? null;
            } else {
                currentId = null; // Folder not found, break
            }
        }
        return path;
    }, [currentFolderId, folders]);

    /**
     * Filters folders and media based on the current folder ID and search term.
     */
    const currentItems = useMemo(() => {
        const currentFolders = folders.filter(f => (f.parentId ?? null) === currentFolderId);

        // In a real app, you'd filter media by folderId from the API.
        // Here, we'll just show media based on folder for demonstration.
        let currentMedia: Media[] = [];
        if (currentFolderId === null) {
            // Root: Show media *not* in a subfolder (or all, for this mock)
            // Let's show items 102, 104
            currentMedia = media.filter(m => [102, 104].includes(m.id));
        } else if (currentFolderId === 1) {
            // Documents folder - show nothing (report is in subfolder 3)
            currentMedia = [];
        } else if (currentFolderId === 2) {
            // Images folder - show nothing (avatar is in subfolder 4)
            currentMedia = [];
        } else if (currentFolderId === 3) {
            // Reports subfolder
            currentMedia = media.filter(m => m.id === 101);
        } else if (currentFolderId === 4) {
            // User Avatars subfolder
            currentMedia = media.filter(m => m.id === 103);
        } else if (currentFolderId === 5) {
            // Videos folder
            currentMedia = media.filter(m => m.id === 105);
        }

        const allItems: MediaItemType[] = [...currentFolders, ...currentMedia];

        if (!searchTerm) {
            return allItems;
        }

        return allItems.filter(item =>
            'name' in item
                ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
                : item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [currentFolderId, folders, media, searchTerm]);

    // --- TOAST NOTIFICATION HANDLERS ---

    const addToast = (message: string, type: Toast['type']) => {
        const id = Date.now();
        const icon = {
            success: <CheckCircle className="text-green-500" />,
            error: <AlertTriangle className="text-red-500" />,
            info: <Info className="text-blue-500" />,
        }[type];
        setToasts(prev => [...prev, { id, message, type, icon }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // --- EVENT HANDLERS ---

    const handleFolderClick = (folder: MediaFolder) => {
        setCurrentFolderId(folder.id);
        setSelectedItem(null);
    };

    const handleFileClick = (file: Media) => {
        setSelectedItem(file);
        setIsDetailsDrawerOpen(true);
    };

    const handleBreadcrumbClick = (folderId: number | null) => {
        setCurrentFolderId(folderId);
        setSelectedItem(null);
    };

    const handleSelectItem = (item: MediaItemType) => {
        if (selectedItem?.id === item.id) {
            setSelectedItem(null); // Deselect
        } else {
            setSelectedItem(item);
            if ('fileName' in item) {
                setIsDetailsDrawerOpen(true);
            } else {
                setIsDetailsDrawerOpen(false);
            }
        }
    };

    const handleCreateFolder = async (name: string) => {
        if (!name.trim()) {
            addToast("Folder name cannot be empty", "error");
            return;
        }
        await fakeApiCall();
        const newFolder: MediaFolder = {
            id: Date.now(),
            name,
            parentId: currentFolderId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setFolders(prev => [...prev, newFolder]);
        setIsNewFolderModalOpen(false);
        addToast(`Folder "${name}" created`, "success");
    };

    const handleUploadFiles = async (files: FileList) => {
        if (files.length === 0) return;

        setIsUploadModalOpen(false);
        addToast(`Uploading ${files.length} file(s)...`, "info");

        await fakeApiCall(1500); // Simulate upload time

        const newMediaItems: Media[] = Array.from(files).map((file, i) => ({
            id: Date.now() + i,
            siteId: 1,
            userId: 1, // Mock user
            fileName: file.name,
            fileType: file.type,
            url: URL.createObjectURL(file), // Temporary URL for preview
            storagePath: `/${currentFolderId || 'root'}/${file.name}`,
            size: file.size,
            // Mock dimensions for images
            width: file.type.startsWith("image/") ? 1024 : undefined,
            height: file.type.startsWith("image/") ? 768 : undefined,
            isPublic: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        // This is a mock. In a real app, you'd add these to the `media` state
        // associated with the `currentFolderId`.
        // For this demo, we'll just log them and show a success toast.
        console.log("Uploaded new media items:", newMediaItems);
        // setMedia(prev => [...prev, ...newMediaItems]); // <-- Uncomment to add to state
        addToast(`${files.length} file(s) uploaded successfully!`, "success");
        // Note: To make them appear, you'd need to adjust the filtering logic in `currentItems`
    };

    const handleDeleteItem = async () => {
        if (!selectedItem) return;

        await fakeApiCall();

        const itemName = 'name' in selectedItem ? selectedItem.name : selectedItem.fileName;

        if ('fileName' in selectedItem) {
            // It's a Media file
            setMedia(prev => prev.filter(m => m.id !== selectedItem.id));
        } else {
            // It's a Folder
            // Note: In a real app, you'd check if the folder is empty first.
            setFolders(prev => prev.filter(f => f.id !== selectedItem.id));
        }

        addToast(`"${itemName}" was deleted.`, "success");
        setIsDetailsDrawerOpen(false);
        setSelectedItem(null);
    };

    const handleRenameItem = async (newName: string) => {
        if (!selectedItem || !newName.trim()) {
            addToast("Invalid name", "error");
            return;
        }

        await fakeApiCall();

        const oldName = 'name' in selectedItem ? selectedItem.name : selectedItem.fileName;

        if ('fileName' in selectedItem) {
            // Rename Media file
            setMedia(prev => prev.map(m =>
                m.id === selectedItem.id ? { ...m, fileName: newName, updatedAt: new Date().toISOString() } : m
            ));
            setSelectedItem(prev => prev ? { ...prev, fileName: newName } as Media : null);
        } else {
            // Rename Folder
            setFolders(prev => prev.map(f =>
                f.id === selectedItem.id ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f
            ));
            setSelectedItem(prev => prev ? { ...prev, name: newName } as MediaFolder : null);
        }

        addToast(`Renamed "${oldName}" to "${newName}"`, "success");
    };

    // --- DRAG & DROP HANDLERS ---

    const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUploadFiles(files);
            e.dataTransfer.clearData();
        }
    };

    // --- RENDER ---

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">

            {/* Header Bar */}
            <MediaHeader
                onNewFolderClick={() => setIsNewFolderModalOpen(true)}
                onUploadClick={() => setIsUploadModalOpen(true)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs path={breadcrumbPath} onClick={handleBreadcrumbClick} />

            {/* Main Content Area */}
            <main
                className="flex-1 overflow-auto p-4 md:p-6 relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragging && <UploadDropzoneOverlay />}

                <MediaGrid
                    items={currentItems}
                    viewMode={viewMode}
                    onFolderClick={handleFolderClick}
                    onFileClick={handleFileClick}
                    onSelectItem={handleSelectItem}
                    selectedItem={selectedItem}
                    addToast={addToast}
                />

                {currentItems.length === 0 && !isDragging && (
                    <EmptyState onUploadClick={() => setIsUploadModalOpen(true)} />
                )}

            </main>

            {/* Modals & Drawers */}
            <NewFolderModal
                isOpen={isNewFolderModalOpen}
                onClose={() => setIsNewFolderModalOpen(false)}
                onCreate={handleCreateFolder}
            />

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUploadFiles}
            />

            {selectedItem && 'fileName' in selectedItem && (
                <DetailsDrawer
                    file={selectedItem as Media}
                    isOpen={isDetailsDrawerOpen}
                    onClose={() => {
                        setIsDetailsDrawerOpen(false);
                        setSelectedItem(null);
                    }}
                    onDelete={handleDeleteItem}
                    onRename={handleRenameItem}
                    addToast={addToast}
                />
            )}

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

// --- SUB-COMPONENTS ---

/**
 * Header component with title, search, and action buttons.
 */
const MediaHeader: React.FC<{
    onNewFolderClick: () => void;
    onUploadClick: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}> = ({ onNewFolderClick, onUploadClick, searchTerm, onSearchChange, viewMode, onViewModeChange }) => {
    return (
        <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            aria-label="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                            aria-label="List View"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <button
                        onClick={onNewFolderClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FolderPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Folder</span>
                    </button>
                    <button
                        onClick={onUploadClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Upload</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

/**
 * Breadcrumbs navigation component.
 */
const Breadcrumbs: React.FC<{
    path: MediaFolder[];
    onClick: (folderId: number | null) => void;
}> = ({ path, onClick }) => {
    return (
        <nav className="flex-shrink-0 flex items-center gap-1.5 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 text-sm font-medium">
            <button
                onClick={() => onClick(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                All Files
            </button>
            {path.map(folder => (
                <React.Fragment key={folder.id}>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    <button
                        onClick={() => onClick(folder.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        {folder.name}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

/**
 * Grid/List layout for rendering media items and folders.
 */
const MediaGrid: React.FC<{
    items: MediaItemType[];
    viewMode: ViewMode;
    onFolderClick: (folder: MediaFolder) => void;
    onFileClick: (file: Media) => void;
    onSelectItem: (item: MediaItemType) => void;
    selectedItem: MediaItemType | null;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ items, viewMode, onFolderClick, onFileClick, onSelectItem, selectedItem, addToast }) => {
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
                {items.map(item =>
                    'name' in item ? (
                        <FolderItemGrid
                            key={`folder-${item.id}`}
                            folder={item}
                            onClick={onFolderClick}
                            onSelect={onSelectItem}
                            isSelected={selectedItem?.id === item.id}
                            addToast={addToast}
                        />
                    ) : (
                        <MediaItemGrid
                            key={`media-${item.id}`}
                            file={item}
                            onClick={onFileClick}
                            onSelect={onSelectItem}
                            isSelected={selectedItem?.id === item.id}
                            addToast={addToast}
                        />
                    )
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                <div className="col-span-6 flex items-center gap-2">
                    <GripVertical className="w-4 h-4 invisible" /> Name
                </div>
                <div className="col-span-2 hidden md:block">Size</div>
                <div className="col-span-4 hidden sm:block">Date Modified</div>
            </div>
            {items.map(item =>
                'name' in item ? (
                    <FolderItemList
                        key={`folder-${item.id}`}
                        folder={item}
                        onClick={onFolderClick}
                        onSelect={onSelectItem}
                        isSelected={selectedItem?.id === item.id}
                        addToast={addToast}
                    />
                ) : (
                    <MediaItemList
                        key={`media-${item.id}`}
                        file={item}
                        onClick={onFileClick}
                        onSelect={onSelectItem}
                        isSelected={selectedItem?.id === item.id}
                        addToast={addToast}
                    />
                )
            )}
        </div>
    );
};

// --- GRID ITEM COMPONENTS ---

const FolderItemGrid: React.FC<{
    folder: MediaFolder;
    onClick: (folder: MediaFolder) => void;
    onSelect: (folder: MediaFolder) => void;
    isSelected: boolean;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ folder, onClick, onSelect, isSelected, addToast }) => {

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onClick(folder); // Double click action on Enter
        } else if (e.key === ' ') {
            e.preventDefault(); // Prevent scrolling
            onSelect(folder);
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(folder)}
            onDoubleClick={() => onClick(folder)}
            onKeyDown={handleKeyDown}
            className={`relative group rounded-lg p-2 aspect-square flex flex-col items-center justify-center text-center cursor-pointer focus:outline-none transition-all
        ${isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md'
                }`}
        >
            <Folder className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500" />
            <span className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200 truncate w-full px-1">
                {folder.name}
            </span>
            <ItemActions item={folder} addToast={addToast} />
        </div>
    );
};

const MediaItemGrid: React.FC<{
    file: Media;
    onClick: (file: Media) => void;
    onSelect: (file: Media) => void;
    isSelected: boolean;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ file, onClick, onSelect, isSelected, addToast }) => {

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onClick(file); // Double click action on Enter
        } else if (e.key === ' ') {
            e.preventDefault(); // Prevent scrolling
            onSelect(file);
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(file)}
            onDoubleClick={() => onClick(file)}
            onKeyDown={handleKeyDown}
            className={`relative group rounded-lg aspect-square overflow-hidden cursor-pointer focus:outline-none transition-all
        ${isSelected
                    ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md'
                }`}
        >
            {file.fileType.startsWith("image/") ? (
                <img
                    src={file.url}
                    alt={file.altText || file.fileName}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400/f87171/ffffff?text=Error"; }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800">
                    <div className="w-1/2 h-1/2">
                        {getFileTypeIcon(file.fileType)}
                    </div>
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <span className="text-xs font-medium text-white truncate w-full block">
                    {file.fileName}
                </span>
            </div>
            <ItemActions item={file} addToast={addToast} />
        </div>
    );
};

// --- LIST ITEM COMPONENTS ---

const FolderItemList: React.FC<{
    folder: MediaFolder;
    onClick: (folder: MediaFolder) => void;
    onSelect: (folder: MediaFolder) => void;
    isSelected: boolean;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ folder, onClick, onSelect, isSelected, addToast }) => {
    return (
        <div
            onClick={() => onSelect(folder)}
            onDoubleClick={() => onClick(folder)}
            className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg cursor-pointer transition-colors relative group
        ${isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
        >
            <div className="col-span-6 flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{folder.name}</span>
            </div>
            <div className="col-span-2 hidden md:block text-sm text-gray-500 dark:text-gray-400">--</div>
            <div className="col-span-4 hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                {new Date(folder.updatedAt).toLocaleDateString()}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <ItemActions item={folder} addToast={addToast} />
            </div>
        </div>
    );
};

const MediaItemList: React.FC<{
    file: Media;
    onClick: (file: Media) => void;
    onSelect: (file: Media) => void;
    isSelected: boolean;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ file, onClick, onSelect, isSelected, addToast }) => {
    return (
        <div
            onClick={() => onSelect(file)}
            onDoubleClick={() => onClick(file)}
            className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg cursor-pointer transition-colors relative group
        ${isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
        >
            <div className="col-span-6 flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="w-8 h-8 flex-shrink-0 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
                    {file.fileType.startsWith("image/") ? (
                        <img src={file.url} alt={file.fileName} className="w-full h-full object-cover rounded-sm" />
                    ) : (
                        <div className="w-full h-full p-0.5">{getFileTypeIcon(file.fileType)}</div>
                    )}
                </div>
                <span className="text-sm font-medium truncate">{file.fileName}</span>
            </div>
            <div className="col-span-2 hidden md:block text-sm text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</div>
            <div className="col-span-4 hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                {new Date(file.updatedAt).toLocaleDateString()}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <ItemActions item={file} addToast={addToast} />
            </div>
        </div>
    );
};

/**
 * Context menu for items (simplified as a top-right dropdown).
 */
const ItemActions: React.FC<{
    item: MediaItemType;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ item, addToast }) => {
    // This is a placeholder for a full dropdown/context menu
    // In a real app, you'd use a library like Radix UI for this.
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                addToast(`Actions for ${'name' in item ? item.name : item.fileName}`, 'info');
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/70 dark:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="More actions"
        >
            <MoreVertical className="w-4 h-4" />
        </button>
    );
};

/**
 * Overlay shown when dragging files over the main area.
 */
const UploadDropzoneOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 border-4 border-dashed border-blue-600 dark:border-blue-400 rounded-lg flex flex-col items-center justify-center z-10 pointer-events-none">
            <HardDriveUpload className="w-24 h-24 text-blue-600 dark:text-blue-300" />
            <p className="mt-4 text-2xl font-semibold text-blue-800 dark:text-blue-100">Drop files to upload</p>
        </div>
    );
};

/**
 * State shown when a folder is empty.
 */
const EmptyState: React.FC<{ onUploadClick: () => void }> = ({ onUploadClick }) => {
    return (
        <div className="text-center p-16">
            <Folder className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">This folder is empty</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Drag and drop files here or use the upload button.</p>
            <button
                onClick={onUploadClick}
                className="mt-6 flex items-center gap-2 px-4 py-2 mx-auto rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                <Upload className="w-4 h-4" />
                Upload Files
            </button>
        </div>
    );
};

// --- MODALS & DRAWERS ---

/**
 * Modal for creating a new folder.
 */
const NewFolderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName('');
            // Focus input when modal opens
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(name);
    };

    return (
        <ModalBackdrop onClose={onClose}>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Create New Folder</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Folder Name
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        id="folderName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., 'Marketing Assets'"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </ModalBackdrop>
    );
};

/**
 * Modal for uploading files.
 */
const UploadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: FileList) => void;
}> = ({ isOpen, onClose, onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
        }
    };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
        }
    };

    return (
        <ModalBackdrop onClose={onClose}>
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold">Upload Files</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                <div className="p-6">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors
              ${isDragging
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                    >
                        <HardDriveUpload className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        <p className="mt-4 font-semibold">Drag & drop files here</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Browse Files
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                    <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                        Max file size: 100MB
                    </p>
                </div>
            </div>
        </ModalBackdrop>
    );
};

/**
 * Backdrop for modals.
 */
const ModalBackdrop: React.FC<React.PropsWithChildren<{ onClose: () => void }>> = ({ children, onClose }) => {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

/**
 * Details drawer for a selected media file.
 */
const DetailsDrawer: React.FC<{
    file: Media;
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    onRename: (newName: string) => void;
    addToast: (message: string, type: Toast['type']) => void;
}> = ({ file, isOpen, onClose, onDelete, onRename, addToast }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(file.fileName);

    useEffect(() => {
        setName(file.fileName);
        setIsEditing(false);
    }, [file]);

    const handleRenameSubmit = () => {
        onRename(name);
        setIsEditing(false);
    };

    const handleCopyUrl = () => {
        // navigator.clipboard.writeText is not reliable in all contexts (e.g., secure iframes)
        // A more robust solution might be needed, but this is standard.
        try {
            navigator.clipboard.writeText(file.url);
            addToast("URL copied to clipboard!", "success");
        } catch (err) {
            console.error("Failed to copy URL: ", err);
            addToast("Failed to copy URL.", "error");
        }
    };

    return (
        <>
            {/* Mobile-friendly overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-30 bg-black/30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-40 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transition-transform transform
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-semibold">File Details</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        {file.fileType.startsWith("image/") ? (
                            <img
                                src={file.url}
                                alt={file.altText || file.fileName}
                                className="w-full h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                            />
                        ) : (
                            <div className="w-full h-48 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-8">
                                {getFileTypeIcon(file.fileType)}
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4">
                        {/* File Name (Editable) */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">File Name</label>
                            {isEditing ? (
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-1 px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={handleRenameSubmit} className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm font-medium truncate" title={file.fileName}>{file.fileName}</p>
                                    <button onClick={() => setIsEditing(true)} className="p-1 text-gray-500 hover:text-blue-600">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <DetailRow label="File Size" value={formatBytes(file.size)} />
                        <DetailRow label="File Type" value={file.fileType} />
                        {file.width && file.height && (
                            <DetailRow label="Dimensions" value={`${file.width} x ${file.height}px`} />
                        )}
                        <DetailRow label="Uploaded" value={new Date(file.createdAt).toLocaleString()} />

                        {/* URL (Copyable) */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">URL</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="text"
                                    readOnly
                                    value={file.url}
                                    className="flex-1 px-2 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 truncate"
                                />
                                <button onClick={handleCopyUrl} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* TODO: Add Alt Text, Caption, Tags inputs here */}

                    </div>

                    {/* Actions */}
                    <div className="p-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <p className="text-sm mt-1">{value}</p>
    </div>
);

/**
 * Container for toast notifications.
 */
const ToastContainer: React.FC<{
    toasts: Toast[];
    onRemove: (id: number) => void;
}> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
            {toasts.map(toast => (
                <ToastNotification key={toast.id} {...toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

/**
 * A single toast notification.
 */
const ToastNotification: React.FC<Toast & { onRemove: (id: number) => void }> = ({
    id, message, type, icon, onRemove
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [id, onRemove]);

    return (
        <div className="flex items-center gap-3 max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border dark:border-gray-700 animate-toast-in">
            <div className="flex-shrink-0">{icon}</div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={() => onRemove(id)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-4 h-4 text-gray-400" />
            </button>
        </div>
    );
};


