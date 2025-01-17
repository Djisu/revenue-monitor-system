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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
var TemporalPaymentForm = function () {
    var _a = useState(''), bussNo = _a[0], setBussNo = _a[1];
    var _b = useState(''), bussName = _b[0], setBussName = _b[1];
    var _c = useState(new Date().getFullYear()), fiscalYear = _c[0], setFiscalYear = _c[1];
    var _d = useState(0), correctRate = _d[0], setCorrectRate = _d[1];
    var _e = useState(0), amount = _e[0], setAmount = _e[1];
    var _f = useState(''), receiptNo = _f[0], setReceiptNo = _f[1];
    var _g = useState(0), paymentMonth = _g[0], setPaymentMonth = _g[1];
    var _h = useState(''), officerNo = _h[0], setOfficerNo = _h[1];
    var _j = useState(''), officerName = _j[0], setOfficerName = _j[1];
    var _k = useState(''), electoralArea = _k[0], setElectoralArea = _k[1];
    var _l = useState(''), businessType = _l[0], setBusinessType = _l[1];
    var _m = useState(''), propertyClass = _m[0], setPropertyClass = _m[1];
    var _o = useState(0), propertyRent = _o[0], setPropertyRent = _o[1];
    var _p = useState(0), balanceBF = _p[0], setBalanceBF = _p[1];
    var _q = useState(0), totalPayable = _q[0], setTotalPayable = _q[1];
    var _r = useState(0), totalPayment = _r[0], setTotalPayment = _r[1];
    var _s = useState(0), currentBalance = _s[0], setCurrentBalance = _s[1];
    var _t = useState([]), businessList = _t[0], setBusinessList = _t[1];
    var _u = useState([]), officerList = _u[0], setOfficerList = _u[1];
    var _v = useState([]), tempPayments = _v[0], setTempPayments = _v[1];
    var _w = useState(''), error = _w[0], setError = _w[1];
    var _x = useState(''), successMessage = _x[0], setSuccessMessage = _x[1];
    useEffect(function () {
        fetchBusinessList();
        fetchOfficerList();
    }, []);
    var fetchBusinessList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_business')];
                case 1:
                    response = _a.sent();
                    setBusinessList(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    setError('No business found');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchOfficerList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_officer')];
                case 1:
                    response = _a.sent();
                    setOfficerList(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('No officers found');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var validateBussNo = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    value = value.trim().split(' ')[0];
                    return [4 /*yield*/, axios.get("http://your-api-url/tb_business?buss_no=".concat(value))];
                case 1:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        setBussName(response.data[0].buss_name);
                        setBusinessType(response.data[0].buss_type);
                        setCorrectRate(response.data[0].current_rate);
                        setPropertyClass(response.data[0].property_class);
                        setPropertyRent(response.data[0].property_rate);
                        //setElectoralArea(response.data[0].electroral_area);
                        setError('');
                        fetchBalanceBF(value);
                        fetchTotalPayable(value);
                        fetchTotalPayment(value);
                    }
                    else {
                        setError('A wrong business number');
                        setBussName('');
                        setBusinessType('');
                        setCorrectRate(0);
                        setPropertyClass('');
                        setPropertyRent(0);
                        setElectoralArea('');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('A wrong business number');
                    setBussName('');
                    setBusinessType('');
                    setCorrectRate(0);
                    setPropertyClass('');
                    setPropertyRent(0);
                    setElectoralArea('');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchBalanceBF = function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("http://your-api-url/find_balance_bf?buss_no=".concat(bussNo))];
                case 1:
                    response = _a.sent();
                    setBalanceBF(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error(error_4);
                    setError('Error fetching balance BF');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchTotalPayable = function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("http://your-api-url/find_total_payable?buss_no=".concat(bussNo, "&fiscal_year=").concat(fiscalYear))];
                case 1:
                    response = _a.sent();
                    setTotalPayable(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error(error_5);
                    setError('Error fetching total payable');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchTotalPayment = function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("http://your-api-url/find_total_payment?buss_no=".concat(bussNo, "&fiscal_year=").concat(fiscalYear))];
                case 1:
                    response = _a.sent();
                    setTotalPayment(response.data);
                    setCurrentBalance(totalPayable - totalPayment - amount);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error(error_6);
                    setError('Error fetching total payment');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var validateOfficerNo = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("http://your-api-url/tb_officer?officer_no=".concat(value))];
                case 1:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        setOfficerName(response.data[0].officer_name);
                        setElectoralArea(response.data[0].electoralarea);
                        setError('');
                    }
                    else {
                        setError('A wrong officer number');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    setError('A wrong officer number');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleBussNoChange = function (e) {
        setBussNo(e.target.value);
        validateBussNo(e.target.value);
    };
    var handleOfficerNoChange = function (e) {
        setOfficerNo(e.target.value);
        validateOfficerNo(e.target.value);
    };
    var handleAmountChange = function (e) {
        setAmount(Number(e.target.value));
        setCurrentBalance(totalPayable - totalPayment - Number(e.target.value));
    };
    var handleReceiptNoChange = function (e) {
        setReceiptNo(e.target.value);
    };
    var handleFiscalYearChange = function (e) {
        setFiscalYear(Number(e.target.value));
    };
    var handleUpdateClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!bussNo || !fiscalYear || !correctRate || !amount || !receiptNo || !paymentMonth || !officerNo) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.put('http://your-api-url/tb_BussCurrBalance', {
                            buss_no: bussNo,
                            fiscalyear: fiscalYear,
                            current_balance: correctRate,
                        })];
                case 1:
                    _a.sent();
                    setSuccessMessage('Last year\'s rate updated successfully');
                    setError('');
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.error(error_8);
                    setError('Error updating last year\'s rate');
                    setSuccessMessage('');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePostClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!bussNo || !fiscalYear || !correctRate || !amount || !receiptNo || !paymentMonth || !officerNo) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.post('http://your-api-url/post_all', {
                            buss_no: bussNo,
                            officer_no: officerNo,
                            amount: amount,
                            receiptno: receiptNo,
                            monthpaid: paymentMonth,
                            transdate: new Date().toISOString().split('T')[0],
                            userid: 'yourUserId', // Replace with actual user ID
                            fiscal_year: fiscalYear,
                        })];
                case 1:
                    _a.sent();
                    setSuccessMessage('Payments successfully transferred to the SERVER. Supervisor must scrutinize and eventually post them');
                    setError('');
                    setTempPayments([]);
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    console.error(error_9);
                    setError('Error transferring payments');
                    setSuccessMessage('');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        window.location.href = '/'; // Redirect to main page or hide the form
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!bussNo || !fiscalYear || !correctRate || !amount || !receiptNo || !paymentMonth || !officerNo) {
                        setError('Please fill in all fields');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.post('http://your-api-url/add_rec', {
                            buss_no: bussNo,
                            officer_no: officerNo,
                            amount: amount,
                            monthpaid: paymentMonth,
                            transdate: new Date().toISOString().split('T')[0],
                            userid: 'yourUserId', // Replace with actual user ID
                            fiscal_year: fiscalYear,
                            receiptno: receiptNo,
                        })];
                case 1:
                    response = _a.sent();
                    setSuccessMessage('Collection Payment temporally entered!!! Please CONNECT to the server and UPLOAD payment entry.');
                    setError('');
                    setTempPayments(__spreadArray(__spreadArray([], tempPayments, true), [response.data], false));
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    console.error(error_10);
                    setError('Error adding a record');
                    setSuccessMessage('');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePaymentMonthChange = function (e) {
        setPaymentMonth(Number(e.target.value));
    };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Temporal Payment" }), error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formOfficerNo", children: [_jsx(Form.Label, { children: "Collector Code:" }), _jsxs(Form.Select, { value: officerNo, onChange: handleOfficerNoChange, children: [_jsx("option", { value: "", children: "Select a collector" }), officerList.map(function (officer) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, " ", officer.officer_name] }, officer.officer_no)); })] })] }), _jsxs(Form.Group, { controlId: "formBussNo", children: [_jsx(Form.Label, { children: "Business No:" }), _jsxs(Form.Select, { value: bussNo, onChange: handleBussNoChange, children: [_jsx("option", { value: "", children: "Select a business" }), businessList.map(function (business) { return (_jsxs("option", { value: business.buss_no, children: [business.buss_no, " ", business.buss_name] }, business.buss_no)); })] })] }), _jsxs(Form.Group, { controlId: "formBussName", children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: bussName, readOnly: true, style: { fontWeight: 'bold', color: 'red' } })] }), _jsxs(Form.Group, { controlId: "formPaymentMonth", children: [_jsx(Form.Label, { children: "Payment Month:" }), _jsxs(Form.Select, { value: paymentMonth, onChange: handlePaymentMonthChange, children: [_jsx("option", { value: "", children: "Select a month" }), Array.from({ length: 12 }, function (_, i) { return (_jsx("option", { value: i + 1, children: i + 1 }, i + 1)); })] })] }), _jsxs(Form.Group, { controlId: "formAmount", children: [_jsx(Form.Label, { children: "Amount to be posted:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: amount, onChange: handleAmountChange, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsxs(Form.Group, { controlId: "formReceiptNo", children: [_jsx(Form.Label, { children: "Receipt No:" }), _jsx(Form.Control, { type: "text", value: receiptNo, onChange: handleReceiptNoChange })] }), _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: fiscalYear, onChange: handleFiscalYearChange })] }), _jsxs(Form.Group, { controlId: "formOfficerName", children: [_jsx(Form.Label, { children: "Officer Name:" }), _jsx(Form.Control, { type: "text", value: officerName, readOnly: true, style: { fontWeight: 'bold', color: 'red' } })] }), _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsx(Form.Control, { type: "text", value: electoralArea, readOnly: true, style: { fontWeight: 'bold', color: 'red' } })] }), _jsxs(Form.Group, { controlId: "formBusinessType", children: [_jsx(Form.Label, { children: "Business Type:" }), _jsx(Form.Control, { type: "text", value: businessType, readOnly: true, style: { fontWeight: 'bold', color: 'red' } })] }), _jsxs(Form.Group, { controlId: "formPropertyClass", children: [_jsx(Form.Label, { children: "Property Class:" }), _jsx(Form.Control, { type: "text", value: propertyClass, readOnly: true, style: { fontWeight: 'bold', color: 'red' } })] }), _jsxs(Form.Group, { controlId: "formPropertyRent", children: [_jsx(Form.Label, { children: "Property Fees:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: propertyRent, readOnly: true, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsxs(Form.Group, { controlId: "formBalanceBF", children: [_jsx(Form.Label, { children: "Balance BF:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: balanceBF, readOnly: true, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsxs(Form.Group, { controlId: "formCurrentRate", children: [_jsx(Form.Label, { children: "Current Rate:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: correctRate, readOnly: true, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsxs(Form.Group, { controlId: "formTotalPayable", children: [_jsx(Form.Label, { children: "Total Payable:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: totalPayable, readOnly: true, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsxs(Form.Group, { controlId: "formTotalPayment", children: [_jsx(Form.Label, { children: "Total Payment:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: totalPayment, readOnly: true, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsxs(Form.Group, { controlId: "formCurrentBalance", children: [_jsx(Form.Label, { children: "Current Balance:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: currentBalance, readOnly: true, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record" }), _jsx(Button, { variant: "success", onClick: handleUpdateClick, style: { marginLeft: '10px' }, children: "Update last year's rate" }), _jsx(Button, { variant: "danger", onClick: handleExitClick, style: { marginLeft: '10px' }, children: "Exit" }), _jsx(Button, { variant: "secondary", onClick: handlePostClick, style: { marginLeft: '10px' }, children: "Transfer entries to the Server" })] }), _jsx("h3", { className: "mt-4", children: "SELECT THE TRANSACTION WHICH YOU WANT TO POST. AFTER THE ASSESSMENT, CLICK ON THE POST BUTTON TO POST" }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Officer No" }), _jsx("th", { children: "Business No" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Receipt No" }), _jsx("th", { children: "Payment Month" }), _jsx("th", { children: "Fiscal Year" })] }) }), _jsx("tbody", { children: tempPayments.map(function (payment) { return (_jsxs("tr", { children: [_jsx("td", { children: payment.officer_no }), _jsx("td", { children: payment.buss_no }), _jsx("td", { children: payment.amount }), _jsx("td", { children: payment.receiptno }), _jsx("td", { children: payment.monthpaid }), _jsx("td", { children: payment.fiscal_year })] }, payment.receiptno)); }) })] })] }));
};
export default TemporalPaymentForm;
