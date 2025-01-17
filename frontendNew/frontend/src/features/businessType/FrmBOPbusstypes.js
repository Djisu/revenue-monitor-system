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
var PropertyOfficerBudgetAssessmentForm = function () {
    var _a = useState(''), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState(''), businessType = _b[0], setBusinessType = _b[1];
    var _c = useState(''), electoralArea = _c[0], setElectoralArea = _c[1];
    var _d = useState('0'), balance = _d[0], setBalance = _d[1];
    var _e = useState([]), officers = _e[0], setOfficers = _e[1];
    var _f = useState([]), fiscalYears = _f[0], setFiscalYears = _f[1];
    var _g = useState([]), businessTypes = _g[0], setBusinessTypes = _g[1];
    var _h = useState([]), businesses = _h[0], setBusinesses = _h[1];
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
            var response, error_2;
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
                        alert("No payments made yet");
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
    var handleFiscalYearChange = function (event) {
        var target = event.target;
        setFiscalYear(target.value);
    };
    var handleBusinessTypeChange = function (event) {
        var target = event.target;
        setBusinessType(target.value);
    };
    var handleElectoralAreaChange = function (event) {
        var target = event.target;
        var selectedArea = target.value;
        setElectoralArea(selectedArea);
        businesses = [];
        setBusinesses(businesses);
    };
    var handleBalanceChange = function (event) {
        setBalance(event.target.value);
    };
    // const handleElectoralAreaValidate = () => {
    //   // Update label with selected electoral area
    //   const labelElement = document.getElementById('lblelectoralarea');
    //   if (labelElement) {
    //     labelElement.innerText = electoralArea;
    //   }
    // };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var businessesResponse, _i, _a, business, firstBusiness, lastBusiness, currBalancesResponse, _b, _c, balance_1, reportResponse, error_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!fiscalYear || !businessType) {
                        alert("ENTER THE FISCAL YEAR AND BUSINESS TYPE");
                        return [2 /*return*/];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 15, , 16]);
                    // Clear temporary tables
                    return [4 /*yield*/, axios.delete('/api/tmp-business')];
                case 2:
                    // Clear temporary tables
                    _d.sent();
                    return [4 /*yield*/, axios.delete('/api/tmp-busscurrbalance')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, axios.get('/api/businesses', {
                            params: { businessType: businessType }
                        })];
                case 4:
                    businessesResponse = _d.sent();
                    if (businessesResponse.data.length === 0) {
                        alert("No businesses found with the specified business type");
                        return [2 /*return*/];
                    }
                    setBusinesses(businessesResponse.data);
                    _i = 0, _a = businessesResponse.data;
                    _d.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    business = _a[_i];
                    return [4 /*yield*/, axios.post('/api/tmp-business', {
                            buss_no: business.buss_no,
                            buss_name: business.buss_name,
                            balance: business.balance,
                            current_rate: business.current_rate,
                            property_rate: business.property_rate,
                            totalAmountDue: business.totalAmountDue,
                            transdate: business.transdate,
                            electoral_area: business.electoral_area
                        })];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    firstBusiness = businessesResponse.data[0].buss_no;
                    lastBusiness = businessesResponse.data[businessesResponse.data.length - 1].buss_no;
                    return [4 /*yield*/, axios.get('/api/business-current-balances', {
                            params: { firstBusiness: firstBusiness, lastBusiness: lastBusiness }
                        })];
                case 9:
                    currBalancesResponse = _d.sent();
                    if (currBalancesResponse.data.length === 0) {
                        alert("No current balances found for the specified businesses");
                        return [2 /*return*/];
                    }
                    _b = 0, _c = currBalancesResponse.data;
                    _d.label = 10;
                case 10:
                    if (!(_b < _c.length)) return [3 /*break*/, 13];
                    balance_1 = _c[_b];
                    return [4 /*yield*/, axios.post('/api/tmp-busscurrbalance', balance_1)];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12:
                    _b++;
                    return [3 /*break*/, 10];
                case 13: return [4 /*yield*/, axios.get('/api/tmp-business')];
                case 14:
                    reportResponse = _d.sent();
                    if (reportResponse.data.length > 0) {
                        window.open('/report/BUSINESS OPERATING PERMIT DEMAND NOTICE1.rpt', '_blank');
                        alert("Processing completed");
                    }
                    else {
                        alert("No records found in this electoral area");
                    }
                    return [3 /*break*/, 16];
                case 15:
                    error_4 = _d.sent();
                    console.error("Error processing preview:", error_4);
                    alert("Error processing preview");
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
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
    // const fetchElectoralAreas = async () => {
    //   try {
    //     const response = await axios.get('/api/electoral-areas');
    //     setOfficers(response.data);
    //   } catch (error) {
    //     console.error("Error fetching electoral areas:", error);
    //     alert("No electoral areas found");
    //   }
    // };
    // const findValueOfBillsDistributed = async (officerNo: string, fiscalYear: string): Promise<number> => {
    //   try {
    //     const response = await axios.get('/api/value-of-bills-distributed', {
    //       params: { officerNo, fiscalYear }
    //     });
    //     return response.data || 0;
    //   } catch (error) {
    //     console.error("Error fetching value of bills distributed:", error);
    //     return 0;
    //   }
    // };
    // const findMonthlyAmount = async (officerNo: string, fiscalYear: string, month: string, monthName: string): Promise<number> => {
    //   try {
    //     const response = await axios.get('/api/monthly-amount', {
    //       params: { officerNo, fiscalYear, month, monthName }
    //     });
    //     return response.data || 0;
    //   } catch (error) {
    //     console.error(`Error fetching amount for ${monthName}:`, error);
    //     return 0;
    //   }
    // };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h3", { style: { textDecoration: 'underline', color: '#FF0000' }, children: "Business Operating Permit Demand Notice" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsxs(Form.Control, { as: "select", value: fiscalYear, onChange: handleFiscalYearChange, children: [_jsx("option", { value: "", children: "Select a fiscal year" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year.fiscal_year, children: year.fiscal_year }, year.fiscal_year)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formBusinessType", children: [_jsx(Form.Label, { children: "Business Types:" }), _jsxs(Form.Control, { as: "select", value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select a business type" }), businessTypes.map(function (type) { return (_jsx("option", { value: type.buss_type, children: type.buss_type }, type.buss_type)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: handleElectoralAreaChange, children: [_jsx("option", { value: "", children: "Select an electoral area" }), officers.map(function (officer) { return (_jsxs("option", { value: officer.officer_no + ' ' + officer.officer_name, children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Enter a value greater than 0 to produce Balance BF Report:" }), _jsx(Form.Control, { type: "text", value: balance, onChange: handleBalanceChange })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview Demand Notices" }) }), _jsx(Col, { children: _jsx(Button, { variant: "success", onClick: handlePrintClick, children: "Print Demand Notices" }) }), _jsx(Col, { children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Form.Label, { id: "lblelectoralarea", style: { borderStyle: 'solid', borderWidth: 1, padding: 5 }, children: "Electoral Area" }) }) })] }));
};
export default PropertyOfficerBudgetAssessmentForm;
