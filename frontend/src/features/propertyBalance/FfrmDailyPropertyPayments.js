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
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';
var PropertyBillPayments = function (_a) {
    var uid = _a.uid, MDImain = _a.MDImain;
    var _b = useState(''), cboZone = _b[0], setCboZone = _b[1];
    var _c = useState(''), cboBussType = _c[0], setCboBussType = _c[1];
    var _d = useState(''), cboFirstDate = _d[0], setCboFirstDate = _d[1];
    var _e = useState(''), cboLastDate = _e[0], setCboLastDate = _e[1];
    var _f = useState([]), zoneOptions = _f[0], setZoneOptions = _f[1];
    var _g = useState([]), bussTypeOptions = _g[0], setBussTypeOptions = _g[1];
    var _h = useState([]), firstDateOptions = _h[0], setFirstDateOptions = _h[1];
    var _j = useState([]), lastDateOptions = _j[0], setLastDateOptions = _j[1];
    var _k = useState([]), lstViewItems = _k[0], setListViewItems = _k[1];
    useEffect(function () {
        // Update business zones in payments
        updateBusinessZones();
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
                        setZoneOptions(response.data.map(function (zone) { return zone.electroral_area; }));
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
    var updateBusinessZones = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, axios.post('http://your-api-url/update-business-zones', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu'
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, axios.post('http://your-api-url/update-business-zones-var', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu'
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, axios.post('http://your-api-url/update-propertyuse-in-tb_PropertyPayments', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu'
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, axios.post('http://your-api-url/update-propertyuse-in-var_PropertyPayments', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu'
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error(error_2);
                    alert("Error in updating business zones: ".concat(error_2.message));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var cmdExitClick = function () {
        // Hide the current form and show the main form
        if (MDImain.current) {
            MDImain.current.show();
        }
    };
    var cmdViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var recSource, recResponse, recData, tmpResponse, tmpData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    // Set the screen pointer to hourglass
                    document.body.style.cursor = 'wait';
                    // Clear previous data
                    return [4 /*yield*/, axios.delete('http://your-api-url/delete-tmp_PropertyPayments', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu'
                            }
                        })];
                case 1:
                    // Clear previous data
                    _a.sent();
                    recSource = '';
                    if (cboZone && cboBussType) {
                        recSource = "set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "') and electroral_area=convert(varchar(50),'").concat(cboZone, "') and propertyuse=convert(varchar(50),'").concat(cboBussType, "')");
                    }
                    else if (cboZone) {
                        recSource = "set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "') and electroral_area=convert(varchar(50),'").concat(cboZone, "')");
                    }
                    else if (cboBussType) {
                        recSource = "set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "') and propertyuse=convert(varchar(50),'").concat(cboBussType, "')");
                    }
                    else {
                        recSource = "set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "')");
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-property-payments', {
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
                        alert("Record not found");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.post('http://your-api-url/insert-tmp_PropertyPayments', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu',
                            data: recData
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tmp_PropertyPayments', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu'
                            }
                        })];
                case 4:
                    tmpResponse = _a.sent();
                    tmpData = tmpResponse.data;
                    if (tmpData.length > 0) {
                        // Assuming frmDisplay.CrystalReport1 is a component or method to display the report
                        // This part will depend on your actual implementation
                        alert("Processing completed");
                    }
                    else {
                        alert("No payments found");
                    }
                    return [3 /*break*/, 7];
                case 5:
                    error_3 = _a.sent();
                    console.error(error_3);
                    alert("Error in operations: ".concat(error_3.message));
                    return [3 /*break*/, 7];
                case 6:
                    // Set the screen pointer back to default
                    document.body.style.cursor = 'default';
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var command1Click = function () { return __awaiter(void 0, void 0, void 0, function () {
        var recSource, recResponse, recData, tmpResponse, tmpData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    // Set the screen pointer to hourglass
                    document.body.style.cursor = 'wait';
                    // Clear previous data
                    return [4 /*yield*/, axios.delete('http://your-api-url/delete-tmp_PropertyPayments', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu'
                            }
                        })];
                case 1:
                    // Clear previous data
                    _a.sent();
                    recSource = '';
                    if (cboZone && cboBussType) {
                        recSource = "set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "') and electroral_area=convert(varchar(50),'").concat(cboZone, "') and propertyuse like '%").concat(cboBussType, "%'");
                    }
                    else if (cboZone) {
                        recSource = "set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "') and electroral_area=convert(varchar(50),'").concat(cboZone, "')");
                    }
                    else if (cboBussType) {
                        recSource = "set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "') and propertyuse like '%").concat(cboBussType, "%'");
                    }
                    else {
                        recSource = "set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'".concat(cboFirstDate, "') and \n                      convert(datetime,'").concat(cboLastDate, "')");
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-property-payments', {
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
                        alert("Record not found");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.post('http://your-api-url/insert-tmp_PropertyPayments', {
                            dsn: 'dsnSaltpond',
                            uid: 'sa',
                            pwd: 'Timbuk2tu',
                            data: recData
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, axios.get('http://your-api-url/get-tmp_PropertyPayments', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu'
                            }
                        })];
                case 4:
                    tmpResponse = _a.sent();
                    tmpData = tmpResponse.data;
                    if (tmpData.length > 0) {
                        // Assuming frmDisplay.CrystalReport1 is a component or method to display the report
                        // This part will depend on your actual implementation
                        alert("Processing completed");
                    }
                    else {
                        alert("No payments found");
                    }
                    return [3 /*break*/, 7];
                case 5:
                    error_4 = _a.sent();
                    console.error(error_4);
                    alert("Error in operations: ".concat(error_4.message));
                    return [3 /*break*/, 7];
                case 6:
                    // Set the screen pointer back to default
                    document.body.style.cursor = 'default';
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var cboZoneDropDown = function () { return __awaiter(void 0, void 0, void 0, function () {
        var recResponse, recData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!cboZone) {
                        alert("Select a zone");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, axios.get('http://your-api-url/get-buss-types', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                electroral_area: cboZone
                            }
                        })];
                case 1:
                    recResponse = _a.sent();
                    recData = recResponse.data;
                    if (recData.length > 0) {
                        setBussTypeOptions(recData.map(function (bussType) { return bussType.propertyuse; }));
                    }
                    else {
                        alert("No business type found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error(error_5);
                    alert("Error in fetching business types: ".concat(error_5.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var cboFirstDateDropDown = function () { return __awaiter(void 0, void 0, void 0, function () {
        var recResponse, recData, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/get-first-dates', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                electroral_area: cboZone
                            }
                        })];
                case 1:
                    recResponse = _a.sent();
                    recData = recResponse.data;
                    if (recData.length > 0) {
                        setFirstDateOptions(recData.map(function (date) { return date.transdate; }));
                    }
                    else {
                        alert("No dates found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error(error_6);
                    alert("Error in fetching first dates: ".concat(error_6.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var cboLastDateDropDown = function () { return __awaiter(void 0, void 0, void 0, function () {
        var recResponse, recData, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/get-last-dates', {
                            params: {
                                dsn: 'dsnSaltpond',
                                uid: 'sa',
                                pwd: 'Timbuk2tu',
                                electroral_area: cboZone
                            }
                        })];
                case 1:
                    recResponse = _a.sent();
                    recData = recResponse.data;
                    if (recData.length > 0) {
                        setLastDateOptions(recData.map(function (date) { return date.transdate; }));
                    }
                    else {
                        alert("No dates found");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    alert("Error in fetching last dates: ".concat(error_7.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var formLoad = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Update business zones in payments
                    return [4 /*yield*/, updateBusinessZones()];
                case 1:
                    // Update business zones in payments
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.error(error_8);
                    alert("Error in updating business zones: ".concat(error_8.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        formLoad();
    }, []);
    return (_jsxs("div", { className: "container-fluid", style: { backgroundColor: '#FFC0C0', height: '100vh', paddingTop: '20px' }, children: [_jsx("h3", { className: "text-center", children: "Daily Property Payments" }), _jsxs("div", { className: "row mb-3", children: [_jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "Electoral Area" }), _jsxs(Form.Select, { value: cboZone, onChange: function (e) { return setCboZone(e.target.value); }, style: { width: '300px' }, onClick: cboZoneDropDown, children: [_jsx("option", { value: "", children: "Select Zone" }), zoneOptions.map(function (zone, index) { return (_jsx("option", { value: zone, children: zone }, index)); })] }), _jsx(Form.Text, { className: "text-right text-muted", children: "Empty means all Electoral Area" })] }), _jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "Business Type/Profession" }), _jsxs(Form.Select, { value: cboBussType, onChange: function (e) { return setCboBussType(e.target.value); }, style: { width: '300px', display: 'none' }, children: [_jsx("option", { value: "", children: "Select Business Type" }), bussTypeOptions.map(function (bussType, index) { return (_jsx("option", { value: bussType, children: bussType }, index)); })] }), _jsx(Form.Text, { className: "text-right text-muted", children: "Empty means all Business Type/Profession" })] })] }), _jsxs("div", { className: "row mb-3", children: [_jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "First Payment Date" }), _jsxs(Form.Select, { value: cboFirstDate, onChange: function (e) { return setCboFirstDate(e.target.value); }, style: { width: '300px' }, onClick: cboFirstDateDropDown, children: [_jsx("option", { value: "", children: "Select Date" }), firstDateOptions.map(function (date, index) { return (_jsx("option", { value: date, children: date }, index)); })] })] }), _jsxs("div", { className: "col-md-6", children: [_jsx(Form.Label, { className: "text-right", children: "Last Payment Date" }), _jsxs(Form.Select, { value: cboLastDate, onChange: function (e) { return setCboLastDate(e.target.value); }, style: { width: '300px' }, onClick: cboLastDateDropDown, children: [_jsx("option", { value: "", children: "Select Date" }), lastDateOptions.map(function (date, index) { return (_jsx("option", { value: date, children: date }, index)); })] })] })] }), _jsxs("div", { className: "row mb-3", children: [_jsx("div", { className: "col-md-6", children: _jsx(Button, { variant: "primary", onClick: cmdViewClick, style: { width: '395px' }, children: "Produce Report (unposted payments)" }) }), _jsx("div", { className: "col-md-6", children: _jsx(Button, { variant: "danger", onClick: cmdExitClick, style: { width: '181px', marginTop: '180px' }, children: "Exit" }) })] }), _jsx("div", { className: "row mb-3", children: _jsx("div", { className: "col-md-6", children: _jsx(Button, { variant: "primary", onClick: command1Click, style: { width: '395px' }, children: "Produce Report (posted payments)" }) }) }), _jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Business No" }), _jsx("th", { children: "Business Name" }), _jsx("th", { children: "Business Type" }), _jsx("th", { children: "Current Rate" }), _jsx("th", { children: "Total Grade" })] }) }), _jsx("tbody", { children: lstViewItems.map(function (item, index) { return (_jsxs("tr", { children: [_jsx("td", { children: item.electroral_area }), _jsx("td", { children: item.buss_no }), _jsx("td", { children: item.buss_name }), _jsx("td", { children: item.buss_type }), _jsx("td", { children: item.current_rate }), _jsx("td", { children: item.Tot_grade })] }, index)); }) })] })] }));
};
export default PropertyBillPayments;
