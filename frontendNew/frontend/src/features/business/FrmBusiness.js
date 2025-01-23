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
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
//import axios from 'axios';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice'; //'../assessment/assessmentSlice';
//import { addBusiness } from './businessSlice';
import { createBusiness } from './businessSlice';
//import { useDispatch, useSelector } from 'react-redux';
//import { RootState } from '../../app/store';
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
        Tot_grade: 0,
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
        status: '',
        serialno: 0,
        current_rate: 0,
        property_rate: 0,
        totalmarks: 0,
        meterid: 0,
        metercategory: '',
        emailaddress: '',
        FloorRoomNo: '',
        suburb: '',
        postaladdress: '',
        irsno: '',
        vatno: '',
        blocklayout: '',
        blockdivision: '',
        noofemployees: 0,
        noofbranches: 0,
        detailsofbranches: '',
        contactperson: '',
        contacttelno: '',
        BALANCENEW: 0,
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState([]), businessTypes = _c[0], setBusinessTypes = _c[1];
    var _d = useState([]), propertyClasses = _d[0], setPropertyClasses = _d[1];
    var _e = useState([]), assessments = _e[0], setAssessments = _e[1];
    var dispatch = useAppDispatch();
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
        dispatch(fetchPropertyClasses());
        dispatch(fetchOfficers());
    }, []);
    var electoralArea = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    setElectoralAreas(electoralArea.map(function (area) { return area.electoral_area; }));
    var businessType = useAppSelector(function (state) { return state.businessType.businessTypes; });
    setBusinessTypes(businessType.map(function (type) { return type.buss_type; }));
    var propertyClass = useAppSelector(function (state) { return state.propertyClass.propertyClasses; });
    setPropertyClasses(propertyClass.map(function (classType) { return classType.property_class; }));
    var officer = useAppSelector(function (state) { return state.officer.officers; });
    setAssessments(officer.map(function (officer) { return "".concat(officer.officer_no, " ").concat(officer.officer_name); }));
    // propertyClasses.push(response.data.map((property: any) => property.property_class));
    // setPropertyClasses(response.data.map((property: any) => property.property_class));
    // const loadElectoralAreas = async () => {
    //   try {
    //     // Fetch data from API
    //    // const response = dispatch(fetchElectoralAreas());
    //     const electoralAreas = useAppSelector((state) => state.electoralArea.electoralAreas);
    //     setElectoralAreas(electoralAreas.map((area: any) => area.electoral_area));
    //   } catch (error) {
    //     console.error(error);
    //     alert('Error loading electoral areas');
    //   }
    // };
    // const loadBusinessTypes = async () => {
    //   try {
    //     //const response = dispatch(fetchBusinessTypes());
    //     const businessTypes = useAppSelector((state) => state.businessType.businessTypes); //electoralArea.electoralAreas);
    //     setBusinessTypes(businessTypes.map((type: any) => type.buss_type));
    //   } catch (error) {
    //     console.error(error);
    //     alert('Error loading business types');
    //   }
    // };
    // const loadPropertyClasses = async () => {
    //   try {
    //     const response = dispatch(fetchPropertyClasses());
    //     propertyClasses.push(response.data.map((property: any) => property.property_class));
    //     setPropertyClasses(response.data.map((property: any) => property.property_class));
    //   } catch (error) {
    //     console.error(error);
    //     alert('Error loading property classes');
    //   }
    // };
    // const loadAssessments = async () => {
    //   try {
    //     const response = dispatch(fetchOfficers());
    //     assessments.push(response.data.map((officer: any) => `${officer.officer_no} ${officer.officer_name}`));
    //     setAssessments(response.data.map((officer: any) => `${officer.officer_no} ${officer.officer_name}`));
    //   } catch (error) {
    //     console.error(error);
    //     alert('Error loading assessments');
    //   }
    // };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevData) {
            var _a;
            return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            try {
                // Basic validation (you can expand this)
                if (!formData.buss_no) {
                    alert('Enter the business number');
                    return [2 /*return*/];
                }
                response = dispatch(createBusiness(formData));
                console.log(response);
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
                    Tot_grade: 0,
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
                    status: '',
                    serialno: 0,
                    current_rate: 0,
                    property_rate: 0,
                    totalmarks: 0,
                    meterid: 0,
                    metercategory: '',
                    emailaddress: '',
                    FloorRoomNo: '',
                    suburb: '',
                    postaladdress: '',
                    irsno: '',
                    vatno: '',
                    blocklayout: '',
                    blockdivision: '',
                    noofemployees: 0,
                    noofbranches: 0,
                    detailsofbranches: '',
                    contactperson: '',
                    contacttelno: '',
                    BALANCENEW: 0,
                });
            }
            catch (error) {
                console.error(error);
                alert('Error in adding a record');
            }
            return [2 /*return*/];
        });
    }); };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h3", { children: "Business Data Entry" }) }), _jsx(CardBody, { children: _jsxs(Form, { children: [_jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_name", children: "Business Name:" }), _jsx(Input, { type: "text", name: "buss_name", id: "buss_name", value: formData.buss_name, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_address", children: "Business Address:" }), _jsx(Input, { type: "text", name: "buss_address", id: "buss_address", value: formData.buss_address, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "street_name", children: "Street Name:" }), _jsx(Input, { type: "text", name: "street_name", id: "street_name", value: formData.street_name, onChange: handleChange })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "landmark", children: "Land Mark:" }), _jsx(Input, { type: "text", name: "landmark", id: "landmark", value: formData.landmark, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "electoral_area", children: "Electoral Area:" }), _jsxs(Input, { type: "select", name: "electoral_area", id: "electoral_area", value: formData.electroral_area, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_permitNo", children: "Property No:" }), _jsx(Input, { type: "text", name: "buss_permitNo", id: "buss_permitNo", value: formData.buss_permitNo, onChange: handleChange })] }) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "buss_type", children: "Business Type:" }), _jsxs(Input, { type: "select", name: "buss_type", id: "buss_type", value: formData.buss_type, onChange: handleChange, children: [_jsx("option", { children: "Select..." }), businessTypes.map(function (type, index) { return (_jsx("option", { value: type, children: type }, index)); })] })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "telno", children: "Tel:" }), _jsx(Input, { type: "text", name: "telno", id: "telno", value: formData.telno, onChange: handleChange })] }) }), _jsx(Col, { md: 4, children: _jsxs(FormGroup, { children: [_jsx(Label, { for: "emailaddress", children: "Email Address:" }), _jsx(Input, { type: "email", name: "emailaddress", id: "emailaddress", value: formData.emailaddress, onChange: handleChange })] }) })] }), _jsx(Row, { children: _jsx(Col, { md: 12, children: _jsx(Button, { color: "primary", onClick: handleAddClick, children: "Add New Record" }) }) }), "Property Class: ", propertyClasses, "Collector: ", assessments, _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }) })] }));
};
