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
var OfficerAssessmentForm = function () {
    var _a = useState(''), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState(''), firstOfficer = _b[0], setFirstOfficer = _b[1];
    var _c = useState([]), officers = _c[0], setOfficers = _c[1];
    var _d = useState([]), fiscalYears = _d[0], setFiscalYears = _d[1];
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
        fetchOfficers();
        fetchFiscalYears();
        // Show alert on form load
        alert("Make sure that client payments are correctly updated else you will not get the report");
    }, []);
    var handleOfficerChange = function (event) {
        var target = event.target;
        var selectedOfficer = target.value.split(' ')[0];
        setFirstOfficer(selectedOfficer);
    };
    var handleFiscalYearChange = function (event) {
        var target = event.target;
        setFiscalYear(target.value);
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetResponse, assessmentResponse, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, axios.get('/api/officer-budget', {
                            params: { fiscalYear: fiscalYear }
                        })];
                case 2:
                    budgetResponse = _a.sent();
                    if (budgetResponse.data.length === 0) {
                        alert("You have to set budgets for the collectors before assessing them");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.delete('/api/officer-assessment')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, axios.get('/api/officer-assessment')];
                case 4:
                    assessmentResponse = _a.sent();
                    if (assessmentResponse.data.length > 0) {
                        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE.rpt', '_blank');
                        alert("This is the report for ".concat(fiscalYear));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Error processing preview:", error_3);
                    alert("Error processing preview");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handlePrintClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetResponse, weeklyBudgetResponse, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, axios.get('/api/officer-budget-weekly', {
                            params: { fiscalYear: fiscalYear }
                        })];
                case 2:
                    budgetResponse = _a.sent();
                    if (budgetResponse.data.length === 0) {
                        alert("You have to set budgets for the collectors before assessing them");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.delete('/api/officer-budget-weekly')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, axios.get('/api/officer-budget-weekly')];
                case 4:
                    weeklyBudgetResponse = _a.sent();
                    if (weeklyBudgetResponse.data.length > 0) {
                        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE WEEKLY.rpt', '_blank');
                        alert("This is the report for ".concat(fiscalYear));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error("Error processing print:", error_4);
                    alert("Error processing print");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Assuming you have a way to navigate back to the main page
        window.location.href = '/'; // Redirect to main page or wherever you want
    };
    // const findNoOfClientsServed = async (officerNo: string): Promise<number> => {
    //   try {
    //     const response = await axios.get('/api/no-of-clients-served', {
    //       params: { officerNo, fiscalYear }
    //     });
    //     return response.data || 0;
    //   } catch (error) {
    //     console.error("Error fetching no of clients served:", error);
    //     return 0;
    //   }
    // };
    // const findValueOfBillsDistributed = async (officerNo: string): Promise<number> => {
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
    // const findJanuaryAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '1', 'January');
    // };
    // const findFebruaryAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '2', 'February');
    // };
    // const findMarchAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '3', 'March');
    // };
    // const findAprilAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '4', 'April');
    // };
    // const findMayAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '5', 'May');
    // };
    // const findJuneAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '6', 'June');
    // };
    // const findJulyAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '7', 'July');
    // };
    // const findAugustAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '8', 'August');
    // };
    // const findSeptemberAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '9', 'September');
    // };
    // const findOctoberAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '10', 'October');
    // };
    // const findNovemberAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '11', 'November');
    // };
    // const findDecemberAmount = async (officerNo: string): Promise<number> => {
    //   return findMonthlyAmount(officerNo, '12', 'December');
    // };
    // const findMonthlyAmount = async (officerNo: string, month: string, monthName: string): Promise<number> => {
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
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "First Fiscal Year:" }), _jsxs(Form.Control, { as: "select", value: fiscalYear, onChange: handleFiscalYearChange, children: [_jsx("option", { value: "", children: "Select a fiscal year" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year.fiscal_year, children: year.fiscal_year }, year.fiscal_year)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstOfficer", children: [_jsx(Form.Label, { children: "First Officer:" }), _jsxs(Form.Control, { as: "select", value: firstOfficer, onChange: handleOfficerChange, children: [_jsx("option", { value: "", children: "Select an officer" }), officers.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.officer_name), children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "success", onClick: handlePrintClick, children: "Print Monitoring Report (Weekly)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) }) })] }));
};
export default OfficerAssessmentForm;
