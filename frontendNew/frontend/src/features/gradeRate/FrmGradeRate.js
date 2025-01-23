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
var GradeRateForm = function () {
    var _a = useState({
        grade: '',
        minValue: 0,
        maxValue: 0,
        rate: 0,
    }), gradeRate = _a[0], setGradeRate = _a[1];
    var _b = useState([]), gradeRates = _b[0], setGradeRates = _b[1];
    var _c = useState(''), addFlag = _c[0], setAddFlag = _c[1];
    var _d = useState(''), editFlag = _d[0], setEditFlag = _d[1];
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
                    return [4 /*yield*/, axios.get('/api/gradeRates')];
                case 1:
                    response = _a.sent();
                    setGradeRates(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching grade rates:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (event) {
        var _a = event.target, name = _a.name, value = _a.value;
        setGradeRate(function (prevGradeRate) {
            var _a;
            return (__assign(__assign({}, prevGradeRate), (_a = {}, _a[name] = name === 'rate' ? parseFloat(value) : parseInt(value, 10), _a)));
        });
    };
    var handleAdd = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!gradeRate.grade) {
                        throw new Error('Enter the grade');
                    }
                    if (!gradeRate.minValue) {
                        throw new Error('Enter the Minimum Value');
                    }
                    if (!gradeRate.maxValue) {
                        throw new Error('Enter the Maximum Value');
                    }
                    if (!gradeRate.rate) {
                        throw new Error('Enter the rate');
                    }
                    return [4 /*yield*/, axios.post('/api/gradeRates', gradeRate)];
                case 1:
                    response = _a.sent();
                    setAddFlag(response.data.message);
                    populateListView();
                    setGradeRate({ grade: '', minValue: 0, maxValue: 0, rate: 0 });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error adding grade rate:', error_2);
                    setAddFlag('Error in adding a record');
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
                    if (!gradeRate.grade) {
                        throw new Error('Enter the grade');
                    }
                    if (!gradeRate.minValue) {
                        throw new Error('Enter the Minimum Value');
                    }
                    if (!gradeRate.maxValue) {
                        throw new Error('Enter the Maximum Value');
                    }
                    if (!gradeRate.rate) {
                        throw new Error('Enter the rate');
                    }
                    return [4 /*yield*/, axios.put("/api/gradeRates/".concat(gradeRate.grade), gradeRate)];
                case 1:
                    response = _a.sent();
                    setEditFlag(response.data.message);
                    populateListView();
                    setGradeRate({ grade: '', minValue: 0, maxValue: 0, rate: 0 });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error editing grade rate:', error_3);
                    setEditFlag('Error in editing a record');
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
                    if (!gradeRate.grade) {
                        throw new Error('Enter the grade');
                    }
                    return [4 /*yield*/, axios.delete("/api/gradeRates/".concat(gradeRate.grade))];
                case 1:
                    response = _a.sent();
                    setDelFlag(response.data.message);
                    populateListView();
                    setGradeRate({ grade: '', minValue: 0, maxValue: 0, rate: 0 });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error deleting grade rate:', error_4);
                    setDelFlag('Error in deleting record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSelectGradeRate = function (event) {
        var selectedGrade = event.currentTarget.getAttribute('data-grade');
        if (selectedGrade) {
            var selectedRecord = gradeRates.find(function (gr) { return gr.grade === selectedGrade; });
            if (selectedRecord) {
                setGradeRate(selectedRecord);
            }
        }
    };
    return (_jsxs(Container, { children: [_jsx(Row, { className: "justify-content-center", children: _jsxs(Col, { xs: 12, md: 8, children: [_jsx("h1", { className: "text-center text-primary", children: "Grade Rates Data Entry" }), _jsx("h2", { className: "text-center text-info", children: "CALIBRATE FEE FIXING GRADES" }), _jsx("h2", { className: "text-center text-danger", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsxs(Form, { children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Grade:" }), _jsx(Form.Control, { type: "text", name: "grade", value: gradeRate.grade, onChange: handleInputChange, placeholder: "Enter Grade" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Minimum Value:" }), _jsx(Form.Control, { type: "text", name: "minValue", value: gradeRate.minValue, onChange: handleInputChange, placeholder: "Enter Minimum Value" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Maximum Value:" }), _jsx(Form.Control, { type: "text", name: "maxValue", value: gradeRate.maxValue, onChange: handleInputChange, placeholder: "Enter Maximum Value" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Rate:" }), _jsx(Form.Control, { type: "text", name: "rate", value: gradeRate.rate.toFixed(2), onChange: handleInputChange, placeholder: "Enter Rate" })] }), _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { variant: "primary", onClick: handleAdd, children: "Add New Record" }), _jsx(Button, { variant: "warning", onClick: handleEdit, children: "Edit Old Record" }), _jsx(Button, { variant: "danger", onClick: handleDelete, children: "Delete" }), _jsx(Button, { variant: "secondary", onClick: function () { return alert('Exit'); }, children: "Exit" }), _jsx(Button, { variant: "info", onClick: populateListView, children: "Load Spreadsheet" })] }), addFlag && _jsx("p", { className: "text-success mt-2", children: addFlag }), editFlag && _jsx("p", { className: "text-success mt-2", children: editFlag }), delFlag && _jsx("p", { className: "text-danger mt-2", children: delFlag })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "GRADE" }), _jsx("th", { children: "MINIMUM VALUE" }), _jsx("th", { children: "MAXIMUM VALUE" }), _jsx("th", { children: "RATE" })] }) }), _jsx("tbody", { children: gradeRates.map(function (gr) { return (_jsxs("tr", { "data-grade": gr.grade, onClick: handleSelectGradeRate, children: [_jsx("td", { children: gr.grade.toUpperCase() }), _jsx("td", { children: gr.minValue }), _jsx("td", { children: gr.maxValue }), _jsx("td", { children: gr.rate.toFixed(2) })] }, gr.grade)); }) })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default GradeRateForm;
