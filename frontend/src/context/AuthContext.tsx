import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../features/auth/authSlice'; // Ensure this path is correct
import { useAppDispatch } from '../app/store';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    username?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string | undefined>(undefined); // State for username
    const dispatch = useAppDispatch();

    const login = async (username: string, password: string): Promise<void> => {
        const response = await dispatch(loginUser({ username, password }));

        if (loginUser.rejected.match(response)) {
            const errorMessage = response.payload?.message || 'Invalid credentials';
            alert(errorMessage);
            setIsAuthenticated(false);
            return; 
        }

        console.log('login successful in AuthProvider');
        setIsAuthenticated(true);
        setUsername(username); // Set the username on successful login
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(undefined); // Clear username on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};