const CustomScrollbarStyles = () => (
    <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background-color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #d1d5db; /* gray-300 */
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #9ca3af; /* gray-400 */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563; /* gray-600 */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280; /* gray-500 */
        }
    `}</style>
);

export default CustomScrollbarStyles;