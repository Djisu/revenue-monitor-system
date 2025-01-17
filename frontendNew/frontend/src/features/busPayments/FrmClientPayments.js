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
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
var FrmClientPayments = function () {
    var _a = useState([]), officers = _a[0], setOfficers = _a[1];
    var _b = useState([]), business = _b[0], setBusiness = _b[1];
    var _c = useState([]), payments = _c[0], setPayments = _c[1];
    var _d = useState([]), fiscalYears = _d[0], setFiscalYears = _d[1];
    // @ts-ignore
    var _e = useState([]), electoralAreas = _e[0], setElectoralAreas = _e[1];
    // @ts-ignore
    var _f = useState(new Date().getFullYear()), fiscalYear = _f[0], setFiscalYear = _f[1];
    // @ts-ignore
    var _g = useState(''), electoralArea = _g[0], setElectoralArea = _g[1];
    var _h = useState(''), officerNo = _h[0], setOfficerNo = _h[1];
    var _j = useState(''), busNo = _j[0], setBusNo = _j[1];
    var _k = useState(0), amount = _k[0], setAmount = _k[1];
    var _l = useState(0), receiptNo = _l[0], setReceiptNo = _l[1];
    var _m = useState(''), paymentMonth = _m[0], setPaymentMonth = _m[1];
    var _o = useState(new Date()), transDate = _o[0], setTransDate = _o[1];
    var _p = useState(''), owner = _p[0], setOwner = _p[1];
    var _q = useState(''), businessName = _q[0], setBusinessName = _q[1];
    var _r = useState(''), businessType = _r[0], setBusinessType = _r[1];
    var _s = useState(0), rate = _s[0], setRate = _s[1];
    var _t = useState(0), balanceBF = _t[0], setBalanceBF = _t[1];
    var _u = useState(''), propertyClass = _u[0], setPropertyClass = _u[1];
    var _v = useState(0), propertyRent = _v[0], setPropertyRent = _v[1];
    var _w = useState(0), totalPayable = _w[0], setTotalPayable = _w[1];
    var _x = useState(0), totalPayment = _x[0], setTotalPayment = _x[1];
    var _y = useState(0), currentBalance = _y[0], setCurrentBalance = _y[1];
    var _z = useState(false), statusFlag = _z[0], setStatusFlag = _z[1];
    useEffect(function () {
        fetchOfficers();
        fetchFiscalYears();
        fetchElectoralAreas();
        fetchPayments();
        handleUserPermissions();
    }, []);
    var fetchOfficers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/officers')];
                case 1:
                    response = _a.sent();
                    setOfficers(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchProperties = function (officerNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/properties', { params: { officer_no: officerNo } })];
                case 1:
                    response = _a.sent();
                    setBusiness(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchFiscalYears = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/fiscal-years')];
                case 1:
                    response = _a.sent();
                    fiscalYears = response.data;
                    setFiscalYears(fiscalYears);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/electoral-areas')];
                case 1:
                    response = _a.sent();
                    electoralAreas = response.data;
                    setElectoralAreas(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPayments = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/payments', { params: { fiscal_year: fiscalYear } })];
                case 1:
                    response = _a.sent();
                    setPayments(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleOfficerNoChange = function (event) {
        var target = event.target;
        var selectedOfficerNo = target.value;
        setOfficerNo(selectedOfficerNo);
        fetchProperties(selectedOfficerNo);
    };
    var handleBusNoChange = function (event) {
        var target = event.target;
        var selectedBusNo = target.value;
        setBusNo(selectedBusNo);
        fetchPropertyDetails(selectedBusNo);
    };
    var fetchPropertyDetails = function (busNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, Business, _a, _b, _c, error_6;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, axios.get('/api/property-details', { params: { buss_no: busNo } })];
                case 1:
                    response = _d.sent();
                    Business = response.data;
                    if (!Business) return [3 /*break*/, 5];
                    setBusinessName(Business.buss_name);
                    setBusinessType(Business.buss_type);
                    setRate(Business.current_rate);
                    _a = setBalanceBF;
                    return [4 /*yield*/, findBalanceBF(Business.buss_no)];
                case 2:
                    _a.apply(void 0, [_d.sent()]);
                    setPropertyClass(Business.property_class);
                    setPropertyRent(Business.property_rate);
                    setOwner(Business.ceo);
                    _b = setTotalPayable;
                    return [4 /*yield*/, findTotalPayable(Business.buss_no)];
                case 3:
                    _b.apply(void 0, [_d.sent()]);
                    _c = setTotalPayment;
                    return [4 /*yield*/, findTotalPayment(Business.buss_no)];
                case 4:
                    _c.apply(void 0, [_d.sent()]);
                    setCurrentBalance(totalPayable - totalPayment);
                    fetchReceiptNos(busNo);
                    return [3 /*break*/, 6];
                case 5:
                    alert("This business number does not exist. Select another number");
                    _d.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_6 = _d.sent();
                    console.error(error_6);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var findBalanceBF = function (busNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/balance-bf', { params: { buss_no: busNo } })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data || 0];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    alert("Error in finding balance");
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var findTotalPayable = function (busNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/total-payable', { params: { buss_no: busNo } })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data || 0];
                case 2:
                    error_8 = _a.sent();
                    console.error(error_8);
                    alert("Error in finding total payable");
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var findTotalPayment = function (busNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/total-payment', { params: { buss_no: busNo } })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data || 0];
                case 2:
                    error_9 = _a.sent();
                    console.error(error_9);
                    alert("Error in finding total payment");
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchReceiptNos = function (busNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/receipt-nos', { params: { buss_no: busNo } })];
                case 1:
                    response = _a.sent();
                    setPayments(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    console.error(error_10);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePaymentMonthChange = function (event) {
        var target = event.target;
        var selectedMonth = target.value;
        setPaymentMonth(selectedMonth);
    };
    var handleAmountChange = function (event) {
        var amount = parseFloat(event.target.value);
        setAmount(amount);
        setCurrentBalance(totalPayable - totalPayment - amount);
    };
    var handleReceiptNoChange = function (event) {
        var receiptNo = parseInt(event.target.value, 10);
        setReceiptNo(receiptNo);
        validateReceiptNo();
    };
    var validateReceiptNo = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, tempResponse, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, axios.get('/api/validate-receipt-no', { params: { receiptno: receiptNo, fiscal_year: fiscalYear } })];
                case 1:
                    response = _a.sent();
                    if (!(response.data.length > 0)) return [3 /*break*/, 2];
                    alert("Receipt number already entered. Enter another receipt number");
                    setReceiptNo(0);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios.get('/api/temp-payment', { params: { receiptno: receiptNo, fiscal_year: fiscalYear } })];
                case 3:
                    tempResponse = _a.sent();
                    if (tempResponse.data.length > 0) {
                        alert("Receipt number temporally entered but not yet posted by the supervisor. Enter a new receipt number");
                        setReceiptNo(0);
                    }
                    else {
                        setStatusFlag(true);
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_11 = _a.sent();
                    console.error(error_11);
                    alert("Error in validating receipt number");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleAddRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!busNo) {
                        alert("Select the business number");
                        return [2 /*return*/];
                    }
                    if (!officerNo) {
                        alert("Select the officer number");
                        return [2 /*return*/];
                    }
                    if (!amount) {
                        alert("Enter the amount");
                        return [2 /*return*/];
                    }
                    if (!paymentMonth) {
                        alert("Select the payment month");
                        return [2 /*return*/];
                    }
                    if (!receiptNo) {
                        alert("Enter the receipt number");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-record', {
                            buss_no: busNo,
                            officer_no: officerNo,
                            amount: amount,
                            monthpaid: paymentMonth,
                            transdate: transDate,
                            userid: 'your_user_id_here', // Replace with actual user ID logic
                            fiscal_year: fiscalYear,
                            receiptno: receiptNo
                        })];
                case 2:
                    response = _a.sent();
                    alert(response.data);
                    fetchPayments();
                    handleUserPermissions();
                    return [3 /*break*/, 4];
                case 3:
                    error_12 = _a.sent();
                    console.error(error_12);
                    alert("Error in adding a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handlePostRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!busNo) {
                        alert("Select the business number");
                        return [2 /*return*/];
                    }
                    if (!officerNo) {
                        alert("Select the officer number");
                        return [2 /*return*/];
                    }
                    if (!amount) {
                        alert("Enter the amount");
                        return [2 /*return*/];
                    }
                    if (!paymentMonth) {
                        alert("Select the payment month");
                        return [2 /*return*/];
                    }
                    if (!receiptNo) {
                        alert("Enter the receipt number");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, axios.get('/api/validate-temp-record', { params: { buss_no: busNo, officer_no: officerNo, fiscal_year: fiscalYear, receiptno: receiptNo } })];
                case 2:
                    response = _a.sent();
                    if (response.data.length === 0) {
                        alert("This payment cannot be posted. Data entry clerk has not yet entered it!!!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.post('/api/post-record', {
                            buss_no: busNo,
                            officer_no: officerNo,
                            amount: amount,
                            monthpaid: paymentMonth,
                            transdate: transDate,
                            userid: 'your_user_id_here', // Replace with actual user ID logic
                            fiscal_year: fiscalYear,
                            receiptno: receiptNo
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, axios.post('/api/update-officer-budget', {
                            officer_no: officerNo,
                            fiscal_year: fiscalYear,
                            month: paymentMonth,
                            amount: amount
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, axios.post('/api/update-business-balance', {
                            buss_no: busNo,
                            amount: amount
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, axios.post('/api/delete-temp-record', {
                            buss_no: busNo,
                            officer_no: officerNo,
                            fiscal_year: fiscalYear,
                            receiptno: receiptNo
                        })];
                case 6:
                    _a.sent();
                    alert("Collector's Payment successfully posted");
                    fetchPayments();
                    handleUserPermissions();
                    return [3 /*break*/, 8];
                case 7:
                    error_13 = _a.sent();
                    console.error(error_13);
                    alert("Error in posting a record");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        var password, response, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = prompt("Enter the password to delete");
                    if (password !== "Timbuk2tu") {
                        alert("Wrong password. Deletion aborted");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios.get('/api/validate-payment-record', { params: { buss_no: busNo, officer_no: officerNo, fiscal_year: fiscalYear, receiptno: receiptNo, monthpaid: paymentMonth } })];
                case 2:
                    response = _a.sent();
                    if (response.data.length === 0) {
                        alert("Record does not exist!!!");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.post('/api/delete-payment-record', {
                            buss_no: busNo,
                            officer_no: officerNo,
                            fiscal_year: fiscalYear,
                            receiptno: receiptNo,
                            monthpaid: paymentMonth
                        })];
                case 3:
                    _a.sent();
                    alert("Faulty record deleted from temporal storage");
                    fetchPayments();
                    handleUserPermissions();
                    return [3 /*break*/, 5];
                case 4:
                    error_14 = _a.sent();
                    console.error(error_14);
                    alert("Error in deleting a record");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleExit = function () {
        // Logic to exit and show main menu
        window.close();
    };
    var handleUserPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            userId = 'your_user_id_here';
            if (userId.toUpperCase() === "SUPERVISOR") {
                setPayments([]);
                fetchSupervisorPayments(fiscalYear);
            }
            else {
                setPayments([]);
                fetchUserPayments(userId, fiscalYear);
            }
            return [2 /*return*/];
        });
    }); };
    var fetchSupervisorPayments = function (fiscalYear) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/supervisor-payments', { params: { fiscal_year: fiscalYear } })];
                case 1:
                    response = _a.sent();
                    setPayments(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_15 = _a.sent();
                    console.error(error_15);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchUserPayments = function (userId, fiscalYear) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/user-payments', { params: { userid: userId, fiscal_year: fiscalYear } })];
                case 1:
                    response = _a.sent();
                    setPayments(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_16 = _a.sent();
                    console.error(error_16);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePrintReceipt = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!officerNo) {
                        alert("Select a collector to produce receipt");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/print-receipt', {
                            officer_no: officerNo,
                            fiscal_year: fiscalYear
                        })];
                case 2:
                    _a.sent();
                    alert("This is the report");
                    return [3 /*break*/, 4];
                case 3:
                    error_17 = _a.sent();
                    console.error(error_17);
                    alert("Error in printing receipt");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDefaulters = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post('/api/defaulters', {
                            fiscal_year: fiscalYear
                        })];
                case 1:
                    _a.sent();
                    alert("This is the report");
                    return [3 /*break*/, 3];
                case 2:
                    error_18 = _a.sent();
                    console.error(error_18);
                    alert("Error in generating defaulters report");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePrepayments = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post('/api/prepayments', {
                            fiscal_year: fiscalYear
                        })];
                case 1:
                    _a.sent();
                    alert("This is the report");
                    return [3 /*break*/, 3];
                case 2:
                    error_19 = _a.sent();
                    console.error(error_19);
                    alert("Error in generating prepayments report");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleLoad = function () {
        handleUserPermissions();
    };
    var handleNoArrears = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post('/api/no-arrears', {
                            fiscal_year: fiscalYear
                        })];
                case 1:
                    _a.sent();
                    alert("This is the report");
                    return [3 /*break*/, 3];
                case 2:
                    error_20 = _a.sent();
                    console.error(error_20);
                    alert("Error in generating no arrears report");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [_jsx(Row, { children: _jsxs(Col, { className: "text-center mt-3", children: [_jsx("h2", { className: "text-primary", children: "Collector's Payments Entry" }), _jsx("h4", { className: "text-info", children: "MARCORY MUNICIPAL ASSEMBLY" })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Collector Code:" }), _jsxs(Form.Control, { as: "select", value: officerNo, onChange: handleOfficerNoChange, children: [_jsx("option", { value: "", children: "Select..." }), officers.map(function (officer) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, " - ", officer.officer_name] }, officer.officer_no)); })] })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Business No:" }), _jsxs(Form.Control, { as: "select", value: busNo, onChange: handleBusNoChange, children: [_jsx("option", { value: "", children: "Select..." }), business.map(function (item) { return (_jsxs("option", { value: item.buss_no, children: [item.buss_no, " - ", item.buss_name, " - ", item.electroral_area] }, item.buss_no)); })] })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Receipt No:" }), _jsx(Form.Control, { type: "number", value: receiptNo, onChange: handleReceiptNoChange })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Payment Month:" }), _jsxs(Form.Control, { as: "select", value: paymentMonth, onChange: handlePaymentMonthChange, children: [_jsx("option", { value: "", children: "Select..." }), _jsx("option", { value: "January", children: "January" }), _jsx("option", { value: "February", children: "February" }), _jsx("option", { value: "March", children: "March" }), _jsx("option", { value: "April", children: "April" }), _jsx("option", { value: "May", children: "May" }), _jsx("option", { value: "June", children: "June" }), _jsx("option", { value: "July", children: "July" }), _jsx("option", { value: "August", children: "August" }), _jsx("option", { value: "September", children: "September" }), _jsx("option", { value: "October", children: "October" }), _jsx("option", { value: "November", children: "November" }), _jsx("option", { value: "December", children: "December" })] })] })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Amount:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: amount, onChange: handleAmountChange })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Payment Date:" }), _jsx(Form.Control, { type: "date", value: transDate.toISOString().split('T')[0], onChange: function (e) { return setTransDate(new Date(e.target.value)); } })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Owner's Name:" }), _jsx(Form.Control, { type: "text", value: owner, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: businessName, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Business Type:" }), _jsx(Form.Control, { type: "text", value: businessType, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Rate:" }), _jsx(Form.Control, { type: "text", value: rate.toFixed(2), readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Balance BF:" }), _jsx(Form.Control, { type: "text", value: balanceBF.toFixed(2), readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Property Class:" }), _jsx(Form.Control, { type: "text", value: propertyClass, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Property Fees:" }), _jsx(Form.Control, { type: "text", value: propertyRent.toFixed(2), readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Total Payable:" }), _jsx(Form.Control, { type: "text", value: totalPayable.toFixed(2), readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Total Payment:" }), _jsx(Form.Control, { type: "text", value: totalPayment.toFixed(2), readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Current Balance:" }), _jsx(Form.Control, { type: "text", value: currentBalance.toFixed(2), readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: fiscalYear, readOnly: true })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleAddRecord, disabled: !statusFlag, children: "Add New Record" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePostRecord, disabled: officerNo === '' || busNo === '' || amount === 0 || paymentMonth === '' || receiptNo === 0, children: "Post" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleDeleteRecord, disabled: officerNo === '' || busNo === '' || paymentMonth === '' || receiptNo === 0, children: "Delete A Faulty Entry" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleExit, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h3", { className: "font-weight-bold", children: "List of Payments" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Collector No" }), _jsx("th", { children: "Business No" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Receipt No" }), _jsx("th", { children: "Payment Month" }), _jsx("th", { children: "Fiscal Year" })] }) }), _jsx("tbody", { children: payments.map(function (payment) { return (_jsxs("tr", { children: [_jsx("td", { children: payment.officer_no }), _jsx("td", { children: payment.buss_no }), _jsx("td", { children: payment.buss_name }), _jsx("td", { children: payment.amount.toFixed(2) }), _jsx("td", { children: payment.receiptno }), _jsx("td", { children: payment.monthpaid }), _jsx("td", { children: payment.fiscal_year })] }, payment.buss_no)); }) })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h3", { className: "font-weight-bold", children: "List of Business Receipt Numbers" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business No" }), _jsx("th", { children: "Receipt No" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Date" })] }) }), _jsx("tbody", { children: payments.map(function (payment) { return (_jsxs("tr", { children: [_jsx("td", { children: payment.buss_no }), _jsx("td", { children: payment.receiptno }), _jsx("td", { children: payment.amount.toFixed(2) }), _jsx("td", { children: payment.transdate.toISOString().split('T')[0] })] }, payment.buss_no)); }) })] })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePrintReceipt, disabled: officerNo === '', children: "Print Receipt" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleDefaulters, children: "Defaulters" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePrepayments, children: "Prepayments" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleLoad, children: "Load" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleNoArrears, children: "No Arrears" }) })] })] }));
};
export default FrmClientPayments;
