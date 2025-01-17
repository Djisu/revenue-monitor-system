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
var FrmMidlevelDetailedReport = function () {
    var _a = useState(''), zone = _a[0], setZone = _a[1];
    var _b = useState(''), businessType = _b[0], setBusinessType = _b[1];
    var _c = useState('1/1/1900'), firstDate = _c[0], setFirstDate = _c[1];
    var _d = useState(new Date().getFullYear().toString()), lastDate = _d[0], setLastDate = _d[1];
    var _e = useState([]), businessList = _e[0], setBusinessList = _e[1];
    var _f = useState([]), businessTypeList = _f[0], setBusinessTypeList = _f[1];
    var _g = useState([]), electoralAreaList = _g[0], setElectoralAreaList = _g[1];
    var _h = useState([]), fiscalYearList = _h[0], setFiscalYearList = _h[1];
    var _j = useState(''), error = _j[0], setError = _j[1];
    var _k = useState(''), successMessage = _k[0], setSuccessMessage = _k[1];
    var _l = useState(false), showFirstDate = _l[0], setShowFirstDate = _l[1];
    useEffect(function () {
        setShowFirstDate(false);
        fetchElectoralAreas();
        fetchBusinessTypes();
        fetchFiscalYears();
    }, []);
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/electoral_areas')];
                case 1:
                    response = _a.sent();
                    setElectoralAreaList(response.data.map(function (area) { return area.electroral_area; }));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('Error fetching electoral areas');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
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
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error fetching business types');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchFiscalYears = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/fiscal_years')];
                case 1:
                    response = _a.sent();
                    setFiscalYearList(response.data.map(function (year) { return year.fiscal_year; }));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('Error fetching fiscal years');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleZoneChange = function (e) {
        setZone(e.target.value);
        updateBusinessTypesAndElectoralAreas();
    };
    var handleBusinessTypeChange = function (e) {
        setBusinessType(e.target.value);
    };
    var handleFirstDateChange = function (e) {
        setFirstDate(e.target.value);
    };
    var handleLastDateChange = function (e) {
        setLastDate(e.target.value);
    };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, detailedReports, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!zone && !businessType) {
                        setError('Please fill in at least one field (Zone or Business Type)');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, axios.delete('http://your-api-url/tb_BusTypeDetailedReport')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_business', {
                            params: {
                                status: 'Active',
                                electroral_area: zone || undefined,
                                buss_type: businessType || undefined,
                            },
                        })];
                case 3:
                    response = _a.sent();
                    if (response.data.length === 0) {
                        setError('No records found');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(response.data.map(function (business) { return __awaiter(void 0, void 0, void 0, function () {
                            var amountDue, amountPaidResponse, amountPaid, balance;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        amountDue = business.current_rate;
                                        return [4 /*yield*/, axios.get('http://your-api-url/amount_paid', {
                                                params: {
                                                    buss_no: business.buss_no,
                                                    fiscal_year: lastDate,
                                                },
                                            })];
                                    case 1:
                                        amountPaidResponse = _a.sent();
                                        amountPaid = amountPaidResponse.data.sum || 0;
                                        balance = amountDue - amountPaid;
                                        return [2 /*return*/, {
                                                electroral_area: business.electroral_area,
                                                buss_no: business.buss_no,
                                                buss_name: business.buss_name,
                                                buss_type: business.buss_type,
                                                amountdue: amountDue,
                                                amountpaid: amountPaid,
                                                balance: balance,
                                                tot_grade: business.tot_grade,
                                            }];
                                }
                            });
                        }); }))];
                case 4:
                    detailedReports = _a.sent();
                    return [4 /*yield*/, axios.post('http://your-api-url/tb_BusTypeDetailedReport', detailedReports)];
                case 5:
                    _a.sent();
                    setSuccessMessage('Report produced successfully');
                    setError('');
                    fetchDetailedReports();
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error(error_4);
                    setError('Error producing report');
                    setSuccessMessage('');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        window.location.href = '/'; // Redirect to main page or hide the form
    };
    var updateBusinessTypesAndElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Update the business zones in payments
                    return [4 /*yield*/, axios.put('http://your-api-url/update_busPayments_zones')];
                case 1:
                    // Update the business zones in payments
                    _a.sent();
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_business', {
                            params: {
                                status: 'Active',
                                electroral_area: zone || undefined,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length === 0) {
                        setError('No business type found');
                        return [2 /*return*/];
                    }
                    setBusinessList(response.data);
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error(error_5);
                    setError('Error fetching business types');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchDetailedReports = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_BusTypeDetailedReport')];
                case 1:
                    response = _a.sent();
                    setBusinessList(response.data.map(function (report) { return ({
                        electroral_area: report.electroral_area,
                        buss_no: report.buss_no,
                        buss_name: report.buss_name,
                        buss_type: report.buss_type,
                        current_rate: report.amountdue,
                        tot_grade: report.tot_grade,
                    }); }));
                    if (response.data.length === 0) {
                        setError('No records found in detailed report');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error(error_6);
                    setError('Error fetching detailed report');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Mid Level Detailed Report (B)" }), error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formZone", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: zone, onChange: handleZoneChange, children: [_jsx("option", { value: "", children: "Select an electoral area" }), electoralAreaList.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }), _jsxs(Form.Group, { controlId: "formBussType", children: [_jsx(Form.Label, { children: "Business Type/Profession:" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select a business type" }), businessTypeList.map(function (type) { return (_jsx("option", { value: type, children: type }, type)); })] }), _jsx(Form.Text, { className: "text-muted", children: "Empty means all Business Type/Profession" })] }), showFirstDate && (_jsxs(Form.Group, { controlId: "formFirstDate", children: [_jsx(Form.Label, { children: "First Payment Date:" }), _jsxs(Form.Select, { value: firstDate, onChange: handleFirstDateChange, children: [_jsx("option", { value: "1/1/1900", children: "Select a fiscal year" }), fiscalYearList.map(function (year) { return (_jsx("option", { value: year.toString(), children: year }, year)); })] })] })), _jsxs(Form.Group, { controlId: "formLastDate", children: [_jsx(Form.Label, { children: "Current Fiscal Year:" }), _jsx(Form.Control, { type: "text", value: lastDate, onChange: handleLastDateChange, readOnly: !showFirstDate })] }), _jsx(Button, { variant: "primary", onClick: handleViewClick, style: { marginTop: '10px' }, children: "Produce Report" }), _jsx(Button, { variant: "danger", onClick: handleExitClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Exit" })] }), _jsx("h3", { className: "mt-4", children: "List Of Businesses" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business No" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type/Profession" }), _jsx("th", { children: "Current Rate" }), _jsx("th", { children: "Total Grade" })] }) }), _jsx("tbody", { children: businessList.map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.electroral_area.toUpperCase() }), _jsx("td", { children: business.buss_no }), _jsx("td", { children: business.buss_name.toUpperCase() }), _jsx("td", { children: business.buss_type.toUpperCase() }), _jsx("td", { children: business.current_rate.toFixed(2) }), _jsx("td", { children: business.tot_grade.toUpperCase() })] }, business.buss_no)); }) })] })] }));
};
export default FrmMidlevelDetailedReport;
