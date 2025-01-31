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
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchGradeFees, deleteGradeFee, createGradeFee, setGradeFees } from './gradeFeesSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
var GradeFeesForm = function () {
    var dispatch = useAppDispatch();
    var gradeFees = useAppSelector(function (state) { return state.gradeFees.gradeFees; });
    var _a = useAppSelector(function (state) { return state.businessType; }), businessTypes = _a.businessTypes, loading = _a.loading, error = _a.error;
    // console.log('businessTypes:', businessTypes); // Debugging statement
    console.log('gradeFees:', gradeFees); // Debugging statement
    var _b = useState(''), businessType = _b[0], setBusinessType = _b[1];
    var _c = useState(''), grade = _c[0], setGrade = _c[1];
    var _d = useState(''), description = _d[0], setDescription = _d[1];
    var _e = useState(0), fees = _e[0], setFees = _e[1];
    var _f = useState(''), successMessage = _f[0], setSuccessMessage = _f[1];
    var _g = useState(''), errorFlag = _g[0], setErrorFlag = _g[1];
    var _h = useState([]), localGradeFeesList = _h[0], setLocalGradeFeesList = _h[1];
    var _j = useState(false), loadingFlag = _j[0], setLoadingFlag = _j[1];
    var _k = useState(null), selectedBussType = _k[0], setSelectedBussType = _k[1];
    var _l = useState(null), selectedGrade = _l[0], setSelectedGrade = _l[1];
    var _m = useState(null), selectedDescription = _m[0], setSelectedDescription = _m[1];
    var _o = useState(0), selectedFees = _o[0], setSelectedFees = _o[1];
    useEffect(function () {
        console.log('in useEffect: Fetching grade fees');
        dispatch(fetchGradeFees());
    }, [dispatch]);
    useEffect(function () {
        console.log('in useEffect: Fetching grade fees list');
        fetchGradeFeesList();
    }, []);
    useEffect(function () {
        var fetchAndSetBusinessTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, dispatch(fetchBusinessTypes()).unwrap()];
                    case 1:
                        response = _a.sent();
                        setBusinessType(response.data.Business_Type);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching business types", error_1);
                        alert("Error in fetching business types");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchAndSetBusinessTypes();
    }, [dispatch]);
    var fetchGradeFeesList = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, formattedGradeFees, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    console.log('Fetching grade fees list');
                    loadingFlag = true;
                    setLoadingFlag(loadingFlag); // Start loading
                    return [4 /*yield*/, dispatch(fetchGradeFees()).unwrap()];
                case 1:
                    response = _a.sent();
                    console.log('Fetched grade fees list:', response);
                    if (response && Array.isArray(response)) {
                        console.log('IT IS AN ARRAY');
                        formattedGradeFees = response.map(function (gr) { return ({
                            buss_type: (gr === null || gr === void 0 ? void 0 : gr.buss_type) || '',
                            description: (gr === null || gr === void 0 ? void 0 : gr.description) || '',
                            grade: (gr === null || gr === void 0 ? void 0 : gr.grade) || '',
                            fees: parseFloat(gr === null || gr === void 0 ? void 0 : gr.fees) || 0,
                        }); });
                        setLocalGradeFeesList(formattedGradeFees);
                        dispatch(setGradeFees(formattedGradeFees));
                    }
                    else {
                        console.error('Expected an array of GradeFee objects but found:', response);
                        setErrorFlag('Error fetching grade fees list');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setErrorFlag(error_2.message);
                    return [3 /*break*/, 4];
                case 3:
                    loadingFlag = false;
                    setLoadingFlag(loadingFlag); // Stop loading
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleBusinessTypeChange = function (e) {
        setBusinessType(e.target.value);
    };
    var handleGradeChange = function (e) {
        setGrade(e.target.value.toUpperCase());
    };
    var handleDescriptionChange = function (e) {
        setDescription(e.target.value);
    };
    var handleFeesChange = function (e) {
        var value = e.target.value;
        if (value === '' || !isNaN(Number(value))) {
            setFees(Number(value));
        }
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Adding new grade fee record');
                    if (!businessType || !grade || !description || !fees) {
                        errorFlag = 'Please fill in all fields';
                        setErrorFlag(errorFlag);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(createGradeFee({ buss_type: businessType, grade: grade, description: description, fees: fees })).unwrap()];
                case 2:
                    response = _a.sent();
                    setSuccessMessage(response.message);
                    //dispatch(setGradeFees([...gradeFees, response.data]));
                    dispatch(fetchGradeFees());
                    clearForm();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    setErrorFlag('Error adding record');
                    setSuccessMessage('');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // const handleEditClick = async () => {
    //   if (!businessType || !grade || !description || !fees) {
    //       setErrorFlag('Please fill in all fields');
    //       return;
    //   }
    //   const formattedGradeFees = {
    //     buss_type: businessType, // Renamed from businessType
    //     grade: grade, 
    //     data: {
    //       buss_type: businessType,
    //       grade: grade, 
    //       description: description,
    //       fees: fees
    //     },
    //   };
    //   try {
    //       const response = await dispatch(updateGradeFee(formattedGradeFees)).unwrap();
    //       setSuccessMessage(`Grade fee record updated successfully: ${JSON.stringify(response)}`);
    //       fetchGradeFeesList();
    //       clearForm();
    //       setErrorFlag('');
    //     } catch (error: any) {
    //       console.error(error);
    //       setErrorFlag('Error editing record');
    //     }
    //   }
    var handleDelete = function (bussType, grade) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Deleting grade fee record');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!bussType || !grade) {
                        throw new Error('Select the business type and enter the grade');
                    }
                    return [4 /*yield*/, dispatch(deleteGradeFee({
                            buss_type: bussType,
                            grade: grade
                        })).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log('response: ', response);
                    setSuccessMessage('Grade rate deleted successfully');
                    clearForm();
                    fetchGradeFeesList();
                    setErrorFlag('');
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error deleting grade rate:', error_4);
                    setErrorFlag('Error in deleting record');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleViewClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                fetchGradeFeesList();
            }
            catch (error) {
                console.error(error);
                setErrorFlag('Error fetching grade fees list');
            }
            return [2 /*return*/];
        });
    }); };
    var clearForm = function () {
        setBusinessType('');
        setGrade('');
        setDescription('');
        setFees(0);
    };
    var handleSelectedBusstype = function (bussType, grade) {
        console.log('Selected buss_type:', bussType, 'Selected grade:', grade);
        if (bussType && grade) {
            console.log('there are values in both fields');
            // Find the corresponding record in the gradeFees array
            var selectedRecord = gradeFees.find(function (gr) { return gr.buss_type === bussType && gr.grade === grade; });
            if (selectedRecord) {
                console.log('Found the selected record:', selectedRecord);
                setSelectedBussType(bussType);
                setSelectedGrade(grade);
                selectedDescription = selectedRecord.description;
                setSelectedDescription(selectedDescription);
                selectedFees = selectedRecord.fees || 0;
                setSelectedFees(selectedFees);
            }
            else {
                console.error('No record found for buss_type:', bussType, 'and grade:', grade);
                setSelectedBussType(bussType);
                setSelectedGrade(grade);
                setSelectedDescription(null);
                setSelectedFees(0); // Convert 0 to a string
            }
        }
    };
    if (loading) {
        return _jsx("p", { children: "Loading..." });
    }
    if (error) {
        return _jsxs("p", { children: ["Error: ", error] });
    }
    return (_jsxs(Container, { children: [error && _jsx(Alert, { variant: "danger", children: error }), successMessage && _jsx(Alert, { variant: "success", children: successMessage }), _jsx("p", { className: "mt-3", style: { color: '#C00000' }, children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formBusinessType", children: [_jsx(Form.Label, { children: "Business Type:" }), _jsxs(Form.Select, { value: businessType, onChange: handleBusinessTypeChange, required: true, children: [_jsx("option", { value: "", children: "Select a business type" }), businessTypes && businessTypes.length > 0 ? (businessTypes.map(function (businessType, index) { return (_jsx("option", { value: businessType.Business_Type, children: businessType.Business_Type }, index)); })) : (_jsx("option", { value: "", disabled: true, children: "No Business Types records found" }))] })] }), _jsxs(Form.Group, { controlId: "formGrade", children: [_jsx(Form.Label, { children: "Grade:" }), _jsx(Form.Control, { type: "text", value: grade, onChange: handleGradeChange, maxLength: 50 })] }), _jsxs(Form.Group, { controlId: "formDescription", children: [_jsx(Form.Label, { children: "Description:" }), _jsx(Form.Control, { type: "text", value: description, onChange: handleDescriptionChange, maxLength: 100 })] }), _jsxs(Form.Group, { controlId: "formFees", children: [_jsx(Form.Label, { children: "Fees (GHC):" }), _jsx(Form.Control, { type: "number", step: "0.01", value: fees, onChange: handleFeesChange }), _jsx(Form.Text, { className: "text-muted", children: "GHC" })] }), _jsxs("div", { children: [_jsx(Button, { variant: "primary", onClick: handleAddClick, className: "uniform-button", children: "Add New Record" }), _jsx(Button, { variant: "info", onClick: handleViewClick, className: "uniform-button", children: "View Grades" }), _jsx(Link, { to: "/main", className: "btn btn-primary uniform-button", children: "Go Back" })] })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, className: "mt-3", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Business Type" }), _jsx("th", { children: "Grade" }), _jsx("th", { children: "Description" }), _jsx("th", { children: "Fees (GHC)" })] }) }), _jsx("tbody", { children: localGradeFeesList && localGradeFeesList.length > 0 ? (localGradeFeesList.map(function (gr, index) { return (_jsxs("tr", { "data-buss_type": gr.buss_type, "data-grade": gr.grade, onClick: function () { return handleSelectedBusstype(gr.buss_type, gr.grade); }, className: selectedBussType === gr.buss_type && selectedGrade === gr.grade ? 'selected' : '', children: [_jsx("td", { children: gr.buss_type }), _jsx("td", { children: gr.grade }), _jsx("td", { children: gr.description }), _jsx("td", { children: gr.fees.toString() }), _jsx("td", { children: _jsx("button", { onClick: function (e) {
                                            e.stopPropagation(); // Prevent the row click event from firing
                                            handleDelete(gr.buss_type, gr.grade);
                                        }, className: "uniform-button", children: "Delete" }) })] }, index)); })) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, children: "No Grade Fees records found" }) })) })] })] }));
};
export default GradeFeesForm;
