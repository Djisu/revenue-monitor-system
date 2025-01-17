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
import { Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
var BusinessReferencesForm = function () {
    var _a = useState(''), bussName = _a[0], setBussName = _a[1];
    var _b = useState(''), bussType = _b[0], setBussType = _b[1];
    var _c = useState(''), electoralArea = _c[0], setElectoralArea = _c[1];
    var _d = useState(''), grade = _d[0], setGrade = _d[1];
    var _e = useState(''), landmark = _e[0], setLandmark = _e[1];
    var _f = useState(''), propertyClass = _f[0], SetPropertyClass = _f[1];
    var _g = useState(0), totNumber = _g[0], setTotNumber = _g[1];
    var _h = useState(0), currentRates = _h[0], setCurrentRates = _h[1];
    var _j = useState([]), businessList = _j[0], setBusinessList = _j[1];
    useEffect(function () {
        fetchBusinessList();
    }, []);
    var fetchBusinessList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('http://your-api-url/tb_business')];
                case 1:
                    response = _a.sent();
                    setBusinessList(response.data);
                    setTotNumber(response.data.length);
                    setCurrentRates(response.data.reduce(function (sum, business) { return sum + business.current_rate; }, 0));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (field, value) { return __awaiter(void 0, void 0, void 0, function () {
        var query, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = "http://your-api-url/tb_business?".concat(field, "=").concat(value);
                    return [4 /*yield*/, axios.get(query)];
                case 1:
                    response = _a.sent();
                    setBusinessList(response.data);
                    setTotNumber(response.data.length);
                    setCurrentRates(response.data.reduce(function (sum, business) { return sum + business.current_rate; }, 0));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, { children: [_jsx("h2", { children: "Business References" }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formBussName", children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { type: "text", value: bussName, onChange: function (e) {
                                    setBussName(e.target.value);
                                    handleInputChange('buss_name', e.target.value);
                                } })] }), _jsxs(Form.Group, { controlId: "formBussType", children: [_jsx(Form.Label, { children: "Business Type:" }), _jsx(Form.Control, { type: "text", value: bussType, onChange: function (e) {
                                    setBussType(e.target.value);
                                    handleInputChange('buss_type', e.target.value);
                                } })] }), _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsx(Form.Control, { type: "text", value: electoralArea, onChange: function (e) {
                                    setElectoralArea(e.target.value);
                                    handleInputChange('electoral_area', e.target.value);
                                } })] }), _jsxs(Form.Group, { controlId: "formGrade", children: [_jsx(Form.Label, { children: "Grade:" }), _jsx(Form.Control, { type: "text", value: grade, onChange: function (e) {
                                    setGrade(e.target.value);
                                    handleInputChange('tot_grade', e.target.value);
                                } })] }), _jsxs(Form.Group, { controlId: "formLandmark", children: [_jsx(Form.Label, { children: "Landmark:" }), _jsx(Form.Control, { type: "text", value: landmark, onChange: function (e) {
                                    setLandmark(e.target.value);
                                    handleInputChange('landmark', e.target.value);
                                } })] }), _jsxs(Form.Group, { controlId: "formPropertyClass", children: [_jsx(Form.Label, { children: "Property Class:" }), _jsx(Form.Control, { type: "text", value: propertyClass, onChange: function (e) {
                                    SetPropertyClass(e.target.value);
                                    handleInputChange('property_class', e.target.value);
                                } })] }), _jsxs(Form.Group, { controlId: "formTotNumber", children: [_jsx(Form.Label, { children: "Total Number of Businesses:" }), _jsx(Form.Control, { type: "number", value: totNumber, readOnly: true })] }), _jsxs(Form.Group, { controlId: "formCurrentRates", children: [_jsx(Form.Label, { children: "Total Current Rates GHC:" }), _jsx(Form.Control, { type: "number", value: currentRates, readOnly: true })] }), _jsx(Button, { variant: "danger", onClick: fetchBusinessList, children: "Empty Records" }), _jsx(Button, { variant: "primary", onClick: function () { return window.location.href = '/'; }, children: "Exit" })] }), _jsx("h3", { children: "List of Business Clients" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Buss No" }), _jsx("th", { children: "Buss Name" }), _jsx("th", { children: "Address" }), _jsx("th", { children: "Type" }), _jsx("th", { children: "Permit No" }), _jsx("th", { children: "Street Name" }), _jsx("th", { children: "Landmark" }), _jsx("th", { children: "Layout" }), _jsx("th", { children: "Property Class" }), _jsx("th", { children: "Grade" }), _jsx("th", { children: "CEO" }), _jsx("th", { children: "Tel No" }), _jsx("th", { children: "Assessed By" }), _jsx("th", { children: "Reg Date" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Serial No" }), _jsx("th", { children: "Current Rate" }), _jsx("th", { children: "Property Rate" })] }) }), _jsx("tbody", { children: businessList.map(function (business) { return (_jsxs("tr", { children: [_jsx("td", { children: business.buss_no }), _jsx("td", { children: business.buss_name.toUpperCase() }), _jsx("td", { children: business.buss_address.toUpperCase() }), _jsx("td", { children: business.buss_type.toUpperCase() }), _jsx("td", { children: business.buss_permitno.toUpperCase() }), _jsx("td", { children: business.street_name.toUpperCase() }), _jsx("td", { children: business.landmark.toUpperCase() }), _jsx("td", { children: business.layout.toUpperCase() }), _jsx("td", { children: business.property_class.toUpperCase() }), _jsx("td", { children: business.tot_grade.toUpperCase() }), _jsx("td", { children: business.ceo.toUpperCase() }), _jsx("td", { children: business.telno }), _jsx("td", { children: business.assessmentby.toUpperCase() }), _jsx("td", { children: business.transdate }), _jsx("td", { children: business.status.toUpperCase() }), _jsx("td", { children: business.serialno }), _jsx("td", { children: business.current_rate }), _jsx("td", { children: business.property_rate })] }, business.buss_no)); }) })] })] }));
};
export default BusinessReferencesForm;
