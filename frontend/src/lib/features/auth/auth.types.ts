
export interface AuthState {
    isAuthenticated: boolean;
    user: user | null;
    isLoading: boolean;
    error: string | null;
}

interface user {
    email: string;
    password: string;
    id: string;
    userType: string;
    status: string;
    verified: boolean;
    loginIp: string | null;
    loginAt: Date | null;
    isSuperAdmin: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}