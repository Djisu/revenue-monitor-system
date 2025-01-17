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
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
var FrmPropertySavingsStatementX = function () {
    var _a = useState(''), loanNo = _a[0], setLoanNo = _a[1];
    var _b = useState(''), startDate = _b[0], setStartDate = _b[1];
    var _c = useState(''), endDate = _c[0], setEndDate = _c[1];
    //const [houseName, setHouseName] = useState('');
    var _d = useState(''), error = _d[0], setError = _d[1];
    var fetchLoanNos = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/loanNos')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setLoanNo(data[0].house_no); // Set first loan number as default
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setError('No houses found');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchTransactions = function (dateField) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, dates, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/transactions?house_no=".concat(loanNo))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    dates = data.map(function (item) { return item.transdate; });
                    if (dateField === 'startDate') {
                        setStartDate(dates[0]);
                    }
                    else if (dateField === 'endDate') {
                        setEndDate(dates[dates.length - 1]);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    setError('No payment records date found');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // const validateLoanNo = async () => {
    //   try {
    //     const response = await fetch(`/api/validateLoanNo?house_no=${loanNo}`);
    //     const data = await response.json();
    //     if (data) {
    //       houseName && setHouseName('');
    //       setHouseName(data.house_no);
    //     } else {
    //       setError('A wrong house number');
    //     }
    //   } catch (err) {
    //     setError('Error validating house number');
    //   }
    // };
    var handleLoanNoChange = function (event) {
        setLoanNo(event.target.value);
    };
    var handleStartDateChange = function (event) {
        setStartDate(event.target.value);
    };
    var handleEndDateChange = function (event) {
        setEndDate(event.target.value);
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!loanNo) {
                        setError('Select a house number');
                        return [2 /*return*/];
                    }
                    // Reset error message
                    setError('');
                    return [4 /*yield*/, fetch("/api/calculateBalance?house_no=".concat(loanNo, "&start_date=").concat(startDate, "&end_date=").concat(endDate))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (data) {
                        // Show report or handle data as needed
                        console.log(data);
                    }
                    else {
                        setError('No records found');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    setError('Error generating report');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchLoanNos();
        // Fetch start and end dates based on selected loan number
        fetchTransactions('startDate');
        fetchTransactions('endDate');
    }, [loanNo]);
    useEffect(function () {
        // Format current date on form load
        setEndDate(new Date().toLocaleDateString('en-GB'));
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h3", { className: "text-center mt-5", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx("h4", { className: "text-center mt-3", children: "Produce Property House Statement" }), error && _jsx(Alert, { variant: "danger", children: error }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formLoanNo", className: "mb-3", children: [_jsx(Form.Label, { children: "House Number" }), _jsx(Form.Select, { value: loanNo, onChange: handleLoanNoChange, children: _jsx("option", { value: "", disabled: true, children: "Select a house number" }) })] }), _jsxs(Form.Group, { controlId: "formStartDate", className: "mb-3", children: [_jsx(Form.Label, { children: "Start Date" }), _jsx(Form.Control, { type: "date", value: startDate, onChange: handleStartDateChange })] }), _jsxs(Form.Group, { controlId: "formEndDate", className: "mb-3", children: [_jsx(Form.Label, { children: "End Date" }), _jsx(Form.Control, { type: "date", value: endDate, onChange: handleEndDateChange })] }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "text-center", children: "Field Officer" }), _jsx(Form.Control, { type: "text", placeholder: "Leave EMPTY for all field officers", disabled: true })] }) }), _jsx(Row, { children: _jsxs(Col, { className: "text-center", children: [_jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview" }), _jsx(Button, { variant: "danger", onClick: function () { return console.log('Exit clicked'); }, children: "Exit" })] }) })] })] }));
};
export default FrmPropertySavingsStatementX;
