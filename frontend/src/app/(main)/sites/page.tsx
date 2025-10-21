import CustomImage from "@/components/shared/custom-image";
import { Site } from "@/layout/types";
import { formatDate } from "@/utils/formate-date";
import { ArrowRightFromLine, Edit, Eye, FileText, LayoutGrid, Plus, Settings, Trash2 } from "lucide-react";
import { FC } from "react";
const mockSites: Site[] = [
    { id: 1, name: 'Innovate Inc.', domain: 'innovate-inc.com', logo: 'https://placehold.co/64x64/3498db/ffffff?text=I', title: 'Innovate Inc. - Pushing the Boundaries of Technology', description: 'Our corporate homepage, showcasing the latest in tech innovation and our company milestones. Updated quarterly with new products.', status: 'active', createdAt: '2023-10-26T10:00:00Z', pageCount: 25 },
    { id: 2, name: 'QuantumLeap', domain: 'quantumleap.dev', logo: undefined, title: 'QuantumLeap Developer Portal', description: 'The official developer hub for the QuantumLeap API. Access documentation, tutorials, and community forums.', status: 'active', createdAt: '2023-09-15T14:30:00Z', pageCount: 150 },
    { id: 3, name: 'EcoGoods', domain: 'ecogoods.store', logo: 'https://placehold.co/64x64/2ecc71/ffffff?text=E', title: 'EcoGoods - Sustainable Products for a Better Planet', description: 'An e-commerce platform dedicated to selling eco-friendly and sustainable products. Features a blog on green living.', status: 'disabled', createdAt: '2023-11-05T18:45:00Z', pageCount: 42 },
    { id: 4, name: 'Artisan Corner', domain: 'artisancorner.blog', logo: undefined, title: 'Artisan Corner - A Blog for Creatives', description: 'A personal blog space for sharing thoughts on art, design, and craftsmanship. Currently on hold.', status: 'active', createdAt: '2023-08-01T09:12:00Z', pageCount: 18 },
    { id: 5, name: 'HealthHub', domain: 'healthhub.app', logo: 'https://placehold.co/64x64/e74c3c/ffffff?text=H', title: 'HealthHub - Your Personal Wellness Tracker', description: 'A web application for tracking fitness goals, nutrition, and overall well-being. Integrates with various fitness devices.', status: 'active', createdAt: '2024-01-20T11:00:00Z', pageCount: 12 },
    { id: 6, name: 'Staging Server', domain: 'staging.innovate-inc.com', logo: undefined, title: 'Staging Environment', description: 'Internal staging server for testing new features before deploying to the main Innovate Inc. website.', status: 'disabled', createdAt: '2023-12-10T16:20:00Z', pageCount: 30 },
];

const StatusBadge: FC<{ status: Site['status'] }> = ({ status }) => {
    const isActive = status === 'active';
    const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
    const colorClasses = isActive ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    return <span className={`${baseClasses} ${colorClasses}`}>{isActive ? 'Active' : 'Disabled'}</span>;
};

const SiteLogo: FC<{ logo?: string; name: string }> = ({ logo, name }) => (
    <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-xl overflow-hidden">
        {logo ? <CustomImage src={logo} alt={`${name} logo`} className="h-full w-full object-cover" /> : <LayoutGrid className="h-7 w-7 text-gray-400" />}
    </div>
);

const IconButton: FC<{ icon: React.ElementType; className?: string; onClick?: () => void; title?: string; }> = ({ icon: Icon, title, className = '', onClick }) => (
    <button title={title} onClick={onClick} className={`p-2 rounded-md transition-colors duration-200 ${className}`} >
        <Icon className="h-5 w-5" />
    </button>
);

const SiteCard: FC<{ site: Site }> = ({ site }) => (
    <div className="group bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg dark:hover:shadow-blue-900/20 transition-all duration-300 flex flex-col">
        <div className="p-5 flex items-start space-x-2">
            <SiteLogo logo={site.logo} name={site.name} />
            <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">{site.name}</h3>
                <p className="text-xs text-gray-500">Created: {formatDate(site.createdAt)}</p>
            </div>
            <StatusBadge status={site.status} />
        </div>
        <div className="px-5 pb-5 flex-grow">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span>{site.pageCount} {site.pageCount === 1 ? 'Page' : 'Pages'}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 h-10">{site.description}</p>
            <a href={`//${site.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">
                {site.domain}
            </a>
        </div>

        <div className="px-5 pb-1">
            <div className="border-t border-gray-100 dark:border-gray-700 w-full"></div>
        </div>

        <div className="p-5 pt-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1 opacity-100 transition-opacity duration-300">
                <IconButton title="Preview" icon={Eye} className="hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500 dark:text-blue-400" />
                <IconButton title="Edit" icon={Edit} className="hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-500 dark:text-yellow-400" />
                <IconButton title="Settings" icon={Settings} className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" />
                <IconButton title="Delete" icon={Trash2} className="hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400" />
            </div>
            <div>
                <IconButton title="Details" icon={ArrowRightFromLine} className="hover:bg-green-100 dark:hover:bg-green-900/50 text-green-500 dark:text-green-400" />
            </div>
        </div>
    </div>
);

const EmptyState: FC = () => (
    <div className="text-center py-20 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/30">
        <LayoutGrid className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No sites yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first site.</p>
        <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Site
            </button>
        </div>
    </div>
);

const SitesPage = () => {
    const sites = mockSites;
    return (
        <main className="bg-gray-50/50 dark:bg-gray-900/50 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="w-full mx-auto">
                <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Your Sites</h1>
                    <button className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        New Site
                    </button>
                    <button className="sm:hidden fixed bottom-4 right-4 z-10 inline-flex items-center justify-center p-3 border border-transparent rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Add New Site">
                        <Plus className="h-6 w-6" />
                    </button>
                </div>

                {sites && sites.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {sites.map((site) => <SiteCard key={site.id} site={site} />)}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </main>
    );
}

export default SitesPage;