"use client";

import React, { useState, FC, ComponentProps, ReactNode } from 'react';
import type { NextPage } from 'next';
import { Edit3, Camera, Mail, User, Lock, LogOut, Shield, Trash2, X, AlertTriangle, CheckCircle } from 'lucide-react';
import CustomImage from '@/components/shared/custom-image';

// --- TYPE DEFINITIONS ---
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

// --- MOCK DATA ---
const mockUser: User = {
    id: 101,
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    address: '123 Innovation Drive, Tech City, TX 75001',
    status: 'active',
    isAdmin: true,
    avatar: 'https://placehold.co/128x128/E0E7FF/4F46E5?text=AT',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2024-05-20T14:45:00Z',
};

// --- REUSABLE UI COMPONENTS ---

const Card: FC<ComponentProps<'div'>> = ({ className, children, ...props }) => (
    <div
        className={`bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
        {...props}
    >
        {children}
    </div>
);

const Button: FC<ComponentProps<'button'>> = ({ className, children, ...props }) => (
    <button
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Input: FC<ComponentProps<'input'>> = ({ className, ...props }) => (
    <input
        className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
    />
);

const Label: FC<ComponentProps<'label'>> = ({ className, children, ...props }) => (
    <label className={`block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 ${className}`} {...props}>
        {children}
    </label>
);

const Badge: FC<{ color: 'green' | 'red' | 'blue'; children: ReactNode }> = ({ color, children }) => {
    const colors = {
        green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[color]}`}>{children}</span>;
};

const Avatar: FC<{ src?: string; alt: string; onEdit: () => void }> = ({ src, alt, onEdit }) => (
    <div className="relative group w-32 h-32 mx-auto">
        <CustomImage
            src={src || ""}
            alt={alt}
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/128x128/E0E7FF/4F46E5?text=${alt.charAt(0)}`;
            }}
        />
        <button
            onClick={onEdit}
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
            <Camera size={24} />
            <span className="sr-only">Change avatar</span>
        </button>
    </div>
);

const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const Alert: FC<{ type: 'success' | 'error', message: string, onClose: () => void }> = ({ type, message, onClose }) => {
    const isSuccess = type === 'success';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;
    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center p-4 mb-4 text-sm rounded-lg ${isSuccess ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200'}`}>
            <Icon className="flex-shrink-0 inline w-4 h-4 mr-3" />
            <div>
                <span className="font-medium">{isSuccess ? 'Success!' : 'Error!'}</span> {message}
            </div>
            <button onClick={onClose} className="ml-4 -mr-2 p-1.5 rounded-full hover:bg-white/20">
                <X size={16} />
            </button>
        </div>
    );
};


