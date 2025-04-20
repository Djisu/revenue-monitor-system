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
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var FrmOfficerBudget = function () {
    var _a;
    var _b = useState(0), fiscalYear = _b[0], setFiscalYear = _b[1];
    var _c = useState(null), annualBudget = _c[0], setAnnualBudget = _c[1];
    var _d = useState(null), monthlyBudget = _d[0], setMonthlyBudget = _d[1];
    var _e = useState(null), weeklyBudget = _e[0], setWeeklyBudget = _e[1];
    var _f = useState(''), electoralArea = _f[0], setElectoralArea = _f[1];
    var _g = useState(''), officerName = _g[0], setOfficerName = _g[1];
    var _h = useState([]), officers = _h[0], setOfficers = _h[1];
    var _j = useState([]), officerBudgets = _j[0], setOfficerBudgets = _j[1];
    var _k = useState(0), electoralQuantity = _k[0], setElectoralQuantity = _k[1];
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
        // Populate ListView on form load
        var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get('/api/officer-budgets')];
                    case 1:
                        response = _a.sent();
                        setOfficerBudgets(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error fetching officer budgets:", error_2);
                        alert("No records found to feed the listview");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Update current rate on form load
        var updateCurrentRate = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.post('/api/update-current-rate')];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error updating current rate:", error_3);
                        alert("Error updating current rate");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchOfficers();
        populateListView();
        updateCurrentRate();
    }, [fiscalYear, electoralArea]);
    var handleOfficerNoChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedValue, _a, selectedOfficerNo, selectedOfficerName, selectedElectoralArea, response, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    selectedValue = event.target.value;
                    _a = selectedValue.split(' '), selectedOfficerNo = _a[0], selectedOfficerName = _a[1], selectedElectoralArea = _a[2];
                    setElectoralArea(selectedElectoralArea);
                    setOfficerName(selectedOfficerName);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/electoral-areas', {
                            params: { officerNo: selectedOfficerNo }
                        })];
                case 2:
                    response = _b.sent();
                    if (response.data) {
                        setElectoralArea(response.data[0].electoral_area);
                    }
                    else {
                        alert("No electoral area found for the selected officer");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _b.sent();
                    console.error("Error fetching electoral areas:", error_4);
                    alert("Error fetching electoral areas");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleElectoralAreaChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedElectoralArea, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedElectoralArea = event.target.value;
                    setElectoralArea(selectedElectoralArea);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/total-clients', {
                            params: { electoralArea: electoralArea, fiscalYear: fiscalYear }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data) {
                        setElectoralQuantity(response.data.totKount.toString());
                    }
                    else {
                        setElectoralQuantity(0);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error("Error fetching total clients:", error_5);
                    alert("Error fetching total clients");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFiscalYearChange = function (event) {
        setFiscalYear(parseInt(event.target.value));
    };
    var handleAnnualBudgetChange = function (event) {
        var annualBudgetValue = parseFloat(event.target.value);
        if (!isNaN(annualBudgetValue)) {
            setAnnualBudget(annualBudgetValue);
            setMonthlyBudget(parseFloat((annualBudgetValue / 12).toFixed(2)));
            setWeeklyBudget(parseFloat((annualBudgetValue / 52).toFixed(2)));
        }
        else {
            setAnnualBudget(null);
            setMonthlyBudget(null);
            setWeeklyBudget(null);
        }
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear || !annualBudget || !monthlyBudget || !electoralArea) {
                        alert("ENTER THE FISCAL YEAR, ANNUAL BUDGET, MONTHLY BUDGET, AND ELECTORAL AREA");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-budget', {
                            officer_no: firstOfficer,
                            officer_name: officerName,
                            fiscal_year: fiscalYear,
                            annual_budget: annualBudget,
                            monthly_budget: monthlyBudget,
                            January_budget: monthlyBudget,
                            February_budget: monthlyBudget,
                            March_budget: monthlyBudget,
                            April_budget: monthlyBudget,
                            May_budget: monthlyBudget,
                            June_budget: monthlyBudget,
                            July_budget: monthlyBudget,
                            August_budget: monthlyBudget,
                            September_budget: monthlyBudget,
                            October_budget: monthlyBudget,
                            November_budget: monthlyBudget,
                            December_budget: monthlyBudget,
                            electoral_area: electoralArea
                        })];
                case 2:
                    response = _a.sent();
                    alert(response.data.message);
                    populateListView();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error("Error adding budget:", error_6);
                    alert("Error adding budget");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAddWeeklyClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear || !annualBudget || !weeklyBudget || !electoralArea) {
                        alert("ENTER THE FISCAL YEAR, ANNUAL BUDGET, WEEKLY BUDGET, AND ELECTORAL AREA");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-budget-weekly', {
                            officer_no: firstOfficer,
                            officer_name: officerName,
                            fiscal_year: fiscalYear,
                            annual_budget: annualBudget,
                            weekly_budget: weeklyBudget,
                            electoral_area: electoralArea
                        })];
                case 2:
                    response = _a.sent();
                    alert(response.data.message);
                    populateListView();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    console.error("Error adding weekly budget:", error_7);
                    alert("Error adding weekly budget");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userRole, response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear || !annualBudget || !monthlyBudget || !electoralArea) {
                        alert("ENTER THE FISCAL YEAR, ANNUAL BUDGET, MONTHLY BUDGET, AND ELECTORAL AREA");
                        return [2 /*return*/];
                    }
                    userRole = localStorage.getItem('userRole');
                    if (userRole !== 'supervisor' && userRole !== 'SUPERVISOR') {
                        alert("Only supervisors can edit this budget.!!");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/edit-budget', {
                            officer_no: firstOfficer,
                            officer_name: officerName,
                            fiscal_year: fiscalYear,
                            annual_budget: annualBudget,
                            monthly_budget: monthlyBudget,
                            electoral_area: electoralArea
                        })];
                case 2:
                    response = _a.sent();
                    alert(response.data.message);
                    populateListView();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error("Error editing budget:", error_8);
                    alert("Error editing budget");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/officer-budgets', {
                            params: { fiscalYear: fiscalYear }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE.rpt', '_blank');
                        alert("Processing completed");
                    }
                    else {
                        alert("No records found for the specified fiscal year");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    console.error("Error viewing budgets:", error_9);
                    alert("Error viewing budgets");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Assuming you have a way to navigate back to the main page
        window.location.href = '/'; // Redirect to main page or wherever you want
    };
    var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/officer-budgets')];
                case 1:
                    response = _a.sent();
                    setOfficerBudgets(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    console.error("Error fetching officer budgets:", error_10);
                    alert("No records found to feed the listview");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var firstOfficer = ((_a = officers.find(function (officer) { return officer.officer_no === electoralArea.split(' ')[0]; })) === null || _a === void 0 ? void 0 : _a.officer_no) || '';
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h3", { children: "Collector's Budget Data Entry" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formOfficerNo", children: [_jsx(Form.Label, { children: "Collector No:" }), _jsxs(Form.Control, { as: "select", value: "".concat(firstOfficer, " ").concat(officerName, " ").concat(electoralArea), onChange: handleOfficerNoChange, children: [_jsx("option", { value: "", children: "Select a collector" }), officers.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.officer_name, " ").concat(officer.electoral_area), children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: fiscalYear, onChange: handleFiscalYearChange })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formAnnualBudget", children: [_jsx(Form.Label, { children: "Annual Budget:" }), _jsx(Form.Control, { type: "number", value: annualBudget !== null ? annualBudget : 0, onChange: handleAnnualBudgetChange }), _jsx(Form.Label, { children: "GHC" })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formMonthlyBudget", children: [_jsx(Form.Label, { children: "Monthly Budget:" }), _jsx(Form.Control, { type: "number", value: monthlyBudget !== null ? monthlyBudget : 0, readOnly: true }), _jsx(Form.Label, { children: "GHC" })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formWeeklyBudget", children: [_jsx(Form.Label, { children: "Weekly Budget:" }), _jsx(Form.Control, { type: "number", value: weeklyBudget !== null ? weeklyBudget : 0, readOnly: true }), _jsx(Form.Label, { children: "GHC" })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: handleElectoralAreaChange, children: [_jsx("option", { value: "", children: "Select an electoral area" }), officers.map(function (officer) { return (_jsx("option", { value: officer.electoral_area, children: officer.electoral_area }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Total Number of Clients in electoral area:" }), _jsx(Form.Control, { type: "number", readOnly: true, value: electoralQuantity })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Collector:" }), _jsx(Form.Control, { type: "text", readOnly: true, value: officerName })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record (Monthly)" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "success", onClick: handleAddWeeklyClick, children: "Add New Record (Weekly)" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "warning", onClick: handleEditClick, children: "Edit Old Record" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "info", onClick: handleViewClick, children: "View Collectors Budgets for Current Year" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Frame1, { officerBudgets: officerBudgets }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
var Frame1 = function (_a) {
    var officerBudgets = _a.officerBudgets;
    return (_jsxs("div", { className: "border p-3", children: [_jsx("h4", { children: "Activtiy" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "OFFICER NAME" }), _jsx("th", { children: "FISCAL YEAR" }), _jsx("th", { children: "ANNUAL BUDGET" }), _jsx("th", { children: "MONTHLY BUDGET" }), _jsx("th", { children: "JANUARY BUDGET" }), _jsx("th", { children: "JANUARY ACTUAL" }), _jsx("th", { children: "FEBRUARY BUDGET" }), _jsx("th", { children: "FEBRUARY ACTUAL" }), _jsx("th", { children: "MARCH BUDGET" }), _jsx("th", { children: "MARCH ACTUAL" }), _jsx("th", { children: "APRIL BUDGET" }), _jsx("th", { children: "APRIL ACTUAL" }), _jsx("th", { children: "MAY BUDGET" }), _jsx("th", { children: "MAY ACTUAL" }), _jsx("th", { children: "JUNE BUDGET" }), _jsx("th", { children: "JUNE ACTUAL" }), _jsx("th", { children: "JULY BUDGET" }), _jsx("th", { children: "JULY ACTUAL" }), _jsx("th", { children: "AUGUST BUDGET" }), _jsx("th", { children: "AUGUST ACTUAL" }), _jsx("th", { children: "SEPTEMBER BUDGET" }), _jsx("th", { children: "SEPTEMBER ACTUAL" }), _jsx("th", { children: "OCTOBER BUDGET" }), _jsx("th", { children: "OCTOBER ACTUAL" }), _jsx("th", { children: "NOVEMBER BUDGET" }), _jsx("th", { children: "NOVEMBER ACTUAL" }), _jsx("th", { children: "DECEMBER BUDGET" }), _jsx("th", { children: "DECEMBER ACTUAL" }), _jsx("th", { children: "TOTAL ACTUAL" }), _jsx("th", { children: "OUTSTANDING" }), _jsx("th", { children: "ELECTORAL AREA" })] }) }), _jsx("tbody", { children: officerBudgets.map(function (budget) { return (_jsxs("tr", { children: [_jsx("td", { children: budget.officer_no }), _jsx("td", { children: budget.officer_name }), _jsx("td", { children: budget.fiscal_year }), _jsx("td", { children: budget.annual_budget.toLocaleString() }), _jsx("td", { children: budget.monthly_budget.toLocaleString() }), _jsx("td", { children: budget.January_budget.toLocaleString() }), _jsx("td", { children: budget.January_Actual.toLocaleString() }), _jsx("td", { children: budget.February_budget.toLocaleString() }), _jsx("td", { children: budget.February_Actual.toLocaleString() }), _jsx("td", { children: budget.March_budget.toLocaleString() }), _jsx("td", { children: budget.March_Actual.toLocaleString() }), _jsx("td", { children: budget.April_budget.toLocaleString() }), _jsx("td", { children: budget.April_Actual.toLocaleString() }), _jsx("td", { children: budget.May_budget.toLocaleString() }), _jsx("td", { children: budget.May_Actual.toLocaleString() }), _jsx("td", { children: budget.June_budget.toLocaleString() }), _jsx("td", { children: budget.June_Actual.toLocaleString() }), _jsx("td", { children: budget.July_budget.toLocaleString() }), _jsx("td", { children: budget.July_Actual.toLocaleString() }), _jsx("td", { children: budget.August_budget.toLocaleString() }), _jsx("td", { children: budget.August_Actual.toLocaleString() }), _jsx("td", { children: budget.September_budget.toLocaleString() }), _jsx("td", { children: budget.September_Actual.toLocaleString() }), _jsx("td", { children: budget.October_budget.toLocaleString() }), _jsx("td", { children: budget.October_Actual.toLocaleString() }), _jsx("td", { children: budget.November_budget.toLocaleString() }), _jsx("td", { children: budget.November_Actual.toLocaleString() }), _jsx("td", { children: budget.December_budget.toLocaleString() }), _jsx("td", { children: budget.December_Actual.toLocaleString() }), _jsx("td", { children: budget.Actual_total.toLocaleString() }), _jsx("td", { children: budget.outstanding.toLocaleString() }), _jsx("td", { children: budget.electoral_area })] }, budget.officer_no)); }) })] })] }));
};
export default FrmOfficerBudget;
