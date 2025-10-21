import { FC } from "react";
import { BlogPostCardProps } from "./types";
import StatusBadge from "../shared/status-badge";
import { Archive, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";


const BlogPostCard: FC<BlogPostCardProps> = ({ post, site, author, openMenuId, setOpenMenuId }) => {
    const isMenuOpen = openMenuId === post.id;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 transition-shadow hover:shadow-lg">
            {post.coverImage && <img className="h-32 w-full object-cover rounded-t-xl" src={post.coverImage} alt={post.title} />}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">

                    <div className="flex items-center gap-2">
                        <img className="h-6 w-6 rounded-full" src={site?.logo} alt={site?.name} />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-300">{site?.name}</span>
                    </div>
                    <StatusBadge status={post.status} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                        <p><strong className="font-semibold text-gray-600 dark:text-gray-300">Author:</strong> {author?.name}</p>
                        <p><strong className="font-semibold text-gray-600 dark:text-gray-300">Updated:</strong> {post.updatedAt}</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setOpenMenuId(isMenuOpen ? null : post.id)}
                            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-slate-800"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>

                        {isMenuOpen && (
                            <div
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                role="menu"
                                onMouseLeave={() => setOpenMenuId(null)}
                            >
                                <div className="py-1" role="none">
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" role="menuitem"><Eye className="h-4 w-4" /> View</a>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" role="menuitem"><Edit className="h-4 w-4" /> Edit</a>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" role="menuitem"><Archive className="h-4 w-4" /> Archive</a>
                                    <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>
                                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" role="menuitem"><Trash2 className="h-4 w-4" /> Delete</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;