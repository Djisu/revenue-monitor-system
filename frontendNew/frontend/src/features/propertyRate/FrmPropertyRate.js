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
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';
import { fetchPropertyRates, createPropertyRate, updatePropertyRate, deletePropertyRate } from './propertyRateSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
var FrmProducePropertyRate = function () {
    // Use dispatch to call actions and update state
    var dispatch = useAppDispatch();
    // Use selector to get state
    var propertyRates = useAppSelector(function (state) { return state.propertyRate.rates; });
    var propertyClasses = useAppSelector(function (state) { return state.propertyClass.propertyClasses; });
    // State management for form fields
    var _a = useState(''), propertyClass = _a[0], setPropertyClass = _a[1];
    var year = new Date().getFullYear();
    var _b = useState(year.toString()), fiscalYear = _b[0], setFiscalYear = _b[1];
    var _c = useState(''), rate = _c[0], setRate = _c[1];
    var _d = useState(''), registrationRate = _d[0], setRegistrationRate = _d[1];
    // State management for dropdowns
    var _e = useState([]), localPropertyClasses = _e[0], setLocalPropertyClasses = _e[1];
    // State management for ListView equivalent
    var _f = useState([]), localPropertyRates = _f[0], setLocalPropertyRates = _f[1];
    // Fetch dropdowns and ListView data on component mount
    useEffect(function () {
        fetchClasses();
        fetchRates();
    }, []);
    var fetchClasses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch(fetchPropertyClasses())];
                case 1:
                    response = _a.sent();
                    localPropertyClasses = response.payload.property_classes;
                    setLocalPropertyClasses(localPropertyClasses);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching classes:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchRates = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch(fetchPropertyRates())];
                case 1:
                    response = _a.sent();
                    localPropertyRates = response.payload.rates;
                    setLocalPropertyRates(localPropertyRates);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching rates:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var propertyRateData, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    propertyRateData = {
                        property_class: propertyClass,
                        fiscalyear: parseInt(fiscalYear, 10),
                        rate: parseFloat(rate),
                        registrationrate: parseFloat(registrationRate),
                    };
                    return [4 /*yield*/, dispatch(createPropertyRate(propertyRateData))];
                case 1:
                    response = _a.sent();
                    alert(response.payload.message);
                    fetchRates();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error adding rate:', error_3);
                    alert('Error in adding a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var propertyRateData, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    propertyRateData = {
                        property_class: propertyClass,
                        fiscalyear: parseInt(fiscalYear, 10),
                        rate: parseFloat(rate),
                        registrationrate: parseFloat(registrationRate),
                    };
                    return [4 /*yield*/, dispatch(updatePropertyRate({ property_Class: propertyClass, fiscalyear: parseInt(fiscalYear, 10), propertyRateData: propertyRateData }))];
                case 1:
                    response = _a.sent();
                    alert(response.payload.message);
                    fetchRates();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error editing rate:', error_4);
                    alert('Error in editing a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch(deletePropertyRate({ property_Class: propertyClass, fiscalyear: parseInt(fiscalYear, 10) }))];
                case 1:
                    response = _a.sent();
                    alert(response.payload.message);
                    fetchRates();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error editing rate:', error_5);
                    alert('Error in editing a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // const handleExitClick = () => {
    //   // Add your logic to exit here
    //   console.log('Exit');
    //   setPropertyClass(rate.property_class);
    //   setFiscalYear(rate.fiscalyear.toString());
    //   setRate(rate.rate.toString());
    //   setRegistrationRate(rate.registrationrate.toString());
    // };
    var handleSelectChange = function (e) {
        var selectedValue = e.target.value;
        console.log('Selected value:', selectedValue);
        var selectedPropertyClass = propertyClasses.find(function (propertyClass) { return propertyClass.property_class === selectedValue; });
        if (selectedPropertyClass) {
            console.log('selectedPropertyClass.property_class: ', selectedPropertyClass.property_class);
            setPropertyClass(selectedPropertyClass.property_class);
            console.log('rate: ', rate);
            setRate(selectedPropertyClass.rate.toString()); // Ensure rate is a string if you're using it as a controlled component value
        }
    };
    var handleListViewItemClick = function (rate) {
        // Your logic here, e.g., navigating to a detail page or opening a modal
        console.log('Clicked rate:', rate);
    };
    return (_jsx("div", { className: "container", children: _jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h4", { className: "text-primary", children: "Property Rate Data Entry" }) }) }), _jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Property Class:" }), _jsxs(Form.Select, { value: propertyClass, onChange: handleSelectChange, children: [_jsx("option", { value: "", children: "Select Property Class" }), propertyClasses.map(function (propertyClass, index) { return (_jsxs("option", { value: propertyClass.property_class, children: [propertyClass.property_class, " ", propertyClass.rate] }, index)); })] })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Rate:" }), _jsx(Form.Control, { value: rate, onChange: function (e) { return setRate(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsx(Form.Control, { value: fiscalYear, onChange: function (e) { return setFiscalYear(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Registration Rate:" }), _jsx(Form.Control, { value: registrationRate, onChange: function (e) { return setRegistrationRate(e.target.value); } })] }) })] }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "PROPERTY CLASS" }), _jsx("th", { children: "FISCAL YEAR" }), _jsx("th", { children: "RATE" }), _jsx("th", { children: "REGISTRATION RATE" })] }) }), _jsx("tbody", { children: propertyRates.map(function (rate) { return (_jsxs("tr", { onClick: function () { return handleListViewItemClick(rate); }, children: [_jsx("td", { children: rate.property_class }), _jsx("td", { children: rate.fiscalyear }), _jsx("td", { children: rate.rate }), _jsx("td", { children: rate.registrationrate })] }, "".concat(rate.property_class, "-").concat(rate.fiscalyear))); }) })] }) }) }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { className: "d-flex flex-column", children: [_jsx(Button, { variant: "primary", onClick: handleAddClick, className: "mb-2", children: "Add New Record" }), _jsx(Button, { variant: "warning", onClick: handleEditClick, className: "mb-2", children: "Edit Old Record" }), _jsx(Button, { variant: "danger", onClick: handleDeleteClick, className: "mb-2", children: "Delete Old Record" }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }) })] }) }));
    ;
};
export default FrmProducePropertyRate;
