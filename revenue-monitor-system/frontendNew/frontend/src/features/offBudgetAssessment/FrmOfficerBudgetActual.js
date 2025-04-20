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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchOfficerBudget } from '../officerBudget/officerBudgetSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
var FrmOfficerBudgetActual = function () {
    var dispatch = useAppDispatch();
    var navigate = useNavigate();
    var _a = useState(2023), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState([]), localBudgetData = _b[0], setLocalBudgetData = _b[1];
    var _c = useState(''), selectedOfficer = _c[0], setSelectedOfficer = _c[1];
    var officersData = useAppSelector(function (state) { return state.officer.officers; });
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatch(fetchOfficers())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [dispatch]);
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(selectedOfficer && fiscalYear)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dispatch(fetchOfficerBudget({ officer_no: selectedOfficer, fiscal_year: fiscalYear })).unwrap()];
                    case 2:
                        data = _a.sent();
                        setLocalBudgetData(data.data);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to fetch budget data: ', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [selectedOfficer, fiscalYear, dispatch]);
    var handleFetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(selectedOfficer && fiscalYear)) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch(fetchOfficerBudget({ officer_no: selectedOfficer, fiscal_year: fiscalYear }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    alert('Please select an officer and enter a fiscal year.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        navigate('/main');
    };
    var getChartData = function (data) {
        if (!data || data.length === 0)
            return { labels: [], datasets: [] };
        var monthlyLabels = [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October',
            'November', 'December'
        ];
        var budgetData = data[0];
        var budgets = monthlyLabels.map(function (month) {
            return parseFloat(budgetData["".concat(month.toLowerCase(), "_budget")]) || 0;
        });
        var actuals = monthlyLabels.map(function (month) {
            return parseFloat(budgetData["".concat(month.toLowerCase(), "_actual")]) || 0;
        });
        return {
            labels: monthlyLabels,
            datasets: [
                {
                    label: 'Monthly Budget',
                    data: budgets,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Monthly Actual',
                    data: actuals,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        };
    };
    var chartData = getChartData(localBudgetData);
    return (_jsx("div", { className: "container mt-4", children: _jsxs("div", { children: [_jsx("p", { className: "mb-4", children: "Fetch Collector Budget" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "fiscalYear", className: "form-label", children: "Fiscal Year:" }), _jsx("input", { type: "number", className: "form-control", id: "fiscalYear", value: fiscalYear, onChange: function (e) { return setFiscalYear(parseInt(e.target.value, 10)); }, min: 2025 })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "officerSelect", className: "form-label", children: "Select Officer:" }), _jsxs("select", { id: "officerSelect", className: "form-select", value: selectedOfficer, onChange: function (e) { return setSelectedOfficer(e.target.value); }, children: [_jsx("option", { value: "", children: "Select an officer" }), officersData.map(function (officer) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }), _jsx("button", { className: "btn btn-primary", onClick: handleFetchData, children: "Fetch Data" }), _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }), _jsx("div", { className: "chart-container mt-4", children: localBudgetData.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { children: "Monthly Budget vs Actuals" }), _jsx(Bar, { data: chartData, options: { responsive: true, maintainAspectRatio: false } }), _jsxs("table", { className: "table mt-4", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Month" }), _jsx("th", { children: "Budget" }), _jsx("th", { children: "Actual" })] }) }), _jsx("tbody", { children: Object.keys(localBudgetData[0]).filter(function (key) { return key.endsWith('_budget'); }).map(function (key, index) {
                                            var month = key.split('_')[0]; // Extract month name and assert type
                                            return (_jsxs("tr", { children: [_jsx("td", { children: month.charAt(0).toUpperCase() + month.slice(1) }), _jsx("td", { children: localBudgetData[0][key] }), _jsx("td", { children: localBudgetData[0]["".concat(month, "_actual")] })] }, index));
                                        }) })] })] })) })] }) }));
};
export default FrmOfficerBudgetActual;
