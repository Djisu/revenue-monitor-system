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
import { Container, Form, Button, Alert, Table, Image } from 'react-bootstrap';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
var EmployeeForm = function () {
    var _a = useState(''), officerNo = _a[0], setOfficerNo = _a[1];
    var _b = useState(''), name = _b[0], setName = _b[1];
    var _c = useState(''), photo = _c[0], setPhoto = _c[1];
    var _d = useState([]), officerList = _d[0], setOfficerList = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var _f = useState(''), successMessage = _f[0], setSuccessMessage = _f[1];
    useEffect(function () {
        fetchOfficerList();
    }, []);
    var fetchOfficerList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_officer')];
                case 1:
                    response = _a.sent();
                    setOfficerList(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('Error fetching officers');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleOfficerNoChange = function (e) {
        setOfficerNo(e.target.value);
    };
    var handleNameChange = function (e) {
        setName(e.target.value.toUpperCase());
    };
    var handlePhotoChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            setPhoto(URL.createObjectURL(e.target.files[0]));
            uploadPhoto(e.target.files[0]);
        }
    };
    var uploadPhoto = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    formData.append('photo', file);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('http://your-api-url/upload_photo', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        })];
                case 2:
                    response = _a.sent();
                    setPhoto(response.data.path);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error uploading photo');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!officerNo || !name || !photo) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('http://your-api-url/add_rec', {
                            officerNo: officerNo,
                            name: name,
                            photo: photo,
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOfficerList();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('Error adding record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!officerNo || !name || !photo) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.put('http://your-api-url/edit_rec', {
                            officerNo: officerNo,
                            name: name,
                            photo: photo,
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOfficerList();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    setError('Error editing record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var delResponse, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!officerNo) {
                        setError('Employee ID cannot be empty');
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
                                officerNo: officerNo,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchOfficerList();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error(error_5);
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
        setOfficerNo('');
        setName('');
        setPhoto('');
    };
    // const validateOfficerNo = async (officerNo: string) => {
    //   try {
    //     const response = await axios.get<Officer>(`http://your-api-url/find_rec?officerNo=${officerNo}`);
    //     setName(response.data.officer_name);
    //     setPhoto(response.data.photo);
    //     setError('');
    //   } catch (error) {
    //     console.error(error);
    //     setError('Record not found');
    //   }
    // };
    var handleItemClick = function (officer) {
        setOfficerNo(officer.officer_no);
        setName(officer.officer_name);
        setPhoto(officer.photo);
    };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Employee Data Entry Screen" }), error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formOfficerno", children: [_jsx(Form.Label, { children: "Employee ID:" }), _jsx(Form.Control, { type: "text", value: officerNo, onChange: handleOfficerNoChange, maxLength: 10, required: true })] }), _jsxs(Form.Group, { controlId: "formName", children: [_jsx(Form.Label, { children: "Name:" }), _jsx(Form.Control, { type: "text", value: name, onChange: handleNameChange, maxLength: 50, required: true })] }), _jsxs(Form.Group, { controlId: "formPhoto", children: [_jsx(Form.Label, { children: "Photo:" }), _jsx(Form.Control, { type: "text", value: photo, onChange: handlePhotoChange, readOnly: true }), _jsxs(Button, { variant: "secondary", onClick: function () { var _a; return (_a = document.getElementById('photoInput')) === null || _a === void 0 ? void 0 : _a.click(); }, style: { marginTop: '10px' }, children: [_jsx(FaUpload, {}), " Upload Photo"] }), _jsx("input", { id: "photoInput", type: "file", onChange: handlePhotoChange, style: { display: 'none' } })] }), _jsx(Button, { variant: "primary", onClick: handleAddClick, style: { marginTop: '10px' }, children: "Add" }), _jsx(Button, { variant: "success", onClick: handleEditClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Edit" }), _jsx(Button, { variant: "danger", onClick: handleDeleteClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Delete" }), _jsx(Button, { variant: "secondary", onClick: handleExitClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Exit" }), _jsx(Button, { variant: "info", onClick: function () { return window.alert('View Logins functionality not implemented'); }, style: { marginLeft: '10px', marginTop: '10px' }, children: "View Logins" })] }), _jsx("h3", { className: "mt-4", children: "List Of Employees" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Employee ID" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Photo" })] }) }), _jsx("tbody", { children: officerList.map(function (officer) { return (_jsxs("tr", { onClick: function () { return handleItemClick(officer); }, children: [_jsx("td", { children: officer.officer_no.toUpperCase() }), _jsx("td", { children: officer.officer_name.toUpperCase() }), _jsx("td", { children: officer.photo && officer.photo !== 'xx' ? (_jsx(Image, { src: officer.photo, alt: officer.officer_name, style: { width: '100px', height: '100px' } })) : ('No Photo') })] }, officer.officer_no)); }) })] }), photo && photo !== 'xx' && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { children: "Photo Preview" }), _jsx(Image, { src: photo, alt: "Employee Photo", style: { width: '200px', height: '200px' } })] }))] }));
};
export default EmployeeForm;
