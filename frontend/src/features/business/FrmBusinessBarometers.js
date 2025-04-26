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
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
var BusinessBarometersForm = function () {
    var _a = useState(''), bussNo = _a[0], setBussNo = _a[1];
    var _b = useState(''), businessName = _b[0], setBusinessName = _b[1];
    var _c = useState(''), businessType = _c[0], setBusinessType = _c[1];
    var _d = useState(0), strategicGrade = _d[0], setStrategicGrade = _d[1];
    var _e = useState(0), productGrade = _e[0], setProductGrade = _e[1];
    var _f = useState(0), busPopGrade = _f[0], setBusPopGrade = _f[1];
    var _g = useState(0), busEnvGrade = _g[0], setBusEnvGrade = _g[1];
    var _h = useState(0), sizeGrade = _h[0], setSizeGrade = _h[1];
    var _j = useState(0), noGrade = _j[0], setNoGrade = _j[1];
    var _k = useState(0), busOpeGrade = _k[0], setBusOpeGrade = _k[1];
    var _l = useState(0), comAvaGrade = _l[0], setComAvaGrade = _l[1];
    // @ts-ignore
    var _m = useState(0), totalMarks = _m[0], setTotalMarks = _m[1];
    var _o = useState([]), businesses = _o[0], setBusinesses = _o[1];
    var _p = useState([]), businessTypesList = _p[0], setBusinessTypesList = _p[1];
    useEffect(function () {
        // Fetch business types
        var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get('/api/business-types')];
                    case 1:
                        response = _a.sent();
                        setBusinessTypesList(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching business types:", error_1);
                        alert("No business types found");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Populate ListView on form load
        var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get('/api/businesses')];
                    case 1:
                        response = _a.sent();
                        setBusinesses(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error fetching businesses:", error_2);
                        alert("No records found to feed the listview");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Update current rate on form load
        var updateCurrentRate = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.post('/api/update-current-rate')];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error updating current rate:", error_3);
                        alert("Error updating current rate");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchBusinessTypes();
        populateListView();
        updateCurrentRate();
    }, []);
    // const handleStrategicGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setStrategicGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleProductGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setProductGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleBusPopGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setBusPopGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleBusEnvGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setBusEnvGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleSizeGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setSizeGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleNoGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setNoGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleBusOpeGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setBusOpeGrade(value);
    //   calculateTotalMarks();
    // };
    // const handleComAvaGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = parseInt(event.target.value, 10);
    //   setComAvaGrade(value);
    //   calculateTotalMarks();
    // };
    // const calculateTotalMarks = () => {
    //   const totMarks = strategicGrade + productGrade + busPopGrade + busEnvGrade + sizeGrade + noGrade + busOpeGrade + comAvaGrade;
    //   setTotalMarks(totMarks);
    // };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!bussNo || !strategicGrade || !productGrade || !busPopGrade || !busEnvGrade || !sizeGrade || !noGrade || !busOpeGrade || !comAvaGrade) {
                        alert("ENTER ALL FIELDS");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-business', {
                            buss_no: bussNo,
                            buss_name: businessName,
                            buss_type: businessType,
                            strategiclocation: strategicGrade,
                            productvariety: productGrade,
                            businesspopularity: busPopGrade,
                            businessenvironment: busEnvGrade,
                            sizeofbusiness: sizeGrade,
                            numberofworkingdays: noGrade,
                            businessoperatingperiod: busOpeGrade,
                            competitorsavailable: comAvaGrade,
                            totalmarks: totalMarks
                        })];
                case 2:
                    response = _a.sent();
                    alert(response.data.message);
                    populateListView();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error adding business:", error_4);
                    alert("Error adding business");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!bussNo || !strategicGrade || !productGrade || !busPopGrade || !busEnvGrade || !sizeGrade || !noGrade || !busOpeGrade || !comAvaGrade) {
                        alert("ENTER ALL FIELDS");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/edit-business', {
                            buss_no: bussNo,
                            strategiclocation: strategicGrade,
                            productvariety: productGrade,
                            businesspopularity: busPopGrade,
                            businessenvironment: busEnvGrade,
                            sizeofbusiness: sizeGrade,
                            numberofworkingdays: noGrade,
                            businessoperatingperiod: busOpeGrade,
                            competitorsavailable: comAvaGrade,
                            totalmarks: totalMarks
                        })];
                case 2:
                    response = _a.sent();
                    alert(response.data.message);
                    populateListView();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error("Error editing business:", error_5);
                    alert("Error editing business");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleBarometersClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var businessesResponse, _i, _a, business, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    // Clear temporary tables
                    return [4 /*yield*/, axios.delete('/api/tmp-business')];
                case 1:
                    // Clear temporary tables
                    _b.sent();
                    return [4 /*yield*/, axios.get('/api/businesses')];
                case 2:
                    businessesResponse = _b.sent();
                    _i = 0, _a = businessesResponse.data;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    business = _a[_i];
                    return [4 /*yield*/, axios.post('/api/tmp-business', business)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // Open the report file
                    window.open('/report/BUSINESS RANKINGS.rpt', '_blank');
                    alert("Processing completed");
                    return [3 /*break*/, 8];
                case 7:
                    error_6 = _b.sent();
                    console.error("Error processing barometers:", error_6);
                    alert("Error processing barometers");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleLoadClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                populateListView();
            }
            catch (error) {
                console.error("Error loading spreadsheet:", error);
                alert("Error loading spreadsheet");
            }
            return [2 /*return*/];
        });
    }); };
    var handleExitClick = function () {
        // Assuming you have a way to navigate back to the main page
        window.location.href = '/'; // Redirect to main page or wherever you want
    };
    var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/businesses')];
                case 1:
                    response = _a.sent();
                    setBusinesses(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error("Error fetching businesses:", error_7);
                    alert("No records found to feed the listview");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { fluid: true, className: "bg-light", children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h2", { style: { textDecoration: 'underline', color: '#0000C0' }, children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx("h3", { children: "Collector's Business Barometers" }) }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Number:" }), _jsx(Form.Control, { type: "text", value: bussNo, onChange: function (e) { return setBussNo(e.target.value); } })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: businessName, onChange: function (e) { return setBusinessName(e.target.value); } })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Type:" }), _jsxs(Form.Select, { value: businessType, onChange: function (e) { return setBusinessType(e.target.value); }, children: [_jsx("option", { value: "", children: "Select a business type" }), businessTypesList.map(function (type) { return (_jsx("option", { value: type.buss_type, children: type.buss_type }, type.buss_type)); })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Strategic Location:" }), _jsx(Form.Check, { type: "radio", label: "Excellent", name: "strategic", onChange: function () { return setStrategicGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "Very Good", name: "strategic", onChange: function () { return setStrategicGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "Good", name: "strategic", onChange: function () { return setStrategicGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "Average", name: "strategic", onChange: function () { return setStrategicGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "L-Average", name: "strategic", onChange: function () { return setStrategicGrade(5); } }), _jsx(Form.Control, { type: "text", value: strategicGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Product Variety:" }), _jsx(Form.Check, { type: "radio", label: "Excellent", name: "product", onChange: function () { return setProductGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "Very Good", name: "product", onChange: function () { return setProductGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "Good", name: "product", onChange: function () { return setProductGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "Average", name: "product", onChange: function () { return setProductGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "L-Average", name: "product", onChange: function () { return setProductGrade(5); } }), _jsx(Form.Control, { type: "text", value: productGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Popularity:" }), _jsx(Form.Check, { type: "radio", label: "Best", name: "busPop", onChange: function () { return setBusPopGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "Better", name: "busPop", onChange: function () { return setBusPopGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "Good", name: "busPop", onChange: function () { return setBusPopGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "Average", name: "busPop", onChange: function () { return setBusPopGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "L-Average", name: "busPop", onChange: function () { return setBusPopGrade(5); } }), _jsx(Form.Control, { type: "text", value: busPopGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Environment:" }), _jsx(Form.Check, { type: "radio", label: "Excellent", name: "busEnv", onChange: function () { return setBusEnvGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "Very Good", name: "busEnv", onChange: function () { return setBusEnvGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "Good", name: "busEnv", onChange: function () { return setBusEnvGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "Average", name: "busEnv", onChange: function () { return setBusEnvGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "L-Average", name: "busEnv", onChange: function () { return setBusEnvGrade(5); } }), _jsx(Form.Control, { type: "text", value: busEnvGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Size Of Business:" }), _jsx(Form.Check, { type: "radio", label: "XX-Large", name: "size", onChange: function () { return setSizeGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "X-Large", name: "size", onChange: function () { return setSizeGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "Large", name: "size", onChange: function () { return setSizeGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "Medium", name: "size", onChange: function () { return setSizeGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "Small", name: "size", onChange: function () { return setSizeGrade(5); } }), _jsx(Form.Control, { type: "text", value: sizeGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Number Of Working Days:" }), _jsx(Form.Check, { type: "radio", label: "7 Days", name: "workingDays", onChange: function () { return setNoGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "6 Days", name: "workingDays", onChange: function () { return setNoGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "5 Days", name: "workingDays", onChange: function () { return setNoGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "4 Days", name: "workingDays", onChange: function () { return setNoGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "3 Days", name: "workingDays", onChange: function () { return setNoGrade(5); } }), _jsx(Form.Control, { type: "text", value: noGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Operating Period:" }), _jsx(Form.Check, { type: "radio", label: "24 Hours", name: "busOpe", onChange: function () { return setBusOpeGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "18 Hours", name: "busOpe", onChange: function () { return setBusOpeGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "12 Hours", name: "busOpe", onChange: function () { return setBusOpeGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "8 Hours", name: "busOpe", onChange: function () { return setBusOpeGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "6 Hours", name: "busOpe", onChange: function () { return setBusOpeGrade(5); } }), _jsx(Form.Control, { type: "text", value: busOpeGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Competitors Available:" }), _jsx(Form.Check, { type: "radio", label: "Pure Mono", name: "comAva", onChange: function () { return setComAvaGrade(1); } }), _jsx(Form.Check, { type: "radio", label: "Mono(3)", name: "comAva", onChange: function () { return setComAvaGrade(2); } }), _jsx(Form.Check, { type: "radio", label: "Moderate(2)", name: "comAva", onChange: function () { return setComAvaGrade(3); } }), _jsx(Form.Check, { type: "radio", label: "Fierce(1)", name: "comAva", onChange: function () { return setComAvaGrade(4); } }), _jsx(Form.Check, { type: "radio", label: "Not Applicable(0)", name: "comAva", onChange: function () { return setComAvaGrade(5); } }), _jsx(Form.Control, { type: "text", value: comAvaGrade, readOnly: true })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Total Marks:" }), _jsx(Form.Control, { type: "text", value: totalMarks, readOnly: true })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "warning", onClick: handleEditClick, children: "Re-evaluate Client" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "info", onClick: handleBarometersClick, children: "View Business Barometers" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "success", onClick: handleLoadClick, children: "Load Spreadsheet" }) }), _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Exit" }) })] }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Frame1, { businesses: businesses }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
var Frame1 = function (_a) {
    var businesses = _a.businesses;
    return (_jsxs("div", { className: "border p-3 mt-3", children: [_jsx("h4", { children: "Activity" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" }), _jsx("th", { children: "BUSS TYPE" }), _jsx("th", { children: "PERMIT NO" }), _jsx("th", { children: "STREET NAME" }), _jsx("th", { children: "LANDMARK" }), _jsx("th", { children: "ELECTORAL AREA" }), _jsx("th", { children: "PROPERTY CLASS" }), _jsx("th", { children: "GRADE" }), _jsx("th", { children: "OWNER" }), _jsx("th", { children: "TEL NO" }), _jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "TRANSDATE" }), _jsx("th", { children: "STATUS" }), _jsx("th", { children: "SERIALNO" }), _jsx("th", { children: "CURRENT RATE" }), _jsx("th", { children: "PROPERTY RATE" })] }) }), _jsx("tbody", { children: businesses.map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.buss_no }), _jsx("td", { children: business.buss_name }), _jsx("td", { children: business.buss_type }), _jsx("td", { children: business.permit_no }), _jsx("td", { children: business.street_name }), _jsx("td", { children: business.landmark }), _jsx("td", { children: business.electoral_area }), _jsx("td", { children: business.property_class }), _jsx("td", { children: business.grade }), _jsx("td", { children: business.owner }), _jsx("td", { children: business.tel_no }), _jsx("td", { children: business.officer_no }), _jsx("td", { children: business.transdate }), _jsx("td", { children: business.status }), _jsx("td", { children: business.serialno }), _jsx("td", { children: business.current_rate.toLocaleString() }), _jsx("td", { children: business.property_rate.toLocaleString() })] }, business.buss_no)); }) })] })] }));
};
export default BusinessBarometersForm;
