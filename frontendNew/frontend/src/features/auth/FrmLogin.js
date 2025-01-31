var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
var FrmLogin = function () {
    var _a = useState(''), username = _a[0], setUsername = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState(''), error = _c[0], setError = _c[1];
    var login = useAuth().login;
    var navigate = useNavigate();
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    //console.log('in frmlogin handlesubmit Username:', username, 'Password:', password);
                    // Validate inputs
                    if (!username || !password) {
                        setError('Username and password cannot be blank!');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //console.log('Logging in with username:', username, 'and password:', password);
                    return [4 /*yield*/, login(username, password)];
                case 2:
                    //console.log('Logging in with username:', username, 'and password:', password);
                    _a.sent();
                    //console.log('About to navigate to MainMenu!');
                    navigate('/main'); // Redirect to MainMenu on successful login
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Login failed:', error_1);
                    setError('Error during login');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx(Container, { className: "d-flex justify-content-center align-items-center", style: { height: '100vh' }, children: _jsxs(Form, { onSubmit: handleSubmit, style: { width: '300px', margin: '0 auto' }, children: [_jsxs(Form.Group, { controlId: "formUsername", children: [_jsx("h1", { children: "Login" }), _jsx(Form.Label, { children: "User Name" }), _jsx(Form.Control, { type: "text", value: username, onChange: function (e) { return setUsername(e.target.value); }, placeholder: "Enter username", autoComplete: "current-username", required: true })] }), _jsxs(Form.Group, { controlId: "formPassword", children: [_jsx(Form.Label, { children: "Password" }), _jsx(Form.Control, { type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, placeholder: "Enter password", autoComplete: "current-password", required: true })] }), _jsx(Button, { variant: "success", type: "submit", className: "mt-3", style: { width: '100%' }, children: "OK" }), _jsx(Button, { variant: "danger", type: "button", className: "mt-3", style: { width: '100%' }, onClick: function () { return navigate('/main'); }, children: "Cancel" }), error && _jsx(Alert, { variant: "danger", className: "mt-3", children: error }), _jsx("div", { className: "mt-3 text-center", style: { color: 'red' }, children: "(c) SoftPlus Solutions" })] }) }));
};
export default FrmLogin;
