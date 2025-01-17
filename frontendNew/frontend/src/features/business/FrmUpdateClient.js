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
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
var UpdateClientForm = function () {
    // State management for form fields
    var _a = useState(''), businessNo = _a[0], setBusinessNo = _a[1];
    var _b = useState(''), businessName = _b[0], setBusinessName = _b[1];
    var _c = useState(''), ceo = _c[0], setCeo = _c[1];
    var _d = useState(''), businessAddress = _d[0], setBusinessAddress = _d[1];
    var _e = useState(''), telNo = _e[0], setTelNo = _e[1];
    var _f = useState(''), businessType = _f[0], setBusinessType = _f[1];
    // @ts-ignore
    var _g = useState(''), bussPermitNo = _g[0], setBussPermitNo = _g[1];
    var _h = useState(''), streetName = _h[0], setStreetName = _h[1];
    var _j = useState(''), landMark = _j[0], setLandMark = _j[1];
    var _k = useState(''), electoralArea = _k[0], setElectoralArea = _k[1];
    var _l = useState(''), propertyClass = _l[0], setPropertyClass = _l[1];
    var _m = useState(''), grade = _m[0], setGrade = _m[1];
    var _o = useState(''), siteNo = _o[0], setSiteNo = _o[1];
    var _p = useState(''), rate = _p[0], setRate = _p[1];
    var _q = useState(''), currentRate = _q[0], setCurrentRate = _q[1];
    var _r = useState(''), balanceBF = _r[0], setBalanceBF = _r[1];
    var _s = useState(''), serialNo = _s[0], setSerialNo = _s[1];
    var _t = useState(''), status = _t[0], setStatus = _t[1];
    var _u = useState(''), emailAddress = _u[0], setEmailAddress = _u[1];
    var _v = useState(''), floorRoomNo = _v[0], setFloorRoomNo = _v[1];
    var _w = useState(''), suburb = _w[0], setSuburb = _w[1];
    var _x = useState(''), contactPerson = _x[0], setContactPerson = _x[1];
    var _y = useState(''), contactTelno = _y[0], setContactTelno = _y[1];
    var _z = useState(''), noOfBranches = _z[0], setNoOfBranches = _z[1];
    var _0 = useState(''), branchLocation = _0[0], setBranchLocation = _0[1];
    var _1 = useState(''), noOfEmployees = _1[0], setNoOfEmployees = _1[1];
    var _2 = useState(''), blockDivision = _2[0], setBlockDivision = _2[1];
    var _3 = useState(''), blockLayout = _3[0], setBlockLayout = _3[1];
    // State management for checkboxes
    var _4 = useState(0), strategicGrade = _4[0], setStrategicGrade = _4[1];
    var _5 = useState(0), productGrade = _5[0], setProductGrade = _5[1];
    var _6 = useState(0), busPopGrade = _6[0], setBusPopGrade = _6[1];
    var _7 = useState(0), busEnvGrade = _7[0], setBusEnvGrade = _7[1];
    var _8 = useState(0), sizeGrade = _8[0], setSizeGrade = _8[1];
    var _9 = useState(0), noGrade = _9[0], setNoGrade = _9[1];
    var _10 = useState(0), busOpeGrade = _10[0], setBusOpeGrade = _10[1];
    var _11 = useState(0), comAvaGrade = _11[0], setComAvaGrade = _11[1];
    // State management for total marks and grade
    var _12 = useState(0), totalMarks = _12[0], setTotalMarks = _12[1];
    var _13 = useState(''), finalGrade = _13[0], setFinalGrade = _13[1];
    // State management for dropdowns
    var _14 = useState([]), assessmentBy = _14[0], setAssessmentBy = _14[1];
    var _15 = useState([]), businessTypes = _15[0], setBusinessTypes = _15[1];
    var _16 = useState([]), electoralAreas = _16[0], setElectoralAreas = _16[1];
    var _17 = useState([]), propertyClasses = _17[0], setPropertyClasses = _17[1];
    // @ts-ignore
    var _18 = useState(new Date()), transdate = _18[0], setTransDate = _18[1];
    // State management for ListView equivalent
    var _19 = useState([]), businesses = _19[0], setBusinesses = _19[1];
    // Simulate database fetch for dropdowns
    useEffect(function () {
        // Fetch assessments, business types, electoral areas, and property classes from the database
        fetchAssessments();
        fetchBusinessTypes();
        fetchElectoralAreas();
        fetchPropertyClasses();
        fetchBusinesses();
    }, []);
    var fetchAssessments = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/assessments')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setAssessmentBy(data.map(function (item) { return item.officer_no + ' '.repeat(10) + item.officer_name; }));
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/businessTypes')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setBusinessTypes(data.map(function (item) { return item.buss_type; }));
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/electoralAreas')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setElectoralAreas(data.map(function (item) { return item.electoral_area; }));
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchPropertyClasses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/propertyClasses')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setPropertyClasses(data.map(function (item) { return item.propertyclass; }));
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchBusinesses = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/api/businesses')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setBusinesses(data);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleCheckboxChange = function (value, setter) {
        setter(value);
        updateTotalMarks();
    };
    var updateTotalMarks = function () {
        var marks = strategicGrade + productGrade + busPopGrade + busEnvGrade + sizeGrade + noGrade + busOpeGrade + comAvaGrade;
        setTotalMarks(marks);
        determineFinalGrade(marks);
    };
    var determineFinalGrade = function (marks) {
        // Define your grading logic here
        if (marks >= 90) {
            setFinalGrade('Excellent');
        }
        else if (marks >= 75) {
            setFinalGrade('Very Good');
        }
        else if (marks >= 60) {
            setFinalGrade('Good');
        }
        else if (marks >= 45) {
            setFinalGrade('Average');
        }
        else {
            setFinalGrade('L-Average');
        }
    };
    var handleAddClick = function () {
        // Add your logic to add a new record here
        console.log('Add new record');
    };
    var handleEditClick = function () {
        // Add your logic to edit a record here
        console.log('Edit record');
    };
    var handleExitClick = function () {
        // Add your logic to exit here
        console.log('Exit');
    };
    var handleViewClick = function () {
        // Add your logic to reload spreadsheet here
        console.log('Reload spreadsheet');
    };
    var handleListViewItemClick = function (item) {
        // Populate form fields with selected item data
        setBusinessNo(item.buss_no);
        setBusinessName(item.buss_name);
        setBusinessAddress(item.buss_address);
        setBusinessType(item.buss_type);
        var value = item.buss_permitno;
        bussPermitNo = value;
        setBussPermitNo(item.buss_permitno);
        setStreetName(item.street_name);
        setLandMark(item.landmark);
        setElectoralArea(item.electroral_area);
        setPropertyClass(item.property_class);
        setGrade(item.tot_grade);
        setCeo(item.ceo);
        setTelNo(item.telno);
        setStrategicGrade(item.strategiclocation);
        setProductGrade(item.productvariety);
        setBusPopGrade(item.businesspopularity);
        setBusEnvGrade(item.businessenvironment);
        setSizeGrade(item.sizeofbusiness);
        setNoGrade(item.numberofworkingdays);
        setBusOpeGrade(item.businessoperatingperiod);
        setComAvaGrade(item.competitorsavailable);
        setAssessmentBy(item.assessmentby);
        transdate = item.transdate;
        setTransDate(item.transdate);
        setBalanceBF(item.balance);
        setStatus(item.status);
        setSerialNo(item.serialno);
        setCurrentRate(item.current_rate);
        setSiteNo(item.site_no);
        setRate(item.property_rate);
        setEmailAddress(item.emailaddress);
        setFloorRoomNo(item.floorroomno);
        setSuburb(item.suburb);
        setContactPerson(item.contactperson);
        setContactTelno(item.contacttelno);
    };
    return (_jsxs("div", { className: "container", children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h2", { className: "text-primary", children: "Re-Evaluate Business Client" }) }) }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Number:" }), _jsx(Form.Control, { value: businessNo, onChange: function (e) { return setBusinessNo(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { value: businessName, onChange: function (e) { return setBusinessName(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "CEO:" }), _jsx(Form.Control, { value: ceo, onChange: function (e) { return setCeo(e.target.value); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Address:" }), _jsx(Form.Control, { value: businessAddress, onChange: function (e) { return setBusinessAddress(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Tel No:" }), _jsx(Form.Control, { value: telNo, onChange: function (e) { return setTelNo(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Type:" }), _jsxs(Form.Select, { value: businessType, onChange: function (e) { return setBusinessType(e.target.value); }, children: [_jsx("option", { children: "Select Business Type" }), businessTypes.map(function (type) { return (_jsx("option", { value: type, children: type }, type)); })] })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Street Name:" }), _jsx(Form.Control, { value: streetName, onChange: function (e) { return setStreetName(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Land Mark:" }), _jsx(Form.Control, { value: landMark, onChange: function (e) { return setLandMark(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { children: "Select Electoral Area" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Property Class:" }), _jsxs(Form.Select, { value: propertyClass, onChange: function (e) { return setPropertyClass(e.target.value); }, children: [_jsx("option", { children: "Select Property Class" }), propertyClasses.map(function (cls) { return (_jsx("option", { value: cls, children: cls }, cls)); })] })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Grade:" }), _jsx(Form.Control, { value: grade, onChange: function (e) { return setGrade(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Site No:" }), _jsx(Form.Control, { value: siteNo, onChange: function (e) { return setSiteNo(e.target.value); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Rate:" }), _jsx(Form.Control, { value: rate, onChange: function (e) { return setRate(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Current Rate:" }), _jsx(Form.Control, { value: currentRate, onChange: function (e) { return setCurrentRate(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Balance BF:" }), _jsx(Form.Control, { value: balanceBF, onChange: function (e) { return setBalanceBF(e.target.value); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Serial No:" }), _jsx(Form.Control, { value: serialNo, onChange: function (e) { return setSerialNo(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Status:" }), _jsx(Form.Control, { value: status, onChange: function (e) { return setStatus(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Assessment By:" }), _jsxs(Form.Select, { value: status, onChange: function (e) { return setStatus(e.target.value); }, children: [_jsx("option", { children: "Select Assessment Officer" }), assessmentBy.map(function (assessment) { return (_jsx("option", { value: assessment, children: assessment }, assessment)); })] })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Email Address:" }), _jsx(Form.Control, { value: emailAddress, onChange: function (e) { return setEmailAddress(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Floor/Room No:" }), _jsx(Form.Control, { value: floorRoomNo, onChange: function (e) { return setFloorRoomNo(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Suburb:" }), _jsxs(Form.Select, { value: suburb, onChange: function (e) { return setSuburb(e.target.value); }, disabled: true, children: [_jsx("option", { children: "Select Suburb" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Contact Person:" }), _jsx(Form.Control, { value: contactPerson, onChange: function (e) { return setContactPerson(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Contact Telno:" }), _jsx(Form.Control, { value: contactTelno, onChange: function (e) { return setContactTelno(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "No Of Branches:" }), _jsx(Form.Control, { value: noOfBranches, onChange: function (e) { return setNoOfBranches(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Branch Location:" }), _jsx(Form.Control, { value: branchLocation, onChange: function (e) { return setBranchLocation(e.target.value); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "No Of Employees:" }), _jsx(Form.Control, { value: noOfEmployees, onChange: function (e) { return setNoOfEmployees(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Block Division:" }), _jsx(Form.Control, { value: blockDivision, onChange: function (e) { return setBlockDivision(e.target.value); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Block Layout:" }), _jsxs(Form.Select, { value: blockLayout, onChange: function (e) { return setBlockLayout(e.target.value); }, children: [_jsx("option", { children: "Select Block Layout" }), propertyClasses.map(function (cls) { return (_jsx("option", { value: cls, children: cls }, cls)); })] })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Strategic Location" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Average", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setStrategicGrade); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Product Variety" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Average", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setProductGrade); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Popularity" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Best", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "Better", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Average", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setBusPopGrade); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Environment" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Average", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setBusEnvGrade); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Size Of Business" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "XX-Large", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "X-Large", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "Large", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "Medium", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "Small", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setSizeGrade); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "No Of Working Days" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "7 Days", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "6 Days", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "5 Days", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "4 Days", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "3 Days", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setNoGrade); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Operating Period" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "24 Hours", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "18 Hours", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "12 Hours", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "8 Hours", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "6 Hours", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setBusOpeGrade); } })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Competitors Available" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Pure Mono", type: "checkbox", onChange: function () { return handleCheckboxChange(1, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Mono(3)", type: "checkbox", onChange: function () { return handleCheckboxChange(2, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Moderate(2)", type: "checkbox", onChange: function () { return handleCheckboxChange(3, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Fierce(1)", type: "checkbox", onChange: function () { return handleCheckboxChange(4, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Not Applicable(0)", type: "checkbox", onChange: function () { return handleCheckboxChange(5, setComAvaGrade); } })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsxs(Col, { children: [_jsx(Form.Label, { children: "Total Marks:" }), _jsx(Form.Control, { value: totalMarks, readOnly: true })] }), _jsxs(Col, { children: [_jsx(Form.Label, { children: "Final Grade:" }), _jsx(Form.Control, { value: finalGrade, readOnly: true })] })] }), _jsxs(Row, { className: "mb-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record" }) }), _jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleEditClick, children: "Re-evaluate Client" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Exit" }) }), _jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleViewClick, children: "RELOAD SPREADSHEET" }) })] }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" }), _jsx("th", { children: "BUSS TYPE" }), _jsx("th", { children: "PERMIT NO" }), _jsx("th", { children: "STREET NAME" }), _jsx("th", { children: "LANDMARK" }), _jsx("th", { children: "ELECTORAL AREA" }), _jsx("th", { children: "PROPERTY CLASS" }), _jsx("th", { children: "GRADE" }), _jsx("th", { children: "OWNER" }), _jsx("th", { children: "TEL NO" }), _jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "TRANSDATE" }), _jsx("th", { children: "STATUS" }), _jsx("th", { children: "SERIALNO" }), _jsx("th", { children: "CURRENT RATE" }), _jsx("th", { children: "PROPERTY RATE" })] }) }), _jsx("tbody", { children: businesses.map(function (business) { return (_jsxs("tr", { onClick: function () { return handleListViewItemClick(business); }, children: [_jsx("td", { children: business.buss_no }), _jsx("td", { children: business.buss_name }), _jsx("td", { children: business.buss_type }), _jsx("td", { children: business.buss_permitno }), _jsx("td", { children: business.street_name }), _jsx("td", { children: business.landmark }), _jsx("td", { children: business.electroral_area }), _jsx("td", { children: business.property_class }), _jsx("td", { children: business.tot_grade }), _jsx("td", { children: business.ceo }), _jsx("td", { children: business.telno }), _jsx("td", { children: business.assessmentby }), _jsx("td", { children: business.transdate }), _jsx("td", { children: business.status }), _jsx("td", { children: business.serialno }), _jsx("td", { children: business.current_rate }), _jsx("td", { children: business.property_rate })] }, business.buss_no)); }) })] }) }) })] }));
};
export default UpdateClientForm;
