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
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Alert, Table } from 'reactstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchBusTypeSummaryReports } from './BusTypeSummaryReportSlice';
import { Bar } from 'react-chartjs-2';
var DailyPayments = function () {
    var _a = useState(''), zone = _a[0], setZone = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState(''), bussType = _c[0], setBussType = _c[1];
    var _d = useState(''), firstDate = _d[0], setFirstDate = _d[1];
    var _e = useState(''), lastDate = _e[0], setLastDate = _e[1];
    var _f = useState([]), bussTypes = _f[0], setBussTypes = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(false), isLoading = _h[0], setIsLoading = _h[1];
    var _j = useState([]), managementReport = _j[0], setManagementReport = _j[1];
    var _k = useState(0), totalBalance = _k[0], setTotalBalance = _k[1];
    var navigate = useNavigate();
    var dispatch = useAppDispatch();
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
    }, [dispatch]);
    var managementReportData = useAppSelector(function (state) { return state.reports.reports; });
    useEffect(function () {
        setManagementReport(managementReportData);
    }, [managementReportData]);
    // const businessList = managementReport.map((report) => ({
    //     electoral_area: report.electoral_area,
    //     buss_type: report.buss_type,
    //     amountdue: report.amountdue,
    //     amountpaid: report.amountpaid,
    //     balance: report.amountdue - report.amountpaid,
    // }));
    useEffect(function () {
        var total = managementReport.reduce(function (acc, curr) { return acc + (curr.amountdue - curr.amountpaid); }, 0);
        totalBalance = total;
        setTotalBalance(totalBalance);
    }, [managementReport]);
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    useEffect(function () {
        if (Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
        }
        else {
            console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
        }
    }, [electoralAreaData]);
    var businessTypes = useAppSelector(function (state) { return state.businessType.businessTypes; });
    useEffect(function () {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes);
        }
    }, [businessTypes]);
    var handleZoneChange = function (e) {
        setZone(e.target.value);
    };
    var handleFirstDateChange = function (e) {
        setFirstDate(e.target.value);
    };
    var handleLastDateChange = function (e) {
        setLastDate(e.target.value);
    };
    var handleProduceReport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dispatch(fetchBusTypeSummaryReports({
                            firstDate: firstDate,
                            lastDate: lastDate,
                            zone: zone,
                            bussType: bussType
                        }))];
                case 2:
                    answer = _a.sent();
                    console.log('answer: ', answer);
                    if (answer && answer.payload) {
                        console.log('answer.payload: ', answer.payload);
                        setManagementReport(answer.payload);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setError(error_1.message);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var businessList = managementReport.map(function (report) { return ({
        electoral_area: report.electoral_area,
        buss_type: report.buss_type,
        amountdue: report.amountdue,
        amountpaid: report.amountpaid,
        balance: report.amountdue - report.amountpaid
    }); });
    // Chart data
    var chartData = {
        labels: businessList.map(function (business) { return business.electoral_area; }), // Use electoral_area as labels
        datasets: [
            {
                label: 'Amount Due',
                data: businessList.map(function (business) { return business.amountdue; }),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Amount Paid',
                data: businessList.map(function (business) { return business.amountpaid; }),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Balance',
                data: businessList.map(function (business) { return business.balance; }),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };
    return (_jsx("div", { children: _jsxs("div", { className: "container mt-5", children: [error && _jsx(Alert, { color: "danger", children: error }), _jsx("div", { children: _jsxs(Form, { children: [_jsxs(FormGroup, { children: [_jsx("p", { className: "text-center text-underline", children: "Produce Daily Payments Report" }), _jsx(Bar, { data: chartData }), _jsx(Label, { for: "zone", className: "font-weight-bold", children: "Electoral Area:" }), _jsxs(Input, { type: "select", name: "zone", id: "zone", value: zone, onChange: handleZoneChange, children: [_jsx("option", { value: "All electoral areas", children: "All electoral areas" }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "bussType", className: "font-weight-bold", children: "Business Type/Profession:" }), _jsxs(Input, { type: "select", name: "bussType", id: "bussType", value: bussType, onChange: function (e) { return setBussType(e.target.value); }, children: [_jsx("option", { value: "All business types", children: "All business types" }), bussTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.business_type, children: businessType.business_type }, index)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "firstDate", className: "font-weight-bold", children: "First Payment Date:" }), _jsx(Input, { type: "date", name: "firstDate", id: "firstDate", value: firstDate, onChange: handleFirstDateChange })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "lastDate", className: "font-weight-bold", children: "Last Payment Date:" }), _jsx(Input, { type: "date", name: "lastDate", id: "lastDate", value: lastDate, onChange: handleLastDateChange })] }), _jsx(FormGroup, { children: _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { color: "success", onClick: handleProduceReport, disabled: isLoading, children: "Produce Summarized Report" }), _jsx(Button, { variant: "secondary", onClick: function () { return navigate("/main"); }, style: { marginLeft: '40px', marginTop: '10px' }, children: "Go Back" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business Type/Profession" }), _jsx("th", { children: "Amount Due" }), _jsx("th", { children: "Amount Paid" }), _jsx("th", { children: "Balance" })] }) }), _jsx("tbody", { children: businessList.map(function (business, index) { return (_jsxs("tr", { children: [_jsx("td", { children: business.electoral_area }), _jsx("td", { children: business.buss_type }), _jsx("td", { children: business.amountdue }), _jsx("td", { children: business.amountpaid }), _jsx("td", { children: business.balance })] }, index)); }) })] })] }) })] }) })] }) }));
};
export default DailyPayments;
