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
import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
var FrmBussOpeNos = function () {
    var _a = useState(''), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState(''), firstBusinessNo = _b[0], setFirstBusinessNo = _b[1];
    var _c = useState(''), secondBusinessNo = _c[0], setSecondBusinessNo = _c[1];
    var _d = useState([]), businessNumbers = _d[0], setBusinessNumbers = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    // Fetch business numbers
    var fetchBusinessNumbers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/business')];
                case 1:
                    response = _a.sent();
                    setBusinessNumbers(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    setError('Error fetching business numbers');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchBusinessNumbers();
    }, []);
    var handlePreview = function () {
        if (!firstBusinessNo && !secondBusinessNo) {
            setError('Select the business numbers');
            return;
        }
        // Logic for processing preview (similar to VB6 cmdPreview_Click)
        console.log("Previewing Demand Notices for", firstBusinessNo, secondBusinessNo);
    };
    var handlePrint = function () {
        // Logic for printing notices
        console.log("Printing Demand Notices for", firstBusinessNo, secondBusinessNo);
    };
    return (_jsxs("div", { style: { backgroundColor: '#FFC0C0', padding: '20px', borderRadius: '5px' }, children: [_jsx("h2", { style: { color: '#FF0000', textAlign: 'center' }, children: "Business Operating Permit Demand Notice" }), _jsx("h4", { style: { color: '#0000C0', textAlign: 'center' }, children: "MARCORY MUNICIPAL ASSEMBLY" }), error && _jsx(Alert, { variant: "danger", children: error }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formFiscalYear", children: [_jsx(Form.Label, { children: "Fiscal Year:" }), _jsxs(Form.Control, { as: "select", value: fiscalYear, onChange: function (e) { return setFiscalYear(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Fiscal Year" }), _jsx("option", { value: "2023", children: "2023" }), _jsx("option", { value: "2024", children: "2024" })] })] }), _jsxs(Form.Group, { controlId: "formFirstBusinessNo", children: [_jsx(Form.Label, { children: "First Business Number:" }), _jsxs(Form.Control, { as: "select", value: firstBusinessNo, onChange: function (e) { return setFirstBusinessNo(e.target.value); }, children: [_jsx("option", { value: "", children: "Select First Business No" }), businessNumbers.map(function (b, index) { return (_jsx("option", { value: b, children: b }, index)); })] })] }), _jsxs(Form.Group, { controlId: "formSecondBusinessNo", children: [_jsx(Form.Label, { children: "Second Business Number:" }), _jsxs(Form.Control, { as: "select", value: secondBusinessNo, onChange: function (e) { return setSecondBusinessNo(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Second Business No" }), businessNumbers.map(function (b, index) { return (_jsx("option", { value: b, children: b }, index)); })] })] }), _jsxs("div", { className: "d-flex justify-content-between", children: [_jsx(Button, { variant: "primary", onClick: handlePreview, children: "Preview Demand Notices" }), _jsx(Button, { variant: "secondary", onClick: handlePrint, children: "Print Demand Notices" }), _jsx(Button, { variant: "danger", onClick: function () { return console.log('Exit'); }, children: "Exit" })] })] })] }));
};
export default FrmBussOpeNos;
