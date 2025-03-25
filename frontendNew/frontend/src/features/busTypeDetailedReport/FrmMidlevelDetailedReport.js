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
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchReportsByCriteria, fetchAllRecords } from '../busTypeDetailedReport/busTypeDetailedReportSlice';
var FrmMidlevelDetailedReport = function () {
    var _a = useState(''), zone = _a[0], setZone = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState([]), bussTypes = _c[0], setBussTypes = _c[1];
    var _d = useState([]), businessList = _d[0], setBusinessList = _d[1];
    var _e = useState(''), businessType = _e[0], setBusinessType = _e[1];
    var _f = useState(new Date().getFullYear().toString()), fiscalYear = _f[0], setFiscalYear = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(''), successMessage = _h[0], setSuccessMessage = _h[1];
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
        console.log('about to dispatch(fetchAllRecords())');
        dispatch(fetchAllRecords());
    }, [dispatch]);
    // Get electoral areas from the Redux store // as ElectoralArea[];
    var busTypeDetailedReport = useAppSelector(function (state) { return state.busTypedetailedReport.reports; });
    useEffect(function () {
        if (Array.isArray(busTypeDetailedReport)) {
            businessList = busTypeDetailedReport;
            setBusinessList(businessList); // Update local state with fetched data
        }
    }, [busTypeDetailedReport]);
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    console.log('typeof electoralAreaData:', typeof electoralAreaData);
    useEffect(function () {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
            console.log('electoralAreas: ', electoralAreas);
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
        setZone(e.target.value);
    };
    var handleLastDateChange = function (e) {
        setFiscalYear(e.target.value);
    };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var reportData, response, reportData_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handleViewClick');
                    if (!zone) {
                        setError('Please select in the electoral area');
                        return [2 /*return*/];
                    }
                    if (!businessType) {
                        setError('Please select the business type/profession');
                        return [2 /*return*/];
                    }
                    if (!fiscalYear) {
                        setError('Please select the current fiscal year');
                        return [2 /*return*/];
                    }
                    reportData = {
                        zone: zone,
                        businessType: businessType,
                        fiscalYear: fiscalYear
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(fetchReportsByCriteria(reportData))];
                case 2:
                    response = _a.sent();
                    console.log('response: ', response);
                    if (response && response.payload) {
                        console.log('RECORDS FOUND action.payload: ', response.payload);
                        reportData_1 = response.payload;
                        console.log('reportData::::::: ', reportData_1);
                        setBusinessList(reportData_1);
                        console.log('businessList: ', businessList);
                        setError(''); // Clear error if request is successful
                        setSuccessMessage('Report produced successfully');
                        //fetchDetailedReports();
                    }
                    else if (response.meta.requestStatus === 'rejected') {
                        // Type guard to ensure action is of type PayloadAction<..., ..., ..., unknown>
                        if ('error' in response) {
                            // Handle the case where the response was rejected
                            console.error('Error fetching reports:', response.error);
                            setError('Error producing report');
                            setSuccessMessage('');
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('An unexpected error occurred');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // const handleExitClick = () => {
    //   window.location.href = '/'; // Redirect to main page or hide the form
    // };
    var totalBalance = 0;
    businessList.forEach(function (business) {
        totalBalance += business.amountdue - business.amountpaid;
    });
    console.log('totalBalance: ', totalBalance);
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs("div", { children: [_jsxs(Form, { children: [_jsx("p", { className: "text-center mb-4", children: "Mid Level Detailed Report" }), _jsxs(Form.Group, { controlId: "formZone", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: zone, onChange: handleZoneChange, children: [_jsx("option", { value: "", children: "Select an electoral area" }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formBussType", children: [_jsx(Form.Label, { children: "Business Type/Profession:" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, children: [_jsx("option", { value: "", children: "Select a business type" }), bussTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.business_type, children: businessType.business_type }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Current Fiscal Year:" }), _jsx(Form.Control, { type: "text", value: fiscalYear, onChange: handleLastDateChange, readOnly: true })] }), _jsxs("div", { children: [_jsx(Button, { variant: "primary", onClick: handleViewClick, style: { marginTop: '10px' }, children: "Produce Report" }), _jsx(Button, { variant: "secondary", onClick: function () { return navigate("/main"); }, style: { marginLeft: '40px', marginTop: '10px' }, children: "Go Back" })] })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsxs("thead", { children: ["Total Balance: ", totalBalance, _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type/Profession" }), _jsx("th", { children: "Amount Due" }), _jsx("th", { children: "Amount Paid" }), _jsx("th", { children: "Balance" })] })] }), _jsx("tbody", { children: businessList.map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.electoral_area }), _jsx("td", { children: business.buss_name }), _jsx("td", { children: business.buss_type }), _jsx("td", { children: business.amountdue }), _jsx("td", { children: business.amountpaid }), _jsx("td", { children: business.amountdue - business.amountpaid })] }, business.buss_no)); }) })] })] })] }));
};
export default FrmMidlevelDetailedReport;
