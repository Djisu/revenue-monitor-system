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
var ClientBalancesForm = function () {
    var _a = useState(new Date().getFullYear()), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState([]), businesses = _b[0], setBusinesses = _b[1];
    var _c = useState([]), bussCurrBalances = _c[0], setBussCurrBalances = _c[1];
    var _d = useState([]), fiscalYearList = _d[0], setFiscalYearList = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var _f = useState(''), successMessage = _f[0], setSuccessMessage = _f[1];
    useEffect(function () {
        fetchFiscalYears();
    }, []);
    var fetchFiscalYears = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
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
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('Error fetching fiscal years');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_business', {
                            params: {
                                status: 'Active',
                                current_rate: { $gt: 0 },
                            },
                        })];
                case 1:
                    response = _a.sent();
                    setBusinesses(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error fetching businesses');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchBussCurrBalances = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_BussCurrBalance', {
                            params: {
                                fiscalyear: fiscalYear,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    setBussCurrBalances(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('Error fetching business balances');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleFiscalYearChange = function (e) {
        var year = Number(e.target.value);
        setFiscalYear(year);
        fetchBusinesses();
    };
    var handleProcessClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var detailedBalances, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    // Delete previous records for the current fiscal year
                    return [4 /*yield*/, axios.delete('http://your-api-url/tb_BussCurrBalance', {
                            params: {
                                fiscalyear: fiscalYear,
                            },
                        })];
                case 1:
                    // Delete previous records for the current fiscal year
                    _a.sent();
                    return [4 /*yield*/, Promise.all(businesses.map(function (business) { return __awaiter(void 0, void 0, void 0, function () {
                            var balanceBF, totalAmountDue;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, findBalanceBF(business.buss_no)];
                                    case 1:
                                        balanceBF = _a.sent();
                                        totalAmountDue = balanceBF + business.current_rate;
                                        return [2 /*return*/, {
                                                buss_no: business.buss_no,
                                                fiscalyear: fiscalYear,
                                                balancebf: balanceBF,
                                                current_balance: business.current_rate,
                                                property_rate: 0,
                                                totalAmountDue: totalAmountDue,
                                                transdate: new Date().toISOString().split('T')[0],
                                                electoralarea: business.electroral_area,
                                            }];
                                }
                            });
                        }); }))];
                case 2:
                    detailedBalances = _a.sent();
                    // Insert new records
                    return [4 /*yield*/, axios.post('http://your-api-url/tb_BussCurrBalance', detailedBalances)];
                case 3:
                    // Insert new records
                    _a.sent();
                    setSuccessMessage('All electoral areas processed');
                    setError('');
                    fetchBussCurrBalances();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error(error_4);
                    setError('Error processing new balances');
                    setSuccessMessage('');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        window.location.href = '/'; // Redirect to main page or hide the form
    };
    var findBalanceBF = function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
        var varPrevFiscalYear, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    varPrevFiscalYear = fiscalYear - 1;
                    return [4 /*yield*/, axios.get('http://your-api-url/find_balancebf', {
                            params: {
                                buss_no: bussNo,
                                fiscal_year: varPrevFiscalYear,
                            },
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data.balancebf || 0];
                case 2:
                    error_5 = _a.sent();
                    console.error(error_5);
                    setError('Error finding balance BF');
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "UPDATE BUSINESS BALANCES" }), error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Current Fiscal Year:" }), _jsx(Form.Select, { value: fiscalYear, onChange: handleFiscalYearChange, children: fiscalYearList.map(function (year) { return (_jsx("option", { value: year, children: year }, year)); }) })] }), _jsx(Button, { variant: "primary", onClick: handleProcessClick, style: { marginTop: '10px' }, children: "Process New" }), _jsx(Button, { variant: "danger", onClick: handleExitClick, style: { marginLeft: '10px', marginTop: '10px' }, children: "Exit" }), _jsx(Button, { variant: "secondary", onClick: function () { return window.alert('Report functionality not implemented'); }, style: { marginLeft: '10px', marginTop: '10px' }, children: "Report" })] }), _jsx("h3", { className: "mt-4", children: "List of Business Types" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business No" }), _jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type/Profession" }), _jsx("th", { children: "Current Rate (GHC)" })] }) }), _jsx("tbody", { children: businesses.map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.buss_no }), _jsx("td", { children: business.electroral_area.toUpperCase() }), _jsx("td", { children: business.buss_name.toUpperCase() }), _jsx("td", { children: business.tot_grade.toUpperCase() }), _jsx("td", { children: business.current_rate.toFixed(2) })] }, business.buss_no)); }) })] }), _jsx("h3", { className: "mt-4", children: "List of Business Balances" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business No" }), _jsx("th", { children: "Fiscal Year" }), _jsx("th", { children: "Balance Brought Forward (GHC)" }), _jsx("th", { children: "Current Balance (GHC)" }), _jsx("th", { children: "Property Rate (GHC)" }), _jsx("th", { children: "Total Amount Due (GHC)" }), _jsx("th", { children: "Transaction Date" }), _jsx("th", { children: "Electoral Area" })] }) }), _jsx("tbody", { children: bussCurrBalances.map(function (balance) { return (_jsxs("tr", { children: [_jsx("td", { children: balance.buss_no }), _jsx("td", { children: balance.fiscalyear }), _jsx("td", { children: balance.balancebf.toFixed(2) }), _jsx("td", { children: balance.current_balance.toFixed(2) }), _jsx("td", { children: balance.property_rate.toFixed(2) }), _jsx("td", { children: balance.totalAmountDue.toFixed(2) }), _jsx("td", { children: balance.transdate }), _jsx("td", { children: balance.electoralarea.toUpperCase() })] }, balance.buss_no)); }) })] }), _jsx("h6", { className: "mt-3", style: { color: '#C00000' }, children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default ClientBalancesForm;
