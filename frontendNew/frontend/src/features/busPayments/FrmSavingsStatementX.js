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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import { fetchBusinessById } from "../business/businessSlice";
import { fetchBusPaymentByTwoDates, fetchTransSavings } from "./busPaymentsSlice";
var FrmSavingsStatementX = function () {
    var _a = useState(""), bussNo = _a[0], setBussNo = _a[1];
    var _b = useState(""), startDate = _b[0], setStartDate = _b[1];
    var _c = useState(""), endDate = _c[0], setEndDate = _c[1];
    var _d = useState(""), businessName = _d[0], setBusinessName = _d[1];
    var _e = useState([]), records = _e[0], setRecords = _e[1];
    var _f = useState(""), errorMessage = _f[0], setErrorMessage = _f[1];
    var _g = useState(""), successMessage = _g[0], setSuccessMessage = _g[1];
    var dispatch = useAppDispatch();
    var navigate = useNavigate(); // Initialize the useNavigate hook
    useEffect(function () {
        // Set default end date to today
        // setEndDate(new Date().toLocaleDateString("en-GB"));
    }, []);
    var handleBussNoChange = function (e) {
        setBussNo(e.target.value);
    };
    var handleStartDateChange = function (event) {
        var selectedDate = event.target.value; // This should be 'YYYY-MM-DD'
        setStartDate(selectedDate); // Assuming you want to keep it in that format
    };
    var handleEndDateChange = function (event) {
        var selectedDate = event.target.value; // This should be 'YYYY-MM-DD'
        setEndDate(selectedDate); // Again, keeping it in that format
    };
    // const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const formattedDate = formatDate(event.target.value);
    //     setStartDate(formattedDate);
    // };
    // const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const formattedDate = formatDate(event.target.value);
    //     setEndDate(formattedDate);
    // };
    var handlePreviewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, fetchedRecords, dates, transSavingsData, fetchedTransSavings, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in handlePreviewClick');
                    setSuccessMessage("");
                    setErrorMessage("");
                    if (!bussNo) {
                        alert("Select a business number");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, dispatch(fetchBusPaymentByTwoDates({
                            bussNo: bussNo,
                            startDate: new Date(startDate),
                            endDate: new Date(endDate)
                        }))];
                case 2:
                    response = _a.sent();
                    if (!fetchBusPaymentByTwoDates.fulfilled.match(response)) return [3 /*break*/, 4];
                    fetchedRecords = response.payload;
                    console.log('fetchedRecords:', fetchedRecords);
                    // Update records state
                    setRecords(fetchedRecords);
                    dates = fetchedRecords.map(function (rec) { return rec.transdate; });
                    //setDates(dates);
                    console.log('dates:', dates);
                    // Set a success message if needed
                    setSuccessMessage("Payment records fetched successfully");
                    return [4 /*yield*/, dispatch(fetchTransSavings())];
                case 3:
                    transSavingsData = _a.sent();
                    console.log('transSavingsData:', transSavingsData);
                    // Update records state
                    if (fetchTransSavings.fulfilled.match(transSavingsData)) {
                        fetchedTransSavings = transSavingsData.payload;
                        console.log('fetchedTransSavings:', fetchedTransSavings);
                        // Update records state
                        setRecords(fetchedTransSavings);
                    }
                    else {
                        throw new Error('Failed to fetch bus payments');
                    }
                    return [3 /*break*/, 5];
                case 4: throw new Error('Failed to fetch bus payments');
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error fetching dates", error_1);
                    setErrorMessage("Error fetching payment records. Please try again.");
                    alert("No payment records found for the selected dates");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var getBusiness = function (businessNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in getBusiness');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(fetchBusinessById(Number(businessNo))).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log('Response from slice:', response.data);
                    if (response) {
                        console.log('there is response:', response.data);
                        setBusinessName(response.data.buss_name);
                        console.log(businessName);
                    }
                    else {
                        console.log('data not found');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error fetching business:', error_2);
                    errorMessage = 'Error fetching business. Please try again.';
                    setErrorMessage(errorMessage);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // const formatDate = (dateString: string): string => {
    //     const [day, month, year] = dateString.split("/");
    //     return `${year}-${month}-${day}`; // Convert to "YYYY-MM-DD"
    // };
    return (_jsx(Container, { children: _jsxs(Row, { children: [_jsxs(Col, { children: [_jsx("p", { children: "Savings Statement" }), errorMessage && _jsx("div", { className: "text-danger", children: errorMessage }), successMessage && _jsx("div", { className: "text-success", children: successMessage }), _jsx("hr", {}), _jsxs(Form.Group, { controlId: "formLoanNo", children: [_jsx(Form.Label, { children: "Business Number" }), _jsx("input", { type: "number", value: bussNo, onChange: handleBussNoChange, onBlur: function (e) { return getBusiness(e.target.value); }, required: true, placeholder: "Enter Business Number" })] }), _jsxs(Form.Group, { controlId: "formBusinessName", children: [_jsx(Form.Label, { children: "Name" }), _jsx(Form.Control, { type: "text", value: businessName, readOnly: true })] }), _jsxs(Form.Group, { controlId: "formStartDate", children: [_jsx(Form.Label, { children: "Start Date" }), _jsx(Form.Control, { type: "date", value: startDate, onChange: handleStartDateChange, required: true })] }), _jsxs(Form.Group, { controlId: "formEndDate", children: [_jsx(Form.Label, { children: "End Date" }), _jsx(Form.Control, { type: "date", value: endDate, onChange: handleEndDateChange, required: true })] })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { className: "d-flex justify-content-between", children: [_jsx(Button, { variant: "primary", onClick: handlePreviewClick, children: "Preview" }), _jsx(Button, { variant: "secondary", onClick: function () { return navigate("/main"); }, children: "Go Back" })] }) }), _jsx(Col, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business Number" }), _jsx("th", { children: "Date" }), _jsx("th", { children: "Details" }), _jsx("th", { children: "Debit" }), _jsx("th", { children: "Credit" }), _jsx("th", { children: "Balance" })] }) }), _jsx("tbody", { children: records.map(function (rec, index) { return (_jsxs("tr", { children: [_jsx("td", { children: rec.buss_no }), _jsx("td", { children: rec.transdate }), _jsx("td", { children: rec.details }), _jsx("td", { children: rec.debit }), _jsx("td", { children: rec.credit }), _jsx("td", { children: rec.balance })] }, index)); }) })] }) })] }) }));
};
export default FrmSavingsStatementX;
