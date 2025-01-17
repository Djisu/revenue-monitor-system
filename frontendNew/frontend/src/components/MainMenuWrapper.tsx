// src/components/MainMenuWrapper.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainMenu from './layout/MainMenu'; // Adjust path as necessary
import { useAuth } from '../context/AuthContext';
import checkAccess from '../utilities/checkAccess'; // Import the checkAccess function

const MainMenuWrapper: React.FC = () => {
    const { isAuthenticated, username } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <MainMenu 
            username={username} 
            checkAccess={checkAccess} // Use the imported function
        />
    );
};

export default MainMenuWrapper;