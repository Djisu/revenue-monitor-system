// src/components/ProtectedRoute.tsx
import React from 'react';
import {  Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;