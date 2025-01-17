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
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
var PropertyUpdate = function () {
    var _a = useState([]), officers = _a[0], setOfficers = _a[1];
    var _b = useState([]), properties = _b[0], setProperties = _b[1];
    var _c = useState([]), propertyTypes = _c[0], setPropertyTypes = _c[1];
    var _d = useState([]), propertyUses = _d[0], setPropertyUses = _d[1];
    var _e = useState([]), propertyClasses = _e[0], setPropertyClasses = _e[1];
    var _f = useState([]), electoralAreas = _f[0], setElectoralAreas = _f[1];
    var _g = useState(''), houseNo = _g[0], setHouseNo = _g[1];
    var _h = useState(''), owner = _h[0], setOwner = _h[1];
    var _j = useState(''), tenant = _j[0], setTenant = _j[1];
    var _k = useState(''), propertyUse = _k[0], setPropertyUse = _k[1];
    var _l = useState(''), propertyType = _l[0], setPropertyType = _l[1];
    var _m = useState(''), propertyClass = _m[0], setPropertyClass = _m[1];
    var _o = useState(''), electoralArea = _o[0], setElectoralArea = _o[1];
    var _p = useState(''), landMark = _p[0], setLandMark = _p[1];
    var _q = useState(''), streetName = _q[0], setStreetName = _q[1];
    var _r = useState(''), lattitude = _r[0], setLattitude = _r[1];
    var _s = useState(''), longitude = _s[0], setLongitude = _s[1];
    var _t = useState(''), code = _t[0], setCode = _t[1];
    var _u = useState(''), elevation = _u[0], setElevation = _u[1];
    var _v = useState('0.0000'), rate = _v[0], setRate = _v[1];
    var _w = useState('0.0000'), propertyUseRate = _w[0], setPropertyUseRate = _w[1];
    var _x = useState('0.0000'), propertyTypeRate = _x[0], setPropertyTypeRate = _x[1];
    var _y = useState('0.0000'), propertyClassRate = _y[0], setPropertyClassRate = _y[1];
    var _z = useState(''), assessmentBy = _z[0], setAssessmentBy = _z[1];
    useEffect(function () {
        fetchOfficers();
        fetchProperties();
        fetchPropertyTypes();
        fetchPropertyUses();
        fetchPropertyClasses();
        fetchElectoralAreas();
    }, []);
    var fetchOfficers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/officers')];
                case 1:
                    response = _a.sent();
                    setOfficers(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchProperties = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
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
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/property-types')];
                case 1:
                    response = _a.sent();
                    setPropertyTypes(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyUses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/property-uses')];
                case 1:
                    response = _a.sent();
                    setPropertyUses(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyClasses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/property-classes')];
                case 1:
                    response = _a.sent();
                    setPropertyClasses(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/electoral-areas')];
                case 1:
                    response = _a.sent();
                    setElectoralAreas(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error(error_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleOfficerNoChange = function (event) {
        var target = event.target;
        var selectedOfficerNo = target.value;
        setAssessmentBy(selectedOfficerNo);
    };
    var handlePropertyUseChange = function (event) {
        var target = event.target;
        var selectedPropertyUse = target.value;
        setPropertyUse(selectedPropertyUse);
        var propertyUseItem = propertyUses.find(function (pu) { return pu.propertyuse === selectedPropertyUse; });
        if (propertyUseItem) {
            setPropertyUseRate(propertyUseItem.propertyrate);
            calculateRate();
        }
    };
    var handlePropertyTypeChange = function (event) {
        var target = event.target;
        var selectedPropertyType = target.value;
        setPropertyType(selectedPropertyType);
        var propertyTypeItem = propertyTypes.find(function (pt) { return pt.property_type === selectedPropertyType; });
        if (propertyTypeItem) {
            setPropertyTypeRate(propertyTypeItem.rate);
            calculateRate();
        }
    };
    var handlePropertyClassChange = function (event) {
        var target = event.target;
        var selectedPropertyClass = target.value;
        setPropertyClass(selectedPropertyClass);
        var propertyClassItem = propertyClasses.find(function (pc) { return pc.property_class === selectedPropertyClass; });
        if (propertyClassItem) {
            setPropertyClassRate(propertyClassItem.rate);
            calculateRate();
        }
    };
    var handleElectoralAreaChange = function (event) {
        var target = event.target;
        var selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
    };
    var handleHouseNoChange = function (event) {
        var houseNo = event.target.value;
        setHouseNo(houseNo);
        fetchPropertyDetails(houseNo);
    };
    var fetchPropertyDetails = function (houseNo) { return __awaiter(void 0, void 0, void 0, function () {
        var response, property, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/api/property-details', { params: { house_no: houseNo } })];
                case 1:
                    response = _a.sent();
                    property = response.data;
                    if (property) {
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
                        setRate(property.rate);
                        setPropertyUseRate(property.propertyuserate);
                        setPropertyTypeRate(property.propertytyperate);
                        setPropertyClassRate(property.propertyclassrate);
                        setAssessmentBy(property.assessmentby);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var calculateRate = function () {
        var useRate = parseFloat(propertyUseRate || '0');
        var typeRate = parseFloat(propertyTypeRate || '0');
        var classRate = parseFloat(propertyClassRate || '0');
        var calculatedRate = useRate * typeRate * classRate;
        setRate(calculatedRate.toFixed(4));
    };
    var handleEditProperty = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_8;
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
                        alert("Kindly enter the land mark");
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
                    if (!rate) {
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
                    return [4 /*yield*/, axios.post('/api/edit-property', {
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
                            rate: rate,
                            propertyuserate: propertyUseRate,
                            propertytyperate: propertyTypeRate,
                            propertyclassrate: propertyClassRate,
                            assessmentby: assessmentBy,
                        })];
                case 2:
                    _a.sent();
                    alert("Record successfully edited");
                    fetchProperties();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    console.error(error_8);
                    alert("Error in editing a record");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [_jsx(Row, { children: _jsxs(Col, { className: "text-center mt-3", children: [_jsx("h2", { className: "text-primary", children: "Update a Property" }), _jsx("h4", { className: "text-info", children: "MARCORY MUNICIPAL ASSEMBLY" })] }) }), _jsx(Row, { children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "House Number:" }), _jsx(Form.Control, { type: "text", value: houseNo, onChange: handleHouseNoChange })] }) }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Owner:" }), _jsx(Form.Control, { type: "text", value: owner, onChange: function (e) { return setOwner(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Tenant:" }), _jsx(Form.Control, { type: "text", value: tenant, onChange: function (e) { return setTenant(e.target.value); } })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Use Of Property:" }), _jsxs(Form.Control, { as: "select", value: propertyUse, onChange: handlePropertyUseChange, children: [_jsx("option", { value: "", children: "Select..." }), propertyUses.map(function (pu) { return (_jsx("option", { value: pu.propertyuse, children: pu.propertyuse }, pu.propertyuse)); })] })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Property Type:" }), _jsxs(Form.Control, { as: "select", value: propertyType, onChange: handlePropertyTypeChange, children: [_jsx("option", { value: "", children: "Select..." }), propertyTypes.map(function (pt) { return (_jsx("option", { value: pt.property_type, children: pt.property_type }, pt.property_type)); })] })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Class Of Property:" }), _jsxs(Form.Control, { as: "select", value: propertyClass, onChange: handlePropertyClassChange, children: [_jsx("option", { value: "", children: "Select..." }), propertyClasses.map(function (pc) { return (_jsx("option", { value: pc.property_class, children: pc.property_class }, pc.property_class)); })] })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Electoral Area:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: handleElectoralAreaChange, children: [_jsx("option", { value: "", children: "Select..." }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Landmark:" }), _jsx(Form.Control, { type: "text", value: landMark, onChange: function (e) { return setLandMark(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Street Name:" }), _jsx(Form.Control, { type: "text", value: streetName, onChange: function (e) { return setStreetName(e.target.value); } })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Lattitude:" }), _jsx(Form.Control, { type: "text", value: lattitude, onChange: function (e) { return setLattitude(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Longitude:" }), _jsx(Form.Control, { type: "text", value: longitude, onChange: function (e) { return setLongitude(e.target.value); } })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Code:" }), _jsx(Form.Control, { type: "text", value: code, onChange: function (e) { return setCode(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Elevation:" }), _jsx(Form.Control, { type: "text", value: elevation, onChange: function (e) { return setElevation(e.target.value); } })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Value of Property:" }), _jsx(Form.Control, { type: "text", value: rate, readOnly: true })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Officer:" }), _jsxs(Form.Control, { as: "select", value: assessmentBy, onChange: handleOfficerNoChange, children: [_jsx("option", { value: "", children: "Select..." }), officers.map(function (officer) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, " - ", officer.officer_name] }, officer.officer_no)); })] })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Use Of Property Rate:" }), _jsx(Form.Control, { type: "text", value: propertyUseRate, readOnly: true })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Type Of Property Rate:" }), _jsx(Form.Control, { type: "text", value: propertyTypeRate, readOnly: true })] }), _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Class Of Property Rate:" }), _jsx(Form.Control, { type: "text", value: propertyClassRate, readOnly: true })] })] }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleEditProperty, children: "Edit a Property" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: function () { return window.close(); }, children: "Exit to Main Menu" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h3", { className: "font-weight-bold", children: "List of Properties" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" }), _jsx("th", { children: "BUSS TYPE" }), _jsx("th", { children: "PERMIT NO" }), _jsx("th", { children: "STREET NAME" }), _jsx("th", { children: "LANDMARK" }), _jsx("th", { children: "ELECTORAL AREA" }), _jsx("th", { children: "PROPERTY CLASS" }), _jsx("th", { children: "GRADE" }), _jsx("th", { children: "OWNER" }), _jsx("th", { children: "TEL NO" }), _jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "TRANSDATE" }), _jsx("th", { children: "STATUS" }), _jsx("th", { children: "SERIALNO" }), _jsx("th", { children: "CURRENT RATE" }), _jsx("th", { children: "PROPERTY RATE" })] }) }), _jsx("tbody", { children: properties.map(function (property) { return (_jsxs("tr", { children: [_jsx("td", { children: property.house_no }), _jsx("td", { children: property.owner }), _jsx("td", { children: property.propertyuse }), _jsx("td", { children: property.house_no }), _jsx("td", { children: property.street_name }), _jsx("td", { children: property.landmark }), _jsx("td", { children: property.electroral_area }), _jsx("td", { children: property.propertyclass }), _jsx("td", { children: property.propertyclass }), _jsx("td", { children: property.owner }), _jsx("td", { children: property.propertyclass }), _jsx("td", { children: property.assessmentby }), _jsx("td", { children: property.house_no }), _jsx("td", { children: property.house_no }), _jsx("td", { children: property.house_no }), _jsx("td", { children: parseFloat(property.rate).toFixed(4) }), _jsx("td", { children: parseFloat(property.rate).toFixed(4) })] }, property.house_no)); }) })] })] }) })] }));
};
export default PropertyUpdate;
