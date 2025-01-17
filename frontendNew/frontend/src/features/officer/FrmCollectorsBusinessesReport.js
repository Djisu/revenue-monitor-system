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
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
// interface Business {
//   buss_no: string;
//   buss_name: string;
//   balance: number;
//   current_rate: number;
//   property_rate: number;
//   totalAmountDue: number;
//   transdate: string;
//   electoral_area: string;
// }
var CollectorsBusinessesReportForm = function () {
    var _a;
    var _b = useState(''), fiscalYear = _b[0], setFiscalYear = _b[1];
    var _c = useState(''), businessType = _c[0], setBusinessType = _c[1];
    var _d = useState(''), electoralArea = _d[0], setElectoralArea = _d[1];
    var _e = useState(''), officerName = _e[0], setOfficerName = _e[1];
    var _f = useState('0'), balance = _f[0], setBalance = _f[1];
    var _g = useState([]), officers = _g[0], setOfficers = _g[1];
    var _h = useState([]), fiscalYears = _h[0], setFiscalYears = _h[1];
    var _j = useState([]), businessTypes = _j[0], setBusinessTypes = _j[1];
    useEffect(function () {
        // Fetch officers
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
                        console.error("Error fetching officers:", error_1);
                        alert("No officer details entered yet");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Fetch fiscal years
        var fetchFiscalYears = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2, currentYear;
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
                        error_2 = _a.sent();
                        console.error("Error fetching fiscal years:", error_2);
                        currentYear = new Date().getFullYear();
                        alert("No officer budget details entered FOR the year ".concat(currentYear));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Fetch business types
        var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get('/api/business-types')];
                    case 1:
                        response = _a.sent();
                        setBusinessTypes(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error fetching business types:", error_3);
                        alert("No business types found");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchOfficers();
        fetchFiscalYears();
        fetchBusinessTypes();
        // Clear fiscal year on form load
        setFiscalYear('');
    }, []);
    var handleOfficerNoChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var target, selectedOfficerNo, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    target = event.target;
                    selectedOfficerNo = target.value.split(' ')[0];
                    setElectoralArea('');
                    setOfficerName('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/officer-details', {
                            params: { officerNo: selectedOfficerNo }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data) {
                        setElectoralArea(response.data.electoral_area);
                        setOfficerName(response.data.officer_name);
                    }
                    else {
                        alert("No officer details found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error fetching officer details:", error_4);
                    alert("Error fetching officer details");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleBusinessTypeChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var target, selectedBusinessType, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    target = event.target;
                    selectedBusinessType = target.value;
                    setBusinessType(selectedBusinessType);
                    if (!electoralArea) {
                        alert("Select the collector before selecting the business type");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/businesses-by-type', {
                            params: { officerNo: firstOfficer, businessType: selectedBusinessType }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data) {
                        setBusinessTypes(response.data);
                    }
                    else {
                        alert("No business types found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error("Error fetching business types:", error_5);
                    alert("Error fetching business types");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFiscalYearChange = function (event) {
        var target = event.target;
        setFiscalYear(target.value);
    };
    var handleBalanceChange = function (event) {
        setBalance(event.target.value);
    };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var businessesResponse, _i, _a, business, reportResponse, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!fiscalYear || !businessType || !electoralArea) {
                        alert("ENTER THE FISCAL YEAR, BUSINESS TYPE, AND ELECTORAL AREA");
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    // Clear temporary tables
                    return [4 /*yield*/, axios.delete('/api/tmp-business')];
                case 2:
                    // Clear temporary tables
                    _b.sent();
                    return [4 /*yield*/, axios.get('/api/businesses', {
                            params: { electoralArea: electoralArea, businessType: businessType, fiscalYear: fiscalYear }
                        })];
                case 3:
                    businessesResponse = _b.sent();
                    if (businessesResponse.data.length === 0) {
                        alert("No businesses found with the specified criteria");
                        return [2 /*return*/];
                    }
                    _i = 0, _a = businessesResponse.data;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    business = _a[_i];
                    return [4 /*yield*/, axios.post('/api/tmp-business', business)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: 
                // Update the current rate
                return [4 /*yield*/, axios.post('/api/update-current-rate', {
                        electoralArea: electoralArea,
                        businessType: businessType,
                        fiscalYear: fiscalYear
                    })];
                case 8:
                    // Update the current rate
                    _b.sent();
                    return [4 /*yield*/, axios.get('/api/tmp-business')];
                case 9:
                    reportResponse = _b.sent();
                    if (reportResponse.data.length > 0) {
                        window.open('/report/COLLECTORS BUSINESSES REPORTS.rpt', '_blank');
                        alert("Processing completed");
                    }
                    else {
                        alert("No records found in this electoral area");
                    }
                    return [3 /*break*/, 11];
                case 10:
                    error_6 = _b.sent();
                    console.error("Error processing view:", error_6);
                    alert("Error processing view");
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var handleSummaryClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var businessesResponse, _i, _a, business, reportResponse, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!fiscalYear || !businessType || !electoralArea) {
                        alert("ENTER THE FISCAL YEAR, BUSINESS TYPE, AND ELECTORAL AREA");
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    // Clear temporary tables
                    return [4 /*yield*/, axios.delete('/api/tmp-business')];
                case 2:
                    // Clear temporary tables
                    _b.sent();
                    return [4 /*yield*/, axios.get('/api/businesses-by-area', {
                            params: { electoralArea: electoralArea, businessType: businessType, fiscalYear: fiscalYear }
                        })];
                case 3:
                    businessesResponse = _b.sent();
                    if (businessesResponse.data.length === 0) {
                        alert("No businesses found with the specified criteria");
                        return [2 /*return*/];
                    }
                    _i = 0, _a = businessesResponse.data;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    business = _a[_i];
                    return [4 /*yield*/, axios.post('/api/tmp-business', business)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, axios.get('/api/tmp-business')];
                case 8:
                    reportResponse = _b.sent();
                    if (reportResponse.data.length > 0) {
                        window.open('/report/SUMMARY OF BUSINESSES IN ELECTORAL AREA.rpt', '_blank');
                        alert("Processing completed");
                    }
                    else {
                        alert("No records found in this electoral area");
                    }
                    return [3 /*break*/, 10];
                case 9:
                    error_7 = _b.sent();
                    console.error("Error processing summary:", error_7);
                    alert("Error processing summary");
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handleViewDebtorClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var businessesResponse, _i, _a, business, reportResponse, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!fiscalYear || !businessType || !electoralArea) {
                        alert("ENTER THE FISCAL YEAR, BUSINESS TYPE, AND ELECTORAL AREA");
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    // Clear temporary tables
                    return [4 /*yield*/, axios.delete('/api/tmp-business')];
                case 2:
                    // Clear temporary tables
                    _b.sent();
                    return [4 /*yield*/, axios.get('/api/debtor-businesses', {
                            params: { electoralArea: electoralArea, businessType: businessType, fiscalYear: fiscalYear }
                        })];
                case 3:
                    businessesResponse = _b.sent();
                    if (businessesResponse.data.length === 0) {
                        alert("No debtor businesses found with the specified criteria");
                        return [2 /*return*/];
                    }
                    _i = 0, _a = businessesResponse.data;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    business = _a[_i];
                    return [4 /*yield*/, axios.post('/api/tmp-business', business)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [4 /*yield*/, axios.get('/api/tmp-business')];
                case 8:
                    reportResponse = _b.sent();
                    if (reportResponse.data.length > 0) {
                        window.open('/report/COLLECTORS BUSINESSES REPORT.rpt', '_blank');
                        alert("Processing completed");
                    }
                    else {
                        alert("No records found in this electoral area");
                    }
                    return [3 /*break*/, 10];
                case 9:
                    error_8 = _b.sent();
                    console.error("Error processing debtor view:", error_8);
                    alert("Error processing debtor view");
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handlePrintClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            alert("Print functionality is not implemented yet.");
            return [2 /*return*/];
        });
    }); };
    var handleExitClick = function () {
        // Assuming you have a way to navigate back to the main page
        window.location.href = '/'; // Redirect to main page or wherever you want
    };
    var firstOfficer = ((_a = officers.find(function (officer) { return officer.officer_no === electoralArea.split(' ')[0]; })) === null || _a === void 0 ? void 0 : _a.officer_no) || '';
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h3", { children: "Collector's Businesses Report" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formOfficerNo", children: [_jsx(Form.Label, { children: "Collector Code:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: handleOfficerNoChange, children: [_jsx("option", { value: "", children: "Select a collector" }), officers.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.electoral_area), children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formBusinessType", children: [_jsx(Form.Label, { children: "Business Types:" }), _jsxs(Form.Control, { as: "select", value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select a business type" }), businessTypes.map(function (type) { return (_jsx("option", { value: type.buss_type, children: type.buss_type }, type.buss_type)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsxs(Form.Control, { as: "select", value: fiscalYear, onChange: handleFiscalYearChange, children: [_jsx("option", { value: "", children: "Select a fiscal year" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year.fiscal_year, children: year.fiscal_year }, year.fiscal_year)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Enter a value greater than 0 to produce Balance BF Report:" }), _jsx(Form.Control, { type: "text", value: balance, onChange: handleBalanceChange })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleViewClick, children: "View Detailed Report" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "success", onClick: handleSummaryClick, children: "View Summarized Report" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "warning", onClick: handleViewDebtorClick, children: "View Detailed Debtor Report" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "danger", onClick: handlePrintClick, children: "Print Demand Notices" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Form.Label, { id: "lblelectoralarea", style: { borderStyle: 'solid', borderWidth: 1, padding: 5 }, children: electoralArea ? "Electoral Area: ".concat(electoralArea.split(' ')[1]) : 'Electoral Area' }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Form.Label, { id: "lblOfficername", style: { borderStyle: 'solid', borderWidth: 1, padding: 5 }, children: officerName ? "Collector Name: ".concat(officerName) : 'Collector Name' }) }) })] }));
};
export default CollectorsBusinessesReportForm;
