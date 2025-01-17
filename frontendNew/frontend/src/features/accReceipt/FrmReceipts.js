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
export var FrmReceipts = function () {
    var _a = useState(0), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState(0), batchNo = _b[0], setBatchNo = _b[1];
    var _c = useState(0), firstNo = _c[0], setFirstNo = _c[1];
    var _d = useState(0), lastNo = _d[0], setLastNo = _d[1];
    var _e = useState([]), receipts = _e[0], setReceipts = _e[1];
    useEffect(function () {
        // Fetch receipts on form load
        fetchReceipts();
    }, []);
    var fetchReceipts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/receipts')];
                case 1:
                    response = _a.sent();
                    setReceipts(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching receipts", error_1);
                    alert("An error occurred while fetching receipts");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleFiscalYearChange = function (e) {
        setFiscalYear(Number(e.target.value));
    };
    var handleBatchNoChange = function (e) {
        setBatchNo(Number(e.target.value));
    };
    var handleFirstNoChange = function (e) {
        setFirstNo(Number(e.target.value));
    };
    var handleLastNoChange = function (e) {
        setLastNo(Number(e.target.value));
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("Enter the fiscal year");
                        return [2 /*return*/];
                    }
                    if (!batchNo) {
                        alert("Enter the batch number");
                        return [2 /*return*/];
                    }
                    if (!firstNo) {
                        alert("Enter the first receipt number");
                        return [2 /*return*/];
                    }
                    if (!lastNo) {
                        alert("Enter the last receipt number");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-receipt', {
                            fiscalyear: fiscalYear,
                            batchno: batchNo,
                            firstno: firstNo,
                            lastno: lastNo
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.success) {
                        alert("Record successfully added");
                        // Clear input fields
                        setFiscalYear(0);
                        setBatchNo(0);
                        setFirstNo(0);
                        setLastNo(0);
                        // Refresh the list of receipts
                        fetchReceipts();
                    }
                    else {
                        alert("Record already exists");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error adding receipt", error_2);
                    alert("Error in adding a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("Enter the fiscal year");
                        return [2 /*return*/];
                    }
                    if (!batchNo) {
                        alert("Enter the batch number");
                        return [2 /*return*/];
                    }
                    if (!firstNo) {
                        alert("Enter the first receipt number");
                        return [2 /*return*/];
                    }
                    if (!lastNo) {
                        alert("Enter the last receipt number");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/delete-receipt', {
                            fiscalyear: fiscalYear,
                            batchno: batchNo,
                            firstno: firstNo,
                            lastno: lastNo
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.success) {
                        alert("Record successfully deleted");
                        // Clear input fields
                        setFiscalYear(0);
                        setBatchNo(0);
                        setFirstNo(0);
                        setLastNo(0);
                        // Refresh the list of receipts
                        fetchReceipts();
                    }
                    else {
                        alert("Record not found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error deleting receipt", error_3);
                    alert("Error in deleting a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };
    var handleBatchNoClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("Enter the fiscal year");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/next-batch-no', {
                            params: { fiscalyear: fiscalYear }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.nextBatchNo) {
                        setBatchNo(response.data.nextBatchNo);
                    }
                    else {
                        alert("Record not found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error fetching next batch number", error_4);
                    alert("An error occurred while fetching the next batch number");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { fluid: true, children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h1", { className: "text-center text-primary", children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsxs(Row, { children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: fiscalYear, onChange: handleFiscalYearChange, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formBatchNo", children: [_jsx(Form.Label, { children: "Batch Number:" }), _jsx(Form.Control, { type: "number", value: batchNo, onChange: handleBatchNoChange, onClick: handleBatchNoClick, required: true })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstNo", children: [_jsx(Form.Label, { children: "First Receipt Number:" }), _jsx(Form.Control, { type: "number", value: firstNo, onChange: handleFirstNoChange, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formLastNo", children: [_jsx(Form.Label, { children: "Last Receipt Number:" }), _jsx(Form.Control, { type: "number", value: lastNo, onChange: handleLastNoChange, required: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: handleDeleteClick, children: "Delete" }) }), _jsx(Col, { children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h2", { children: "List of Receipt Numbers" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Fiscal Year" }), _jsx("th", { children: "Batch Number" }), _jsx("th", { children: "First No" }), _jsx("th", { children: "Last No" })] }) }), _jsx("tbody", { children: receipts.map(function (receipt, index) { return (_jsxs("tr", { onClick: function () {
                                            setFiscalYear(receipt.fiscalyear);
                                            setBatchNo(receipt.batchno);
                                            setFirstNo(receipt.firstno);
                                            setLastNo(receipt.lastno);
                                        }, children: [_jsx("td", { children: receipt.fiscalyear }), _jsx("td", { children: receipt.batchno }), _jsx("td", { children: receipt.firstno }), _jsx("td", { children: receipt.lastno })] }, index)); }) })] })] }) })] }));
};
