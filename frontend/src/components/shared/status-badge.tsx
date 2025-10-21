import { FC } from "react";
import { BlogPost } from "../blogs/types";

const StatusBadge: FC<{ status: BlogPost['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const styles = {
        published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return (
        <span className={`${baseClasses} ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;