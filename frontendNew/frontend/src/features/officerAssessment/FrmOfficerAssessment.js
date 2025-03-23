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
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchOfficers } from '../officer/officerSlice';
import { fetchJanuaryAmount, fetchFebruaryAmount, fetchMarchAmount, fetchAprilAmount, fetchMayAmount, fetchJuneAmount, fetchJulyAmount, fetchAugustAmount, fetchSeptemberAmount, fetchOctoberAmount, fetchNovemberAmount, fetchDecemberAmount, fetchClientsServed, fetchBillsDistributed, createClientsServed, fetchOfficerAssessment } from './officerAssessmentSlice';
import { fetchOfficerBudget } from '../officerBudget/officerBudgetSlice';
import OfficerAssessmentBarChart from '../../charts/OfficerAssessmentBarChart';
//type FetchClientsServedPayload = any[]; // Replace 'any[]' with the actual type
var FrmOfficerAssessment = function () {
    var dispatch = useAppDispatch();
    var navigate = useNavigate();
    var _a = useState(""), firstFiscalYear = _a[0], setFirstFiscalYear = _a[1]; // Initialize as an empty string
    var _b = useState(''), firstOfficer = _b[0], setFirstOfficer = _b[1];
    var _c = useState([]), chartData = _c[0], setChartData = _c[1]; // Initialize as an empty array
    var _d = useState(false), shouldFetchChartData = _d[0], setShouldFetchChartData = _d[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var action, fetchedData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('in fetchData');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dispatch(fetchOfficerAssessment({ officerNo: firstOfficer, fiscalYear: parseInt(firstFiscalYear, 10) }))];
                    case 2:
                        action = _a.sent();
                        console.log('action.payload: ', action.payload);
                        fetchedData = Array.isArray(action.payload) ? action.payload : [action.payload];
                        setChartData(fetchedData); // Set the normalized data to chartData
                        console.log('SUCCESS SUCCESS SUCCESS');
                        console.log('chartData: ', fetchedData);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching data:', error_1);
                        console.log('FAIL FAIL FAIL');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (shouldFetchChartData) {
            fetchData();
            setShouldFetchChartData(false); // Reset the state after fetching
        }
    }, [dispatch, shouldFetchChartData]);
    var officersData = useAppSelector(function (state) { return state.officer.officers; });
    useEffect(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatch(fetchOfficers())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [dispatch]);
    var handleFirstOfficerChange = function (event) {
        var target = event.target;
        var selectedOfficer = target.value.split(' ')[0];
        setFirstOfficer(selectedOfficer);
    };
    var handleFirstFiscalYearChange = function (event) {
        var target = event.target;
        setFirstFiscalYear(target.value);
    };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetResponse, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handlePreviewClick');
                    if (!firstFiscalYear || !firstOfficer) {
                        alert("ENTER THE FISCAL YEAR AND OFFICERS");
                        return [2 /*return*/];
                    }
                    console.log('about to access budgetResponse');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, dispatch(fetchOfficerBudget({ officer_no: firstOfficer, fiscal_year: parseInt(firstFiscalYear, 10) })).unwrap()];
                case 2:
                    budgetResponse = _a.sent();
                    console.log('budgetResponse.data: ', budgetResponse.data);
                    // Check if the response indicates that the data exists
                    if (budgetResponse.exists) {
                        // Data was successfully fetched
                        console.log('Budget Data:', budgetResponse.data);
                        // You can further process the budget data here
                    }
                    else {
                        // Handle the case where the data doesn't exist
                        console.error("No budget data found for the officer:", budgetResponse);
                        alert("No budget data found for the officer.");
                    }
                    console.log('about to access variable of createClientsServedParams object');
                    if (!(budgetResponse && budgetResponse.exists && Array.isArray(budgetResponse.data))) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.all(budgetResponse.data.map(function (officer) { return __awaiter(void 0, void 0, void 0, function () {
                            var officerNo, officerName, fiscalYearValue, noOfClientsServed, valueOfBillsDistributed, januaryAmount, error_3, februaryAmount, error_4, marchAmount, error_5, aprilAmount, error_6, mayAmount, error_7, juneAmount, error_8, julyAmount, error_9, augustAmount, error_10, septemberAmount, error_11, octoberAmount, error_12, novemberAmount, error_13, decemberAmount, error_14, totalReceiptToDate, balance, remarks, createClientsServedParams, answer;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        officerNo = officer.officer_no;
                                        console.log('officerNo: ', officerNo);
                                        officerName = officer.officer_name;
                                        console.log('officerName: ', officerName);
                                        fiscalYearValue = parseInt(firstFiscalYear, 10);
                                        // Check if fiscalYearValue is a valid number
                                        if (isNaN(fiscalYearValue)) {
                                            throw new Error('Invalid fiscalYear: must be a number');
                                        }
                                        // Dispatch the thunk with the necessary parameters
                                        console.log('on dispatch(fetchClientsServed');
                                        return [4 /*yield*/, dispatch(fetchClientsServed({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 1:
                                        noOfClientsServed = _a.sent();
                                        console.log('noOfClientsServed: ', noOfClientsServed);
                                        return [4 /*yield*/, dispatch(fetchBillsDistributed({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 2:
                                        valueOfBillsDistributed = _a.sent();
                                        console.log('valueOfBillsDistributed: ', valueOfBillsDistributed);
                                        januaryAmount = 0;
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, dispatch(fetchJanuaryAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 4:
                                        // Directly use unwrap to get the result or catch the error
                                        januaryAmount = _a.sent();
                                        console.log('Total amount for January:', januaryAmount);
                                        return [3 /*break*/, 6];
                                    case 5:
                                        error_3 = _a.sent();
                                        console.error('Failed to fetch amount:', error_3);
                                        return [3 /*break*/, 6];
                                    case 6:
                                        februaryAmount = 0;
                                        _a.label = 7;
                                    case 7:
                                        _a.trys.push([7, 9, , 10]);
                                        return [4 /*yield*/, dispatch(fetchFebruaryAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 8:
                                        // Directly use unwrap to get the result or catch the error
                                        februaryAmount = _a.sent();
                                        console.log('Total amount for February:', februaryAmount);
                                        return [3 /*break*/, 10];
                                    case 9:
                                        error_4 = _a.sent();
                                        console.error('Failed to fetch amount:', error_4);
                                        return [3 /*break*/, 10];
                                    case 10:
                                        marchAmount = 0;
                                        _a.label = 11;
                                    case 11:
                                        _a.trys.push([11, 13, , 14]);
                                        return [4 /*yield*/, dispatch(fetchMarchAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 12:
                                        // Directly use unwrap to get the result or catch the error
                                        marchAmount = _a.sent();
                                        console.log('Total amount for March:', marchAmount);
                                        return [3 /*break*/, 14];
                                    case 13:
                                        error_5 = _a.sent();
                                        console.error('Failed to fetch amount:', error_5);
                                        return [3 /*break*/, 14];
                                    case 14:
                                        aprilAmount = 0;
                                        _a.label = 15;
                                    case 15:
                                        _a.trys.push([15, 17, , 18]);
                                        return [4 /*yield*/, dispatch(fetchAprilAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 16:
                                        // Directly use unwrap to get the result or catch the error
                                        aprilAmount = _a.sent();
                                        console.log('Total amount for april:', aprilAmount);
                                        return [3 /*break*/, 18];
                                    case 17:
                                        error_6 = _a.sent();
                                        console.error('Failed to fetch amount:', error_6);
                                        return [3 /*break*/, 18];
                                    case 18:
                                        mayAmount = 0;
                                        _a.label = 19;
                                    case 19:
                                        _a.trys.push([19, 21, , 22]);
                                        return [4 /*yield*/, dispatch(fetchMayAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 20:
                                        // Directly use unwrap to get the result or catch the error
                                        mayAmount = _a.sent();
                                        console.log('Total amount for may:', mayAmount);
                                        return [3 /*break*/, 22];
                                    case 21:
                                        error_7 = _a.sent();
                                        console.error('Failed to fetch amount:', error_7);
                                        return [3 /*break*/, 22];
                                    case 22:
                                        juneAmount = 0;
                                        _a.label = 23;
                                    case 23:
                                        _a.trys.push([23, 25, , 26]);
                                        return [4 /*yield*/, dispatch(fetchJuneAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 24:
                                        // Directly use unwrap to get the result or catch the error
                                        juneAmount = _a.sent();
                                        console.log('Total amount for june:', juneAmount);
                                        return [3 /*break*/, 26];
                                    case 25:
                                        error_8 = _a.sent();
                                        console.error('Failed to fetch amount:', error_8);
                                        return [3 /*break*/, 26];
                                    case 26:
                                        julyAmount = 0;
                                        _a.label = 27;
                                    case 27:
                                        _a.trys.push([27, 29, , 30]);
                                        return [4 /*yield*/, dispatch(fetchJulyAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 28:
                                        // Directly use unwrap to get the result or catch the error
                                        julyAmount = _a.sent();
                                        console.log('Total amount for july:', julyAmount);
                                        return [3 /*break*/, 30];
                                    case 29:
                                        error_9 = _a.sent();
                                        console.error('Failed to fetch amount:', error_9);
                                        return [3 /*break*/, 30];
                                    case 30:
                                        augustAmount = 0;
                                        _a.label = 31;
                                    case 31:
                                        _a.trys.push([31, 33, , 34]);
                                        return [4 /*yield*/, dispatch(fetchAugustAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 32:
                                        // Directly use unwrap to get the result or catch the error
                                        augustAmount = _a.sent();
                                        console.log('Total amount for august:', augustAmount);
                                        return [3 /*break*/, 34];
                                    case 33:
                                        error_10 = _a.sent();
                                        console.error('Failed to fetch amount:', error_10);
                                        return [3 /*break*/, 34];
                                    case 34:
                                        septemberAmount = 0;
                                        _a.label = 35;
                                    case 35:
                                        _a.trys.push([35, 37, , 38]);
                                        return [4 /*yield*/, dispatch(fetchSeptemberAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 36:
                                        // Directly use unwrap to get the result or catch the error
                                        septemberAmount = _a.sent();
                                        console.log('Total amount for september:', septemberAmount);
                                        return [3 /*break*/, 38];
                                    case 37:
                                        error_11 = _a.sent();
                                        console.error('Failed to fetch amount:', error_11);
                                        return [3 /*break*/, 38];
                                    case 38:
                                        octoberAmount = 0;
                                        _a.label = 39;
                                    case 39:
                                        _a.trys.push([39, 41, , 42]);
                                        return [4 /*yield*/, dispatch(fetchOctoberAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 40:
                                        // Directly use unwrap to get the result or catch the error
                                        octoberAmount = _a.sent();
                                        console.log('Total amount for october:', octoberAmount);
                                        return [3 /*break*/, 42];
                                    case 41:
                                        error_12 = _a.sent();
                                        console.error('Failed to fetch amount:', error_12);
                                        return [3 /*break*/, 42];
                                    case 42:
                                        novemberAmount = 0;
                                        _a.label = 43;
                                    case 43:
                                        _a.trys.push([43, 45, , 46]);
                                        return [4 /*yield*/, dispatch(fetchNovemberAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 44:
                                        // Directly use unwrap to get the result or catch the error
                                        novemberAmount = _a.sent();
                                        console.log('Total amount for november:', novemberAmount);
                                        return [3 /*break*/, 46];
                                    case 45:
                                        error_13 = _a.sent();
                                        console.error('Failed to fetch amount:', error_13);
                                        return [3 /*break*/, 46];
                                    case 46:
                                        decemberAmount = 0;
                                        _a.label = 47;
                                    case 47:
                                        _a.trys.push([47, 49, , 50]);
                                        return [4 /*yield*/, dispatch(fetchDecemberAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 48:
                                        // Directly use unwrap to get the result or catch the error
                                        decemberAmount = _a.sent();
                                        console.log('Total amount for december:', decemberAmount);
                                        return [3 /*break*/, 50];
                                    case 49:
                                        error_14 = _a.sent();
                                        console.error('Failed to fetch amount:', error_14);
                                        return [3 /*break*/, 50];
                                    case 50:
                                        totalReceiptToDate = januaryAmount + // Assuming value is the property holding the number
                                            februaryAmount +
                                            marchAmount +
                                            aprilAmount +
                                            mayAmount +
                                            juneAmount +
                                            julyAmount +
                                            augustAmount +
                                            septemberAmount +
                                            octoberAmount +
                                            novemberAmount +
                                            decemberAmount;
                                        console.log('totalReceiptToDate: ', totalReceiptToDate);
                                        balance = valueOfBillsDistributed - totalReceiptToDate;
                                        console.log('balance: ', balance);
                                        remarks = (valueOfBillsDistributed > 0) ? (totalReceiptToDate / valueOfBillsDistributed) * 100 : 0;
                                        console.log('remarks: ', remarks);
                                        createClientsServedParams = {
                                            officerNo: officerNo, // Assumes officerNo is a string defined elsewhere
                                            fiscalYear: fiscalYearValue, // Use 'fiscalYear'
                                            noOfClientsServed: noOfClientsServed, // Must be defined as a number
                                            valueOfBillsDistributed: valueOfBillsDistributed, // Must be defined as a number
                                            JanuaryAmount: januaryAmount, // Use PascalCase
                                            FebruaryAmount: februaryAmount,
                                            MarchAmount: marchAmount,
                                            AprilAmount: aprilAmount,
                                            MayAmount: mayAmount,
                                            JuneAmount: juneAmount,
                                            JulyAmount: julyAmount,
                                            AugustAmount: augustAmount,
                                            SeptemberAmount: septemberAmount,
                                            OctoberAmount: octoberAmount,
                                            NovemberAmount: novemberAmount,
                                            DecemberAmount: decemberAmount,
                                            totalReceiptToDate: totalReceiptToDate, // Must be defined as a number
                                            balance: balance, // Must be defined as a number
                                            remarks: remarks,
                                        };
                                        console.log('createClientsServedParams processed values: ', createClientsServedParams);
                                        return [4 /*yield*/, dispatch(createClientsServed(createClientsServedParams)).unwrap()];
                                    case 51:
                                        answer = _a.sent();
                                        console.log('answer: ', answer);
                                        alert(answer);
                                        console.log('All data fetched and processed.');
                                        // Set to trigger fetching chart data
                                        setShouldFetchChartData(true);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.log('No data available or response structure is invalid.');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error processing preview:", error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        navigate('/main');
    };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("p", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstFiscalYear", children: [_jsx(Form.Label, { children: "First Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: firstFiscalYear, onChange: handleFirstFiscalYearChange, placeholder: "Enter a fiscal year" })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstOfficer", children: [_jsxs(Form.Label, { children: ["First Officer:   ", _jsx("p", { style: { textDecoration: 'underline', color: '#0000C0' }, children: firstOfficer })] }), _jsxs(Form.Control, { as: "select", value: firstOfficer, onChange: handleFirstOfficerChange, children: [_jsx("option", { value: "", children: "Select an officer" }), officersData.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.officer_name), children: [officer.officer_no, "  ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(OfficerAssessmentBarChart, { data: chartData }) }) })] }));
};
export default FrmOfficerAssessment;
