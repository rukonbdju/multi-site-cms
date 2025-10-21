import { Bold, Edit3, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Italic, Link2, Link2Off, List, ListOrdered, Pilcrow, Quote, Strikethrough, Type, Underline } from "lucide-react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { LinkModal } from "./editor-components";
import Button from "@/components/shared/button";
import EditorBlockStyle from "./editor-block-style";

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
        <>
            <EditorBlockStyle />
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
        </>
    );
};

export default RichTextEditor;