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
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
var ProducePropertyRatesVarianceAnalysis = function () {
    var _a = useState(''), electoralArea = _a[0], setElectoralArea = _a[1];
    var _b = useState(''), startDate = _b[0], setStartDate = _b[1];
    var _c = useState(''), endDate = _c[0], setEndDate = _c[1];
    var _d = useState(''), businessType = _d[0], setBusinessType = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var _f = useState([]), electoralAreas = _f[0], setElectoralAreas = _f[1];
    var _g = useState([]), businessTypes = _g[0], setBusinessTypes = _g[1];
    var _h = useState([]), dates = _h[0], setDates = _h[1];
    var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/businessTypes')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setBusinessTypes(data.map(function (item) { return item.electroral_area; }));
                    setBusinessType(data[0].electroral_area); // Set first business type as default
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setError('No business types found');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/electoralAreas')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setElectoralAreas(data.map(function (item) { return item.electroral_area; }));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError('No electoral areas found');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchDates = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/dates?electoral_area=".concat(electoralArea))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setDates(data.map(function (item) { return item.transdate; }));
                    setStartDate(data[0].transdate);
                    setEndDate(data[data.length - 1].transdate);
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    setError('No payment records date found');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleBusinessTypeChange = function (event) {
        setBusinessType(event.target.value);
    };
    var handleElectoralAreaChange = function (event) {
        setElectoralArea(event.target.value);
    };
    var handleStartDateChange = function (event) {
        setStartDate(event.target.value);
    };
    var handleEndDateChange = function (event) {
        setEndDate(event.target.value);
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!electoralArea || !startDate || !endDate) {
                        setError('Select an electoral area and both start and end dates');
                        return [2 /*return*/];
                    }
                    // Reset error message
                    setError('');
                    return [4 /*yield*/, fetch("/api/detailedPreview?electoral_area=".concat(electoralArea, "&start_date=").concat(startDate, "&end_date=").concat(endDate))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data) {
                        // Handle the response data as needed
                        console.log(data);
                        alert('Detailed Preview generated successfully');
                    }
                    else {
                        setError('No records found');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    setError('Error generating detailed preview');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSummaryClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!electoralArea || !startDate || !endDate) {
                        setError('Select an electoral area and both start and end dates');
                        return [2 /*return*/];
                    }
                    // Reset error message
                    setError('');
                    return [4 /*yield*/, fetch("/api/summaryPreview?electoral_area=".concat(electoralArea, "&start_date=").concat(startDate, "&end_date=").concat(endDate))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data) {
                        // Handle the response data as needed
                        console.log(data);
                        alert('Summary Preview generated successfully');
                    }
                    else {
                        setError('No records found');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    setError('Error generating summary preview');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Implement exit functionality if needed
        alert('Exit clicked');
    };
    useEffect(function () {
        fetchBusinessTypes();
    }, []);
    useEffect(function () {
        fetchElectoralAreas();
    }, []);
    useEffect(function () {
        fetchDates();
    }, [electoralArea]);
    useEffect(function () {
        // Format current date on form load
        setEndDate(new Date().toLocaleDateString('en-GB'));
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h3", { className: "text-center mt-5", style: { color: '#0000C0', textDecoration: 'underline' }, children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx("h4", { className: "text-center mt-3", children: "Electoral Areas Variance Analysis" }), error && _jsx(Alert, { variant: "danger", children: error }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formBusinessType", className: "mb-3", children: [_jsx(Form.Label, { children: "Business Type" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", disabled: true, children: "Select a business type" }), businessTypes.map(function (type) { return (_jsx("option", { value: type, children: type }, type)); })] }), _jsx(Form.Label, { className: "mt-2", style: { color: '#0000C0' }, children: "Leave Electoral Area empty to show all business types" })] }), _jsxs(Form.Group, { controlId: "formElectoralArea", className: "mb-3", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: electoralArea, onChange: handleElectoralAreaChange, children: [_jsx("option", { value: "", disabled: true, children: "Select an electoral area" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }), _jsxs(Form.Group, { controlId: "formStartDate", className: "mb-3", children: [_jsx(Form.Label, { children: "Start Date" }), _jsxs(Form.Select, { value: startDate, onChange: handleStartDateChange, children: [_jsx("option", { value: "", disabled: true, children: "Select a start date" }), dates.map(function (date) { return (_jsx("option", { value: date, children: date }, date)); })] })] }), _jsxs(Form.Group, { controlId: "formEndDate", className: "mb-3", children: [_jsx(Form.Label, { children: "End Date" }), _jsxs(Form.Select, { value: endDate, onChange: handleEndDateChange, children: [_jsx("option", { value: "", disabled: true, children: "Select an end date" }), dates.map(function (date) { return (_jsx("option", { value: date, children: date }, date)); })] })] }), _jsxs(Form.Group, { controlId: "formFieldOfficer", className: "mb-3", style: { display: 'none' }, children: [_jsx(Form.Label, { children: "Field Officer" }), _jsx(Form.Control, { type: "text", placeholder: "Leave EMPTY for all field officers", disabled: true })] }), _jsx(Form.Group, { controlId: "formFieldOfficerLabel", className: "mb-3", style: { display: 'none' }, children: _jsx(Form.Label, { children: "Leave Field Officer EMPTY for all field officers" }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { className: "text-center", children: [_jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Detailed Preview" }), _jsx(Button, { variant: "secondary", onClick: handleSummaryClick, children: "Summerized Preview" }), _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Exit" })] }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] })] }));
};
export default ProducePropertyRatesVarianceAnalysis;
