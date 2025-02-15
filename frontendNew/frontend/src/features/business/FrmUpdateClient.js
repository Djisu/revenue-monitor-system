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
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchBusinesses, fetchBusinessById, updateBusiness } from './businessSlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice';
//import {fetchGradeRates} from '../gradeRate/gradeRateSlice';
import { fetchPropertyRateByPropertyClassAndFiscalyear } from '../propertyRate/propertyRateSlice';
var UpdateClientForm = function () {
    // State management for form fields
    var _a = useState(0), businessNo = _a[0], setBusinessNo = _a[1];
    var _b = useState(''), businessName = _b[0], setBusinessName = _b[1];
    var _c = useState(''), ceo = _c[0], setCeo = _c[1];
    var _d = useState(''), businessAddress = _d[0], setBusinessAddress = _d[1];
    var _e = useState(''), telNo = _e[0], setTelNo = _e[1];
    var _f = useState(''), businessType = _f[0], setBusinessType = _f[1];
    var _g = useState(''), bussTown = _g[0], setBussTown = _g[1];
    //const [bussPermitNo, setBussPermitNo] = useState('');
    var _h = useState(''), streetName = _h[0], setStreetName = _h[1];
    var _j = useState(''), landMark = _j[0], setLandMark = _j[1];
    //const [electoralArea, setElectoralArea] = useState('');
    var _k = useState(''), propertyClass = _k[0], setPropertyClass = _k[1];
    var _l = useState(''), totGrade = _l[0], setTotGrade = _l[1];
    var _m = useState(0), propertyRate = _m[0], setPropertyRate = _m[1];
    var _o = useState(0), currentRate = _o[0], setCurrentRate = _o[1];
    var _p = useState(0), balanceBF = _p[0], setBalanceBF = _p[1];
    var _q = useState('Active'), status = _q[0], setStatus = _q[1];
    var _r = useState(''), emailAddress = _r[0], setEmailAddress = _r[1];
    var _s = useState(''), gpsAddress = _s[0], setGpsAddress = _s[1];
    var _t = useState(0), noOfBranches = _t[0], setNoOfBranches = _t[1];
    var _u = useState(0), noOfEmployees = _u[0], setNoOfEmployees = _u[1];
    // State management for checkboxes
    var _v = useState(0), strategicGrade = _v[0], setStrategicGrade = _v[1];
    var _w = useState(0), productGrade = _w[0], setProductGrade = _w[1];
    var _x = useState(0), busPopGrade = _x[0], setBusPopGrade = _x[1];
    var _y = useState(0), busEnvGrade = _y[0], setBusEnvGrade = _y[1];
    var _z = useState(0), sizeGrade = _z[0], setSizeGrade = _z[1];
    var _0 = useState(0), noGrade = _0[0], setNoGrade = _0[1];
    var _1 = useState(0), busOpeGrade = _1[0], setBusOpeGrade = _1[1];
    var _2 = useState(0), comAvaGrade = _2[0], setComAvaGrade = _2[1];
    // State management for total marks and grade
    var _3 = useState(0), totalMarks = _3[0], setTotalMarks = _3[1];
    var _4 = useState(''), finalGrade = _4[0], setFinalGrade = _4[1];
    // State management for dropdowns
    ////////
    var _5 = useState([]), electoralAreas = _5[0], setElectoralAreas = _5[1];
    var _6 = useState([]), businessTypes = _6[0], setBusinessTypes = _6[1];
    var _7 = useState([]), propertyClasses = _7[0], setPropertyClasses = _7[1];
    var _8 = useState([]), assessments = _8[0], setAssessments = _8[1];
    ///////
    var _9 = useState(''), electoralArea = _9[0], setElectoralArea = _9[1];
    var _10 = useState(''), assessment = _10[0], setAssessment = _10[1];
    var _11 = useState(new Date()), transdate = _11[0], setTransDate = _11[1];
    var _12 = useState([]), businesses = _12[0], setBusinesses = _12[1];
    var _13 = useState(''), selectedBusinessType = _13[0], setSelectedBusinessType = _13[1];
    var _14 = useState(''), selectedOfficer = _14[0], setSelectedOfficer = _14[1];
    var dispatch = useAppDispatch();
    // Fetch data on component mount
    useEffect(function () {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
        dispatch(fetchPropertyClasses());
        dispatch(fetchOfficers());
    }, [dispatch]);
    /////////
    // Get property rate and current rate from the Redux store
    //const propertyRateData = useAppSelector((state) => state.propertyRate.rates);
    // Get businesses from the Redux store
    var businessesData = useAppSelector(function (state) { return state.business.businesses; });
    //console.log('businessesData:', businessesData);
    useEffect(function () {
        if (Array.isArray(businessesData)) {
            setBusinesses(businessesData);
        }
        else {
            console.error('Expected businesses to be an array but got:', businessesData);
        }
    }, [businessesData]);
    var electoralAreaResponse = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    //console.log('electoralAreaResponse:', electoralAreaResponse);
    useEffect(function () {
        if (Array.isArray(electoralAreaResponse)) {
            setElectoralAreas(electoralAreaResponse.map(function (area) { return area.electoral_area; }));
        }
        else {
            console.error('Expected electoralArea to be an array but got:', electoralAreaResponse);
        }
    }, [electoralAreaResponse]);
    // Get business types from the Redux store
    var businessTypesItems = useAppSelector(function (state) { return state.businessType.businessTypes; });
    useEffect(function () {
        if (Array.isArray(businessTypesItems)) {
            var types = businessTypesItems.map(function (business) { return business.Business_Type; });
            setBusinessTypes(types);
        }
        else {
            console.error('Expected businessType to be an array but got:', businessTypesItems);
        }
    }, [businessTypesItems]); // Dependency should be businessTypesItems, not selectedBusinessType
    // Get property classes from the Redux store
    var propertyClassData = useAppSelector(function (state) { return state.propertyClass.propertyClasses; });
    //console.log('propertyClassData:', propertyClassData);
    useEffect(function () {
        setPropertyClasses(propertyClassData.map(function (classType) { return classType.property_class; }));
    }, [propertyClassData]);
    // Get officers from the Redux store
    var officers = useAppSelector(function (state) { return state.officer.officers; });
    useEffect(function () {
        if (Array.isArray(officers)) {
            var officerNames = officers.map(function (officer) { return officer.officer_name; });
            setAssessments(officerNames);
        }
        else {
            console.error('Expected officers to be an array but got:', officers);
        }
    }, [officers]);
    ////////
    var handleRadioChange = function (value, setter) {
        console.log('in handleRadioChange, value:', value);
        setter(value);
        updateTotalMarks();
    };
    // Update total marks whenever any grade changes
    useEffect(function () {
        updateTotalMarks();
    }, [strategicGrade, productGrade, busPopGrade, busEnvGrade, sizeGrade, noGrade, busOpeGrade, comAvaGrade]);
    var updateTotalMarks = function () {
        var marks = strategicGrade + productGrade + busPopGrade + busEnvGrade + sizeGrade + noGrade + busOpeGrade + comAvaGrade;
        console.log('in updateTotalMarks, marks:', marks);
        setTotalMarks(marks);
        determineFinalGrade(marks);
    };
    // Determine final grade
    var determineFinalGrade = function (marks) {
        // Define your grading logic here
        if (marks >= 40) { // 8 * 5 = 40
            setFinalGrade('Excellent');
        }
        else if (marks >= 32) { // 8 * 4 = 32
            setFinalGrade('Very Good');
        }
        else if (marks >= 24) { // 8 * 3 = 24
            setFinalGrade('Good');
        }
        else if (marks >= 16) { // 8 * 2 = 16
            setFinalGrade('Average');
        }
        else {
            setFinalGrade('L-Average');
        }
    };
    var mapToBusinessData = function (data) {
        return {
            buss_name: data.businessName,
            ceo: data.ceo,
            buss_address: data.businessAddress,
            telno: data.telNo,
            buss_type: data.businessType,
            buss_town: data.buss_town,
            street_name: data.streetName,
            landmark: data.landMark,
            electroral_area: electoralArea,
            property_class: propertyClass,
            tot_grade: finalGrade,
            current_rate: data.currentRate,
            property_rate: data.propertyRate,
            emailaddress: data.emailAddress,
            totalmarks: data.totalMarks,
            balance: data.balanceBF,
            status: data.status,
            strategiclocation: data.strategicGrade,
            productvariety: data.productGrade,
            businesspopularity: data.busPopGrade,
            businessenvironment: data.busEnvGrade,
            sizeofbusiness: data.sizeGrade,
            numberofworkingdays: data.noGrade,
            businessoperatingperiod: data.busOpeGrade,
            competitorsavailable: data.comAvaGrade,
            assessment: assessment,
            transdate: data.transdate,
            gps_address: gpsAddress,
            noOfEmployees: data.noOfEmployees,
            noOfBranches: data.noOfBranches,
        };
    };
    var handleEditClick = function () {
        console.log('in handleEditClick Edit record');
        console.log('tot_grade: ', finalGrade);
        var updatedBusiness = {
            buss_no: businessNo,
            data: mapToBusinessData({
                businessName: businessName,
                ceo: ceo,
                businessAddress: businessAddress,
                telNo: telNo,
                businessType: businessType,
                buss_town: bussTown,
                streetName: streetName,
                landMark: landMark,
                electoralArea: electoralArea,
                propertyClass: propertyClass,
                totGrade: finalGrade,
                currentRate: currentRate,
                propertyRate: propertyRate,
                totalMarks: totalMarks,
                balanceBF: balanceBF,
                status: status,
                emailAddress: emailAddress,
                gps_address: gpsAddress,
                strategicGrade: strategicGrade,
                productGrade: productGrade,
                busPopGrade: busPopGrade,
                busEnvGrade: busEnvGrade,
                sizeGrade: sizeGrade,
                noGrade: noGrade,
                busOpeGrade: busOpeGrade,
                comAvaGrade: comAvaGrade,
                assessment: assessments[0],
                transdate: transdate,
                noOfEmployees: noOfEmployees,
                noOfBranches: noOfBranches
            })
        };
        console.log('THIS IS THE UPDATED gps_address:  ', gpsAddress);
        dispatch(updateBusiness({
            buss_no: businessNo,
            data: __assign(__assign({}, updatedBusiness.data), { tot_grade: finalGrade, assessmentby: selectedOfficer || '', totalmarks: updatedBusiness.data.totalmarks || 0, buss_no: updatedBusiness.buss_no || 0, noofemployees: updatedBusiness.data.noOfEmployees || 0, noofbranches: updatedBusiness.data.noOfBranches || 0, gps_address: gpsAddress || '' })
        }));
        console.log('Edit record:', updatedBusiness);
    };
    var handleExitClick = function () {
        // Reset form fields
        setBusinessNo(0);
        setBusinessName('');
        setCeo('');
        setBusinessAddress('');
        setTelNo('');
        setBusinessType('');
        setStreetName('');
        setLandMark('');
        setElectoralAreas([]);
        setPropertyClasses([]);
        totGrade = '';
        setTotGrade(totGrade);
        setTotGrade(finalGrade);
        setPropertyRate(0);
        setCurrentRate(0);
        setBalanceBF(0);
        setStatus('');
        setEmailAddress('');
        setGpsAddress('');
        setNoOfEmployees(0);
        setNoOfBranches(0);
        setStrategicGrade(0);
        setProductGrade(0);
        setBusPopGrade(0);
        setBusEnvGrade(0);
        setSizeGrade(0);
        setNoGrade(0);
        setBusOpeGrade(0);
        setComAvaGrade(0);
        setAssessments([]);
        assessment = '';
        setAssessment(assessment);
        setTotalMarks(0);
        setFinalGrade('');
        setTransDate(new Date());
        console.log('Exit');
    };
    var handleViewClick = function () {
        // Refetch businesses to reload spreadsheet
        dispatch(fetchBusinesses());
        console.log('Reload spreadsheet');
    };
    var handleListViewItemClick = function (item) {
        // Populate form fields with selected item data
        setBusinessNo(item.buss_no);
        setBusinessName(item.buss_name);
        setBusinessAddress(item.buss_address);
        setBusinessType(item.buss_type);
        setSelectedBusinessType(item.buss_type);
        setBussTown(item.buss_town);
        setStreetName(item.street_name);
        setLandMark(item.landmark);
        setElectoralAreas(item.electroral_area);
        setPropertyClasses(item.property_class);
        setTotGrade(item.tot_grade);
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
        setAssessments(item.assessmentby);
        selectedOfficer = item.assessmentby;
        setSelectedOfficer(item.assessmentby);
        setTransDate(item.transdate);
        setBalanceBF(item.balance);
        setStatus(item.status);
        setPropertyRate(item.property_rate);
        setEmailAddress(item.emailaddress);
        setNoOfBranches(item.no_of_branches);
        setNoOfEmployees(item.no_of_employees);
        setTotalMarks(item.totalmarks);
        setGpsAddress(item.gps_address);
        setFinalGrade(item.tot_grade);
    };
    var getRate = function (propertyClass) { return __awaiter(void 0, void 0, void 0, function () {
        var propClass, fiscalYear, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in getRate, onBlur triggered with:', propertyClass);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    propClass = propertyClass;
                    fiscalYear = Number(new Date().getFullYear());
                    return [4 /*yield*/, dispatch(fetchPropertyRateByPropertyClassAndFiscalyear({ property_Class: propClass, fiscalyear: fiscalYear })).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log('response:', response);
                    // Check if response is an array or an object
                    if (Array.isArray(response) && response[0].rate !== undefined) {
                        setPropertyRate(response[0].rate);
                    }
                    else if (response && response.rate !== undefined) {
                        setPropertyRate(response.rate);
                    }
                    else {
                        console.error('rate is undefined in the response');
                        setPropertyRate(0); // or some default value
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching property rate:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getBusiness = function (businessId) { return __awaiter(void 0, void 0, void 0, function () {
        var id, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in getBusiness, onBlur triggered with:', businessId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    id = Number(businessId);
                    console.log('before  dispatch(fetchBusinessById(id)).unwrap();');
                    return [4 /*yield*/, dispatch(fetchBusinessById(id)).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:');
                    // Check if response is an array or an object
                    if (Array.isArray(response)) {
                        console.log('Response is an array:', response[0]);
                        // set response fields to the following state variables
                        setBusinessNo(response[0].buss_no);
                        setBusinessName(response[0].buss_name);
                        setBusinessAddress(response[0].buss_address);
                        // Populate form fields with selected item data
                        setBusinessNo(response[0].buss_no);
                        setBusinessName(response[0].buss_name);
                        setBusinessAddress(response[0].buss_address);
                        setBusinessType(response[0].buss_type);
                        // setSelectedBusinessType(response[0].buss_type);
                        console.log('buss_town:', response[0].BUSS_TOWN);
                        setBussTown(response[0].BUSS_TOWN);
                        setStreetName(response[0].street_name);
                        setLandMark(response[0].landmark);
                        setElectoralArea(response[0].electroral_area);
                        setPropertyClass(response[0].property_class);
                        getRate(response[0].property_class);
                        setCeo(response[0].ceo);
                        setTelNo(response[0].telno);
                        console.log('response[0].assessmentby:  ', response[0].assessmentby);
                        selectedOfficer = response[0].assessmentby;
                        setSelectedOfficer(response[0].assessmentby);
                        setAssessment(response[0].assessmentby);
                        console.log('selectedOfficer:  ', selectedOfficer);
                        console.log('assessments:  ', assessments);
                        console.log('assessment:  ', assessment);
                        setAssessments(response[0].assessmentby);
                        setTransDate(response[0].transdate);
                        setStatus(response[0].status);
                        setEmailAddress(response[0].emailaddress);
                        setSelectedBusinessType(response[0].buss_type);
                        setGpsAddress(response[0].gps_address);
                        // alert("Business found")
                    }
                    else if (response) {
                        console.log('Response is an object:', response);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error fetching businesses:', error_2);
                    if (fetchBusinessById.rejected.match(error_2)) {
                        alert('Error fetching business');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "container", style: { backgroundColor: '#add8e6' }, children: _jsxs("div", { children: [_jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h4", { className: "text-primary", children: "Update Old Business Client" }) }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Number:" }), _jsx(Form.Control, { value: businessNo, onChange: function (e) { return setBusinessNo(Number(e.target.value)); }, onBlur: function (e) { return getBusiness(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Name:" }), _jsx(Form.Control, { value: businessName, onChange: function (e) { return setBusinessName(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "CEO:" }), _jsx(Form.Control, { value: ceo, onChange: function (e) { return setCeo(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Address:" }), _jsx(Form.Control, { value: businessAddress, onChange: function (e) { return setBusinessAddress(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Tel No:" }), _jsx(Form.Control, { value: telNo, onChange: function (e) { return setTelNo(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Type:" }), _jsxs(Form.Select, { value: selectedBusinessType, onChange: function (e) { return setSelectedBusinessType(e.target.value); }, children: [_jsx("option", { children: "Select Business Type" }), businessTypes.map(function (type, index) { return (_jsx("option", { value: type, children: type }, index)); })] })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Town:" }), _jsx(Form.Control, { value: bussTown, onChange: function (e) { return setBussTown(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Street Name:" }), _jsx(Form.Control, { value: streetName, onChange: function (e) { return setStreetName(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Land Mark:" }), _jsx(Form.Control, { value: landMark, onChange: function (e) { return setLandMark(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Electoral Area:" }), _jsxs(Form.Select, { value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { children: "Select Electoral Area" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Property Class:" }), _jsxs(Form.Select, { value: propertyClass, onChange: function (e) { return setPropertyClass(e.target.value); }, onBlur: function (e) { return getRate(e.target.value); }, children: [_jsx("option", { children: "Select Property Class" }), propertyClasses.map(function (cls, index) { return (_jsx("option", { value: cls, children: cls }, index)); })] })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Status:" }), _jsx(Form.Control, { value: status, onChange: function (e) { return setStatus(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Collector:" }), _jsxs(Form.Select, { value: assessment, onChange: function (e) { return setAssessment(e.target.value); }, children: [_jsx("option", { children: "Select Collector" }), officers.map(function (officer, index) { return (_jsx("option", { value: officer.officer_name, children: officer.officer_name }, index)); })] })] }) })] }), _jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Email Address:" }), _jsx(Form.Control, { value: emailAddress, onChange: function (e) { return setEmailAddress(e.target.value); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "GPS Address:" }), _jsx(Form.Control, { value: gpsAddress, onChange: function (e) { return setGpsAddress(e.target.value); } })] }) }), _jsx(Row, { className: "mb-2", children: _jsx(Col, { children: _jsx("p", { className: "text-primary", children: "Fill the Values Below" }) }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Property Rate:" }), _jsx(Form.Control, { value: propertyRate, onChange: function (e) { return setPropertyRate(Number(e.target.value)); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Current Rate:" }), _jsx(Form.Control, { value: currentRate, onChange: function (e) { return setCurrentRate(Number(e.target.value)); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Balance BF:" }), _jsx(Form.Control, { value: balanceBF, onChange: function (e) { return setBalanceBF(Number(e.target.value)); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "No Of Branches:" }), _jsx(Form.Control, { value: noOfBranches, onChange: function (e) { return setNoOfBranches(Number(e.target.value)); } })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "No Of Employees:" }), _jsx(Form.Control, { value: noOfEmployees, onChange: function (e) { return setNoOfEmployees(Number(e.target.value)); } })] }) })] }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Strategic Location" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "radio", name: "strategicLocation", id: "strategicLocation1", value: 5, checked: strategicGrade === 5, onChange: function () { return handleRadioChange(5, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "radio", name: "strategicLocation", id: "strategicLocation2", value: 4, checked: strategicGrade === 4, onChange: function () { return handleRadioChange(4, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "radio", name: "strategicLocation", id: "strategicLocation3", value: 3, checked: strategicGrade === 3, onChange: function () { return handleRadioChange(3, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "radio", name: "strategicLocation", id: "strategicLocation4", value: 2, checked: strategicGrade === 2, onChange: function () { return handleRadioChange(2, setStrategicGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Avg", type: "radio", name: "strategicLocation", id: "strategicLocation5", value: 1, checked: strategicGrade === 1, onChange: function () { return handleRadioChange(1, setStrategicGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Product Grade" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "radio", name: "productGrade", id: "productGrade1", value: 5, checked: productGrade === 5, onChange: function () { return handleRadioChange(5, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "radio", name: "productGrade", id: "productGrade2", value: 4, checked: productGrade === 4, onChange: function () { return handleRadioChange(4, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "radio", name: "productGrade", id: "productGrade3", value: 3, checked: productGrade === 3, onChange: function () { return handleRadioChange(3, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "radio", name: "productGrade", id: "productGrade4", value: 2, checked: productGrade === 2, onChange: function () { return handleRadioChange(2, setProductGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Avg", type: "radio", name: "productGrade", id: "productGrade5", value: 1, checked: productGrade === 1, onChange: function () { return handleRadioChange(1, setProductGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Population Grade" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "radio", name: "busPopGrade", id: "busPopGrade1", value: 5, checked: busPopGrade === 5, onChange: function () { return handleRadioChange(5, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "radio", name: "busPopGrade", id: "busPopGrade2", value: 4, checked: busPopGrade === 4, onChange: function () { return handleRadioChange(4, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "radio", name: "busPopGrade", id: "busPopGrade3", value: 3, checked: busPopGrade === 3, onChange: function () { return handleRadioChange(3, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "radio", name: "busPopGrade", id: "busPopGrade4", value: 2, checked: busPopGrade === 2, onChange: function () { return handleRadioChange(2, setBusPopGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Avg", type: "radio", name: "busPopGrade", id: "busPopGrade5", value: 1, checked: busPopGrade === 1, onChange: function () { return handleRadioChange(1, setBusPopGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Environment Grade" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "radio", name: "busEnvGrade", id: "busEnvGrade1", value: 5, checked: busEnvGrade === 5, onChange: function () { return handleRadioChange(5, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "radio", name: "busEnvGrade", id: "busEnvGrade2", value: 4, checked: busEnvGrade === 4, onChange: function () { return handleRadioChange(4, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "radio", name: "busEnvGrade", id: "busEnvGrade3", value: 3, checked: busEnvGrade === 3, onChange: function () { return handleRadioChange(3, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "radio", name: "busEnvGrade", id: "busEnvGrade4", value: 2, checked: busEnvGrade === 2, onChange: function () { return handleRadioChange(2, setBusEnvGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Avg", type: "radio", name: "busEnvGrade", id: "busEnvGrade5", value: 1, checked: busEnvGrade === 1, onChange: function () { return handleRadioChange(1, setBusEnvGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Size Grade" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Excellent", type: "radio", name: "sizeGrade", id: "sizeGrade1", value: 5, checked: sizeGrade === 5, onChange: function () { return handleRadioChange(5, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "Very Good", type: "radio", name: "sizeGrade", id: "sizeGrade2", value: 4, checked: sizeGrade === 4, onChange: function () { return handleRadioChange(4, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "Good", type: "radio", name: "sizeGrade", id: "sizeGrade3", value: 3, checked: sizeGrade === 3, onChange: function () { return handleRadioChange(3, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "Average", type: "radio", name: "sizeGrade", id: "sizeGrade4", value: 2, checked: sizeGrade === 2, onChange: function () { return handleRadioChange(2, setSizeGrade); } }), _jsx(Form.Check, { inline: true, label: "L-Avg", type: "radio", name: "sizeGrade", id: "sizeGrade5", value: 1, checked: sizeGrade === 1, onChange: function () { return handleRadioChange(1, setSizeGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "No Of Working Days" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "7 Days", type: "radio", name: "noOfWorkingDays", id: "noOfWorkingDays1", value: 5, checked: noGrade === 5, onChange: function () { return handleRadioChange(5, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "6 Days", type: "radio", name: "noOfWorkingDays", id: "noOfWorkingDays2", value: 4, checked: noGrade === 4, onChange: function () { return handleRadioChange(4, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "5 Days", type: "radio", name: "noOfWorkingDays", id: "noOfWorkingDays3", value: 3, checked: noGrade === 3, onChange: function () { return handleRadioChange(3, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "4 Days", type: "radio", name: "noOfWorkingDays", id: "noOfWorkingDays4", value: 2, checked: noGrade === 2, onChange: function () { return handleRadioChange(2, setNoGrade); } }), _jsx(Form.Check, { inline: true, label: "3 Days", type: "radio", name: "noOfWorkingDays", id: "noOfWorkingDays5", value: 1, checked: noGrade === 1, onChange: function () { return handleRadioChange(1, setNoGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Business Operating Period" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "24 Hours", type: "radio", name: "businessOperatingPeriod", id: "businessOperatingPeriod1", value: 5, checked: busOpeGrade === 5, onChange: function () { return handleRadioChange(5, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "18 Hours", type: "radio", name: "businessOperatingPeriod", id: "businessOperatingPeriod2", value: 4, checked: busOpeGrade === 4, onChange: function () { return handleRadioChange(4, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "12 Hours", type: "radio", name: "businessOperatingPeriod", id: "businessOperatingPeriod3", value: 3, checked: busOpeGrade === 3, onChange: function () { return handleRadioChange(3, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "8 Hours", type: "radio", name: "businessOperatingPeriod", id: "businessOperatingPeriod4", value: 2, checked: busOpeGrade === 2, onChange: function () { return handleRadioChange(2, setBusOpeGrade); } }), _jsx(Form.Check, { inline: true, label: "6 Hours", type: "radio", name: "businessOperatingPeriod", id: "businessOperatingPeriod5", value: 1, checked: busOpeGrade === 1, onChange: function () { return handleRadioChange(1, setBusOpeGrade); } })] }) }) }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Competitors Available" }), _jsx("br", {}), _jsx(Form.Check, { inline: true, label: "Pure Mono", type: "radio", name: "competitorsAvailable", id: "competitorsAvailable1", value: 5, checked: comAvaGrade === 5, onChange: function () { return handleRadioChange(5, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Mono(3)", type: "radio", name: "competitorsAvailable", id: "competitorsAvailable2", value: 4, checked: comAvaGrade === 4, onChange: function () { return handleRadioChange(4, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Moderate(2)", type: "radio", name: "competitorsAvailable", id: "competitorsAvailable3", value: 3, checked: comAvaGrade === 3, onChange: function () { return handleRadioChange(3, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Fierce(1)", type: "radio", name: "competitorsAvailable", id: "competitorsAvailable4", value: 2, checked: comAvaGrade === 2, onChange: function () { return handleRadioChange(2, setComAvaGrade); } }), _jsx(Form.Check, { inline: true, label: "Not Applicable(0)", type: "radio", name: "competitorsAvailable", id: "competitorsAvailable5", value: 1, checked: comAvaGrade === 1, onChange: function () { return handleRadioChange(1, setComAvaGrade); } })] }) }) }), _jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Total Marks:" }), _jsx(Form.Control, { value: totalMarks, readOnly: true })] }) }), _jsx(Row, { className: "mb-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { children: "Final Grade:" }), _jsx(Form.Control, { value: finalGrade, readOnly: true })] }) })] }), _jsx("div", { children: _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" })] }) }), _jsx("tbody", { children: businesses.map(function (business) { return (_jsxs("tr", { onClick: function () { return handleListViewItemClick(business); }, children: [_jsx("td", { children: business.buss_no }), _jsx("td", { children: business.buss_name })] }, business.buss_no)); }) })] }) }) }) }), _jsxs("div", { children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleEditClick, children: "Update Business Client" }) }) }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: handleExitClick, children: "Zero All Values" }) }) }), _jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleViewClick, children: "RELOAD SPREADSHEET" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", style: { textDecoration: "none" }, children: "Go Back" }) }) })] })] }) }));
    ;
};
export default UpdateClientForm;
