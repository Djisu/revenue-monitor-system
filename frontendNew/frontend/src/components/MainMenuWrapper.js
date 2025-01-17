import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import MainMenu from './layout/MainMenu'; // Adjust path as necessary
import { useAuth } from '../context/AuthContext';
import checkAccess from '../utilities/checkAccess'; // Import the checkAccess function
var MainMenuWrapper = function () {
    var _a = useAuth(), isAuthenticated = _a.isAuthenticated, username = _a.username;
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/" });
    }
    return (_jsx(MainMenu, { username: username, checkAccess: checkAccess }));
};
export default MainMenuWrapper;
