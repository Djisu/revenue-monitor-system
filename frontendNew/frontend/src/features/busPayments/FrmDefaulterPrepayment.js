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
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchPaymentDefaulters } from './busPaymentsSlice';
import { fetchBalances } from '../balance/balanceSlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import BalanceTable from '../balance/BalanceTable';
var DefaulterPrepaymentForm = function () {
    var _a = useState(''), electoralArea = _a[0], setElectoralArea = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1]; // Loading state
    var dispatch = useAppDispatch();
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    var balanceData = useAppSelector(function (state) { return state.balance.balances; });
    useEffect(function () {
        setLoading(true); // Set loading to true
        dispatch(fetchElectoralAreas()).finally(function () { return setLoading(false); }); // Fetch electoral areas
    }, [dispatch]);
    useEffect(function () {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
        }
        else {
            console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
        }
    }, [electoralAreaData]);
    var fetchBalancesData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true); // Set loading to true
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dispatch(fetchBalances())];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching balances:", error_1);
                    alert("Error fetching balances");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false); // Set loading to false after fetching
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDefaultersClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!electoralArea) {
                        alert("Select the electoral area");
                        return [2 /*return*/];
                    }
                    setLoading(true); // Set loading to true
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, dispatch(fetchPaymentDefaulters(electoralArea)).unwrap()];
                case 2:
                    response = _a.sent();
                    if (!(response.data.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetchBalancesData()];
                case 3:
                    _a.sent();
                    alert("This is the report for ".concat(electoralArea));
                    return [3 /*break*/, 5];
                case 4:
                    alert("No records found");
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error fetching defaulters list:", error_2);
                    alert("Error fetching defaulters list");
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false); // Set loading to false after fetching
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [loading && (_jsx("div", { className: "text-center", children: _jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }) })), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { children: [_jsx(Form.Label, { htmlFor: "electoral_area", children: "Electoral Area:" }), _jsxs(Form.Select, { name: "electoral_area", id: "electoral_area", value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { value: "All electoral areas", children: "All electoral areas" }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleDefaultersClick, disabled: loading, children: "Defaulters List" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) }), balanceData.length > 0 && _jsx(BalanceTable, { balanceData: balanceData })] }));
};
export default DefaulterPrepaymentForm;
