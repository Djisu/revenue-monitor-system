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
import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var OperatorPermissionsForm = function () {
    var _a = useState(''), operatorID = _a[0], setOperatorID = _a[1];
    var _b = useState(''), menus = _b[0], setMenus = _b[1];
    var _c = useState(''), reports = _c[0], setReports = _c[1];
    var _d = useState('DEM'), databases = _d[0], setDatabases = _d[1];
    var _e = useState(''), password = _e[0], setPassword = _e[1];
    var _f = useState([]), operatorList = _f[0], setOperatorList = _f[1];
    var _g = useState([]), operatorPermissions = _g[0], setOperatorPermissions = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var _j = useState(''), successMessage = _j[0], setSuccessMessage = _j[1];
    useEffect(function () {
        fetchOperatorList();
        fetchOperatorPermissions();
    }, []);
    var fetchOperatorList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/operator_definition')];
                case 1:
                    response = _a.sent();
                    setOperatorList(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('Error fetching operators');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchOperatorPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/operator_permission')];
                case 1:
                    response = _a.sent();
                    setOperatorPermissions(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error fetching operator permissions');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleOperatorIDChange = function (e) {
        setOperatorID(e.target.value);
        validateOperatorID(e.target.value);
    };
    var handleMenusChange = function (e) {
        setMenus(e.target.value);
    };
    var handleReportsChange = function (e) {
        setReports(e.target.value);
    };
    var handleDatabasesChange = function (e) {
        setDatabases(e.target.value);
    };
    var handlePasswordChange = function (e) {
        setPassword(e.target.value);
    };
    var validateOperatorID = function (operatorID) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("http://your-api-url/find_rec?operatorID=".concat(operatorID, "&password=").concat(password))];
                case 1:
                    response = _a.sent();
                    setMenus(response.data.menus || '');
                    setReports(response.data.reports || '');
                    setDatabases(response.data.databases || 'DEM');
                    setError('');
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('Record not found');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!operatorID || !menus || !reports || !password) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('http://your-api-url/add_rec', {
                            operatorID: operatorID,
                            menus: menus,
                            reports: reports,
                            databases: databases,
                            password: password,
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOperatorPermissions();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    setError('Error adding record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!operatorID || !menus || !reports || !password) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.put('http://your-api-url/edit_rec', {
                            operatorID: operatorID,
                            menus: menus,
                            reports: reports,
                            databases: databases,
                            password: password,
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOperatorPermissions();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error(error_5);
                    setError('Error editing record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var delResponse, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!operatorID || !password) {
                        setError('Operator ID and Password cannot be empty');
                        return [2 /*return*/];
                    }
                    delResponse = prompt("Enter Y to Delete, N to Not to Delete");
                    if ((delResponse === null || delResponse === void 0 ? void 0 : delResponse.toUpperCase()) !== 'Y') {
                        setError('Deletion aborted');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.delete('http://your-api-url/delete_rec', {
                            data: {
                                operatorID: operatorID,
                                password: password,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOperatorPermissions();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error(error_6);
                    setError('Error deleting record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        window.location.href = '/'; // Redirect to main page or hide the form
    };
    var clearForm = function () {
        setOperatorID('');
        setMenus('');
        setReports('');
        setDatabases('DEM');
        setPassword('');
    };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Operator Reports" }), error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formOperatorID", children: [_jsx(Form.Label, { children: "Operator ID:" }), _jsxs(Form.Select, { value: operatorID, onChange: handleOperatorIDChange, children: [_jsx("option", { value: "", children: "Select an operator" }), operatorList.map(function (operator) { return (_jsxs("option", { value: operator.operatorID, children: [operator.operatorID, " ", operator.operatorName] }, operator.operatorID)); })] })] }), _jsxs(Form.Group, { controlId: "formPassword", children: [_jsx(Form.Label, { children: "Password:" }), _jsx(Form.Control, { type: "password", value: password, onChange: handlePasswordChange, maxLength: 10 })] }), _jsxs(Form.Group, { controlId: "formMenus", children: [_jsx(Form.Label, { children: "Menus:" }), _jsx(Form.Control, { type: "text", value: menus, onChange: handleMenusChange, maxLength: 100 })] }), _jsxs(Form.Group, { controlId: "formReports", children: [_jsx(Form.Label, { children: "Reports:" }), _jsx(Form.Control, { type: "text", value: reports, onChange: handleReportsChange, maxLength: 100 })] }), _jsxs(Form.Group, { controlId: "formDatabases", children: [_jsx(Form.Label, { children: "Databases:" }), _jsx(Form.Control, { type: "text", value: databases, onChange: handleDatabasesChange, maxLength: 10, style: { display: 'none' } })] }), _jsx(Button, { variant: "primary", onClick: handleAddClick, style: { marginTop: '10px' }, children: "Add" }), _jsx(Button, { variant: "success", onClick: handleEditClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Edit" }), _jsx(Button, { variant: "danger", onClick: handleDeleteClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Delete" }), _jsx(Button, { variant: "secondary", onClick: handleExitClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Exit" })] }), _jsx("h3", { className: "mt-4", children: "List Of Operators" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Operator ID" }), _jsx("th", { children: "Menus" }), _jsx("th", { children: "Reports" }), _jsx("th", { children: "Databases" }), _jsx("th", { children: "Password" })] }) }), _jsx("tbody", { children: operatorPermissions.map(function (permission) { return (_jsxs("tr", { onClick: function () {
                                setOperatorID(permission.operatorID);
                                setMenus(permission.menus);
                                setReports(permission.reports);
                                setDatabases(permission.databases);
                                setPassword(permission.password);
                            }, children: [_jsx("td", { children: permission.operatorID.toUpperCase() }), _jsx("td", { children: permission.menus.toUpperCase() }), _jsx("td", { children: permission.reports.toUpperCase() }), _jsx("td", { children: permission.databases.toUpperCase() }), _jsx("td", { children: permission.password.toUpperCase() })] }, permission.operatorID)); }) })] }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default OperatorPermissionsForm;
