import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import MainMenu from './layout/MainMenu'; // Adjust path as necessary
import { useAuth } from '../context/AuthContext';
var MainMenuWrapper = function (_a) {
    var handleSubmenuClick = _a.handleSubmenuClick, checkAccess = _a.checkAccess;
    var isAuthenticated = useAuth().isAuthenticated;
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/" });
    }
    return (_jsx(MainMenu, { checkAccess: checkAccess, handleSubmenuClick: handleSubmenuClick }));
};
export default MainMenuWrapper;
