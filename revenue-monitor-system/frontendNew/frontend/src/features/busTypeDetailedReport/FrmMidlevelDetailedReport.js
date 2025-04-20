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
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Container, Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchDetailedReports } from '../busTypeDetailedReport/busTypeDetailedReportSlice';
var FrmMidlevelDetailedReport = function () {
    var _a = useState('All electoral areas'), zone = _a[0], setZone = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState([]), bussTypes = _c[0], setBussTypes = _c[1];
    var _d = useState([]), busDetailedReport = _d[0], setBusDetailedReport = _d[1];
    var _e = useState(''), businessType = _e[0], setBusinessType = _e[1];
    var _f = useState(new Date().getFullYear().toString()), fiscalYear = _f[0], setFiscalYear = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(''), successMessage = _h[0], setSuccessMessage = _h[1];
    var _j = useState(false), loading = _j[0], setLoading = _j[1];
    var navigate = useNavigate();
    var dispatch = useAppDispatch();
    // Fetch data on component mount
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
    }, [dispatch]);
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    var businessTypes = useAppSelector(function (state) { return state.businessType.businessTypes; });
    var busTypeDetailedReport = useAppSelector(function (state) { return state.busTypedetailedReport.reports; });
    useEffect(function () {
        if (Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
        }
    }, [electoralAreaData]);
    useEffect(function () {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes);
        }
    }, [businessTypes]);
    useEffect(function () {
        if (Array.isArray(busTypeDetailedReport)) {
            setBusDetailedReport(busTypeDetailedReport);
        }
    }, [busTypeDetailedReport]);
    var handleBusinessTypeChange = function (e) {
        setBusinessType(e.target.value);
    };
    var handleZoneChange = function (e) {
        setZone(e.target.value);
    };
    var handleLastDateChange = function (e) {
        setFiscalYear(e.target.value);
    };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var reportData, answer, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!fiscalYear) {
                        setError('Please select the current fiscal year');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    reportData = { zone: zone, businessType: businessType, fiscalYear: fiscalYear };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dispatch(fetchDetailedReports(reportData))];
                case 2:
                    answer = _b.sent();
                    if (answer && Array.isArray(answer.payload)) {
                        setBusDetailedReport(answer.payload);
                        setSuccessMessage('Report produced successfully');
                        setError('');
                    }
                    else if (answer.meta.requestStatus === 'rejected') {
                        setError('Error producing report');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    setError('An unexpected error occurred');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var groupedData = busDetailedReport.reduce(function (acc, report) {
        var area = report.electoral_area;
        if (!area)
            return acc;
        if (!acc[area]) {
            acc[area] = {
                electoral_area: area,
                totalAmountDue: 0,
                totalAmountPaid: 0,
                totalBalance: 0,
                businesses: [],
            };
        }
        var amountDue = Number(report.amountdue) || 0;
        var amountPaid = Number(report.amountpaid) || 0;
        acc[area].totalAmountDue += amountDue;
        acc[area].totalAmountPaid += amountPaid;
        acc[area].totalBalance = acc[area].totalAmountDue - acc[area].totalAmountPaid;
        acc[area].businesses.push({
            electroral_area: area,
            buss_no: report.buss_no,
            buss_name: report.buss_name,
            buss_type: report.buss_type,
            amountdue: amountDue,
            amountpaid: amountPaid,
        });
        return acc;
    }, {});
    var summarizedList = Object.values(groupedData);
    var calculateGrandTotals = function (reports) {
        var totalDue = 0;
        var totalPaid = 0;
        var totalBal = 0;
        reports.forEach(function (report) {
            var amountDue = Number(report.amountdue) || 0;
            var amountPaid = Number(report.amountpaid) || 0;
            totalDue += amountDue;
            totalPaid += amountPaid;
            totalBal += (amountDue - amountPaid);
        });
        return { totalDue: totalDue, totalPaid: totalPaid, totalBal: totalBal };
    };
    var _k = calculateGrandTotals(busDetailedReport), grandTotalAmountDue = _k.totalDue, grandTotalAmountPaid = _k.totalPaid, grandTotalBalance = _k.totalBal;
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs("div", { children: [_jsxs(Form, { children: [_jsx("p", { className: "text-center mb-4", children: "Mid Level Detailed Report" }), _jsxs(Form.Group, { controlId: "formZone", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: zone, onChange: handleZoneChange, children: [_jsx("option", { value: "All electoral areas", children: "All electoral areas" }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formBussType", children: [_jsx(Form.Label, { children: "Business Type/Profession:" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "All business types", children: "All business types" }), bussTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.business_type, children: businessType.business_type }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Current Fiscal Year:" }), _jsx(Form.Control, { type: "text", value: fiscalYear, onChange: handleLastDateChange })] }), _jsxs("div", { children: [_jsx(Button, { variant: "primary", onClick: handleViewClick, style: { marginTop: '10px' }, children: "Produce Report" }), _jsx(Button, { variant: "secondary", onClick: function () { return navigate("/main"); }, style: { marginLeft: '40px', marginTop: '10px' }, children: "Go Back" })] }), loading && (_jsx("div", { className: "text-center mt-3", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }) }))] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type/Profession" }), _jsx("th", { children: "Amount Due" }), _jsx("th", { children: "Amount Paid" }), _jsx("th", { children: "Balance" })] }) }), _jsxs("tbody", { children: [summarizedList.map(function (area, index) {
                                        var _a, _b, _c, _d, _e, _f;
                                        var isFirstBusiness = index === 0 || area.electoral_area !== summarizedList[index - 1].electoral_area;
                                        if (isFirstBusiness) {
                                            return (_jsxs(React.Fragment, { children: [_jsxs("tr", { children: [_jsx("td", { rowSpan: area.businesses.length + 1, children: area.electoral_area || 'N/A' }), _jsx("td", { children: ((_a = area.businesses[0]) === null || _a === void 0 ? void 0 : _a.buss_name) || 'N/A' }), _jsx("td", { children: ((_b = area.businesses[0]) === null || _b === void 0 ? void 0 : _b.buss_type) || 'N/A' }), _jsx("td", { children: (_c = area.businesses[0]) === null || _c === void 0 ? void 0 : _c.amountdue.toFixed(2) }), _jsx("td", { children: (_d = area.businesses[0]) === null || _d === void 0 ? void 0 : _d.amountpaid.toFixed(2) }), _jsx("td", { children: (((_e = area.businesses[0]) === null || _e === void 0 ? void 0 : _e.amountdue) - ((_f = area.businesses[0]) === null || _f === void 0 ? void 0 : _f.amountpaid)).toFixed(2) })] }), area.businesses.slice(1).map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.buss_name || 'N/A' }), _jsx("td", { children: business.buss_type || 'N/A' }), _jsx("td", { children: business.amountdue.toFixed(2) }), _jsx("td", { children: business.amountpaid.toFixed(2) }), _jsx("td", { children: (business.amountdue - business.amountpaid).toFixed(2) })] }, business.buss_no)); }), _jsxs("tr", { style: { fontWeight: 'bold' }, children: [_jsxs("td", { colSpan: 2, children: ["Total for ", area.electoral_area] }), _jsx("td", { children: area.totalAmountDue.toFixed(2) }), _jsx("td", { children: area.totalAmountPaid.toFixed(2) }), _jsx("td", { children: area.totalBalance.toFixed(2) })] })] }, index));
                                        }
                                        else {
                                            return null;
                                        }
                                    }), _jsxs("tr", { style: { fontWeight: 'bold', backgroundColor: '#f0f0f0' }, children: [_jsx("td", { colSpan: 3, children: "Grand Total" }), _jsx("td", { children: grandTotalAmountDue.toFixed(2) }), _jsx("td", { children: grandTotalAmountPaid.toFixed(2) }), _jsx("td", { children: grandTotalBalance.toFixed(2) })] })] })] })] })] }));
};
export default FrmMidlevelDetailedReport;
