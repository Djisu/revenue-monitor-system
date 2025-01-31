var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { Container, Form, Button, Alert, Table, Image, ButtonGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchOfficers, createOfficer, updateOfficer, deleteOfficer } from './officerSlice';
import { storePhotoAsync } from '../photos/photosSlice';
var EmployeeForm = function () {
    var _a = useState(''), officerNo = _a[0], setOfficerNo = _a[1];
    var _b = useState(''), name = _b[0], setName = _b[1];
    var _c = useState(''), photo = _c[0], setPhoto = _c[1];
    var _d = useState(''), photoUrlFromState = _d[0], setPhotoUrlFromState = _d[1];
    var _e = useState([]), officerList = _e[0], setOfficerList = _e[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    var _g = useState(''), successMessage = _g[0], setSuccessMessage = _g[1];
    var _h = useState(''), photoType = _h[0], setPhotoType = _h[1];
    var _j = useState(''), photoName = _j[0], setPhotoName = _j[1];
    var dispatch = useAppDispatch();
    var selectedPhotoUrl = useAppSelector(function (state) { return state.photos.photoUrl; });
    console.log('Photo URL from state:', selectedPhotoUrl);
    useEffect(function () {
        fetchOfficerList();
    }, []);
    var fetchOfficerList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, officersWithUrls, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Fetching officers...');
                    return [4 /*yield*/, dispatch(fetchOfficers()).unwrap()];
                case 1:
                    response = _a.sent();
                    console.log('Fetched officers:', response); // Log the result
                    // Check if result is an array
                    if (Array.isArray(response)) {
                        officersWithUrls = response.map(function (officer) {
                            if (officer.photo instanceof Blob) {
                                return __assign(__assign({}, officer), { photoUrl: URL.createObjectURL(officer.photo) });
                            }
                            else {
                                return __assign(__assign({}, officer), { photoUrl: officer.photo // Assuming photo is a URL string
                                 });
                            }
                        });
                        setOfficerList(officersWithUrls);
                    }
                    else {
                        console.error('Expected an array, but received:', response);
                        setOfficerList([]);
                    }
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
        console.log('in handlePhotoChange');
        if (e.target.files && e.target.files[0]) {
            var file = e.target.files[0];
            photoType = file.type;
            setPhotoType(photoType);
            photoName = file.name;
            setPhotoName(photoName);
            if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
                alert('File size exceeds the limit of 10MB.');
                return;
            }
            var photoBlobUrl = URL.createObjectURL(file);
            setPhoto(file); // Store the Blob itself
            setPhotoUrlFromState(photoBlobUrl); // Update the photo URL in state
            console.log('Photo URL:', photoBlobUrl);
            console.log('Photo:', file.name);
            uploadPhoto(file);
        }
    };
    var uploadPhoto = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var resultAction, photoUrl_1, updatedOfficerList, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in uploadPhoto');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('about to dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }))');
                    console.log('file:', file);
                    console.log('officerNo:', officerNo);
                    return [4 /*yield*/, dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }))];
                case 2:
                    resultAction = _a.sent();
                    console.log('after dispatch(storePhotoAsync(', resultAction);
                    if (storePhotoAsync.fulfilled.match(resultAction)) {
                        console.log('Photo uploaded successfully:', resultAction.payload.photoUrl);
                        photoUrl_1 = resultAction.payload.photoUrl;
                        console.log('Photo URL:', photoUrl_1);
                        updatedOfficerList = officerList.map(function (officer) {
                            if (officer.officer_no === officerNo) {
                                return __assign(__assign({}, officer), { photoUrl: photoUrl_1 });
                            }
                            return officer;
                        });
                        setOfficerList(updatedOfficerList);
                        setPhotoUrlFromState(photoUrl_1); // Update the photo URL in state
                        setPhoto(photoUrl_1); // Update the photo URL in state
                        console.log('Photo URL:', photoUrl_1);
                    }
                    else if (storePhotoAsync.rejected.match(resultAction)) {
                        if (resultAction.payload) {
                            console.error('Error uploading photo XXXXX:', resultAction.payload.error);
                            // Handle specific error, e.g., show error notification
                            if (resultAction.payload.error.includes('Photo already exists')) {
                                // Handle the specific 409 error
                                console.log('Handling 409: Photo already exists');
                                // Show a user-friendly message or notification
                                alert('Photo already exists for this officer.');
                            }
                            else {
                                // Handle other errors
                                alert('Failed to upload photo. Please try again.');
                            }
                        }
                        else {
                            console.error('Error uploading photo: No payload');
                            alert('Failed to upload photo. Please try again.');
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error uploading photo:', error_2);
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
                    console.log('about to dispatch(createOfficer({officer_no, officer_name, photo}))');
                    console.log('officer_no:', officerNo);
                    console.log('officer_name:', name);
                    console.log('photo:', photoUrlFromState);
                    return [4 /*yield*/, dispatch(createOfficer({
                            officer_no: officerNo,
                            officer_name: name,
                            photo: photoUrlFromState //typeof photo === 'string' ? photo : URL.createObjectURL(photo), // Use the photo URL
                        }))];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.payload.message);
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
                    return [4 /*yield*/, dispatch(updateOfficer({
                            officer_no: officerNo,
                            officerData: {
                                officer_no: officerNo,
                                officer_name: name,
                                photo: typeof photo === 'string' ? photo : URL.createObjectURL(photo), // Use the photo URL
                            },
                        }))];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.payload.message);
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
                    return [4 /*yield*/, dispatch(deleteOfficer(officerNo))];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.payload.message);
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
    var clearForm = function () {
        setOfficerNo('');
        setName('');
        setPhoto('');
        setPhotoUrlFromState(''); // Clear the photo URL in state
    };
    var handleItemClick = function (officer) {
        var _a;
        setOfficerNo(officer.officer_no);
        setName(officer.officer_name);
        setPhoto(officer.photoUrl ? '' : officer.photo); // If photoUrl is available, clear photo
        setPhotoUrlFromState((_a = officer.photoUrl) !== null && _a !== void 0 ? _a : ''); // Use the nullish coalescing operator
    };
    // const [photoUrlFromState, setPhotoUrlFromState] = useState<string>(''); // State to store the photo URL from Redux
    useEffect(function () {
        var fetchOfficers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, officers, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/officers')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        officers = _a.sent();
                        setOfficerList(officers); // Set the officer list with the JSON data
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Failed to fetch officers:', error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchOfficers();
        // return () => {
        //   officerList.forEach((officer) => {
        //     if (officer.photoUrl) {
        //       URL.revokeObjectURL(officer.photoUrl);
        //     }
        //   });
        // };
    }, [officerList]);
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formOfficerno", children: [_jsx(Form.Label, { children: "Employee ID:" }), _jsx(Form.Control, { type: "text", value: officerNo, onChange: handleOfficerNoChange, maxLength: 10, required: true })] }), _jsxs(Form.Group, { controlId: "formName", children: [_jsx(Form.Label, { children: "Name:" }), _jsx(Form.Control, { type: "text", value: name, onChange: handleNameChange, maxLength: 50, required: true })] }), _jsxs(Form.Group, { controlId: "formPhoto", children: [_jsx(Form.Label, { children: "Photo:" }), _jsx(Form.Control, { type: "text", value: typeof photo === 'string' ? photo : photoName, readOnly: true }), _jsxs("div", { style: { marginTop: '10px' }, children: [_jsxs(Button, { variant: "secondary", onClick: function () { var _a; return (_a = document.getElementById('photoInput')) === null || _a === void 0 ? void 0 : _a.click(); }, children: [_jsx(FaUpload, {}), " Upload Photo"] }), _jsx("input", { id: "photoInput", type: "file", accept: "image/*", onChange: handlePhotoChange, style: { display: 'none' } })] })] }), _jsx("div", { style: { marginTop: '10px' }, children: _jsxs(ButtonGroup, { children: [_jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add" }), _jsx(Button, { variant: "success", onClick: handleEditClick, style: { marginLeft: '10px' }, children: "Edit" }), _jsx(Button, { variant: "danger", onClick: handleDeleteClick, style: { marginLeft: '10px' }, children: "Delete" }), _jsx(Link, { to: "/main", className: "btn btn-secondary m-3", children: "Go Back" })] }) })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Employee ID" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Photo" })] }) }), _jsx("tbody", { children: officerList.map(function (officer) { return (_jsxs("tr", { onClick: function () { return handleItemClick(officer); }, children: [_jsx("td", { children: officer.officer_no }), _jsx("td", { children: officer.officer_name }), _jsx("td", { children: officer.photoUrl && officer.photoUrl !== 'xx' ? (_jsx(Image, { src: officer.photoUrl, alt: officer.officer_name, style: { width: '100px', height: '100px' } })) : ('No Photo') })] }, officer.officer_no)); }) })] }), photoUrlFromState && photoUrlFromState !== 'xx' && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { children: "Photo Preview" }), _jsx(Image, { src: photoUrlFromState, alt: "Employee Photo", style: { width: '200px', height: '200px' } })] }))] }));
};
export default EmployeeForm;
