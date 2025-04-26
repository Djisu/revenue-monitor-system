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
import { useAppDispatch } from '../../app/store';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchBusinesses, fetchBusinessById } from './businessSlice';
import { billOneBusiness } from '../busPayments/busPaymentsSlice';
export var FrmBillClient = function () {
    var _a = useState(0), bussNo = _a[0], setBussNo = _a[1];
    var _b = useState(''), bussName = _b[0], setBussName = _b[1];
    var _c = useState(0), amount = _c[0], setAmount = _c[1];
    var _d = useState(''), error = _d[0], setError = _d[1];
    //let [businessExists, setBusinessExists] = useState(false)
    //const businessesData = useAppSelector((state) => state.business.businesses)
    var dispatch = useAppDispatch();
    useEffect(function () {
        fetchBusinessList();
    }, []);
    var fetchBusinessList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dispatch(fetchBusinesses()).unwrap()];
                case 1:
                    _a.sent();
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
    var handleBillClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handleBillClick');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(billOneBusiness(bussNo)).unwrap()];
                case 2:
                    response = _a.sent();
                    if (response) {
                        alert('Billing successful');
                        setAmount(0);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setError('Error billing client');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getBusiness = function (businessId) { return __awaiter(void 0, void 0, void 0, function () {
        var id, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in getBusiness, onBlur triggered with:', businessId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    id = Number(businessId);
                    console.log('before  dispatch(fetchBusinessById(id)).unwrap();');
                    return [4 /*yield*/, dispatch(fetchBusinessById(id)).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:', response.data);
                    console.log('response: ', response.data);
                    if (response) {
                        setBussNo(response.data.buss_no || ''); // This can now be an empty string
                        setBussName(response.data.buss_name || '');
                        setAmount(response.data.current_rate || 0);
                    }
                    else {
                        alert('record not found');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error fetching businesses:', error_3);
                    if (fetchBusinessById.rejected.match(error_3)) {
                        alert('Error fetching business');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), _jsxs(Form, { children: [_jsx("p", { className: "bold-blue", children: "Bill a Business for Current Fiscal Year" }), _jsxs(Form.Group, { controlId: "formBussNo", children: [_jsx(Form.Label, { children: "Business Number:" }), _jsx(Form.Control, { type: "number", value: bussNo, onChange: function (e) { return setBussNo(Number(e.target.value)); }, onBlur: function (e) { return getBusiness(e.target.value); }, placeholder: "Click to get the next business number", min: "0" // Optional: set minimum value
                             })] }), _jsxs(Form.Group, { controlId: "formBussName", children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: bussName, readOnly: true })] }), _jsxs(Form.Group, { controlId: "formAmount", children: [_jsx(Form.Label, { children: "Amount to be posted:" }), _jsx(Form.Control, { type: "number", step: "0.01", value: amount, onChange: function (e) { return setAmount(Number(e.target.value)); }, style: { fontWeight: 'bold', color: 'blue' } })] }), _jsx(Button, { variant: "primary", onClick: handleBillClick, children: "Click to Bill a Client" })] }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
