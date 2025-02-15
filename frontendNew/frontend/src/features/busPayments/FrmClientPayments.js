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
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { fetchBusinessById } from '../../features/business/businessSlice';
import { createBusPayment } from '../busPayments/busPaymentsSlice';
var FrmClientPayments = function () {
    var _a = useState(0), businessNo = _a[0], setBusinessNo = _a[1];
    var _b = useState(''), officerNo = _b[0], setOfficerNo = _b[1];
    var _c = useState(0), billedAmount = _c[0], setBilledAmount = _c[1];
    var _d = useState(0), paidAmount = _d[0], setPaidAmount = _d[1];
    var _e = useState(''), monthPaid = _e[0], setMonthPaid = _e[1];
    var transDate = new Date().toISOString().split('T')[0];
    var _f = useState(''), fiscalYear = _f[0], setFiscalYear = _f[1];
    var _g = useState(''), receiptNo = _g[0], setReceiptNo = _g[1];
    var _h = useState(''), email = _h[0], setEmail = _h[1];
    var _j = useState(''), electoralArea = _j[0], setElectoralArea = _j[1];
    var _k = useState(''), errorMessage = _k[0], setErrorMessage = _k[1];
    var _l = useState(''), businessName = _l[0], setBusinessName = _l[1];
    var dispatch = useAppDispatch();
    useEffect(function () {
        var currentMonthNumber = new Date().getMonth(); // + 1;
        setMonthPaid(setMonthString(currentMonthNumber));
    }, []);
    var getBusiness = function (businessNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dispatch(fetchBusinessById(Number(businessNo))).unwrap()];
                case 1:
                    response = _a.sent();
                    console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:');
                    // Check if response is an array or an object
                    if (Array.isArray(response)) {
                        console.log('Response is an array:', response[0]);
                        // set response fields to the following state variables
                        setOfficerNo(response[0].assessmentby);
                        setElectoralArea(response[0].electroral_area);
                        setEmail(response[0].emailaddress);
                        businessName = response[0].buss_name;
                        setBusinessName(businessName);
                        setFiscalYear(new Date().getFullYear().toString());
                        billedAmount = Number(response[0].current_rate) + Number(response[0].property_rate);
                        setBilledAmount(billedAmount);
                        receiptNo = generateUniqueNumber();
                        setReceiptNo(receiptNo);
                    }
                    ;
                    return [2 /*return*/];
            }
        });
    }); };
    var generateUniqueNumber = function () {
        var randomNumber = Math.floor(Math.random() * 1000000) + 1;
        var salt = Math.random().toString(36).substring(2, 15); // Generates a random string as a salt
        return "".concat(randomNumber, "-").concat(salt);
    };
    //   const uniqueNumber = generateUniqueNumber();
    //   console.log(uniqueNumber)
    var setMonthString = function (monthNumber) {
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return monthNames[monthNumber];
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var busPayment, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handleSubmit');
                    e.preventDefault();
                    // Validation checks
                    if (businessNo <= 0) {
                        errorMessage = 'Business Number is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!officerNo) {
                        errorMessage = 'Officer Number is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (paidAmount <= 0) {
                        errorMessage = 'Amount is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!monthPaid) {
                        errorMessage = 'Month Paid is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!transDate) {
                        errorMessage = 'Transaction Date is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!fiscalYear) {
                        errorMessage = 'Fiscal Year is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!receiptNo) {
                        errorMessage = 'Receipt Number is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!email) {
                        errorMessage = 'Email is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    if (!electoralArea) {
                        errorMessage = 'Electoral Area is required';
                        setErrorMessage(errorMessage);
                        return [2 /*return*/];
                    }
                    busPayment = {
                        buss_no: businessNo.toString(),
                        officer_no: officerNo,
                        paidAmount: paidAmount,
                        monthpaid: monthPaid,
                        transdate: transDate,
                        fiscal_year: fiscalYear,
                        ReceiptNo: receiptNo,
                        email: email,
                        electoral_area: electoralArea,
                    };
                    console.log('busPayment:', busPayment);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(createBusPayment(busPayment)).unwrap()];
                case 2:
                    response = _a.sent();
                    // Handle success, e.g., clear form, show success message, etc.
                    setErrorMessage('');
                    console.log(response);
                    if (createBusPayment.fulfilled.match(response)) {
                        setBusinessNo(0);
                        setOfficerNo('');
                        setPaidAmount(0);
                        setMonthPaid('');
                        setFiscalYear('');
                        setReceiptNo('');
                        setEmail('');
                        setBilledAmount(0);
                        alert('Payment successfully added');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // Handle error, e.g., show error message
                    setErrorMessage('Failed to create payment. Please try again.');
                    console.error('Error creating payment:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "container", style: { backgroundColor: '#add8e6' }, children: _jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h4", { className: "text-primary", children: "Business Client Payment" }) }) }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsxs(Form.Label, { children: ["Business Number: ", businessName] }), _jsx(Form.Control, { type: "number", value: businessNo, onChange: function (e) { return setBusinessNo(Number(e.target.value)); }, onBlur: function (e) { return getBusiness(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Officer Number:" }), _jsx(Form.Control, { type: "text", value: officerNo, onChange: function (e) { return setOfficerNo(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h5", { className: "text-primary", children: "Billed Amount: " }) }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsxs(Form.Label, { children: ["Billed Amount: ", billedAmount] }), _jsx(Form.Control, { type: "number", value: paidAmount, onChange: function (e) { return setPaidAmount(Number(e.target.value)); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Month Paid:" }), _jsx(Form.Control, { value: monthPaid, readOnly // If you want it to be read-only
                                        : true })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Transaction Date:" }), _jsx(Form.Control, { value: transDate, readOnly: true })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsx(Form.Control, { value: fiscalYear, readOnly: true })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Receipt Number:" }), _jsx(Form.Control, { type: "text", value: receiptNo, onChange: function (e) { return setReceiptNo(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Email:" }), _jsx(Form.Control, { value: email, readOnly: true })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsx(Form.Control, { value: electoralArea, readOnly: true })] }) }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx(Button, { type: "submit", variant: "primary", children: "Click to pay" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", style: { textDecoration: "none" }, children: "Go Back" }) }) })] })] }) }));
};
export default FrmClientPayments;
