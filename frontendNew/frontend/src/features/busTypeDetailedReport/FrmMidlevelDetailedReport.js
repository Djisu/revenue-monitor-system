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
// interface BusTypeDetailedReportX {
//   electoral_area: string;
//   buss_no: number; // Ensure this is a number
//   buss_name: string;
//   buss_type: string;
//   amountdue: number;
//   amountpaid: number;
// }
// interface BusinessTypeDetailedReport {
//   electroral_area: string;
//   buss_no: number;
//   buss_name: string;
//   buss_type: string;
//   amountdue: number;
//   amountpaid: number;
//   balance: number;
//   tot_grade: string;
// }
// interface ElectoralArea {
//   electroral_area: string;
// }
// interface FiscalYear {
//   fiscal_year: number;
// }
// interface reportAdd {
//   zone: string;
//   businessType: string;
//   fiscalYear: string;
// }
var FrmMidlevelDetailedReport = function () {
    var _a = useState(''), zone = _a[0], setZone = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState([]), bussTypes = _c[0], setBussTypes = _c[1];
    // let [businessList] = useState<BusTypeDetailedReport[]>([]);
    var _d = useState([]), busDetailedReport = _d[0], setBusDetailedReport = _d[1];
    var _e = useState(''), businessType = _e[0], setBusinessType = _e[1];
    var _f = useState(new Date().getFullYear().toString()), fiscalYear = _f[0], setFiscalYear = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(''), successMessage = _h[0], setSuccessMessage = _h[1];
    var _j = useState(false), loading = _j[0], setLoading = _j[1]; // Loading state
    var reportData = {
        zone: zone,
        businessType: businessType,
        fiscalYear: fiscalYear
    };
    var navigate = useNavigate(); // Initialize the useNavigate hook  
    var dispatch = useAppDispatch();
    // Fetch data on component mount
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
    }, [dispatch]);
    useEffect(function () {
        dispatch(fetchElectoralAreas());
    }, [dispatch]);
    useEffect(function () {
        console.log('about to dispatch(fetchDetailedReports())');
        dispatch(fetchDetailedReports(reportData)); // Make sure this is triggered correctly
    }, [dispatch]);
    // Get electoral areas from the Redux store // as ElectoralArea[];
    var busTypeDetailedReport = useAppSelector(function (state) { return state.busTypedetailedReport.reports; });
    useEffect(function () {
        if (Array.isArray(busTypeDetailedReport)) {
            setBusDetailedReport(busTypeDetailedReport); // Correct this line
            console.log('busTypeDetailedReport: ', busTypeDetailedReport);
        }
    }, [busTypeDetailedReport]);
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    //console.log('typeof electoralAreaData:', typeof electoralAreaData)
    useEffect(function () {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
            //console.log('electoralAreas: ', electoralAreas)
        }
        else {
            console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
        }
    }, [electoralAreaData, setElectoralAreas]);
    var businessTypes = useAppSelector(function (state) { return state.businessType.businessTypes; });
    console.log('businessTypes: ', businessTypes);
    useEffect(function () {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes); // Update local state with fetched data
        }
    }, [businessTypes]); // Dependency array includes businessTypes
    var handleBusinessTypeChange = function (e) {
        setBusinessType(e.target.value);
    };
    var handleZoneChange = function (e) {
        var selectedZone = e.target.value;
        setZone(selectedZone);
        // You can log or handle the selected value here
        //console.log('Selected Zone:', selectedZone);
    };
    var handleLastDateChange = function (e) {
        setFiscalYear(e.target.value);
    };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handleViewClick');
                    if (!fiscalYear) {
                        setError('Please select the current fiscal year');
                        return [2 /*return*/];
                    }
                    //  const reportAdd = {
                    //     zone,
                    //     businessType,
                    //     fiscalYear: fiscalYear
                    //   }
                    setLoading(true); // Set loading to true
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dispatch(fetchDetailedReports(reportData))];
                case 2:
                    answer = _a.sent();
                    console.log('answer from the thunk: ', answer.payload);
                    if (answer && answer.payload) {
                        // console.log('RECORDS FOUND action.payload: ', answer.payload)
                        // Extract the payload from the action
                        reportData = answer.payload;
                        console.log('reportData::::::: ', reportData);
                        setBusDetailedReport(reportData);
                        console.log('busDetailedReport: ', busDetailedReport);
                        setError(''); // Clear error if request is successful
                        setSuccessMessage('Report produced successfully');
                        //fetchDetailedReports();
                    }
                    else if (answer.meta.requestStatus === 'rejected') {
                        // Type guard to ensure action is of type PayloadAction<..., ..., ..., unknown>
                        if ('error' in answer) {
                            // Handle the case where the answer was rejected
                            console.error('Error fetching reports:', answer.error);
                            setError('Error producing report');
                            setSuccessMessage('');
                        }
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('An unexpected error occurred');
                    setSuccessMessage('');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false); // Set loading to false after the fetch completes
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // const handleExitClick = () => {
    //   window.location.href = '/'; // Redirect to main page or hide the form
    // };
    //  let totalBalance: number = 0;
    //   businessList.forEach((business) => {
    //     totalBalance += business.amountdue - business.amountpaid;
    //   });
    //   console.log('totalBalance: ', totalBalance)
    var grandTotalAmountDue = 0;
    var grandTotalAmountPaid = 0;
    var grandTotalBalance = 0;
    var groupedData = busDetailedReport.reduce(function (acc, busDetailedReport) {
        var area = busDetailedReport.electoral_area;
        if (!area) {
            return acc; // Skip if no electoral area
        }
        if (!acc[area]) {
            acc[area] = {
                electoral_area: area,
                totalAmountDue: 0,
                totalAmountPaid: 0,
                totalBalance: 0,
                businesses: []
            };
        }
        var rawAmountDue = busDetailedReport.amountdue;
        var rawAmountPaid = busDetailedReport.amountpaid;
        var amountDue = typeof rawAmountDue === 'number' ? rawAmountDue : parseFloat(rawAmountDue) || 0;
        var amountPaid = typeof rawAmountPaid === 'number' ? rawAmountPaid : parseFloat(rawAmountPaid) || 0;
        // Update area totals
        acc[area].totalAmountDue += amountDue;
        acc[area].totalAmountPaid += amountPaid;
        acc[area].totalBalance = acc[area].totalAmountDue - acc[area].totalAmountPaid;
        // Add to grand totals
        grandTotalAmountDue += amountDue;
        grandTotalAmountPaid += amountPaid;
        grandTotalBalance = grandTotalAmountDue - grandTotalAmountPaid; // Correctly calculate grand total balance
        acc[area].businesses.push({
            electroral_area: area,
            buss_no: busDetailedReport.buss_no,
            buss_name: busDetailedReport.buss_name,
            buss_type: busDetailedReport.buss_type,
            amountdue: amountDue,
            amountpaid: amountPaid
        });
        return acc;
    }, {});
    var summarizedList = Object.values(groupedData);
    console.log('summarizedList: ', summarizedList);
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs("div", { children: [_jsxs(Form, { children: [_jsx("p", { className: "text-center mb-4", children: "Mid Level Detailed Report" }), _jsxs(Form.Group, { controlId: "formZone", children: [_jsx(Form.Label, { children: "Electoral Area:- Select any electoral area then select All electoral areas " }), _jsxs(Form.Select, { value: zone, onChange: handleZoneChange, children: [_jsx("option", { value: "All electoral areas", children: "All electoral areas" }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formBussType", children: [_jsx(Form.Label, { children: "Business Type/Profession:" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select business types/professions" }), bussTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.business_type, children: businessType.business_type }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Current Fiscal Year:" }), _jsx(Form.Control, { type: "text", value: fiscalYear, onChange: handleLastDateChange, readOnly: true })] }), _jsxs("div", { children: [_jsx(Button, { variant: "primary", onClick: handleViewClick, style: { marginTop: '10px' }, children: "Produce Report" }), _jsx(Button, { variant: "secondary", onClick: function () { return navigate("/main"); }, style: { marginLeft: '40px', marginTop: '10px' }, children: "Go Back" })] }), loading && (_jsx("div", { className: "text-center mt-3", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }) }))] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type/Profession" }), _jsx("th", { children: "Amount Due" }), _jsx("th", { children: "Amount Paid" }), _jsx("th", { children: "Balance" })] }) }), _jsxs("tbody", { children: [summarizedList.map(function (area, index) {
                                        var _a, _b;
                                        var isFirstBusiness = index === 0 || area.electoral_area !== summarizedList[index - 1].electoral_area;
                                        if (isFirstBusiness) {
                                            return (_jsxs(React.Fragment, { children: [_jsxs("tr", { children: [_jsx("td", { rowSpan: area.businesses.length + 1, children: area.electoral_area || 'N/A' }), _jsx("td", { children: ((_a = area.businesses[0]) === null || _a === void 0 ? void 0 : _a.buss_name) || 'N/A' }), _jsx("td", { children: ((_b = area.businesses[0]) === null || _b === void 0 ? void 0 : _b.buss_type) || 'N/A' }), _jsx("td", { children: isNaN(area.totalAmountDue) ? '0.00' : area.totalAmountDue.toFixed(2) }), _jsx("td", { children: isNaN(area.totalAmountPaid) ? '0.00' : area.totalAmountPaid.toFixed(2) }), _jsx("td", { children: isNaN(area.totalBalance) ? '0.00' : area.totalBalance.toFixed(2) })] }), area.businesses.slice(1).map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.buss_name || 'N/A' }), _jsx("td", { children: business.buss_type || 'N/A' }), _jsx("td", { children: isNaN(business.amountdue) ? '0.00' : business.amountdue.toFixed(2) }), _jsx("td", { children: isNaN(business.amountpaid) ? '0.00' : business.amountpaid.toFixed(2) }), _jsx("td", { children: isNaN(business.amountdue - business.amountpaid) ? '0.00' : (business.amountdue - business.amountpaid).toFixed(2) })] }, business.buss_no)); }), _jsxs("tr", { style: { fontWeight: 'bold' }, children: [_jsxs("td", { colSpan: 3, children: ["Total for ", area.electoral_area] }), _jsx("td", { children: isNaN(area.totalAmountDue) ? '0.00' : area.totalAmountDue.toFixed(2) }), _jsx("td", { children: isNaN(area.totalAmountPaid) ? '0.00' : area.totalAmountPaid.toFixed(2) }), _jsx("td", { children: isNaN(area.totalBalance) ? '0.00' : area.totalBalance.toFixed(2) })] })] }, index));
                                        }
                                        else {
                                            return null;
                                        }
                                    }), _jsxs("tr", { style: { fontWeight: 'bold', backgroundColor: '#f0f0f0' }, children: [_jsx("td", { colSpan: 3, children: "Grand Total" }), _jsx("td", { children: isNaN(grandTotalAmountDue) ? '0.00' : grandTotalAmountDue.toFixed(2) }), _jsx("td", { children: isNaN(grandTotalAmountPaid) ? '0.00' : grandTotalAmountPaid.toFixed(2) }), _jsx("td", { children: isNaN(grandTotalBalance) ? '0.00' : grandTotalBalance.toFixed(2) })] })] })] })] })] }));
};
export default FrmMidlevelDetailedReport;