// --- PAGE COMPONENT ---
const UserProfilePage: NextPage = () => {
    const [user, setUser] = useState<User>(mockUser);
    const [formData, setFormData] = useState({ name: user.name, email: user.email, address: user.address || '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'account'>('personal');
    const [modal, setModal] = useState<'logout' | 'delete' | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setUser(prev => ({ ...prev, ...formData }));
        setIsEditing(false);
        showAlert('success', 'Profile updated successfully!');
    };

    const handleCancelEdit = () => {
        setFormData({ name: user.name, email: user.email, address: user.address || '' });
        setIsEditing(false);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showAlert('error', "New passwords don't match.");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            showAlert('error', "Password must be at least 8 characters long.");
            return;
        }
        // Mock API call
        console.log("Updating password...");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showAlert('success', 'Password changed successfully!');
    };

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 5000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const TabButton: FC<{ tabName: 'personal' | 'security' | 'account', children: ReactNode }> = ({ tabName, children }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === tabName
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <Button
                        onClick={() => {
                            setIsEditing(true);
                            setActiveTab('personal');
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit Profile
                    </Button>
                </header>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Overview */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="p-6 text-center">
                            <Avatar src={user.avatar} alt={user.name} onEdit={() => showAlert('success', 'Avatar editing coming soon!')} />
                            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <div className="mt-2 flex items-center justify-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">{user.isAdmin ? 'Administrator' : 'User'}</span>
                                {user.isAdmin && <Badge color="blue">Admin</Badge>}
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>
                            <div className="mt-2">
                                <Badge color={user.status === 'active' ? 'green' : 'red'}>{user.status}</Badge>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Member since {formatDate(user.createdAt)}
                            </p>
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-bold text-lg mb-4 px-2 text-gray-800 dark:text-gray-200">Quick Actions</h3>
                            <div className="space-y-2">
                                <Button onClick={() => { setIsEditing(true); setActiveTab('personal'); }} className="w-full justify-start text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                    <User size={18} /> Edit Profile
                                </Button>
                                <Button onClick={() => setActiveTab('security')} className="w-full justify-start text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                    <Lock size={18} /> Change Password
                                </Button>
                                <Button onClick={() => setModal('logout')} className="w-full justify-start text-red-600 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
                                    <LogOut size={18} /> Logout
                                </Button>
                            </div>
                        </Card>

                        {user.isAdmin && (
                            <Card className="p-4">
                                <h3 className="font-bold text-lg mb-4 px-2 text-gray-800 dark:text-gray-200">Admin Tools</h3>
                                <div className="space-y-2">
                                    <Button className="w-full justify-start text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                        <Shield size={18} /> Manage Users
                                    </Button>
                                    <Button className="w-full justify-start text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" /></svg>
                                        View Site Analytics
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Profile Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="p-4 border-b dark:border-gray-700">
                                <nav className="flex space-x-2">
                                    <TabButton tabName='personal'>Personal Information</TabButton>
                                    <TabButton tabName='security'>Security</TabButton>
                                    <TabButton tabName='account'>Account</TabButton>
                                </nav>
                            </div>
                            <div className="p-6">
                                {activeTab === 'personal' && (
                                    <form onSubmit={handleSaveProfile}>
                                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Personal Information</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
                                            </div>
                                            <div>
                                                <Label htmlFor="address">Address</Label>
                                                <Input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} disabled={!isEditing} placeholder="Your address" />
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <div className="mt-8 flex justify-end gap-4">
                                                <Button type="button" onClick={handleCancelEdit} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200">
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                )}

                                {activeTab === 'security' && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Security Settings</h3>
                                        <div className="space-y-8">
                                            {/* Change Password Form */}
                                            <form onSubmit={handleUpdatePassword} className="border-b dark:border-gray-700 pb-8">
                                                <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Change Password</h4>
                                                <div className="space-y-4 max-w-sm">
                                                    <div>
                                                        <Label htmlFor="currentPassword">Current Password</Label>
                                                        <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="newPassword">New Password</Label>
                                                        <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                        <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                                                    </div>
                                                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Update Password</Button>
                                                </div>
                                            </form>

                                            {/* Two-Factor Authentication */}
                                            <div>
                                                <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Two-Factor Authentication</h4>
                                                <div className="flex items-center justify-between max-w-sm">
                                                    <p className="text-gray-600 dark:text-gray-400">Enable 2FA for extra security.</p>
                                                    <label htmlFor="two-factor-auth" className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" value="" id="two-factor-auth" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'account' && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Account Information</h3>
                                        <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                                            <li className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-200">User ID:</span> <span>{user.id}</span></li>
                                            <li className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-200">Account Status:</span> <Badge color={user.status === 'active' ? 'green' : 'red'}>{user.status}</Badge></li>
                                            <li className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-200">Role:</span> <Badge color="blue">{user.isAdmin ? 'Admin' : 'User'}</Badge></li>
                                            <li className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-200">Created At:</span> <span>{formatDate(user.createdAt)}</span></li>
                                            <li className="flex justify-between items-center"><span className="font-medium text-gray-700 dark:text-gray-200">Last Updated:</span> <span>{formatDate(user.updatedAt)}</span></li>
                                        </ul>

                                        <div className="mt-10 pt-6 border-t border-red-200 dark:border-red-900/30">
                                            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h4>
                                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                                Deleting your account is a permanent action and cannot be undone.
                                            </p>
                                            <Button onClick={() => setModal('delete')} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                                                <Trash2 size={16} /> Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={modal === 'logout'} onClose={() => setModal(null)} title="Confirm Logout">
                <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to log out of your account?</p>
                <div className="flex justify-end gap-4">
                    <Button onClick={() => setModal(null)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200">
                        Cancel
                    </Button>
                    <Button onClick={() => { setModal(null); showAlert('success', 'You have been logged out.'); }} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Logout
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={modal === 'delete'} onClose={() => setModal(null)} title="Delete Account">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mt-3 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        Are you absolutely sure?
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This action cannot be undone. This will permanently delete your account and all associated data.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={() => setModal(null)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200">
                        Cancel
                    </Button>
                    <Button onClick={() => { setModal(null); showAlert('error', 'Account deletion is disabled in this demo.'); }} className="bg-red-600 hover:bg-red-700 text-white">
                        Yes, Delete Account
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default UserProfilePage;
