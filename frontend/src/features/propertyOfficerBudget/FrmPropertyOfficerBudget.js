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
var FrmPropertyOfficerBudget = function () {
    var _a = useState([]), officers = _a[0], setOfficers = _a[1];
    var _b = useState(''), officerNo = _b[0], setOfficerNo = _b[1];
    var _c = useState(''), officerName = _c[0], setOfficerName = _c[1];
    var _d = useState(0), fiscalYear = _d[0], setFiscalYear = _d[1];
    var _e = useState(0), annualBudget = _e[0], setAnnualBudget = _e[1];
    var _f = useState(0), monthlyBudget = _f[0], setMonthlyBudget = _f[1];
    var _g = useState(0), WeeklyBudget = _g[0], setWeeklyBudget = _g[1];
    var _h = useState(''), electoralArea = _h[0], setElectoralArea = _h[1];
    var _j = useState(0), electoralQuantity = _j[0], setElectoralQuantity = _j[1];
    var _k = useState([]), budgetItems = _k[0], setBudgetItems = _k[1];
    useEffect(function () {
        fetchOfficers();
        fetchBudgetItems();
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
    var fetchBudgetItems = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/budget-items')];
                case 1:
                    response = _a.sent();
                    setBudgetItems(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleOfficerNoChange = function (event) {
        var target = event.target;
        var selectedOfficerNo = target.value;
        setOfficerNo(selectedOfficerNo);
        var officer = officers.find(function (o) { return o.officer_no === selectedOfficerNo; });
        if (officer) {
            setOfficerName(officer.officer_name);
            fetchElectoralAreas(officer.officer_no);
        }
    };
    var fetchElectoralAreas = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/electoral-areas', { params: { officer_no: officerNo } })];
                case 1:
                    response = _a.sent();
                    setElectoralArea(response.data[0]);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleElectoralAreaChange = function (event) {
        var target = event.target;
        var selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
        fetchElectoralQuantity(selectedElectoralArea);
    };
    var fetchElectoralQuantity = function (electoralArea) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/electoral-quantity', { params: { electoralarea: electoralArea } })];
                case 1:
                    response = _a.sent();
                    setElectoralQuantity(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleFiscalYearChange = function (event) {
        var fiscalYear = parseInt(event.target.value, 10);
        setFiscalYear(fiscalYear);
    };
    var handleAnnualBudgetChange = function (event) {
        var annualBudget = parseFloat(event.target.value);
        setAnnualBudget(annualBudget);
        setMonthlyBudget(annualBudget / 12);
        setWeeklyBudget(annualBudget / 52);
    };
    var handleMonthlyBudgetChange = function (event) {
        var monthlyBudget = parseFloat(event.target.value);
        setMonthlyBudget(monthlyBudget);
    };
    var handleWeeklyBudgetChange = function (event) {
        var weeklyBudget = parseFloat(event.target.value);
        setWeeklyBudget(weeklyBudget);
    };
    var addRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fiscalYear === 0) {
                        alert("Enter the fiscal year");
                        return [2 /*return*/];
                    }
                    if (annualBudget === 0) {
                        alert("Enter the annual budgeted figure");
                        return [2 /*return*/];
                    }
                    if (monthlyBudget === 0) {
                        alert("Enter the monthly budgeted figure");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-record', {
                            officer_no: officerNo,
                            officer_name: officerName,
                            fiscal_year: fiscalYear,
                            annual_budget: annualBudget,
                            monthly_budget: monthlyBudget,
                            electoral_area: electoralArea,
                        })];
                case 2:
                    _a.sent();
                    alert("Collection budget made successfully");
                    fetchBudgetItems();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error(error_5);
                    alert("Error in adding a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var editRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Add logic to check if the user is a supervisor
                    if (fiscalYear === 0) {
                        alert("Enter the fiscal year");
                        return [2 /*return*/];
                    }
                    if (annualBudget === 0) {
                        alert("Enter the annual budgeted figure");
                        return [2 /*return*/];
                    }
                    if (monthlyBudget === 0) {
                        alert("Enter the monthly budgeted figure");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/edit-record', {
                            officer_no: officerNo,
                            officer_name: officerName,
                            fiscal_year: fiscalYear,
                            annual_budget: annualBudget,
                            monthly_budget: monthlyBudget,
                            electoral_area: electoralArea,
                        })];
                case 2:
                    _a.sent();
                    alert("Record successfully added");
                    fetchBudgetItems();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error(error_6);
                    alert("Error in adding a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var viewCollectorsBudgets = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/view-budgets')];
                case 1:
                    response = _a.sent();
                    if (response.data.length === 0) {
                        alert("You have have to set budgets for the collects before assessing them");
                        return [2 /*return*/];
                    }
                    // Logic to generate and show the report
                    alert("Collectors budgets for the current year fetched successfully");
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [_jsx(Row, { children: _jsxs(Col, { className: "text-center mt-3", children: [_jsx("h2", { className: "text-primary", children: "PROPERTY RATES COLLECTOR'S BUDGET DATA ENTRY" }), _jsx("h4", { className: "text-info", children: "MARCORY MUNICIPAL ASSEMBLY" })] }) }), _jsx(Row, { children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formOfficerNo", children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Collector No:" }), _jsxs(Form.Control, { as: "select", value: officerNo, onChange: handleOfficerNoChange, children: [_jsx("option", { value: "", children: "Select..." }), officers.map(function (officer) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, " - ", officer.officer_name, " - ", officer.electoralarea] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Fiscal Year" }), _jsx(Form.Control, { type: "number", value: fiscalYear, onChange: handleFiscalYearChange })] }) }), _jsxs(Row, { children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Electoral Area" }), _jsx(Form.Control, { as: "select", value: electoralArea, onChange: handleElectoralAreaChange, children: _jsx("option", { value: "", children: "Select..." }) })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Total Number of Clients in Electoral Area" }), _jsx(Form.Control, { type: "text", value: electoralQuantity, readOnly: true })] })] }), _jsx(Row, { children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Annual Budget (GHC)" }), _jsx(Form.Control, { type: "number", step: "0.01", value: annualBudget, onChange: handleAnnualBudgetChange })] }) }), _jsx(Row, { children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Monthly Budget (GHC)" }), _jsx(Form.Control, { type: "number", step: "0.01", value: monthlyBudget, onChange: handleMonthlyBudgetChange })] }) }), _jsx(Row, { children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Weekly Budget (GHC)" }), _jsx(Form.Control, { type: "number", step: "0.01", value: WeeklyBudget, onChange: handleWeeklyBudgetChange })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: addRecord, children: "Add New Record (Monthly)" }) }), _jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: editRecord, children: "Edit Old Record" }) }), _jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: viewCollectorsBudgets, children: "View Collectors Budgets for Current Year" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: function () { return window.close(); }, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h3", { className: "font-weight-bold", children: "Collectors Budget" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "OFFICER NAME" }), _jsx("th", { children: "FISCAL YEAR" }), _jsx("th", { children: "ANNUAL BUDGET" }), _jsx("th", { children: "MONTHLY BUDGET" }), _jsx("th", { children: "ACTUAL TOTAL" }), _jsx("th", { children: "OUTSTANDING" }), _jsx("th", { children: "ELECTORAL AREA" })] }) }), _jsx("tbody", { children: budgetItems.map(function (item) { return (_jsxs("tr", { children: [_jsx("td", { children: item.officer_no }), _jsx("td", { children: item.officer_name }), _jsx("td", { children: item.fiscal_year }), _jsx("td", { children: item.annual_budget.toFixed(2) }), _jsx("td", { children: item.monthly_budget.toFixed(2) }), _jsx("td", { children: item.actual_total.toFixed(2) }), _jsx("td", { children: item.outstanding.toFixed(2) }), _jsx("td", { children: item.electoral_area })] }, item.officer_no)); }) })] })] }) })] }));
};
export default FrmPropertyOfficerBudget;
