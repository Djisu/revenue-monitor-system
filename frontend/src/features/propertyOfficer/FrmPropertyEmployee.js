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
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var FrmPropertyEmployee = function () {
    var _a = useState({
        officer_no: '',
        officer_name: '',
        photo: '',
    }), employee = _a[0], setEmployee = _a[1];
    var _b = useState([]), employees = _b[0], setEmployees = _b[1];
    var _c = useState(''), addflag = _c[0], setAddflag = _c[1];
    var _d = useState(''), editflag = _d[0], setEditflag = _d[1];
    var _e = useState(''), delFlag = _e[0], setDelFlag = _e[1];
    useEffect(function () {
        populateListView();
    }, []);
    var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/employees')];
                case 1:
                    response = _a.sent();
                    setEmployees(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching employees:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (event) {
        var _a = event.target, name = _a.name, value = _a.value;
        setEmployee(function (prevEmployee) {
            var _a;
            return (__assign(__assign({}, prevEmployee), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleAdd = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!employee.officer_no || !employee.officer_name) {
                        throw new Error('Officer ID and Name cannot be empty');
                    }
                    return [4 /*yield*/, axios.post('/api/employees', employee)];
                case 1:
                    response = _a.sent();
                    setAddflag(response.data.message);
                    populateListView();
                    setEmployee({ officer_no: '', officer_name: '', photo: '' });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error adding employee:', error_2);
                    setAddflag('Error in adding a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!employee.officer_no || !employee.officer_name) {
                        throw new Error('Officer ID and Name cannot be empty');
                    }
                    return [4 /*yield*/, axios.put("/api/employees/".concat(employee.officer_no), employee)];
                case 1:
                    response = _a.sent();
                    setEditflag(response.data.message);
                    populateListView();
                    setEmployee({ officer_no: '', officer_name: '', photo: '' });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error editing employee:', error_3);
                    setEditflag('Error in editing a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!employee.officer_no) {
                        throw new Error('Officer ID cannot be empty');
                    }
                    return [4 /*yield*/, axios.delete("/api/employees/".concat(employee.officer_no))];
                case 1:
                    response = _a.sent();
                    setDelFlag(response.data.message);
                    populateListView();
                    setEmployee({ officer_no: '', officer_name: '', photo: '' });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error deleting employee:', error_4);
                    setDelFlag('Error in deleting record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSelectEmployee = function (event) {
        var selectedOfficerNo = event.currentTarget.getAttribute('data-officerno');
        if (selectedOfficerNo) {
            var selectedEmployee = employees.find(function (emp) { return emp.officer_no === selectedOfficerNo; });
            if (selectedEmployee) {
                setEmployee(selectedEmployee);
            }
        }
    };
    var handlePhotoClick = function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function (e) {
            var target = e.target;
            if (target.files && target.files.length > 0) {
                var file_1 = target.files[0];
                setEmployee(function (prevEmployee) { return (__assign(__assign({}, prevEmployee), { photo: URL.createObjectURL(file_1) })); });
            }
        };
        input.click();
    };
    return (_jsxs(Container, { children: [_jsx(Row, { className: "justify-content-center", children: _jsxs(Col, { xs: 12, md: 8, children: [_jsx("h1", { className: "text-center text-primary", children: "Employees for Property Rates" }), _jsx("h2", { className: "text-center text-info", children: "MARKORY WEST MUNICIPAL ASSEMBLY" }), _jsxs(Form, { children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Employee ID:" }), _jsx(Form.Control, { type: "text", name: "officer_no", value: employee.officer_no, onChange: handleInputChange, placeholder: "Enter Employee ID" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Name:" }), _jsx(Form.Control, { type: "text", name: "officer_name", value: employee.officer_name, onChange: handleInputChange, placeholder: "Enter Name" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Photo:" }), _jsx(Form.Control, { type: "text", name: "photo", value: employee.photo, onClick: handlePhotoClick, readOnly: true, placeholder: "Select Photo" })] }), _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { variant: "primary", onClick: handleAdd, children: "Add" }), _jsx(Button, { variant: "warning", onClick: handleEdit, children: "Edit" }), _jsx(Button, { variant: "danger", onClick: handleDelete, children: "Delete" }), _jsx(Button, { variant: "info", onClick: function () { return alert('View Logins'); }, children: "View Logins" })] }), addflag && _jsx("p", { className: "text-success mt-2", children: addflag }), editflag && _jsx("p", { className: "text-success mt-2", children: editflag }), delFlag && _jsx("p", { className: "text-danger mt-2", children: delFlag })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "OFFICER NAME" }), _jsx("th", { children: "PHOTO" })] }) }), _jsx("tbody", { children: employees.map(function (emp) { return (_jsxs("tr", { "data-officerno": emp.officer_no, onClick: handleSelectEmployee, children: [_jsx("td", { children: emp.officer_no }), _jsx("td", { children: emp.officer_name.toUpperCase() }), _jsx("td", { children: emp.photo && emp.photo !== 'xx' ? (_jsx("img", { src: emp.photo, alt: emp.officer_name, style: { width: '100px', height: '100px' } })) : ('No Photo') })] }, emp.officer_no)); }) })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default FrmPropertyEmployee;
