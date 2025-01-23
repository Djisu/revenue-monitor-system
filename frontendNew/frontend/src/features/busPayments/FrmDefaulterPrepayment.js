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
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var DefaulterPrepaymentForm = function () {
    var _a = useState(''), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState(''), electoralArea = _b[0], setElectoralArea = _b[1];
    var _c = useState([]), electoralAreas = _c[0], setElectoralAreas = _c[1];
    useEffect(function () {
        var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get('/api/electoral-areas')];
                    case 1:
                        response = _a.sent();
                        setElectoralAreas(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching electoral areas:", error_1);
                        alert("Error fetching electoral areas");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchElectoralAreas();
    }, []);
    var handleDefaultersClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/defaulters-list', {
                            params: { fiscalYear: fiscalYear, electoralArea: electoralArea }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        window.open('/report/defaulters-list.rpt', '_blank');
                        alert("This is the report for ".concat(electoralArea));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error fetching defaulters list:", error_2);
                    alert("Error fetching defaulters list");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleFullyPaidBusinessesClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/fully-paid-businesses', {
                            params: { electoralArea: electoralArea }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        window.open('/report/fully-paid-businesses.rpt', '_blank');
                        alert("This is the report for ".concat(electoralArea));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error fetching fully paid businesses:", error_3);
                    alert("Error fetching fully paid businesses");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePaymentDefaultersClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/payment-defaulters', {
                            params: { electoralArea: electoralArea }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        window.open('/report/payment-defaulters.rpt', '_blank');
                        alert("This is the report for ".concat(electoralArea));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error fetching payment defaulters:", error_4);
                    alert("Error fetching payment defaulters");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePaymentsClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/payments', {
                            params: { electoralArea: electoralArea }
                        })];
                case 1:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        window.open('/report/businesses-payments.rpt', '_blank');
                        alert("This is the report for ".concat(electoralArea));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error fetching payments:", error_5);
                    alert("Error fetching payments");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handlePrepaymentsClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fiscalYear) {
                        alert("ENTER THE FISCAL YEAR");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/over-payments-list', {
                            params: { fiscalYear: fiscalYear, electoralArea: electoralArea }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        window.open('/report/over-payments-list.rpt', '_blank');
                        alert("This is the report for ".concat(electoralArea));
                    }
                    else {
                        alert("No records found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error("Error fetching over payments list:", error_6);
                    alert("Error fetching over payments list");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Assuming you have a way to navigate back to the main page
        window.location.href = '/'; // Redirect to main page or wherever you want
    };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { value: "", children: "Select an area" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Enter the fiscal year:" }), _jsx(Form.Control, { type: "text", value: fiscalYear, onChange: function (e) { return setFiscalYear(e.target.value); } })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleDefaultersClick, children: "Defaulters List" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "success", onClick: handlePrepaymentsClick, children: "Over Payments List" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "warning", onClick: handlePaymentsClick, children: "Payments" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "danger", onClick: handlePaymentDefaultersClick, children: "Payment And Receivables" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "secondary", onClick: handleFullyPaidBusinessesClick, children: "Fully Paid Businesses (No Arrears)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "outline-dark", onClick: handleExitClick, children: "Exit" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default DefaulterPrepaymentForm;
