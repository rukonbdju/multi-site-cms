"use client";

import CustomImage from '@/components/shared/custom-image';
import React, { useState, useMemo, FC, SVGProps } from 'react';

// --- TYPES AND MOCK DATA ---

interface User {
    id: number;
    name: string;
    email: string;
    address?: string;
    status: 'active' | 'inactive';
    isAdmin: boolean;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

const mockUsers: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', address: '123 Admin St, City', status: 'active', isAdmin: true, avatar: 'https://i.pravatar.cc/150?u=1', createdAt: '2023-10-01', updatedAt: '2023-10-25' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', address: '456 User Ave, Town', status: 'active', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=2', createdAt: '2023-10-02', updatedAt: '2023-10-22' },
    { id: 3, name: 'John Smith', email: 'john.smith@example.com', status: 'inactive', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=3', createdAt: '2023-10-05', updatedAt: '2023-10-20' },
    { id: 4, name: 'Emily White', email: 'emily.white@example.com', address: '789 Tech Rd, Metropolis', status: 'active', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=4', createdAt: '2023-10-10', updatedAt: '2023-10-26' },
    { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com', status: 'inactive', isAdmin: true, avatar: 'https://i.pravatar.cc/150?u=5', createdAt: '2023-10-12', updatedAt: '2023-10-18' },
    { id: 6, name: 'Sarah Green', email: 'sarah.green@example.com', address: '321 Code Ln, Village', status: 'active', isAdmin: false, avatar: 'https://i.pravatar.cc/150?u=6', createdAt: '2023-10-15', updatedAt: '2023-10-28' },
];

// --- ICONS (from lucide-react) ---
// In a real project, you'd `npm install lucide-react` and import them.
// For this single-file setup, we'll define them as functional components.

const UserPlus: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
    </svg>
);

const Edit3: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const Trash2: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);

const Search: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);

const Lock: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const MoreVertical: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
);


// --- UI HELPER COMPONENTS ---

const Avatar: FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-3">
        <div className="avatar">
            <div className="mask mask-squircle w-12 h-12 rounded-full">
                {user.avatar ? (
                    <CustomImage
                        src={user.avatar} alt={user.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/EBF4FF/76A9FA?text=${user.name.charAt(0)}`; }}
                    />

                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-blue-100 text-blue-500 font-bold rounded-full">
                        {user.name.charAt(0)}
                    </div>
                )}
            </div>
        </div>
        <div>
            <div className="font-bold text-gray-900 dark:text-gray-100">{user.name}</div>
        </div>
    </div>
);

const Badge: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${className}`}>
        {children}
    </span>
);

const statusColorMap = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const roleColorMap = {
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    user: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
};

// --- MODAL COMPONENTS ---

const UserModal: FC<{
    user: Partial<User> | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Partial<User>) => void;
}> = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<User>>({});

    React.useEffect(() => {
        setFormData(user || { name: '', email: '', status: 'active', isAdmin: false });
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add form validation here
        if (!formData.name || !formData.email) {
            alert('Name and Email are required.');
            return;
        }
        onSave(formData);
    };

    const isNewUser = !user?.id;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
                    {isNewUser ? 'Add New User' : 'Edit User'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" required />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                            <input type="text" name="address" id="address" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <input id="isAdmin" name="isAdmin" type="checkbox" checked={formData.isAdmin || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Admin Role</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const DeleteConfirmationModal: FC<{
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ user, isOpen, onClose, onConfirm }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Delete User</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete <span className="font-bold">{user.name}</span>? This action cannot be undone.
                    </p>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE & COMPONENTS ---

const AccessDenied: FC = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-8 rounded-lg">
        <Lock className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
    </div>
);

const UserManagementPage: FC = () => {
    // Simulate checking for admin role. In a real app, this would come from session/context.
    const [isAdminUser] = useState(true);

    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'all', role: 'all' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredUsers = useMemo(() => {
        return users
            .filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .filter(user => filters.status === 'all' || user.status === filters.status)
            .filter(user => filters.role === 'all' || (filters.role === 'admin' ? user.isAdmin : !user.isAdmin));
    }, [users, searchTerm, filters]);

    const handleAddNewUser = () => {
        setEditingUser({});
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = () => {
        if (deletingUser) {
            setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
            showToast(`User ${deletingUser.name} deleted successfully.`);
            setIsDeleteModalOpen(false);
            setDeletingUser(null);
        }
    };

    const handleSaveUser = (userToSave: Partial<User>) => {
        if (userToSave.id) { // Editing existing user
            setUsers(prev => prev.map(u => u.id === userToSave.id ? { ...u, ...userToSave, updatedAt: new Date().toISOString().split('T')[0] } as User : u));
            showToast(`User ${userToSave.name} updated successfully.`);
        } else { // Adding new user
            const newUser: User = {
                id: Math.max(...users.map(u => u.id)) + 1,
                name: userToSave.name || '',
                email: userToSave.email || '',
                status: userToSave.status || 'active',
                isAdmin: userToSave.isAdmin || false,
                address: userToSave.address,
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0],
                avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
            };
            setUsers(prev => [...prev, newUser]);
            showToast(`User ${newUser.name} created successfully.`);
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    if (!isAdminUser) {
        return <AccessDenied />;
    }

    return (
        <div className="dark p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* --- Page Header --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h1>
                <button onClick={handleAddNewUser} className="mt-4 md:mt-0 flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add New User
                </button>
            </header>

            {/* --- Search and Filters --- */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <select name="status" onChange={handleFilterChange} value={filters.status} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select name="role" onChange={handleFilterChange} value={filters.role} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- User Table / Cards --- */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created Date</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Avatar user={user} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={user.isAdmin ? roleColorMap.admin : roleColorMap.user}>{user.isAdmin ? 'Admin' : 'User'}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={statusColorMap[user.status]}>{user.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.createdAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left group">
                                            <button className="p-2 rounded-full hover:bg-gray-200">
                                                <MoreVertical className="h-5 w-5 text-gray-500" />
                                            </button>
                                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 invisible group-hover:visible">
                                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <a href="#" onClick={(e) => { e.preventDefault(); handleEditUser(user); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">
                                                        <Edit3 className="h-4 w-4 mr-3" /> Edit
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(user); }} className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">
                                                        <Trash2 className="h-4 w-4 mr-3" /> Delete
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <Avatar user={user} />
                                <div className="relative inline-block text-left group">
                                    <button className="p-1 rounded-full hover:bg-gray-200">
                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                    </button>
                                    <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 invisible group-hover:visible">
                                        <div className="py-1">
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleEditUser(user); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Edit3 className="h-4 w-4 mr-3" /> Edit
                                            </a>
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(user); }} className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Trash2 className="h-4 w-4 mr-3" /> Delete
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            <div className="flex items-center space-x-2">
                                <Badge className={statusColorMap[user.status]}>{user.status}</Badge>
                                <Badge className={user.isAdmin ? roleColorMap.admin : roleColorMap.user}>{user.isAdmin ? 'Admin' : 'User'}</Badge>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Created: {user.createdAt}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Modals and Toasts --- */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteUser}
                user={deletingUser}
            />
            {toastMessage && (
                <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;

