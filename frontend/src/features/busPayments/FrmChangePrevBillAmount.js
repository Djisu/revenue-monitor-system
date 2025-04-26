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
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var FrmChangePrevBillAmount = function () {
    var _a = useState(''), busNo = _a[0], setBusNo = _a[1];
    var _b = useState(''), busName = _b[0], setBusName = _b[1];
    var _c = useState(''), year = _c[0], setYear = _c[1];
    var _d = useState(0), oldBilledAmount = _d[0], setOldBilledAmount = _d[1];
    var _e = useState(0), newBilledAmount = _e[0], setNewBilledAmount = _e[1];
    var _f = useState([]), businessOptions = _f[0], setBusinessOptions = _f[1];
    var _g = useState([]), yearOptions = _g[0], setYearOptions = _g[1];
    var _h = useState(false), showModal = _h[0], setShowModal = _h[1];
    var _j = useState(''), modalMessage = _j[0], setModalMessage = _j[1];
    useEffect(function () {
        fetchBusinessOptions();
        fetchYearOptions();
    }, []);
    var fetchBusinessOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, options, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/businesses')];
                case 1:
                    response = _a.sent();
                    options = response.data.map(function (_a) {
                        var buss_no = _a.buss_no, buss_name = _a.buss_name;
                        return ({
                            value: buss_no,
                            label: "".concat(buss_no, "          ").concat(buss_name)
                        });
                    });
                    setBusinessOptions(options);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    showModalMessage('Error fetching business options');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchYearOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, options, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/fiscalyears')];
                case 1:
                    response = _a.sent();
                    options = response.data.map(function (_a) {
                        var fiscalyear = _a.fiscalyear;
                        return fiscalyear;
                    });
                    setYearOptions(options);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    showModalMessage('Error fetching fiscal year options');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleBusNoChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedBusNo, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedBusNo = event.target.value;
                    setBusNo(selectedBusNo);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("http://your-api-url/business/".concat(selectedBusNo))];
                case 2:
                    response = _a.sent();
                    setBusName(response.data.buss_name);
                    setOldBilledAmount(response.data.current_balance);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    showModalMessage('A wrong business number');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleYearChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedYear, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedYear = event.target.value;
                    setYear(selectedYear);
                    if (!busNo) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("http://your-api-url/business/".concat(busNo, "/fiscalyear/").concat(selectedYear))];
                case 2:
                    response = _a.sent();
                    setOldBilledAmount(response.data.current_balance);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    showModalMessage('Error fetching old billed amount');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleNewBilledAmountChange = function (event) {
        setNewBilledAmount(Number(event.target.value));
    };
    var handleUpdateClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, axios.post('http://your-api-url/updatebalance', {
                            buss_no: busNo,
                            fiscalyear: year,
                            new_amount: newBilledAmount
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, axios.get("http://your-api-url/business/".concat(busNo, "/fiscalyear/").concat(year))];
                case 2:
                    response = _a.sent();
                    if (response.data.current_balance === newBilledAmount) {
                        showModalMessage('Update successful');
                    }
                    else {
                        showModalMessage('Error with Update');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error(error_5);
                    showModalMessage('Error with Update');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Logic to exit to main menu or close the form
        console.log('Exiting to main menu...');
    };
    var showModalMessage = function (message) {
        setModalMessage(message);
        setShowModal(true);
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h1", { children: "Change Previously Billed Amount" }), _jsxs(Form.Group, { controlId: "formBusNo", children: [_jsx(Form.Label, { children: "Business No:" }), _jsxs(Form.Select, { value: busNo, onChange: handleBusNoChange, children: [_jsx("option", { value: "", children: "Select Business No" }), businessOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); })] })] }), _jsxs(Form.Group, { controlId: "formBusName", children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: busName, readOnly: true })] }), _jsxs(Form.Group, { controlId: "formYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsxs(Form.Select, { value: year, onChange: handleYearChange, children: [_jsx("option", { value: "", children: "Select Fiscal Year" }), yearOptions.map(function (option) { return (_jsx("option", { value: option, children: option }, option)); })] })] }), _jsxs(Form.Group, { controlId: "formOldBilledAmount", children: [_jsx(Form.Label, { children: "Old Billed Amount:" }), _jsx(Form.Control, { type: "text", value: oldBilledAmount, readOnly: true })] }), _jsxs(Form.Group, { controlId: "formNewBilledAmount", children: [_jsx(Form.Label, { children: "New Amount to Bill:" }), _jsx(Form.Control, { type: "text", value: newBilledAmount, onChange: handleNewBilledAmountChange })] }), _jsxs("div", { className: "mt-3", children: [_jsx(Button, { variant: "primary", onClick: handleUpdateClick, children: "Update Billed Amount" }), _jsx(Button, { variant: "danger", className: "ms-3", onClick: handleExitClick, children: "Exit to Main Menu" })] }), _jsxs(Modal, { show: showModal, onHide: function () { return setShowModal(false); }, children: [_jsx(Modal.Header, { closeButton: true, children: _jsx(Modal.Title, { children: "Information" }) }), _jsx(Modal.Body, { children: modalMessage }), _jsx(Modal.Footer, { children: _jsx(Button, { variant: "secondary", onClick: function () { return setShowModal(false); }, children: "Close" }) })] }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default FrmChangePrevBillAmount;
