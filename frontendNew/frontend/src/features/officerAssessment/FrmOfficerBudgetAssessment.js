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
import axios from 'axios';
var OfficerBudgetAssessment = function () {
    var _a = useState(''), firstFiscalYear = _a[0], setFirstFiscalYear = _a[1];
    var _b = useState(''), firstOfficer = _b[0], setFirstOfficer = _b[1];
    var _c = useState([]), fiscalYears = _c[0], setFiscalYears = _c[1];
    var _d = useState([]), officers = _d[0], setOfficers = _d[1];
    useEffect(function () {
        fetchFiscalYears();
        fetchOfficers();
    }, []);
    var fetchFiscalYears = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/fiscalYears')];
                case 1:
                    response = _a.sent();
                    setFiscalYears(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    alert(error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchOfficers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
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
                    error_2 = _a.sent();
                    alert(error_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleFirstFiscalYearChange = function (event) {
        setFirstFiscalYear(Number(event.target.value));
    };
    var handleFirstOfficerChange = function (event) {
        setFirstOfficer(event.target.value);
    };
    var handleExitClick = function () {
        // Replace this with the appropriate logic to handle exit
        alert('Exit clicked');
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, assessmentData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, axios.get('/api/officerbudget', {
                            params: { fiscalYear: firstFiscalYear, officerNo: firstOfficer }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.data.length === 0) {
                        alert('You have to set budgets for the collects before assessing them');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.delete('/api/budgetAssess')];
                case 2:
                    _a.sent();
                    assessmentData = response.data.map(function (officer) {
                        var varMonthlyValue = officer.totalValue / 12;
                        return [
                            { month: 'January', amount: officer.januaryAmount, budget: varMonthlyValue },
                            { month: 'February', amount: officer.februaryAmount, budget: varMonthlyValue },
                            { month: 'March', amount: officer.marchAmount, budget: varMonthlyValue },
                            { month: 'April', amount: officer.aprilAmount, budget: varMonthlyValue },
                            { month: 'May', amount: officer.mayAmount, budget: varMonthlyValue },
                            { month: 'June', amount: officer.juneAmount, budget: varMonthlyValue },
                            { month: 'July', amount: officer.julyAmount, budget: varMonthlyValue },
                            { month: 'August', amount: officer.augustAmount, budget: varMonthlyValue },
                            { month: 'September', amount: officer.septemberAmount, budget: varMonthlyValue },
                            { month: 'October', amount: officer.octoberAmount, budget: varMonthlyValue },
                            { month: 'November', amount: officer.novemberAmount, budget: varMonthlyValue },
                            { month: 'December', amount: officer.decemberAmount, budget: varMonthlyValue },
                        ];
                    }).flat();
                    return [4 /*yield*/, axios.post('/api/budgetAssess', assessmentData)];
                case 3:
                    _a.sent();
                    // Replace this with the appropriate logic to display the report
                    alert('Monitoring Report Previewed');
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    alert(error_3.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { style: { backgroundColor: '#FFC0C0', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx("h1", { style: { textDecoration: 'underline', color: '#0000C0', fontSize: '24px' }, children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx("h2", { style: { textDecoration: 'underline', color: '#400000', fontSize: '20px' }, children: "Collector Performance Trend" }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsx("label", { style: { marginRight: '10px', fontWeight: 'bold' }, children: "First Fiscal Year:" }), _jsxs("select", { value: firstFiscalYear, onChange: handleFirstFiscalYearChange, children: [_jsx("option", { value: "", children: "Select" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year.fiscal_year, children: year.fiscal_year }, year.fiscal_year)); })] })] }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsx("label", { style: { marginRight: '10px', fontWeight: 'bold' }, children: "First Officer:" }), _jsxs("select", { value: firstOfficer, onChange: handleFirstOfficerChange, children: [_jsx("option", { value: "", children: "Select" }), officers.map(function (officer) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, " - ", officer.officer_name] }, officer.officer_no)); })] })] }), _jsxs("div", { style: { marginTop: '20px', display: 'flex', justifyContent: 'space-around', width: '50%' }, children: [_jsx("button", { style: { fontWeight: 'bold' }, onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }), _jsx("button", { style: { fontWeight: 'bold' }, onClick: handleExitClick, children: "Exit" })] })] }));
};
export default OfficerBudgetAssessment;
