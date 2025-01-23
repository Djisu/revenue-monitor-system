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
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var SavingsStatementX = function () {
    var _a = useState(''), loanNo = _a[0], setLoanNo = _a[1];
    var _b = useState(''), startDate = _b[0], setStartDate = _b[1];
    var _c = useState(''), endDate = _c[0], setEndDate = _c[1];
    // @ts-ignore
    var _d = useState(''), businessName = _d[0], setBusinessName = _d[1];
    var _e = useState([]), dates = _e[0], setDates = _e[1];
    var _f = useState([]), records = _f[0], setRecords = _f[1];
    useEffect(function () {
        // Set default end date to today
        setEndDate(new Date().toLocaleDateString('en-GB'));
    }, []);
    var handleLoanNoChange = function (e) {
        setLoanNo(e.target.value);
        // Fetch dates based on loan number
        fetchDates(e.target.value);
    };
    // const handleLoanNoValidate = async () => {
    //     if (!loanNo) {
    //         alert("Select a business number");
    //         return;
    //     }
    //     try {
    //         const response = await axios.get(`/api/business/${loanNo}`);
    //         if (response.data.length > 0) {
    //             setBusinessName(response.data[0].buss_name);
    //         } else {
    //             alert("A wrong business number");
    //         }
    //     } catch (error) {
    //         console.error("Error validating loan number", error);
    //         alert("An error occurred while validating the loan number");
    //     }
    // };
    var fetchDates = function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("/api/dates", {
                            params: { buss_no: bussNo }
                        })];
                case 1:
                    response = _a.sent();
                    setDates(response.data.map(function (rec) { return rec.transdate; }));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching dates", error_1);
                    alert("No payment records date found");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleStartDateChange = function (e) {
        setStartDate(e.target.value);
    };
    var handleEndDateChange = function (e) {
        setEndDate(e.target.value);
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!loanNo) {
                        alert("Select a business number");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("/api/records", {
                            params: { buss_no: loanNo, start_date: startDate, end_date: endDate }
                        })];
                case 2:
                    response = _a.sent();
                    setRecords(response.data);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error fetching records", error_2);
                    alert("No records found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
    };
    return (_jsxs(Container, { children: [_jsx(Row, { children: _jsx(Col, { children: _jsx("h1", { className: "text-center text-primary", children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsxs(Row, { children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formLoanNo", children: [_jsx(Form.Label, { children: "Business Number" }), _jsx(Form.Select, { value: loanNo, onChange: handleLoanNoChange, required: true, children: _jsx("option", { value: "", children: "Select Business Number" }) })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formBusinessName", children: [_jsx(Form.Label, { children: "Name" }), _jsx(Form.Control, { type: "text", value: businessName, readOnly: true })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formStartDate", children: [_jsx(Form.Label, { children: "Start Date" }), _jsxs(Form.Select, { value: startDate, onChange: handleStartDateChange, required: true, children: [_jsx("option", { value: "", children: "Select Start Date" }), dates.map(function (date) { return (_jsx("option", { value: date, children: date }, date)); })] })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formEndDate", children: [_jsx(Form.Label, { children: "End Date" }), _jsxs(Form.Select, { value: endDate, onChange: handleEndDateChange, required: true, children: [_jsx("option", { value: "", children: "Select End Date" }), dates.map(function (date) { return (_jsx("option", { value: date, children: date }, date)); })] })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business Number" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Details" }), _jsx("th", { children: "Debit" }), _jsx("th", { children: "Credit" }), _jsx("th", { children: "Balance" })] }) }), _jsx("tbody", { children: records.map(function (rec, index) { return (_jsxs("tr", { children: [_jsx("td", { children: rec.buss_no }), _jsx("td", { children: rec.transdate }), _jsx("td", { children: rec.details }), _jsx("td", { children: rec.debit }), _jsx("td", { children: rec.credit }), _jsx("td", { children: rec.balance })] }, index)); }) })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default SavingsStatementX;
