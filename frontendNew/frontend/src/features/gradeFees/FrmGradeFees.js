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
// interface DeleteRecResponse {
//   message: string;
// }
var GradeFeesForm = function () {
    var _a = useState(''), businessType = _a[0], setBusinessType = _a[1];
    var _b = useState(''), grade = _b[0], setGrade = _b[1];
    var _c = useState(''), description = _c[0], setDescription = _c[1];
    var _d = useState(0), fees = _d[0], setFees = _d[1];
    var _e = useState([]), gradeFeesList = _e[0], setGradeFeesList = _e[1];
    var _f = useState([]), businessTypeList = _f[0], setBusinessTypeList = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(''), successMessage = _h[0], setSuccessMessage = _h[1];
    useEffect(function () {
        fetchBusinessTypes();
        fetchGradeFeesList();
    }, []);
    var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/business_types')];
                case 1:
                    response = _a.sent();
                    setBusinessTypeList(response.data.map(function (type) { return type.buss_type; }));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('Error fetching business types');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchGradeFeesList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_gradefees')];
                case 1:
                    response = _a.sent();
                    setGradeFeesList(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error fetching grade fees list');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleBusinessTypeChange = function (e) {
        setBusinessType(e.target.value);
    };
    var handleGradeChange = function (e) {
        setGrade(e.target.value.toUpperCase());
    };
    var handleDescriptionChange = function (e) {
        setDescription(e.target.value);
    };
    var handleFeesChange = function (e) {
        var value = e.target.value;
        if (value === '' || !isNaN(Number(value))) {
            setFees(Number(value));
        }
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!businessType || !grade || !description || !fees) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('http://your-api-url/add_rec', {
                            businessType: businessType,
                            grade: grade,
                            description: description,
                            fees: fees,
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchGradeFeesList();
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
                    if (!businessType || !grade || !description || !fees) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.put('http://your-api-url/edit_rec', {
                            businessType: businessType,
                            grade: grade,
                            description: description,
                            fees: fees,
                        })];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.data.message);
                    setError('');
                    clearForm();
                    fetchGradeFeesList();
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
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                fetchGradeFeesList();
            }
            catch (error) {
                console.error(error);
                setError('Error fetching grade fees list');
            }
            return [2 /*return*/];
        });
    }); };
    var handleExitClick = function () {
        window.location.href = '/'; // Redirect to main page or hide the form
    };
    var handleItemClick = function (gradeFee) {
        setBusinessType(gradeFee.buss_type);
        setGrade(gradeFee.grade);
        setDescription(gradeFee.description);
        setFees(gradeFee.fees);
    };
    var clearForm = function () {
        setBusinessType('');
        setGrade('');
        setDescription('');
        setFees(0);
    };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Grade Fees Entry" }), error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formBusinessType", children: [_jsx(Form.Label, { children: "Business Type:" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select a business type" }), businessTypeList.map(function (type) { return (_jsx("option", { value: type, children: type }, type)); })] })] }), _jsxs(Form.Group, { controlId: "formGrade", children: [_jsx(Form.Label, { children: "Grade:" }), _jsx(Form.Control, { type: "text", value: grade, onChange: handleGradeChange, maxLength: 50 })] }), _jsxs(Form.Group, { controlId: "formDescription", children: [_jsx(Form.Label, { children: "Description:" }), _jsx(Form.Control, { type: "text", value: description, onChange: handleDescriptionChange, maxLength: 100 })] }), _jsxs(Form.Group, { controlId: "formFees", children: [_jsx(Form.Label, { children: "Fees (GHC):" }), _jsx(Form.Control, { type: "number", step: "0.01", value: fees, onChange: handleFeesChange }), _jsx(Form.Text, { className: "text-muted", children: "GHC" })] }), _jsx(Button, { variant: "primary", onClick: handleAddClick, style: { marginTop: '10px' }, children: "Add New Record" }), _jsx(Button, { variant: "success", onClick: handleEditClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Edit Old Record" }), _jsx(Button, { variant: "info", onClick: handleViewClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "View Grades" }), _jsx(Button, { variant: "danger", onClick: handleExitClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Exit" }), _jsx(Button, { variant: "secondary", onClick: function () { return window.alert('Report functionality not implemented'); }, style: { marginLeft: '10px', marginTop: '10px' }, children: "Report" }), _jsx(Form.Text, { className: "text-danger", style: { marginTop: '10px' }, children: "Know that you are changing ONLY the fees and description" })] }), _jsx("h3", { className: "mt-4", children: "List of Business Types" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business Type" }), _jsx("th", { children: "Grade" }), _jsx("th", { children: "Description" }), _jsx("th", { children: "Fees (GHC)" })] }) }), _jsx("tbody", { children: gradeFeesList.map(function (gradeFee) { return (_jsxs("tr", { onClick: function () { return handleItemClick(gradeFee); }, children: [_jsx("td", { children: gradeFee.buss_type.toUpperCase() }), _jsx("td", { children: gradeFee.grade.toUpperCase() }), _jsx("td", { children: gradeFee.description.toUpperCase() }), _jsx("td", { children: gradeFee.fees.toFixed(2) })] }, "".concat(gradeFee.buss_type, "-").concat(gradeFee.grade))); }) })] }), _jsx("h6", { className: "mt-3", style: { color: '#C00000' }, children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default GradeFeesForm;
