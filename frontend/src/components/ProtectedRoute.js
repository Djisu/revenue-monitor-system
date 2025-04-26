import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ProtectedRoute.tsx
//import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
var ProtectedRoute = function (_a) {
    var element = _a.element;
    var isAuthenticated = useAuth().isAuthenticated;
    return isAuthenticated ? element : _jsx(Navigate, { to: "/" });
};
export default ProtectedRoute;
