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
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
var FrmProperty = function () {
    var _a = useState(''), houseNo = _a[0], setHouseNo = _a[1];
    var _b = useState(''), owner = _b[0], setOwner = _b[1];
    var _c = useState(''), tenant = _c[0], setTenant = _c[1];
    var _d = useState(''), propertyUse = _d[0], setPropertyUse = _d[1];
    var _e = useState(''), propertyType = _e[0], setPropertyType = _e[1];
    var _f = useState(''), propertyClass = _f[0], setPropertyClass = _f[1];
    var _g = useState(''), electoralArea = _g[0], setElectoralArea = _g[1];
    var _h = useState(''), landMark = _h[0], setLandMark = _h[1];
    var _j = useState(''), streetName = _j[0], setStreetName = _j[1];
    var _k = useState(''), lattitude = _k[0], setLattitude = _k[1];
    var _l = useState(''), longitude = _l[0], setLongitude = _l[1];
    var _m = useState(''), code = _m[0], setCode = _m[1];
    var _o = useState(''), elevation = _o[0], setElevation = _o[1];
    var _p = useState(0.0000), propertyRate = _p[0], setPropertyRate = _p[1];
    var _q = useState(0.0000), propertyUseRate = _q[0], setPropertyUseRate = _q[1];
    var _r = useState(0.0000), propertyTypeRate = _r[0], setPropertyTypeRate = _r[1];
    var _s = useState(0.0000), propertyClassRate = _s[0], setPropertyClassRate = _s[1];
    var _t = useState(''), assessmentBy = _t[0], setAssessmentBy = _t[1];
    var _u = useState([]), properties = _u[0], setProperties = _u[1];
    var _v = useState([]), electoralAreaOptions = _v[0], setElectoralAreaOptions = _v[1];
    var _w = useState([]), propertyTypeOptions = _w[0], setPropertyTypeOptions = _w[1];
    var _x = useState([]), propertyClassOptions = _x[0], setPropertyClassOptions = _x[1];
    var _y = useState([]), assessmentByOptions = _y[0], setAssessmentByOptions = _y[1];
    useEffect(function () {
        // Fetch properties and dropdown options on form load
        fetchProperties();
        fetchElectoralAreaOptions();
        fetchPropertyTypeOptions();
        fetchPropertyClassOptions();
        fetchAssessmentByOptions();
    }, []);
    var fetchProperties = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/properties')];
                case 1:
                    response = _a.sent();
                    setProperties(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching properties", error_1);
                    alert("An error occurred while fetching properties");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchElectoralAreaOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/electoral-area-options')];
                case 1:
                    response = _a.sent();
                    setElectoralAreaOptions(response.data.map(function (area) { return ({
                        value: area.electoral_area,
                        label: area.electoral_area
                    }); }));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error fetching electoral area options", error_2);
                    alert("No electoral area entered yet");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyTypeOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/property-type-options')];
                case 1:
                    response = _a.sent();
                    setPropertyTypeOptions(response.data.map(function (type) { return ({
                        value: type.property_type,
                        label: type.property_type
                    }); }));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error fetching property type options", error_3);
                    alert("Error fetching property type options");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyClassOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/property-class-options')];
                case 1:
                    response = _a.sent();
                    setPropertyClassOptions(response.data.map(function (cls) { return ({
                        value: cls.property_class,
                        label: cls.property_class
                    }); }));
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error fetching property class options", error_4);
                    alert("Error fetching property class options");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchAssessmentByOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/assessment-by-options')];
                case 1:
                    response = _a.sent();
                    setAssessmentByOptions(response.data.map(function (officer) { return ({
                        value: "".concat(officer.officer_no, " ").concat(officer.officer_name),
                        label: "".concat(officer.officer_no, " ").concat(officer.officer_name)
                    }); }));
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error fetching assessment by options", error_5);
                    alert("No officer entered yet");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleElectoralAreaChange = function (e) {
        setElectoralArea(e.target.value);
        fetchPropertyUseRate(e.target.value);
    };
    var handlePropertyTypeChange = function (e) {
        setPropertyType(e.target.value);
        fetchPropertyTypeRate(e.target.value);
    };
    var handlePropertyUseChange = function (e) {
        setPropertyUse(e.target.value);
    };
    var handlePropertyClassChange = function (e) {
        setPropertyClass(e.target.value);
        fetchPropertyClassRate(e.target.value);
    };
    var handleAssessmentByChange = function (e) {
        setAssessmentBy(e.target.value);
    };
    var fetchPropertyUseRate = function (electoralArea) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!electoralArea) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/property-use-rate', {
                            params: { electoral_area: electoralArea }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        setPropertyUseRate(response.data[0].propertyrate);
                    }
                    else {
                        alert("No rate found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error("Error fetching property use rate", error_6);
                    alert("Error fetching property use rate");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyTypeRate = function (propertyType) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!propertyType) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/property-type-rate', {
                            params: { propertyType: propertyType }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        setPropertyTypeRate(response.data[0].rate);
                    }
                    else {
                        alert("No rate found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    console.error("Error fetching property type rate", error_7);
                    alert("Error fetching property type rate");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyClassRate = function (propertyClass) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!propertyClass) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get('/api/property-class-rate', {
                            params: { propertyClass: propertyClass }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.length > 0) {
                        setPropertyClassRate(response.data[0].rate);
                    }
                    else {
                        alert("No rate found");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error("Error fetching property class rate", error_8);
                    alert("Error fetching property class rate");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!houseNo) {
                        alert("Kindly enter the house number");
                        return [2 /*return*/];
                    }
                    if (!owner) {
                        alert("Kindly enter the owner");
                        return [2 /*return*/];
                    }
                    if (!tenant) {
                        alert("Kindly enter the tenant");
                        return [2 /*return*/];
                    }
                    if (!propertyUse) {
                        alert("Kindly select the use of property");
                        return [2 /*return*/];
                    }
                    if (!propertyType) {
                        alert("Kindly select the type of property");
                        return [2 /*return*/];
                    }
                    if (!propertyClass) {
                        alert("Kindly select the class of property");
                        return [2 /*return*/];
                    }
                    if (!electoralArea) {
                        alert("Kindly select the electoral area");
                        return [2 /*return*/];
                    }
                    if (!landMark) {
                        alert("Kindly enter the landmark");
                        return [2 /*return*/];
                    }
                    if (!streetName) {
                        alert("Kindly enter the street name");
                        return [2 /*return*/];
                    }
                    if (!lattitude) {
                        alert("Kindly enter the Lattitude");
                        return [2 /*return*/];
                    }
                    if (!longitude) {
                        alert("Kindly enter the Longitude");
                        return [2 /*return*/];
                    }
                    if (!code) {
                        alert("Kindly enter the code");
                        return [2 /*return*/];
                    }
                    if (!elevation) {
                        alert("Kindly enter the elevation");
                        return [2 /*return*/];
                    }
                    if (!propertyRate) {
                        alert("Kindly enter the property rate");
                        return [2 /*return*/];
                    }
                    if (!assessmentBy) {
                        alert("Kindly enter the officer in charge of the property");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('/api/add-property', {
                            house_no: houseNo,
                            owner: owner,
                            tenant: tenant,
                            propertyuse: propertyUse,
                            propertytype: propertyType,
                            propertyclass: propertyClass,
                            electroral_area: electoralArea,
                            landmark: landMark,
                            street_name: streetName,
                            lattitude: lattitude,
                            longitude: longitude,
                            code: code,
                            elevation: elevation,
                            rate: propertyRate,
                            Assessmentby: assessmentBy,
                            balance: 0,
                            PropertyUseRate: propertyUseRate,
                            PropertytypeRate: propertyTypeRate,
                            PropertyclassRate: propertyClassRate
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.success) {
                        alert("Record successfully added");
                        // Clear input fields
                        setHouseNo('');
                        setOwner('');
                        setTenant('');
                        setPropertyUse('');
                        setPropertyType('');
                        setPropertyClass('');
                        setElectoralArea('');
                        setLandMark('');
                        setStreetName('');
                        setLattitude('');
                        setLongitude('');
                        setCode('');
                        setElevation('');
                        setPropertyRate(0.0000);
                        setAssessmentBy('');
                        // Refresh the list of properties
                        fetchProperties();
                    }
                    else {
                        alert("Record already exists");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    console.error("Error adding property", error_9);
                    alert("Error in adding a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleExitClick = function () {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };
    var handleRowClick = function (property) {
        setHouseNo(property.house_no);
        setOwner(property.owner);
        setTenant(property.tenant);
        setPropertyUse(property.propertyuse);
        setPropertyType(property.propertytype);
        setPropertyClass(property.propertyclass);
        setElectoralArea(property.electroral_area);
        setLandMark(property.landmark);
        setStreetName(property.street_name);
        setLattitude(property.lattitude);
        setLongitude(property.longitude);
        setCode(property.code);
        setElevation(property.elevation);
        setPropertyRate(property.rate);
        setAssessmentBy(property.Assessmentby);
    };
    return (_jsxs(Container, { fluid: true, children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h1", { className: "text-center text-primary", children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { children: _jsx(Col, { children: _jsx("h3", { className: "text-center text-danger", children: "PROPERTY DATA ENTRY" }) }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formHouseNo", children: [_jsx(Form.Label, { children: "House Number:" }), _jsx(Form.Control, { type: "text", value: houseNo, onChange: function (e) { return setHouseNo(e.target.value); }, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formOwner", children: [_jsx(Form.Label, { children: "Owner:" }), _jsx(Form.Control, { type: "text", value: owner, onChange: function (e) { return setOwner(e.target.value); }, required: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formTenant", children: [_jsx(Form.Label, { children: "Tenant:" }), _jsx(Form.Control, { type: "text", value: tenant, onChange: function (e) { return setTenant(e.target.value); }, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyUse", children: [_jsx(Form.Label, { children: "Use of Property:" }), _jsxs(Form.Select, { value: propertyUse, onChange: handlePropertyUseChange, required: true, children: [_jsx("option", { value: "", children: "Select Use of Property" }), propertyClassOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); })] })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyType", children: [_jsx(Form.Label, { children: "Type of Property:" }), _jsxs(Form.Select, { value: propertyType, onChange: handlePropertyTypeChange, required: true, children: [_jsx("option", { value: "", children: "Select Type of Property" }), propertyTypeOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); })] })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyClass", children: [_jsx(Form.Label, { children: "Class of Property:" }), _jsxs(Form.Select, { value: propertyClass, onChange: handlePropertyClassChange, required: true, children: [_jsx("option", { value: "", children: "Select Class of Property" }), propertyClassOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); })] })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: electoralArea, onChange: handleElectoralAreaChange, required: true, children: [_jsx("option", { value: "", children: "Select Electoral Area" }), electoralAreaOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); })] })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formAssessmentBy", children: [_jsx(Form.Label, { children: "Officer:" }), _jsxs(Form.Select, { value: assessmentBy, onChange: handleAssessmentByChange, required: true, children: [_jsx("option", { value: "", children: "Select Officer" }), assessmentByOptions.map(function (option) { return (_jsx("option", { value: option.value, children: option.label }, option.value)); })] })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formLandMark", children: [_jsx(Form.Label, { children: "Landmark:" }), _jsx(Form.Control, { type: "text", value: landMark, onChange: function (e) { return setLandMark(e.target.value); }, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formStreetName", children: [_jsx(Form.Label, { children: "Street Name:" }), _jsx(Form.Control, { type: "text", value: streetName, onChange: function (e) { return setStreetName(e.target.value); }, required: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formLattitude", children: [_jsx(Form.Label, { children: "Lattitude:" }), _jsx(Form.Control, { type: "text", value: lattitude, onChange: function (e) { return setLattitude(e.target.value); }, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formLongitude", children: [_jsx(Form.Label, { children: "Longitude:" }), _jsx(Form.Control, { type: "text", value: longitude, onChange: function (e) { return setLongitude(e.target.value); }, required: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formCode", children: [_jsx(Form.Label, { children: "Code:" }), _jsx(Form.Control, { type: "text", value: code, onChange: function (e) { return setCode(e.target.value); }, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formElevation", children: [_jsx(Form.Label, { children: "Elevation:" }), _jsx(Form.Control, { type: "text", value: elevation, onChange: function (e) { return setElevation(e.target.value); }, required: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyRate", children: [_jsx(Form.Label, { children: "Property Rate:" }), _jsx(Form.Control, { type: "number", step: "0.0001", value: propertyRate, onChange: function (e) { return setPropertyRate(parseFloat(e.target.value)); }, required: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyUseRate", children: [_jsx(Form.Label, { children: "Use of Property Rate:" }), _jsx(Form.Control, { type: "number", step: "0.0001", value: propertyUseRate, onChange: function (e) { return setPropertyUseRate(parseFloat(e.target.value)); }, readOnly: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyTypeRate", children: [_jsx(Form.Label, { children: "Type of Property Rate:" }), _jsx(Form.Control, { type: "number", step: "0.0001", value: propertyTypeRate, onChange: function (e) { return setPropertyTypeRate(parseFloat(e.target.value)); }, readOnly: true })] }) }), _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formPropertyClassRate", children: [_jsx(Form.Label, { children: "Class of Property Rate:" }), _jsx(Form.Control, { type: "number", step: "0.0001", value: propertyClassRate, onChange: function (e) { return setPropertyClassRate(parseFloat(e.target.value)); }, readOnly: true })] }) })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Exit to Main Menu" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h2", { children: "List of Properties" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "House No" }), _jsx("th", { children: "Owner" }), _jsx("th", { children: "Tenant" }), _jsx("th", { children: "Use of Property" }), _jsx("th", { children: "Electoral Area" })] }) }), _jsx("tbody", { children: properties.map(function (property, index) { return (_jsxs("tr", { onClick: function () { return handleRowClick(property); }, children: [_jsx("td", { children: property.house_no }), _jsx("td", { children: property.owner }), _jsx("td", { children: property.tenant }), _jsx("td", { children: property.propertyuse }), _jsx("td", { children: property.electroral_area })] }, index)); }) })] })] }) })] }));
};
export default FrmProperty;
