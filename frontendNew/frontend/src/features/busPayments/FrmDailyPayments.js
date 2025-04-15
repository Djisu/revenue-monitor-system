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
import { useAppSelector, useAppDispatch } from '../../app/store';
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchDailyPayments, selectBusPayments } from './busPaymentsSlice';
import PaymentsTable from './PaymentsTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
var FrmDailyPayments = function () {
    var _a = useState(''), electoralArea = _a[0], setElectoralArea = _a[1];
    //let [electoralAreasData, setElectoralAreasData] = useState<ElectoralArea[]>([]);//
    var _b = useState(''), selectedBusinessType = _b[0], setSelectedBusinessType = _b[1];
    var _c = useState(''), firstDate = _c[0], setFirstDate = _c[1];
    var _d = useState(''), lastDate = _d[0], setLastDate = _d[1];
    var _e = useState([]), bussTypes = _e[0], setBussTypes = _e[1];
    var _f = useState(''), errorx = _f[0], setErrorx = _f[1];
    var _g = useState([]), busPaymentsData = _g[0], setBusPaymentsData = _g[1];
    var dispatch = useAppDispatch();
    var _h = useAppSelector(function (state) { return state.electoralArea; }), electoralAreas = _h.electoralAreas, loading = _h.loading, error = _h.error;
    var businessTypes = useAppSelector(function (state) { return state.businessType.businessTypes; }); // as BusinessTypeData[]
    console.log('businessTypes: ', businessTypes);
    useEffect(function () {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes); // Update local state with fetched data
        }
    }, [businessTypes]); // Dependency array includes businessTypes
    if (Array.isArray(businessTypes)) {
        console.log('businessTypes  is an array');
    }
    else {
        console.log('IT IS NOT AN ARRAY');
    }
    // Check entire Redux state (for debugging)
    //const entireState = useAppSelector((state) => state);
    //console.log('Entire Redux State:', entireState);
    var busPayments = useAppSelector(selectBusPayments);
    console.log('busPayments:', busPayments);
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
    }, [dispatch]);
    useEffect(function () {
        console.log('Fetched business types:', businessTypes);
    }, [businessTypes]);
    var generateRequestId = function () {
        var timestamp = Date.now(); // Current timestamp in milliseconds
        var randomNum = Math.floor(Math.random() * 1000000); // Random number between 0 and 999999
        return "req-".concat(timestamp, "-").concat(randomNum); // Format: req-<timestamp>-<randomNumber>
    };
    // Example usage
    var requestId = generateRequestId();
    console.log(requestId); // e.g., "req-1671234567890-123456"
    var handlePaymentError = function (criteria) {
        var errorResponse = {
            type: 'businessType/dailypayments/rejected',
            payload: null, // Use null instead of undefined for clarity
            meta: {
                requestId: generateRequestId(), // Function to generate a unique request ID
                requestStatus: 'rejected',
                criteria: criteria, // Include the criteria that caused the error
                timestamp: new Date().toISOString(), // Add a timestamp for tracking
            },
            error: {
                name: 'PaymentNotFoundError',
                message: "No payment data found for the specified criteria: ".concat(JSON.stringify(criteria)),
                stack: new Error().stack, // Capture the stack trace
            },
        };
        return errorResponse;
    };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var DailyPaymentsData, answer, criteria, error_2, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Inside handleViewClick');
                    // Validate input fields
                    if (!electoralArea) {
                        setErrorx("Please select an electoral area");
                        return [2 /*return*/];
                    }
                    if (!selectedBusinessType) {
                        setErrorx("Please select a business type");
                        return [2 /*return*/];
                    }
                    if (!firstDate) {
                        setErrorx("Please select a first date");
                        return [2 /*return*/];
                    }
                    if (!lastDate) {
                        setErrorx("Please select a last date");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    DailyPaymentsData = {
                        firstDate: new Date(firstDate),
                        lastDate: new Date(lastDate),
                        electoralarea: electoralArea,
                        bussType: selectedBusinessType,
                    };
                    console.log('DailyPaymentsData:', DailyPaymentsData);
                    return [4 /*yield*/, dispatch(fetchDailyPayments(DailyPaymentsData))];
                case 2:
                    answer = _a.sent();
                    console.log('answer:', answer);
                    if (answer.payload) {
                        busPaymentsData = answer.payload;
                        setBusPaymentsData(busPaymentsData);
                        console.log('busPaymentsData:', busPaymentsData);
                    }
                    else {
                        criteria = {
                            constituency: electoralArea,
                            bussType: selectedBusinessType,
                            firstDate: new Date(firstDate),
                            lastDate: new Date(lastDate),
                        };
                        console.log('criteria:', criteria);
                        error_2 = handlePaymentError(criteria);
                        console.error(error_2); // Log the error for debugging
                        //alert(JSON.stringify(error.error, null, 2))
                        alert('Payment not found.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching daily payments:", error_1);
                    if (error_1.response) {
                        // Check for a 404 error specifically
                        if (error_1.response.status === 404) {
                            setErrorx("Requested data not found.");
                            alert("Requested data not found.");
                        }
                        else {
                            setErrorx("Error fetching daily payments: " + error_1.message);
                            alert("Error fetching daily payments: " + error_1.message);
                        }
                    }
                    else {
                        setErrorx("Error fetching daily payments");
                        alert("Error fetching daily payments");
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (_jsxs("div", { className: "text-center mt-5", children: [_jsx(Spinner, { style: { width: '3rem', height: '3rem' } }), _jsx("p", { children: "Loading..." })] }));
    }
    if (error || errorx) {
        return _jsxs("div", { children: ["Error: ", error || errorx] });
    }
    return (_jsxs("div", { className: "container mt-5", children: [errorx && _jsx(Alert, { color: "danger", children: errorx }), _jsxs(Form, { children: [_jsxs(FormGroup, { children: [_jsx("p", { className: "text-center text-underline", children: "Produce Daily Payments Report" }), _jsx(Label, { for: "zone", className: "font-weight-bold", children: "Electoral Area:" }), _jsxs(Input, { type: "select", name: "electoral_area", id: "electoral_area", value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { value: "All electoral areas", children: "All electoral areas" }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area.electoral_area, children: area.electoral_area }, index)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "bussType", className: "font-weight-bold", children: "Business Type/Profession:" }), _jsxs(Input, { type: "select", name: "bussType", id: "bussType", value: selectedBusinessType, onChange: function (e) { return setSelectedBusinessType(e.target.value); }, children: [_jsx("option", { value: "All business types", children: "All business types" }), bussTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.business_type, children: businessType.business_type }, index)); })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "firstDate", className: "font-weight-bold", children: "First Payment Date:" }), _jsx(Input, { type: "date", name: "firstDate", id: "firstDate", value: firstDate, onChange: function (e) { return setFirstDate(e.target.value); } })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "lastDate", className: "font-weight-bold", children: "Last Payment Date:" }), _jsx(Input, { type: "date", name: "lastDate", id: "lastDate", value: lastDate, onChange: function (e) { return setLastDate(e.target.value); } })] }), _jsxs(FormGroup, { children: [_jsx("div", { className: "d-flex justify-content-between", children: _jsx(Button, { color: "primary", onClick: handleViewClick, children: "Produce Report" }) }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }), _jsx(PaymentsTable, { busPaymentsData: busPaymentsData })] })] }));
};
export default FrmDailyPayments;
