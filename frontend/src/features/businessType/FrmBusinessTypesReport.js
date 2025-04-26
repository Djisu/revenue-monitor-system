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
import { Link } from 'react-router-dom';
var BusinessTypesReport = function () {
    var _a = useState(''), businessType = _a[0], setBusinessType = _a[1];
    var _b = useState([]), businessTypes = _b[0], setBusinessTypes = _b[1];
    var _c = useState(''), error = _c[0], setError = _c[1];
    var _d = useState(false), isLoading = _d[0], setIsLoading = _d[1];
    useEffect(function () {
        var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, types, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/business-types')];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        types = data.map(function (record) { return record.buss_type; });
                        setBusinessTypes(types);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        setError(error_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchBusinessTypes();
    }, []);
    // const fetchBusinessTypes = async () => {
    //     try {
    //         const response = await fetch('/api/business-types');
    //         const data: BusinessType[] = await response.json();
    //         const types = data.map((record) => record.buss_type);
    //         setBusinessTypes(types);
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    // };
    var handleBusinessTypeChange = function (e) {
        var selectedBusinessType = e.target.value;
        setBusinessType(selectedBusinessType);
    };
    var handleViewReportSortedByCategory = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleProduceReport('sorted-by-category', false)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleViewReportElectoralArea = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleProduceReport('electoral-area', false)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleViewReportCurrentRates = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleProduceReport('current-rates', false)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleViewReportCurrentRatesActual = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleProduceReport('current-rates', true)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleViewReportElectoralAreaActual = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleProduceReport('electoral-area', true)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleViewReportGradeActual = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleProduceReport('grade', true)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleProduceReport = function (reportType, isActual) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/produce-report', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ businessType: businessType, reportType: reportType, isActual: isActual }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        window.location.href = "/reports/".concat(reportType); // Redirect to report page
                    }
                    else {
                        setError(data.message);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    setError(error_2.message);
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Logic to hide the form and show the main form
        // This can be managed by routing or state in a larger application
        window.location.href = '/'; // Redirect to main page or handle as needed
    };
    return (_jsxs("div", { className: "container mt-5", children: [error && _jsx(Alert, { color: "danger", children: error }), _jsx("h1", { className: "text-center text-underline", children: "Business Types Report" }), _jsx("h2", { className: "text-center", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsxs(Form, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { for: "businessType", className: "font-weight-bold", children: "Business Type:" }), _jsxs(Input, { type: "select", name: "businessType", id: "businessType", value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select Business Type" }), businessTypes.map(function (bt) { return (_jsx("option", { value: bt, children: bt }, bt)); })] })] }), _jsx(FormGroup, { children: _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { color: "primary", onClick: handleViewReportSortedByCategory, disabled: isLoading, children: isLoading ? 'Loading...' : 'View Report (sorted by category)' }), _jsx(Button, { color: "success", onClick: handleViewReportElectoralArea, disabled: isLoading, children: isLoading ? 'Loading...' : 'View Report (electoral area)' }), _jsx(Button, { color: "warning", onClick: handleViewReportCurrentRates, disabled: isLoading, style: { display: 'none' }, children: isLoading ? 'Loading...' : 'View Report (current rates)' }), _jsx(Button, { color: "danger", onClick: handleExitClick, children: "Exit" })] }) })] }), _jsxs("div", { className: "mt-5", children: [_jsx("h2", { className: "text-center", children: "Actual Reports" }), _jsx(Form, { children: _jsx(FormGroup, { children: _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { color: "primary", onClick: handleViewReportGradeActual, disabled: isLoading, children: isLoading ? 'Loading...' : 'View Report (sorted by category)' }), _jsx(Button, { color: "success", onClick: handleViewReportElectoralAreaActual, disabled: isLoading, children: isLoading ? 'Loading...' : 'View Report (electoral area)' }), _jsx(Button, { color: "warning", onClick: handleViewReportCurrentRatesActual, disabled: isLoading, style: { display: 'none' }, children: isLoading ? 'Loading...' : 'View Report (current rates)' }), _jsx(Button, { color: "danger", onClick: handleExitClick, children: "Exit" })] }) }) })] }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default BusinessTypesReport;
