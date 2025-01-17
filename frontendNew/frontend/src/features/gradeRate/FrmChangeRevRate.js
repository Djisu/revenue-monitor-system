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
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// interface ClientBalance {
//   buss_no: number;
//   fiscalyear: number;
//   balancebf: number;
//   current_balance: number;
//   totalAmountDue: number;
//   transdate: string;
// }
var ChangeRevRateForm = function () {
    var _a = useState(''), bussNo = _a[0], setBussNo = _a[1];
    var _b = useState(''), bussName = _b[0], setBussName = _b[1];
    var _c = useState(0), fiscalYear = _c[0], setFiscalYear = _c[1];
    var _d = useState(0), correctRate = _d[0], setCorrectRate = _d[1];
    var _e = useState([]), businessList = _e[0], setBusinessList = _e[1];
    var _f = useState(''), error = _f[0], setError = _f[1];
    useEffect(function () {
        fetchBusinessList();
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
                    businessList = response.data;
                    setBusinessList(businessList);
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
    var handleBussNoChange = function (e) {
        setBussNo(e.target.value);
        validateBussNo(e.target.value);
    };
    var validateBussNo = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get("http://your-api-url/tb_business?buss_no=".concat(value))];
                case 1:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        setBussName(response.data[0].buss_name);
                        setError('');
                    }
                    else {
                        setError('A wrong business number');
                        setBussName('');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('A wrong business number');
                    setBussName('');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleFiscalYearChange = function (e) {
        setFiscalYear(Number(e.target.value));
    };
    var handleCorrectRateChange = function (e) {
        setCorrectRate(Number(e.target.value));
    };
    var handleUpdateClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!bussNo || !fiscalYear || !correctRate) {
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
                    alert('Last year\'s rate updated successfully');
                    setCorrectRate(0);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setError('Error updating last year\'s rate');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        window.location.href = '/'; // Redirect to main page or hide the form
    };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Change Last Year's Rate" }), error && _jsx(Alert, { variant: "danger", children: error }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formBussNo", children: [_jsx(Form.Label, { children: "Business Number:" }), _jsx(Form.Control, { type: "text", value: bussNo, onChange: handleBussNoChange })] }), _jsxs(Form.Group, { controlId: "formBussName", children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: bussName, readOnly: true, style: { fontWeight: 'bold', color: 'red' } })] }), _jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: fiscalYear, onChange: handleFiscalYearChange })] }), _jsxs(Form.Group, { controlId: "formCorrectRate", children: [_jsx(Form.Label, { children: "Correct Rate:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: correctRate, onChange: handleCorrectRateChange, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsx(Button, { variant: "primary", onClick: handleUpdateClick, children: "Update last year's rate" }), _jsx(Button, { variant: "danger", onClick: handleExitClick, style: { marginLeft: '10px' }, children: "Exit" })] })] }));
};
export default ChangeRevRateForm;
