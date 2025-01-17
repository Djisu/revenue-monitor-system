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
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
var CompareTwoYears = function () {
    var _a = useState(''), firstFiscalYear = _a[0], setFirstFiscalYear = _a[1];
    var _b = useState(''), secondFiscalYear = _b[0], setSecondFiscalYear = _b[1];
    var _c = useState(''), firstOfficer = _c[0], setFirstOfficer = _c[1];
    //const [lastOfficer, setLastOfficer] = useState<string>('');
    var _d = useState(''), officerName = _d[0], setOfficerName = _d[1];
    var _e = useState([]), fiscalYears = _e[0], setFiscalYears = _e[1];
    var _f = useState([]), officers = _f[0], setOfficers = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    useEffect(function () {
        fetchFiscalYears();
        fetchOfficers();
    }, []);
    var fetchFiscalYears = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/fiscal-years')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setFiscalYears(data);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    setError(error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchOfficers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/officers')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setOfficers(data);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    setError(error_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFirstOfficerChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var officerNo, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    officerNo = e.target.value.trim().split(' ')[0];
                    setFirstOfficer(officerNo);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/officer/".concat(officerNo))];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data) {
                        setOfficerName(data.officer_name);
                    }
                    else {
                        setError("No officer details found for this collector.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    setError(error_3.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!firstOfficer) {
                        setOfficerName('');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/preview-report', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ firstFiscalYear: firstFiscalYear, secondFiscalYear: secondFiscalYear, firstOfficer: firstOfficer }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        // Logic to display the report (e.g., redirect to a report page)
                        window.location.href = '/reports/two-year-comparison';
                    }
                    else {
                        setError("Error processing the report.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    setError(error_4.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Logic to hide the form and show the main form
        // This can be managed by routing or state in a larger application
        window.location.href = '/'; // Redirect to main page or handle as needed
    };
    return (_jsxs("div", { className: "container mt-5", children: [error && _jsx(Alert, { color: "danger", children: error }), _jsx("h1", { className: "text-center text-underline", children: "Collector Performance Trend" }), _jsx("h2", { className: "text-center", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsxs(Form, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { for: "firstFiscalYear", className: "font-weight-bold", children: "First Fiscal Year:" }), _jsxs(Input, { type: "select", name: "firstFiscalYear", id: "firstFiscalYear", value: firstFiscalYear, onChange: function (e) { return setFirstFiscalYear(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Year" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year, children: year }, year)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "firstOfficer", className: "font-weight-bold", children: "First Officer:" }), _jsxs(Input, { type: "select", name: "firstOfficer", id: "firstOfficer", value: firstOfficer, onChange: handleFirstOfficerChange, children: [_jsx("option", { value: "", children: "Select Officer" }), officers.map(function (officer) { return (_jsx("option", { value: officer.split(' ')[0], children: officer }, officer)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "secondFiscalYear", className: "font-weight-bold", children: "Second Fiscal Year:" }), _jsxs(Input, { type: "select", name: "secondFiscalYear", id: "secondFiscalYear", value: secondFiscalYear, onChange: function (e) { return setSecondFiscalYear(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Year" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year, children: year }, year)); })] })] }), _jsx(FormGroup, { children: _jsx(Label, { className: "font-weight-bold", children: officerName }) }), _jsx(FormGroup, { children: _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { color: "primary", onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }), _jsx(Button, { color: "danger", onClick: handleExitClick, children: "Exit" })] }) })] })] }));
};
export default CompareTwoYears;
