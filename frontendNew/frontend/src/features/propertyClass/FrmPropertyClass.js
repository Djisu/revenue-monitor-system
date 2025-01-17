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
var FrmPropertyClass = function () {
    var _a = useState({
        property_class: '',
        rate: 0,
    }), propertyClass = _a[0], setPropertyClass = _a[1];
    var _b = useState([]), propertyClasses = _b[0], setPropertyClasses = _b[1];
    var _c = useState(''), addFlag = _c[0], setAddFlag = _c[1];
    var _d = useState(''), delFlag = _d[0], setDelFlag = _d[1];
    useEffect(function () {
        populateListView();
    }, []);
    var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/propertyClasses')];
                case 1:
                    response = _a.sent();
                    setPropertyClasses(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching property classes:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (event) {
        var _a = event.target, name = _a.name, value = _a.value;
        setPropertyClass(function (prevPropertyClass) {
            var _a;
            return (__assign(__assign({}, prevPropertyClass), (_a = {}, _a[name] = name === 'rate' ? parseFloat(value) : value, _a)));
        });
    };
    var handleAdd = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!propertyClass.property_class) {
                        throw new Error('Enter the property class');
                    }
                    if (!propertyClass.rate || isNaN(propertyClass.rate)) {
                        throw new Error('Enter the rate');
                    }
                    return [4 /*yield*/, axios.post('/api/propertyClasses', propertyClass)];
                case 1:
                    response = _a.sent();
                    setAddFlag(response.data.message);
                    populateListView();
                    setPropertyClass({ property_class: '', rate: 0 });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error adding property class:', error_2);
                    setAddFlag('Error in adding a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!propertyClass.property_class) {
                        throw new Error('Enter the property class');
                    }
                    return [4 /*yield*/, axios.delete("/api/propertyClasses/".concat(propertyClass.property_class))];
                case 1:
                    response = _a.sent();
                    setDelFlag(response.data.message);
                    populateListView();
                    setPropertyClass({ property_class: '', rate: 0 });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error deleting property class:', error_3);
                    setDelFlag('Error in deleting record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSelectPropertyClass = function (event) {
        var selectedPropertyClass = event.currentTarget.getAttribute('data-propertyclass');
        if (selectedPropertyClass) {
            var selectedRecord = propertyClasses.find(function (pc) { return pc.property_class === selectedPropertyClass; });
            if (selectedRecord) {
                setPropertyClass(selectedRecord);
            }
        }
    };
    return (_jsx(Container, { children: _jsx(Row, { className: "justify-content-center", children: _jsxs(Col, { xs: 12, md: 8, children: [_jsx("h1", { className: "text-center text-primary", children: "Property Class" }), _jsx("h2", { className: "text-center text-danger", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx("h3", { className: "text-center text-info", children: "PROPERTY CLASS DATA ENTRY" }), _jsxs(Form, { children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Property Class:" }), _jsx(Form.Control, { type: "text", name: "property_class", value: propertyClass.property_class, onChange: handleInputChange, placeholder: "Enter Property Class" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Property Rate:" }), _jsx(Form.Control, { type: "text", name: "rate", value: propertyClass.rate.toFixed(2), onChange: handleInputChange, placeholder: "Enter Property Rate" })] }), _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { variant: "primary", onClick: handleAdd, children: "Add New Record" }), _jsx(Button, { variant: "warning", onClick: handleDelete, children: "Delete" }), _jsx(Button, { variant: "secondary", onClick: function () { return alert('Exit'); }, children: "Exit" })] }), addFlag && _jsx("p", { className: "text-success mt-2", children: addFlag }), delFlag && _jsx("p", { className: "text-danger mt-2", children: delFlag })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "PROPERTY CLASS" }), _jsx("th", { children: "RATE" })] }) }), _jsx("tbody", { children: propertyClasses.map(function (pc) { return (_jsxs("tr", { "data-propertyclass": pc.property_class, onClick: handleSelectPropertyClass, children: [_jsx("td", { children: pc.property_class.toUpperCase() }), _jsx("td", { children: pc.rate.toFixed(2) })] }, pc.property_class)); }) })] })] }) }) }));
};
export default FrmPropertyClass;
