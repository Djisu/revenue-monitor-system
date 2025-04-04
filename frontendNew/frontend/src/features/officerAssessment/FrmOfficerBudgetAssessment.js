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
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';
import { fetchOfficerAssessment } from './officerAssessmentSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { Bar } from 'react-chartjs-2';
var OfficerBudgetAssessment = function () {
    var _a = useState(''), firstFiscalDate = _a[0], setFirstFiscalDate = _a[1];
    var _b = useState(''), firstOfficer = _b[0], setFirstOfficer = _b[1];
    var _c = useState(0), fiscalYear = _c[0], setFiscalYear = _c[1];
    //let [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
    //let [officers, setOfficers] = useState<Officer[]>([]);
    var _d = useState([]), assessmentData = _d[0], setAssessmentData = _d[1];
    var officersData = useAppSelector(function (state) { return state.officer.officers; });
    var dispatch = useAppDispatch();
    useEffect(function () {
        // Log assessment data whenever it changes
        console.log('Updated Assessment Data: ', assessmentData);
    }, [assessmentData]);
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
    var handleFirstFiscalDateChange = function (event) {
        setFirstFiscalDate(event.target.value);
    };
    var handleFirstOfficerChange = function (event) {
        var target = event.target;
        var selectedOfficer = target.value.split(' ')[0];
        setFirstOfficer(selectedOfficer);
    };
    // const handleExitClick = () => {
    //   // Replace this with the appropriate logic to handle exit
    //   alert('Exit clicked');
    // };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fiscalYearx, fetchParams, action, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fiscalYearx = new Date(firstFiscalDate).getFullYear();
                    fiscalYear = fiscalYearx;
                    setFiscalYear(fiscalYear);
                    fetchParams = {
                        fiscalYear: fiscalYear, officerNo: firstOfficer
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(fetchOfficerAssessment(fetchParams))];
                case 2:
                    action = _a.sent();
                    // Check if the action was fulfilled
                    if (fetchOfficerAssessment.fulfilled.match(action)) {
                        response = action.payload;
                        if (!response) {
                            alert('You have to set budgets for the collects before assessing them');
                            return [2 /*return*/];
                        }
                        console.log('RESPONSE: ', response.januaryamount, response.februaryamount, response.marchamount, response.aprilamount, response.mayamount, response.juneamount, response.julyamount, response.augustamount, response.septemberamount, response.octoberamount, response.novemberamount, response.decemberamount);
                        data = [
                            { month: 'January', amount: response.januaryamount || 0 },
                            { month: 'February', amount: response.februaryamount || 0 },
                            { month: 'March', amount: response.marchamount || 0 },
                            { month: 'April', amount: response.aprilamount || 0 },
                            { month: 'May', amount: response.mayamount || 0 },
                            { month: 'June', amount: response.juneamount || 0 },
                            { month: 'July', amount: response.julyamount || 0 },
                            { month: 'August', amount: response.augustamount || 0 },
                            { month: 'September', amount: response.septemberamount || 0 },
                            { month: 'October', amount: response.octoberamount || 0 },
                            { month: 'November', amount: response.novemberamount || 0 },
                            { month: 'December', amount: response.decemberamount || 0 },
                        ];
                        setAssessmentData(data);
                    }
                    else {
                        alert('Failed to fetch officer assessment: ' + action.error.message);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    alert(error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var barColors = [
        'rgba(75, 192, 192, 0.6)', // January
        'rgba(153, 102, 255, 0.6)', // February
        'rgba(255, 159, 64, 0.6)', // March
        'rgba(255, 99, 132, 0.6)', // April
        'rgba(54, 162, 235, 0.6)', // May
        'rgba(255, 206, 86, 0.6)', // June
        'rgba(75, 192, 192, 0.6)', // July
        'rgba(201, 203, 207, 0.6)', // August
        'rgba(255, 99, 132, 0.6)', // September
        'rgba(54, 162, 235, 0.6)', // October
        'rgba(255, 206, 86, 0.6)', // November
        'rgba(153, 102, 255, 0.6)', // December
    ];
    return (_jsxs("div", { style: { backgroundColor: 'white', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [_jsx("p", { children: "Collector Performance Trend" }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsx("label", { style: { marginRight: '10px', fontWeight: 'bold' }, children: "First Fiscal Year:" }), _jsx("input", { type: "date", value: firstFiscalDate, onChange: handleFirstFiscalDateChange, style: { marginRight: '10px' } })] }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsx("label", { style: { marginRight: '10px', fontWeight: 'bold' }, children: "First Officer:" }), _jsxs("select", { value: firstOfficer, onChange: handleFirstOfficerChange, children: [_jsx("option", { value: "", children: "Select" }), officersData.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.officer_name), children: [officer.officer_no, "  ", officer.officer_name] }, officer.officer_no)); })] })] }), _jsx("div", { style: { marginTop: '20px', display: 'flex', justifyContent: 'space-around', width: '50%' }, children: _jsx("button", { style: { fontWeight: 'bold', backgroundColor: 'gray', }, onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }) }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }), assessmentData.length > 0 && (_jsxs("div", { style: { width: '80%', marginTop: '30px' }, children: [_jsx("h3", { children: "Monthly Collector Payments" }), _jsx(Bar, { data: {
                            labels: assessmentData.map(function (item) { return item.month; }),
                            datasets: [
                                {
                                    label: 'Amounts Collected Graph',
                                    data: assessmentData.map(function (item) { return item.amount; }),
                                    backgroundColor: barColors, // Use the array of colors
                                    borderColor: barColors.map(function (color) { return color.replace('0.6', '1'); }), // Make borders fully opaque
                                    borderWidth: 1,
                                },
                            ],
                        }, options: { scales: { y: { beginAtZero: true } } } }), _jsxs("table", { style: { marginTop: '20px', width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Month" }), _jsx("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Amount" })] }) }), _jsx("tbody", { children: assessmentData.map(function (item, index) { return (_jsxs("tr", { children: [_jsx("td", { style: { border: '1px solid #000', padding: '8px', color: 'white', backgroundColor: 'black' }, children: item.month }), _jsx("td", { style: { border: '1px solid #000', padding: '8px', color: 'white', backgroundColor: 'black' }, children: item.amount })] }, index)); }) })] })] }))] }));
};
export default OfficerBudgetAssessment;
