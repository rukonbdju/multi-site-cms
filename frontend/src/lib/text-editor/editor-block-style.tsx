const EditorBlockStyle = () => {
    return (
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
    )
}

export default EditorBlockStyle;