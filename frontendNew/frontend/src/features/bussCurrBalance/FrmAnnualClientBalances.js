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
import axios from 'axios'; // For making HTTP requests
import { Button, Form, Table } from 'react-bootstrap'; // Bootstrap components
var PropertyBillPayments = function (_a) {
    var MDImain = _a.MDImain;
    var _b = useState(''), cboBussType = _b[0], setCboBussType = _b[1];
    var _c = useState(''), cboZone = _c[0], setCboZone = _c[1];
    var _d = useState(''), cboFirstDate = _d[0], setCboFirstDate = _d[1];
    var _e = useState(''), cboLastDate = _e[0], setCboLastDate = _e[1];
    var _f = useState([]), lstViewItems = _f[0], setListViewItems = _f[1];
    var _g = useState([]), zones = _g[0], setZones = _g[1];
    useEffect(function () {
        setListViewItems([]);
        // Fetch zones for ComboBox
        var fetchZones = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get('http://your-api-url/get-zones', {
                                params: {
                                    dsn: 'dsnSaltpond',
                                    uid: 'sa',
                                    pwd: 'Timbuk2tu'
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        setZones(response.data.map(function (zone) { return zone.buss_type; }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        alert("Error in fetching zones: ".concat(error_1.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchZones();
    }, []);
    var cmdExitClick = function () {
        // Hide the current form and show the main form
        if (MDImain.current) {
            MDImain.current.show();
        }
    };
    var cmdViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var recSource, recResponse, recData, _i, recData_1, rec, varCurrRate, varPayment, recSummResponse1, recSummData1, recSummResponse2, recSummData2, recSummResponse3, recSummData3, val2014Balance, recSummResponse4, recSummData4, varBussType, recSummResponse5, recSummData5, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, 13, 14]);
                    // Set the screen pointer to hourglass
                    document.body.style.cursor = 'wait';
                    // Clear previous data
                    return [4 /*yield*/, axios.delete('http://your-api-url/delete-tb-BusTypeDetailedReport', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu'
                            }
                        })];
                case 1:
                    // Clear previous data
                    _a.sent();
                    recSource = "set dateformat dmy select electroral_area,buss_no,buss_name, buss_type,current_rate,Tot_grade from tb_Business where status='Active' order by electroral_area asc";
                    if (cboZone) {
                        recSource = "set dateformat dmy select electroral_area,buss_no,buss_name, buss_type,current_rate,Tot_grade from tb_Business where buss_type=convert(varchar(50),'".concat(cboZone, "') and status='Active' order by electroral_area asc");
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tb_Business', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                sql: recSource
                            }
                        })];
                case 2:
                    recResponse = _a.sent();
                    recData = recResponse.data;
                    if (recData.length === 0) {
                        alert("No records found");
                        return [2 /*return*/];
                    }
                    _i = 0, recData_1 = recData;
                    _a.label = 3;
                case 3:
                    if (!(_i < recData_1.length)) return [3 /*break*/, 10];
                    rec = recData_1[_i];
                    varCurrRate = 0;
                    varPayment = 0;
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tb_BussCurrBalance', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                buss_no: rec.buss_no
                            }
                        })];
                case 4:
                    recSummResponse1 = _a.sent();
                    recSummData1 = recSummResponse1.data;
                    if (recSummData1.length > 0 && recSummData1[0].totsum) {
                        varCurrRate = recSummData1[0].totsum;
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tb_busPayments', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                buss_no: rec.buss_no
                            }
                        })];
                case 5:
                    recSummResponse2 = _a.sent();
                    recSummData2 = recSummResponse2.data;
                    if (recSummData2.length > 0 && recSummData2[0].totpayments) {
                        varPayment = recSummData2[0].totpayments;
                    }
                    else {
                        varPayment = 0;
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tb_business', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                buss_no: rec.buss_no
                            }
                        })];
                case 6:
                    recSummResponse3 = _a.sent();
                    recSummData3 = recSummResponse3.data;
                    val2014Balance = 0;
                    if (recSummData3.length > 0 && recSummData3[0].balance) {
                        val2014Balance = recSummData3[0].balance;
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tb_business', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                buss_no: rec.buss_no
                            }
                        })];
                case 7:
                    recSummResponse4 = _a.sent();
                    recSummData4 = recSummResponse4.data;
                    varBussType = recSummData4.length > 0 ? recSummData4[0].buss_type : '';
                    // Insert into detailed report table
                    return [4 /*yield*/, axios.post('http://your-api-url/insert-tb_BusTypeDetailedReport', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu',
                            electroral_area: rec.electroral_area,
                            buss_no: rec.buss_no,
                            buss_name: rec.buss_name,
                            buss_type: rec.buss_type,
                            balance2014: val2014Balance,
                            amountdue: varCurrRate,
                            amountpaid: varPayment,
                            balance: val2014Balance + varCurrRate - varPayment,
                            Tot_grade: varBussType
                        })];
                case 8:
                    // Insert into detailed report table
                    _a.sent();
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10: return [4 /*yield*/, axios.get('http://your-api-url/get-tb_BusTypeDetailedReport', {
                        params: {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu'
                        }
                    })];
                case 11:
                    recSummResponse5 = _a.sent();
                    recSummData5 = recSummResponse5.data;
                    if (recSummData5.length > 0) {
                        // Assuming frmDisplay.CrystalReport1 is a component or method to display the report
                        // This part will depend on your actual implementation
                        alert("This is the report");
                    }
                    else {
                        alert("No records found in detailed report Error in operations");
                    }
                    return [3 /*break*/, 14];
                case 12:
                    error_2 = _a.sent();
                    console.error(error_2);
                    alert("Error in operations: ".concat(error_2.message));
                    return [3 /*break*/, 14];
                case 13:
                    // Set the screen pointer back to default
                    document.body.style.cursor = 'default';
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "container-fluid", style: { backgroundColor: '#FFC0C0', height: '100vh', paddingTop: '20px' }, children: [_jsx("h3", { className: "text-center", children: "Annual Client Balances" }), _jsxs("div", { className: "row mb-3", children: [_jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "Electoral Area" }), _jsxs(Form.Control, { as: "select", value: cboZone, onChange: function (e) { return setCboZone(e.target.value); }, style: { width: '300px' }, children: [_jsx("option", { value: "", children: "Select Zone" }), zones.map(function (zone, index) { return (_jsx("option", { value: zone, children: zone }, index)); })] }), _jsx(Form.Text, { className: "text-right text-muted", style: { display: 'none' }, children: "Empty means all Electoral Area" })] }), _jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "Business Type/Profession" }), _jsx(Form.Control, { as: "select", value: cboBussType, onChange: function (e) { return setCboBussType(e.target.value); }, style: { width: '300px', display: 'none' }, children: _jsx("option", { value: "", children: "Select Business Type" }) }), _jsx(Form.Text, { className: "text-right text-muted", style: { display: 'none' }, children: "Empty means all Business Type/Profession" })] })] }), _jsxs("div", { className: "row mb-3", children: [_jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "First Payment Date" }), _jsx(Form.Control, { as: "select", value: cboFirstDate, onChange: function (e) { return setCboFirstDate(e.target.value); }, style: { width: '300px', display: 'none' }, children: _jsx("option", { value: "", children: "Select Date" }) })] }), _jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "Last Payment Date" }), _jsx(Form.Control, { as: "select", value: cboLastDate, onChange: function (e) { return setCboLastDate(e.target.value); }, style: { width: '300px', display: 'none' }, children: _jsx("option", { value: "", children: "Select Date" }) })] })] }), _jsxs("div", { className: "row mb-3", children: [_jsx("div", { className: "col-md-6", children: _jsx(Button, { variant: "primary", onClick: cmdViewClick, style: { width: '395px' }, children: "Produce Report" }) }), _jsx("div", { className: "col-md-6", children: _jsx(Button, { variant: "danger", onClick: cmdExitClick, style: { width: '395px' }, children: "Exit" }) })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business No" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type" }), _jsx("th", { children: "Current Rate" }), _jsx("th", { children: "Total Grade" })] }) }), _jsx("tbody", { children: lstViewItems.map(function (item, index) { return (_jsxs("tr", { children: [_jsx("td", { children: item.electroral_area }), _jsx("td", { children: item.buss_no }), _jsx("td", { children: item.buss_name }), _jsx("td", { children: item.buss_type }), _jsx("td", { children: item.current_rate }), _jsx("td", { children: item.Tot_grade })] }, index)); }) })] })] }));
};
export default PropertyBillPayments;
