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
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { addBudget, resetError, resetBudgetState } from './officerBudgetSlice'; // Adjust the path as necessary
import { fetchOfficers } from '../officer/officerSlice';
var FrmOfficerBudget = function () {
    var dispatch = useAppDispatch();
    var navigate = useNavigate();
    // You may also want to retrieve the loading and error state from the Redux store
    var error = useAppSelector(function (state) { return state.officerBudget; }).error;
    var officers = useAppSelector(function (state) { return state.officer.officers; });
    console.log('officers', officers);
    var _a = useState(''), officerNo = _a[0], setOfficerNo = _a[1];
    var _b = useState(0), fiscalYear = _b[0], setFiscalYear = _b[1];
    // Optionally reset state on unmount
    useEffect(function () {
        return function () {
            dispatch(resetBudgetState());
        };
    }, [dispatch]);
    useEffect(function () {
        dispatch(fetchOfficers());
    }, [dispatch]);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var budgetData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('handleSubmit');
                    e.preventDefault();
                    if (!officerNo || !fiscalYear) {
                        //errorData = 'Please select both officer and fiscal year.'
                        alert('Please select both officer and fiscal year.');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    budgetData = {
                        officer_no: officerNo,
                        fiscal_year: fiscalYear
                    };
                    return [4 /*yield*/, dispatch(addBudget(budgetData)).unwrap()];
                case 2:
                    _a.sent(); // Using unwrap to get the resolved value directly;
                    // Assuming successful response structure from addBudget
                    alert('Budget record added successfully.');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    //errorData = 'Error in create budget record.';
                    alert('Error in create budget record.');
                    return [3 /*break*/, 5];
                case 4:
                    // Clear the form fields regardless of success or failure
                    setOfficerNo('');
                    setFiscalYear(0);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleExit = function () {
        // Logic to exit the form, e.g., reset state or navigate away
        setOfficerNo('');
        setFiscalYear(0);
        navigate('/main');
    };
    useEffect(function () {
        // Reset error state on component mount
        dispatch(resetError());
    }, [dispatch]);
    return (_jsx("div", { className: "container mt-4", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("p", { className: "mb-4", children: "Create Annual Budget Record" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "officer", className: "form-label", children: "Officer:" }), _jsxs("select", { id: "officer", className: "form-select", value: officerNo, onChange: function (e) { return setOfficerNo(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Officer" }), officers.map(function (officer, index) { return (_jsx("option", { value: officer.officer_no, children: officer.officer_name }, index)); })] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "fiscalYear", className: "form-label", children: "Fiscal Year:" }), _jsx("input", { id: "fiscalYear", type: "number", className: "form-control", value: fiscalYear, onChange: function (e) { return setFiscalYear(parseInt(e.target.value)); }, placeholder: "Enter Fiscal Year" })] }), error && _jsx("p", { className: "text-danger", children: error }), _jsx("button", { type: "submit", className: "btn btn-primary me-2", children: "Submit" }), _jsx("button", { className: "primary m-3", onClick: handleExit, children: "Go Back" })] }) }));
};
export default FrmOfficerBudget;
