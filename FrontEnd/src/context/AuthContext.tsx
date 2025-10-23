import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../../utils/apiFunctions'

interface UserInfo {
    email: string;
    username?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    loading: boolean;
    login: (token: string, userInfo: UserInfo) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Validate any stored token with the backend
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                // Optimistically set from saved info for snappy UX
                const savedUserInfo = localStorage.getItem('userInfo');
                if (savedUserInfo) {
                    setIsAuthenticated(true);
                    setUserInfo(JSON.parse(savedUserInfo));
                }
                const { email, username } = await getCurrentUser(token);
                setIsAuthenticated(true);
                setUserInfo({ email, username });
                localStorage.setItem('userInfo', JSON.stringify({ email, username }));
            } catch (e) {
                // Token invalid/expired: clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                setIsAuthenticated(false);
                setUserInfo(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const login = (token: string, user: UserInfo) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
        setIsAuthenticated(true);
        setUserInfo(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userInfo, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};