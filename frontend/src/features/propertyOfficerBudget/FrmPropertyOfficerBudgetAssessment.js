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
import { Link } from 'react-router-dom';
var PropertyOfficerBudgetAssessmentForm = function () {
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
    var handleFirstFiscalYearChange = function (event) {
        var target = event.target;
        setFiscalYear(target.value);
    };
    var handleFirstOfficerChange = function (event) {
        var target = event.target;
        var selectedOfficer = target.value.split(' ')[0];
        setFirstOfficer(selectedOfficer);
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetResponse, _i, officers_1, officer, valueOfBillsDistributed, januaryAmount, februaryAmount, marchAmount, aprilAmount, mayAmount, juneAmount, julyAmount, augustAmount, septemberAmount, octoberAmount, novemberAmount, decemberAmount, monthlyValue, assessmentResponse, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 44, , 45]);
                    return [4 /*yield*/, axios.get('/api/officer-budget', {
                            params: { fiscalYear: fiscalYear }
                        })];
                case 2:
                    budgetResponse = _a.sent();
                    if (budgetResponse.data.length === 0) {
                        alert("You have to set budgets for the collectors before assessing them");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.delete('/api/budget-assess')];
                case 3:
                    _a.sent();
                    _i = 0, officers_1 = officers;
                    _a.label = 4;
                case 4:
                    if (!(_i < officers_1.length)) return [3 /*break*/, 42];
                    officer = officers_1[_i];
                    return [4 /*yield*/, findValueOfBillsDistributed(officer.officer_no)];
                case 5:
                    valueOfBillsDistributed = _a.sent();
                    return [4 /*yield*/, findJanuaryAmount(officer.officer_no)];
                case 6:
                    januaryAmount = _a.sent();
                    return [4 /*yield*/, findFebruaryAmount(officer.officer_no)];
                case 7:
                    februaryAmount = _a.sent();
                    return [4 /*yield*/, findMarchAmount(officer.officer_no)];
                case 8:
                    marchAmount = _a.sent();
                    return [4 /*yield*/, findAprilAmount(officer.officer_no)];
                case 9:
                    aprilAmount = _a.sent();
                    return [4 /*yield*/, findMayAmount(officer.officer_no)];
                case 10:
                    mayAmount = _a.sent();
                    return [4 /*yield*/, findJuneAmount(officer.officer_no)];
                case 11:
                    juneAmount = _a.sent();
                    return [4 /*yield*/, findJulyAmount(officer.officer_no)];
                case 12:
                    julyAmount = _a.sent();
                    return [4 /*yield*/, findAugustAmount(officer.officer_no)];
                case 13:
                    augustAmount = _a.sent();
                    return [4 /*yield*/, findSeptemberAmount(officer.officer_no)];
                case 14:
                    septemberAmount = _a.sent();
                    return [4 /*yield*/, findOctoberAmount(officer.officer_no)];
                case 15:
                    octoberAmount = _a.sent();
                    return [4 /*yield*/, findNovemberAmount(officer.officer_no)];
                case 16:
                    novemberAmount = _a.sent();
                    return [4 /*yield*/, findDecemberAmount(officer.officer_no)];
                case 17:
                    decemberAmount = _a.sent();
                    monthlyValue = valueOfBillsDistributed / 12;
                    if (!(januaryAmount > 0)) return [3 /*break*/, 19];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'January',
                            budget: monthlyValue,
                            amount: januaryAmount,
                            variance: monthlyValue - januaryAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19:
                    if (!(februaryAmount > 0)) return [3 /*break*/, 21];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'February',
                            budget: monthlyValue,
                            amount: februaryAmount,
                            variance: monthlyValue - februaryAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 20:
                    _a.sent();
                    _a.label = 21;
                case 21:
                    if (!(marchAmount > 0)) return [3 /*break*/, 23];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'March',
                            budget: monthlyValue,
                            amount: marchAmount,
                            variance: monthlyValue - marchAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 22:
                    _a.sent();
                    _a.label = 23;
                case 23:
                    if (!(aprilAmount > 0)) return [3 /*break*/, 25];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'April',
                            budget: monthlyValue,
                            amount: aprilAmount,
                            variance: monthlyValue - aprilAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 24:
                    _a.sent();
                    _a.label = 25;
                case 25:
                    if (!(mayAmount > 0)) return [3 /*break*/, 27];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'May',
                            budget: monthlyValue,
                            amount: mayAmount,
                            variance: monthlyValue - mayAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 26:
                    _a.sent();
                    _a.label = 27;
                case 27:
                    if (!(juneAmount > 0)) return [3 /*break*/, 29];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'June',
                            budget: monthlyValue,
                            amount: juneAmount,
                            variance: monthlyValue - juneAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 28:
                    _a.sent();
                    _a.label = 29;
                case 29:
                    if (!(julyAmount > 0)) return [3 /*break*/, 31];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'July',
                            budget: monthlyValue,
                            amount: julyAmount,
                            variance: monthlyValue - julyAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 30:
                    _a.sent();
                    _a.label = 31;
                case 31:
                    if (!(augustAmount > 0)) return [3 /*break*/, 33];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'August',
                            budget: monthlyValue,
                            amount: augustAmount,
                            variance: monthlyValue - augustAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 32:
                    _a.sent();
                    _a.label = 33;
                case 33:
                    if (!(septemberAmount > 0)) return [3 /*break*/, 35];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'September',
                            budget: monthlyValue,
                            amount: septemberAmount,
                            variance: monthlyValue - septemberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 34:
                    _a.sent();
                    _a.label = 35;
                case 35:
                    if (!(octoberAmount > 0)) return [3 /*break*/, 37];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'October',
                            budget: monthlyValue,
                            amount: octoberAmount,
                            variance: monthlyValue - octoberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 36:
                    _a.sent();
                    _a.label = 37;
                case 37:
                    if (!(novemberAmount > 0)) return [3 /*break*/, 39];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'November',
                            budget: monthlyValue,
                            amount: novemberAmount,
                            variance: monthlyValue - novemberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 38:
                    _a.sent();
                    _a.label = 39;
                case 39:
                    if (!(decemberAmount > 0)) return [3 /*break*/, 41];
                    return [4 /*yield*/, axios.post('/api/budget-assess', {
                            month: 'December',
                            budget: monthlyValue,
                            amount: decemberAmount,
                            variance: monthlyValue - decemberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 40:
                    _a.sent();
                    _a.label = 41;
                case 41:
                    _i++;
                    return [3 /*break*/, 4];
                case 42: return [4 /*yield*/, axios.get('/api/budget-assess')];
                case 43:
                    assessmentResponse = _a.sent();
                    if (assessmentResponse.data.length > 0) {
                        window.open('/report/Property Collector Perfomance Trend.rpt', '_blank');
                        alert("This is the report for ".concat(fiscalYear));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 45];
                case 44:
                    error_3 = _a.sent();
                    console.error("Error processing preview:", error_3);
                    alert("Error processing preview");
                    return [3 /*break*/, 45];
                case 45: return [2 /*return*/];
            }
        });
    }); };
    var handlePrintClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetResponse, _i, officers_2, officer, valueOfBillsDistributed, januaryAmount, februaryAmount, marchAmount, aprilAmount, mayAmount, juneAmount, julyAmount, augustAmount, septemberAmount, octoberAmount, novemberAmount, decemberAmount, monthlyValue, weeklyBudgetResponse, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 44, , 45]);
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
                    _i = 0, officers_2 = officers;
                    _a.label = 4;
                case 4:
                    if (!(_i < officers_2.length)) return [3 /*break*/, 42];
                    officer = officers_2[_i];
                    return [4 /*yield*/, findValueOfBillsDistributed(officer.officer_no)];
                case 5:
                    valueOfBillsDistributed = _a.sent();
                    return [4 /*yield*/, findJanuaryAmount(officer.officer_no)];
                case 6:
                    januaryAmount = _a.sent();
                    return [4 /*yield*/, findFebruaryAmount(officer.officer_no)];
                case 7:
                    februaryAmount = _a.sent();
                    return [4 /*yield*/, findMarchAmount(officer.officer_no)];
                case 8:
                    marchAmount = _a.sent();
                    return [4 /*yield*/, findAprilAmount(officer.officer_no)];
                case 9:
                    aprilAmount = _a.sent();
                    return [4 /*yield*/, findMayAmount(officer.officer_no)];
                case 10:
                    mayAmount = _a.sent();
                    return [4 /*yield*/, findJuneAmount(officer.officer_no)];
                case 11:
                    juneAmount = _a.sent();
                    return [4 /*yield*/, findJulyAmount(officer.officer_no)];
                case 12:
                    julyAmount = _a.sent();
                    return [4 /*yield*/, findAugustAmount(officer.officer_no)];
                case 13:
                    augustAmount = _a.sent();
                    return [4 /*yield*/, findSeptemberAmount(officer.officer_no)];
                case 14:
                    septemberAmount = _a.sent();
                    return [4 /*yield*/, findOctoberAmount(officer.officer_no)];
                case 15:
                    octoberAmount = _a.sent();
                    return [4 /*yield*/, findNovemberAmount(officer.officer_no)];
                case 16:
                    novemberAmount = _a.sent();
                    return [4 /*yield*/, findDecemberAmount(officer.officer_no)];
                case 17:
                    decemberAmount = _a.sent();
                    monthlyValue = valueOfBillsDistributed / 12;
                    if (!(januaryAmount > 0)) return [3 /*break*/, 19];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'January',
                            budget: monthlyValue,
                            amount: januaryAmount,
                            variance: monthlyValue - januaryAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19:
                    if (!(februaryAmount > 0)) return [3 /*break*/, 21];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'February',
                            budget: monthlyValue,
                            amount: februaryAmount,
                            variance: monthlyValue - februaryAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 20:
                    _a.sent();
                    _a.label = 21;
                case 21:
                    if (!(marchAmount > 0)) return [3 /*break*/, 23];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'March',
                            budget: monthlyValue,
                            amount: marchAmount,
                            variance: monthlyValue - marchAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 22:
                    _a.sent();
                    _a.label = 23;
                case 23:
                    if (!(aprilAmount > 0)) return [3 /*break*/, 25];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'April',
                            budget: monthlyValue,
                            amount: aprilAmount,
                            variance: monthlyValue - aprilAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 24:
                    _a.sent();
                    _a.label = 25;
                case 25:
                    if (!(mayAmount > 0)) return [3 /*break*/, 27];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'May',
                            budget: monthlyValue,
                            amount: mayAmount,
                            variance: monthlyValue - mayAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 26:
                    _a.sent();
                    _a.label = 27;
                case 27:
                    if (!(juneAmount > 0)) return [3 /*break*/, 29];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'June',
                            budget: monthlyValue,
                            amount: juneAmount,
                            variance: monthlyValue - juneAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 28:
                    _a.sent();
                    _a.label = 29;
                case 29:
                    if (!(julyAmount > 0)) return [3 /*break*/, 31];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'July',
                            budget: monthlyValue,
                            amount: julyAmount,
                            variance: monthlyValue - julyAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 30:
                    _a.sent();
                    _a.label = 31;
                case 31:
                    if (!(augustAmount > 0)) return [3 /*break*/, 33];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'August',
                            budget: monthlyValue,
                            amount: augustAmount,
                            variance: monthlyValue - augustAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 32:
                    _a.sent();
                    _a.label = 33;
                case 33:
                    if (!(septemberAmount > 0)) return [3 /*break*/, 35];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'September',
                            budget: monthlyValue,
                            amount: septemberAmount,
                            variance: monthlyValue - septemberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 34:
                    _a.sent();
                    _a.label = 35;
                case 35:
                    if (!(octoberAmount > 0)) return [3 /*break*/, 37];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'October',
                            budget: monthlyValue,
                            amount: octoberAmount,
                            variance: monthlyValue - octoberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 36:
                    _a.sent();
                    _a.label = 37;
                case 37:
                    if (!(novemberAmount > 0)) return [3 /*break*/, 39];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'November',
                            budget: monthlyValue,
                            amount: novemberAmount,
                            variance: monthlyValue - novemberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 38:
                    _a.sent();
                    _a.label = 39;
                case 39:
                    if (!(decemberAmount > 0)) return [3 /*break*/, 41];
                    return [4 /*yield*/, axios.post('/api/officer-budget-weekly', {
                            month: 'December',
                            budget: monthlyValue,
                            amount: decemberAmount,
                            variance: monthlyValue - decemberAmount,
                            fiscalyear: fiscalYear,
                            assessmentby: officer.officer_name
                        })];
                case 40:
                    _a.sent();
                    _a.label = 41;
                case 41:
                    _i++;
                    return [3 /*break*/, 4];
                case 42: return [4 /*yield*/, axios.get('/api/officer-budget-weekly')];
                case 43:
                    weeklyBudgetResponse = _a.sent();
                    if (weeklyBudgetResponse.data.length > 0) {
                        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE WEEKLY.rpt', '_blank');
                        alert("This is the report for ".concat(fiscalYear));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 45];
                case 44:
                    error_4 = _a.sent();
                    console.error("Error processing print:", error_4);
                    alert("Error processing print");
                    return [3 /*break*/, 45];
                case 45: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Assuming you have a way to navigate back to the main page
        window.location.href = '/'; // Redirect to main page or wherever you want
    };
    var findValueOfBillsDistributed = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/value-of-bills-distributed', {
                            params: { officerNo: officerNo, fiscalYear: fiscalYear }
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data || 0];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error fetching value of bills distributed:", error_5);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var findMonthlyAmount = function (officerNo, month, monthName) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/monthly-amount', {
                            params: { officerNo: officerNo, fiscalYear: fiscalYear, month: month, monthName: monthName }
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data || 0];
                case 2:
                    error_6 = _a.sent();
                    console.error("Error fetching amount for ".concat(monthName, ":"), error_6);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var findJanuaryAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '1', 'January')];
        });
    }); };
    var findFebruaryAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '2', 'February')];
        });
    }); };
    var findMarchAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '3', 'March')];
        });
    }); };
    var findAprilAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '4', 'April')];
        });
    }); };
    var findMayAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '5', 'May')];
        });
    }); };
    var findJuneAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '6', 'June')];
        });
    }); };
    var findJulyAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '7', 'July')];
        });
    }); };
    var findAugustAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '8', 'August')];
        });
    }); };
    var findSeptemberAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '9', 'September')];
        });
    }); };
    var findOctoberAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '10', 'October')];
        });
    }); };
    var findNovemberAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '11', 'November')];
        });
    }); };
    var findDecemberAmount = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, findMonthlyAmount(officerNo, '12', 'December')];
        });
    }); };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "First Fiscal Year:" }), _jsxs(Form.Control, { as: "select", value: fiscalYear, onChange: handleFirstFiscalYearChange, children: [_jsx("option", { value: "", children: "Select a fiscal year" }), fiscalYears.map(function (year) { return (_jsx("option", { value: year.fiscal_year, children: year.fiscal_year }, year.fiscal_year)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstOfficer", children: [_jsx(Form.Label, { children: "First Officer:" }), _jsxs(Form.Control, { as: "select", value: firstOfficer, onChange: handleFirstOfficerChange, children: [_jsx("option", { value: "", children: "Select an officer" }), officers.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.officer_name), children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "success", onClick: handlePrintClick, children: "Print Monitoring Report (Weekly)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default PropertyOfficerBudgetAssessmentForm;
