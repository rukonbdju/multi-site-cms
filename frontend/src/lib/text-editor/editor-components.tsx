import Button from "@/components/shared/button";
import { X } from "lucide-react";
import { FC, useEffect, useRef } from "react";

export const LinkModal: FC<{
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

