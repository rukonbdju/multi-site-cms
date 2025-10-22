"use client";

import CustomImage from '@/components/shared/custom-image';
import { Edit3, Lock, MoreVertical, Search, Trash2, UserPlus } from 'lucide-react';
import React, { useState, FC } from 'react';

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


// --- UI HELPER COMPONENTS ---

const Avatar: FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-3">
        <div className="avatar">
            <div className="mask mask-squircle w-8 h-8 rounded-full">
                {user.avatar ? (
                    <CustomImage className='rounded-full' src={user.avatar} alt={user.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48/EBF4FF/76A9FA?text=${user.name.charAt(0)}`; }} />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-blue-100 text-blue-500 font-bold rounded-full">
                        {user.name.charAt(0)}
                    </div>
                )}
            </div>
        </div>
        <div>
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.name}</div>
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

    if (!isAdminUser) {
        return <AccessDenied />;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* --- Page Header --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h1>
                <button className="mt-4 md:mt-0 flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300">
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

                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <select name="status" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select name="role" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
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
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                                            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 z-10 invisible group-hover:visible group-focus-within:visible">
                                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">
                                                        <Edit3 className="h-4 w-4 mr-3" /> Edit
                                                    </a>
                                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">
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
                    {mockUsers.map(user => (
                        <div key={user.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <Avatar user={user} />
                                <div className="relative inline-block text-left group">
                                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                        <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                    <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 z-10 invisible group-hover:visible group-focus-within:visible">
                                        <div className="py-1">
                                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Edit3 className="h-4 w-4 mr-3" /> Edit
                                            </a>
                                            <a href="#" className="flex items-center px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">
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
        </div>
    );
};

export default UserManagementPage;



