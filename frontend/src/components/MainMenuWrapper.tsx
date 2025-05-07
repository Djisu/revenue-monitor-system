// src/components/MainMenuWrapper.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainMenu from './layout/MainMenu'; // Adjust path as necessary
import { useAuth } from '../context/AuthContext';

interface MainMenuWrapperProps {
    handleSubmenuClick: () => void;
    checkAccess: (menuOption: string) => Promise<boolean>; 
}

const MainMenuWrapper: React.FC<MainMenuWrapperProps> = ({ handleSubmenuClick, checkAccess }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <MainMenu 
            checkAccess={checkAccess} // Use the imported function
            handleSubmenuClick={handleSubmenuClick} // Pass handleSubmenuClick to MainMenu
        />
    );
};

export default MainMenuWrapper;