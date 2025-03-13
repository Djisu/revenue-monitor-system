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
import { fetchJanuaryAmount, fetchClientsServed, fetchBillsDistributed } from './officerAssessmentSlice';
import { fetchOfficerBudget } from '../officerBudget/officerBudgetSlice';
var FrmOfficerAssessment = function () {
    var dispatch = useAppDispatch();
    var navigate = useNavigate();
    var _a = useState(""), firstFiscalYear = _a[0], setFirstFiscalYear = _a[1]; // Initialize as an empty string
    var _b = useState(''), firstOfficer = _b[0], setFirstOfficer = _b[1];
    //let [fiscalYears, setFiscalYears] = useState<FiscalYearsParam[]>([]);
    //const [selectedOfficerName, setSelectedOfficerName] = useState('');
    var officersData = useAppSelector(function (state) { return state.officer.officers; });
    // const fiscalYearsData: FiscalYear[] = useAppSelector((state) => state.officerAssessment.fiscalYears);    //.officerAssessment?.bus_year || []);
    // console.log("Selected Fiscal Year:", firstFiscalYear);
    // console.log("Fiscal Years Data:", fiscalYearsData);
    // useEffect(() => {
    //   console.log('Officers Data Updated:', officersData); 
    // }, [fiscalYearsData]);
    // Use this effect to log the updated state after it changes
    // useEffect(() => {
    //   console.log("Updated firstOfficer:", firstOfficer);
    // }, [firstOfficer]);
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
    // Fetch fiscal years
    // const fetchFiscalYearsData = async () => {
    //   try {
    //       // Dispatch the thunk
    //       const resultAction = await dispatch(fetchFiscalYears())  //.unwrap();
    //       console.log("resultAction:", resultAction)
    //      // Check if the response indicates that the data exists
    //           if (resultAction.payload) {
    //             // Data was successfully fetched
    //             console.log('resultAction.payload:', resultAction.payload);
    //             // You can further process the budget data here
    //           } else {
    //             // Handle the case where the data doesn't exist
    //             console.error("No budget data found for the officer:", resultAction);
    //             alert("No budget data found for the officer.");
    //           }
    //   } catch (error) {
    //       console.error("Error fetching fiscal years:", error);
    //       const currentYear = new Date().getFullYear();
    //       alert(`No officer budget details entered FOR the year ${currentYear}`);
    //   }
    // };
    // const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
    //   const target = event.target as HTMLSelectElement; 
    //   console.log("target.value:", target.value);
    //   setFirstOfficer(target.value.split(' ')[0]);
    //    console.log("firstOfficer:", firstOfficer);
    // };
    // const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
    //   const target = event.target as HTMLSelectElement;
    //   const selectedOfficer = target.value.split(' ')[0];
    //   setFirstOfficer(selectedOfficer);
    // };
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
        var budgetResponse, error_1;
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
                            var officerNo, officerName, fiscalYearValue, noOfClientsServed, valueOfBillsDistributed, januaryAmount;
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
                                        return [4 /*yield*/, dispatch(fetchClientsServed({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 1:
                                        noOfClientsServed = _a.sent();
                                        console.log('noOfClientsServed: ', noOfClientsServed);
                                        return [4 /*yield*/, dispatch(fetchBillsDistributed({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 2:
                                        valueOfBillsDistributed = _a.sent();
                                        console.log('valueOfBillsDistributed: ', valueOfBillsDistributed);
                                        return [4 /*yield*/, dispatch(fetchJanuaryAmount({ officerNo: officerNo, fiscalYear: fiscalYearValue })).unwrap()];
                                    case 3:
                                        januaryAmount = _a.sent();
                                        console.log('januaryAmount: ', januaryAmount);
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
                    error_1 = _a.sent();
                    console.error("Error processing preview:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        navigate('/main');
    };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("p", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstFiscalYear", children: [_jsx(Form.Label, { children: "First Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: firstFiscalYear, onChange: handleFirstFiscalYearChange, placeholder: "Enter a fiscal year" })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formFirstOfficer", children: [_jsxs(Form.Label, { children: ["First Officer:   ", _jsx("p", { style: { textDecoration: 'underline', color: '#0000C0' }, children: firstOfficer })] }), _jsxs(Form.Control, { as: "select", value: firstOfficer, onChange: handleFirstOfficerChange, children: [_jsx("option", { value: "", children: "Select an officer" }), officersData.map(function (officer) { return (_jsxs("option", { value: "".concat(officer.officer_no, " ").concat(officer.officer_name), children: [officer.officer_no, "  ", officer.officer_name] }, officer.officer_no)); })] })] }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview Monitoring Report (Monthly)" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Button, { variant: "secondary", onClick: handleExitClick, children: "Exit" }) }) })] }));
};
export default FrmOfficerAssessment;
