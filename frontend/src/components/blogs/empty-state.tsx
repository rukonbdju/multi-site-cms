import { FileText, Plus } from "lucide-react";
import { FC } from "react";

const EmptyState: FC<{ onCreate: () => void }> = ({ onCreate }) => (
    <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No blog posts yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first post.</p>
        <div className="mt-6">
            <button
                onClick={onCreate}
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
                <Plus className="h-4 w-4" />
                Create New Post
            </button>
        </div>
    </div>
);

export default EmptyState;