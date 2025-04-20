var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { createBusiness, fetchLastBussNo } from './businessSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';
export var FrmBusiness = function () {
    var _a = useState({
        buss_no: 0,
        buss_name: '',
        buss_address: '',
        buss_type: '',
        buss_town: '',
        buss_permitNo: '',
        street_name: '',
        landmark: '',
        electroral_area: '',
        property_class: '',
        tot_grade: '',
        ceo: '',
        telno: '',
        strategiclocation: 0,
        productvariety: 0,
        businesspopularity: 0,
        businessenvironment: 0,
        sizeofbusiness: 0,
        numberofworkingdays: 0,
        businessoperatingperiod: 0,
        competitorsavailable: 0,
        assessmentby: '',
        transdate: new Date(),
        balance: 0,
        status: 'Active',
        current_rate: 0,
        property_rate: 0,
        totalmarks: 0,
        emailaddress: '',
        postaladdress: '',
        noofemployees: 0,
        noofbranches: 0,
        BALANCENEW: 0,
        gps_address: '',
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState([]), bussTypes = _c[0], setBussTypes = _c[1];
    var _d = useState([]), propertyClasses = _d[0], setPropertyClasses = _d[1];
    var _e = useState([]), assessments = _e[0], setAssessments = _e[1];
    var _f = useState(false), loading = _f[0], setLoading = _f[1]; // Loading state
    var dispatch = useAppDispatch();
    // Fetch data on component mount
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
        dispatch(fetchPropertyClasses());
        dispatch(fetchOfficers());
    }, [dispatch]);
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    var businessTypes = useAppSelector(function (state) { return state.businessType.businessTypes; });
    var propertyClass = useAppSelector(function (state) { return state.propertyClass.propertyClasses; });
    var officer = useAppSelector(function (state) { return state.officer.officers; });
    useEffect(function () {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
        }
    }, [electoralAreaData]);
    useEffect(function () {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes);
        }
    }, [businessTypes]);
    useEffect(function () {
        setPropertyClasses(propertyClass.map(function (classType) { return classType.property_class; }));
    }, [propertyClass]);
    useEffect(function () {
        setAssessments(officer.map(function (officer) { return "".concat(officer.officer_name); }));
    }, [officer]);
    var getBussNo = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newBussNo_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('getBussNo called');
                    setLoading(true); // Set loading to true
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dispatch(fetchLastBussNo()).unwrap()];
                case 2:
                    newBussNo_1 = _a.sent();
                    setFormData(function (prevData) { return (__assign(__assign({}, prevData), { buss_no: newBussNo_1 })); });
                    console.log('in FrmBusiness.tsx: buss_no:', newBussNo_1);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch last buss_no:', error_1);
                    setFormData(function (prevData) { return (__assign(__assign({}, prevData), { buss_no: 0 })); });
                    console.log('in FrmBusiness.tsx: buss_no:', 0);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false); // Set loading to false
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevData) {
            var _a;
            return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!formData.buss_no) {
                        alert('Enter the business number');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, dispatch(createBusiness(formData))];
                case 1:
                    response = _a.sent();
                    if (createBusiness.fulfilled.match(response)) {
                        alert('Record successfully added');
                        setFormData({
                            buss_no: 0,
                            buss_name: '',
                            buss_address: '',
                            buss_type: '',
                            buss_town: '',
                            buss_permitNo: '',
                            street_name: '',
                            landmark: '',
                            electroral_area: '',
                            property_class: '',
                            tot_grade: '',
                            ceo: '',
                            telno: '',
                            strategiclocation: 0,
                            productvariety: 0,
                            businesspopularity: 0,
                            businessenvironment: 0,
                            sizeofbusiness: 0,
                            numberofworkingdays: 0,
                            businessoperatingperiod: 0,
                            competitorsavailable: 0,
                            assessmentby: '',
                            transdate: new Date(),
                            balance: 0,
                            status: 'Active',
                            current_rate: 0,
                            property_rate: 0,
                            totalmarks: 0,
                            emailaddress: '',
                            postaladdress: '',
                            noofemployees: 0,
                            noofbranches: 0,
                            BALANCENEW: 0,
                            gps_address: '',
                        });
                    }
                    else {
                        throw new Error(response.error.message);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    alert('Error in adding a record');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Card, { style: { backgroundColor: '#add8e6' }, children: [_jsx(CardHeader, { children: _jsx("h3", { children: "New Business Data Entry" }) }), _jsx(CardBody, { children: _jsxs(Form, { children: [_jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_no", children: "Business Number:" }), _jsx(Input, { type: "text", name: "buss_no", id: "buss_no", value: formData.buss_no, onChange: handleChange, onFocus: getBussNo }), loading && _jsx(Spinner, { size: "sm", color: "primary" }), " "] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_name", children: "Business Name:" }), _jsx(Input, { type: "text", name: "buss_name", id: "buss_name", value: formData.buss_name, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_address", children: "Business Address:" }), _jsx(Input, { type: "text", name: "buss_address", id: "buss_address", value: formData.buss_address, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "street_name", children: "Street Name:" }), _jsx(Input, { type: "text", name: "street_name", id: "street_name", value: formData.street_name, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_town", children: "Town:" }), _jsx(Input, { type: "text", name: "buss_town", id: "buss_town", value: formData.buss_town, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "ceo", children: "CEO:" }), _jsx(Input, { type: "text", name: "ceo", id: "ceo", value: formData.ceo, onChange: handleChange })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "landmark", children: "Land Mark:" }), _jsx(Input, { type: "text", name: "landmark", id: "landmark", value: formData.landmark, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "electoral_area", children: "Electoral Area:" }), _jsxs(Input, { type: "select", name: "electroral_area", id: "electoral_area", value: formData.electroral_area, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_permitNo", children: "Property No:" }), _jsx(Input, { type: "text", name: "buss_permitNo", id: "buss_permitNo", value: formData.buss_permitNo, onChange: handleChange })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_type", children: "Business Type:" }), _jsxs(Input, { type: "select", name: "buss_type", id: "buss_type", value: formData.buss_type, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), bussTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.business_type, children: businessType.business_type }, index)); })] })] }) }), _jsxs(Col, { md: 4, children: [_jsxs(FormGroup, { children: [_jsx(Label, { for: "telno", children: "Tel:" }), _jsx(Input, { type: "text", name: "telno", id: "telno", value: formData.telno, onChange: handleChange })] }), _jsxs(FormGroup, { children: [_jsx(Label, { for: "status", children: "Status:" }), _jsxs(Input, { type: "select", name: "status", id: "status", value: formData.status, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), _jsx("option", { value: "Active", children: "Active" }), _jsx("option", { value: "Dormant", children: "Dormant" })] })] })] }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "emailaddress", children: "Email Address:" }), _jsx(Input, { type: "email", name: "emailaddress", id: "emailaddress", value: formData.emailaddress, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "gps_address", children: "GPS Address:" }), _jsx(Input, { type: "text", name: "gps_address", id: "gps_address", placeholder: "Enter GPS Address", value: formData.gps_address, onChange: handleChange })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "property_class", children: "Property Class:" }), _jsxs(Input, { type: "select", name: "property_class", id: "property_class", value: formData.property_class, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), propertyClasses.map(function (classType, index) { return (_jsx("option", { value: classType, children: classType }, index)); })] })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "assessmentby", children: "Collector:" }), _jsxs(Input, { type: "select", name: "assessmentby", id: "assessmentby", value: formData.assessmentby, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), assessments.map(function (assessment, index) { return (_jsx("option", { value: assessment, children: assessment }, index)); })] })] }) })] }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { md: 12, children: _jsx(Button, { color: "primary", onClick: handleAddClick, children: "Add New Record" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }) })] }));
};
