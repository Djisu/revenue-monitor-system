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
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
//type FormControlElement = HTMLSelectElement | HTMLInputElement;
var BusinessOperatingPermit = function () {
    // @ts-ignore
    var _a = useState([]), officers = _a[0], setOfficers = _a[1];
    var _b = useState([]), properties = _b[0], setProperties = _b[1];
    var _c = useState([]), fiscalYears = _c[0], setFiscalYears = _c[1];
    var _d = useState([]), electoralAreas = _d[0], setElectoralAreas = _d[1];
    var _e = useState(0), fiscalYear = _e[0], setFiscalYear = _e[1];
    var _f = useState(''), electoralArea = _f[0], setElectoralArea = _f[1];
    //const [balance, setBalance] = useState<number>(0);
    useEffect(function () {
        fetchOfficers();
        fetchProperties();
        fetchFiscalYears();
        fetchElectoralAreas();
    }, []);
    var fetchOfficers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/officers')];
                case 1:
                    response = _a.sent();
                    setOfficers(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchProperties = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/properties')];
                case 1:
                    response = _a.sent();
                    setProperties(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
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
                    return [4 /*yield*/, axios.get('/api/fiscal-years')];
                case 1:
                    response = _a.sent();
                    setFiscalYears(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/electoral-areas')];
                case 1:
                    response = _a.sent();
                    setElectoralAreas(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleElectoralAreaChange = function (event) {
        var target = event.target;
        var selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
    };
    var handleFiscalYearChange = function (event) {
        var selectedFiscalYear = parseInt(event.target.value, 10);
        setFiscalYear(selectedFiscalYear);
    };
    var handlePreviewDemandNotices = function () { return __awaiter(void 0, void 0, void 0, function () {
        var propertiesResponse, propertiesData, _i, propertiesData_1, property, balanceBF, recBussCurrlance, reportResponse, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fiscalYear === 0) {
                        alert("Kindly select the fiscal year");
                        return [2 /*return*/];
                    }
                    if (!electoralArea) {
                        alert("Kindly select the electoral area");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, axios.get('/api/properties', { params: { electoral_area: electoralArea } })];
                case 2:
                    propertiesResponse = _a.sent();
                    propertiesData = propertiesResponse.data;
                    if (propertiesData.length === 0) {
                        alert("No records found in this electoral area");
                        return [2 /*return*/];
                    }
                    _i = 0, propertiesData_1 = propertiesData;
                    _a.label = 3;
                case 3:
                    if (!(_i < propertiesData_1.length)) return [3 /*break*/, 8];
                    property = propertiesData_1[_i];
                    return [4 /*yield*/, findBalanceBF(property.buss_no)];
                case 4:
                    balanceBF = _a.sent();
                    return [4 /*yield*/, axios.post('/api/update-balance', {
                            buss_no: property.buss_no,
                            fiscalyear: fiscalYear,
                            balancebf: balanceBF
                        })];
                case 5:
                    recBussCurrlance = _a.sent();
                    // Update current_rate and balancenew in tb_business
                    return [4 /*yield*/, axios.post('/api/update-property', {
                            buss_no: property.buss_no,
                            current_rate: recBussCurrlance.data.current_balance,
                            balancenew: balanceBF
                        })];
                case 6:
                    // Update current_rate and balancenew in tb_business
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: 
                // Clear temporary tables
                return [4 /*yield*/, axios.post('/api/clear-temp-tables')];
                case 9:
                    // Clear temporary tables
                    _a.sent();
                    // Insert data into temporary tables
                    return [4 /*yield*/, axios.post('/api/insert-temp-data', {
                            electoral_area: electoralArea,
                            fiscalyear: fiscalYear
                        })];
                case 10:
                    // Insert data into temporary tables
                    _a.sent();
                    return [4 /*yield*/, axios.get('/api/report')];
                case 11:
                    reportResponse = _a.sent();
                    if (reportResponse.data.length === 0) {
                        alert("No paid businesses found");
                        return [2 /*return*/];
                    }
                    alert("Processing completed");
                    return [3 /*break*/, 13];
                case 12:
                    error_5 = _a.sent();
                    console.error(error_5);
                    alert("Error in processing demand notices");
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var findBalanceBF = function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
        var varPrevFiscalYear, paymentsResponse, varPrevPayments, billingsResponse, varPrevBalances, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    varPrevFiscalYear = new Date().getFullYear() - 1;
                    return [4 /*yield*/, axios.get('/api/payments', { params: { buss_no: bussNo } })];
                case 1:
                    paymentsResponse = _a.sent();
                    varPrevPayments = paymentsResponse.data || 0;
                    return [4 /*yield*/, axios.get('/api/billings', { params: { buss_no: bussNo, fiscalyear: varPrevFiscalYear } })];
                case 2:
                    billingsResponse = _a.sent();
                    varPrevBalances = billingsResponse.data || 0;
                    return [2 /*return*/, varPrevBalances - varPrevPayments];
                case 3:
                    error_6 = _a.sent();
                    console.error(error_6);
                    alert("Error in finding balance");
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExit = function () {
        // Logic to exit and show main menu
        window.close();
    };
    return (_jsxs(Container, { children: [_jsx(Row, { children: _jsxs(Col, { className: "text-center mt-3", children: [_jsx("h2", { className: "text-primary", children: "Business Operating Permit Demand Notice" }), _jsx("h4", { className: "text-info", children: "MARCORY MUNICIPAL ASSEMBLY" })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Electoral Area:" }), _jsxs(Form.Control, { as: "select", value: electoralArea !== null ? electoralArea : "", onChange: handleElectoralAreaChange, children: [_jsx("option", { value: "", children: "Select..." }), electoralAreas.map(function (area) { return (_jsx("option", { value: area.electroral_area, children: area.electroral_area }, area.electroral_area)); })] })] }), _jsxs(Col, { className: "mt-3", children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Fiscal Year:" }), _jsxs(Form.Control, { as: "select", value: fiscalYear !== null ? fiscalYear : 0, onChange: handleFiscalYearChange, children: [_jsx("option", { value: 0, children: "Select..." }), fiscalYears.map(function (year) { return (_jsx("option", { value: year.fiscalyear, children: year.fiscalyear }, year.fiscalyear)); })] })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePreviewDemandNotices, children: "Preview Demand Notices" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleExit, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h3", { className: "font-weight-bold", children: "List of Properties" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" }), _jsx("th", { children: "BUSS TYPE" }), _jsx("th", { children: "PERMIT NO" }), _jsx("th", { children: "STREET NAME" }), _jsx("th", { children: "LANDMARK" }), _jsx("th", { children: "ELECTORAL AREA" }), _jsx("th", { children: "PROPERTY CLASS" }), _jsx("th", { children: "GRADE" }), _jsx("th", { children: "OWNER" }), _jsx("th", { children: "TEL NO" }), _jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "TRANSDATE" }), _jsx("th", { children: "STATUS" }), _jsx("th", { children: "SERIALNO" }), _jsx("th", { children: "CURRENT RATE" }), _jsx("th", { children: "PROPERTY RATE" })] }) }), _jsx("tbody", { children: properties.map(function (property) { return (_jsxs("tr", { children: [_jsx("td", { children: property.buss_no }), _jsx("td", { children: property.buss_name }), _jsx("td", { children: property.propertyuse }), _jsx("td", { children: property.buss_no }), _jsx("td", { children: property.street_name }), _jsx("td", { children: property.landmark }), _jsx("td", { children: property.electroral_area }), _jsx("td", { children: property.propertyclass }), _jsx("td", { children: property.assessmentby }), _jsx("td", { children: property.buss_no }), _jsx("td", { children: property.status }), _jsx("td", { children: property.buss_no }), _jsx("td", { children: property.current_rate.toFixed(2) }), _jsx("td", { children: parseFloat(property.rate).toFixed(2) })] }, property.buss_no)); }) })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default BusinessOperatingPermit;
