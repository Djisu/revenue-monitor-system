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
var DailyPayments = function () {
    var _a = useState(''), zone = _a[0], setZone = _a[1];
    var _b = useState(''), bussType = _b[0], setBussType = _b[1];
    var _c = useState(''), firstDate = _c[0], setFirstDate = _c[1];
    var _d = useState(''), lastDate = _d[0], setLastDate = _d[1];
    var _e = useState([]), zones = _e[0], setZones = _e[1];
    var _f = useState([]), bussTypes = _f[0], setBussTypes = _f[1];
    var _g = useState([]), paymentDates = _g[0], setPaymentDates = _g[1];
    var _h = useState(''), error = _h[0], setError = _h[1];
    var _j = useState(false), isLoading = _j[0], setIsLoading = _j[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var zonesResponse, zonesData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Update business zones in payments
                        return [4 /*yield*/, fetch('/api/update-business-zones', { method: 'POST' })];
                    case 1:
                        // Update business zones in payments
                        _a.sent();
                        return [4 /*yield*/, fetch('/api/zones')];
                    case 2:
                        zonesResponse = _a.sent();
                        return [4 /*yield*/, zonesResponse.json()];
                    case 3:
                        zonesData = _a.sent();
                        setZones(zonesData);
                        // Fetch payment dates (if zone is pre-selected)
                        if (zone) {
                            fetchPaymentDates(zone);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        setError(error_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [zone]);
    var fetchPaymentDates = function (zone) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, dates, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/payment-dates?zone=".concat(zone))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    dates = data.map(function (record) { return record.transdate; });
                    setPaymentDates(dates);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    setError(error_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchBussTypes = function (zone) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, types, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!zone) {
                        setError("Select a zone");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("/api/business-types?zone=".concat(zone))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    types = data.map(function (record) { return record.buss_type; });
                    setBussTypes(types);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    setError(error_3.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleZoneChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedZone;
        return __generator(this, function (_a) {
            selectedZone = e.target.value;
            setZone(selectedZone);
            // Fetch business types based on the selected zone
            fetchBussTypes(selectedZone);
            // Fetch payment dates based on the selected zone
            fetchPaymentDates(selectedZone);
            return [2 /*return*/];
        });
    }); };
    var handleFirstDateChange = function (e) {
        var selectedDate = e.target.value;
        setFirstDate(selectedDate);
    };
    var handleLastDateChange = function (e) {
        var selectedDate = e.target.value;
        setLastDate(selectedDate);
    };
    var handleProduceReport = function (posted) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_4;
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
                            body: JSON.stringify({ firstDate: firstDate, lastDate: lastDate, zone: zone, bussType: bussType, posted: posted }),
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.success) {
                        window.location.href = '/reports/daily-zones-payments'; // Redirect to report page
                    }
                    else {
                        setError(data.message);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_4 = _a.sent();
                    setError(error_4.message);
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleViewClick = function () {
        handleProduceReport(false);
    };
    var handleProduceReportClick = function () {
        handleProduceReport(true);
    };
    var handleExitClick = function () {
        // Logic to hide the form and show the main form
        // This can be managed by routing or state in a larger application
        window.location.href = '/'; // Redirect to main page or handle as needed
    };
    return (_jsxs("div", { className: "container mt-5", children: [error && _jsx(Alert, { color: "danger", children: error }), _jsx("h1", { className: "text-center text-underline", children: "Produce Daily Payments Report" }), _jsx("h2", { className: "text-center", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsxs(Form, { children: [_jsxs(FormGroup, { children: [_jsx(Label, { for: "zone", className: "font-weight-bold", children: "Electoral Area:" }), _jsxs(Input, { type: "select", name: "zone", id: "zone", value: zone, onChange: handleZoneChange, children: [_jsx("option", { value: "", children: "Select Zone" }), zones.map(function (z) { return (_jsx("option", { value: z, children: z }, z)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "bussType", className: "font-weight-bold", children: "Business Type/Profession:" }), _jsxs(Input, { type: "select", name: "bussType", id: "bussType", value: bussType, onChange: function (e) { return setBussType(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Business Type" }), bussTypes.map(function (bt) { return (_jsx("option", { value: bt, children: bt }, bt)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "firstDate", className: "font-weight-bold", children: "First Payment Date:" }), _jsxs(Input, { type: "select", name: "firstDate", id: "firstDate", value: firstDate, onChange: handleFirstDateChange, children: [_jsx("option", { value: "", children: "Select Date" }), paymentDates.map(function (date) { return (_jsx("option", { value: date, children: date }, date)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "lastDate", className: "font-weight-bold", children: "Last Payment Date:" }), _jsxs(Input, { type: "select", name: "lastDate", id: "lastDate", value: lastDate, onChange: handleLastDateChange, children: [_jsx("option", { value: "", children: "Select Date" }), paymentDates.map(function (date) { return (_jsx("option", { value: date, children: date }, date)); })] })] }), _jsx(FormGroup, { children: _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { color: "primary", onClick: handleViewClick, disabled: isLoading, children: isLoading ? 'Loading...' : 'Produce Report (unposted payments)' }), _jsx(Button, { color: "success", onClick: handleProduceReportClick, disabled: isLoading, children: isLoading ? 'Loading...' : 'Produce Report (posted payments)' }), _jsx(Button, { color: "danger", onClick: handleExitClick, children: "Exit" })] }) })] })] }));
};
export default DailyPayments;
