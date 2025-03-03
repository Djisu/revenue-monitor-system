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
import { fetchBusinessTypes, createBusinessType, deleteBusinessType } from './businessTypeSlice';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
// interface BusinessTypeData {
//     business_Type: string;
// }
// Define the interface for the component state
// interface BusinessTypeState {
//     businessTypes: BusinessTypeData[];
// }
var FrmBusinessType = function () {
    var _a = useState([]), businessTypeList = _a[0], setBusinessTypeList = _a[1];
    var _b = useState(false), isDeleting = _b[0], setIsDeleting = _b[1];
    var dispatch = useAppDispatch();
    var _c = useAppSelector(function (state) { return state.businessType; }), businessTypes = _c.businessTypes, loading = _c.loading, error = _c.error;
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
                        console.log("Fetched business types:", response.data); // Debugging statement
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
    var handleBusinessTypeChange = function (e) {
        setBusinessTypeList(e.target.value.split(','));
        console.log("Business type list:", businessTypeList); // Debugging statement
    };
    var handleAddClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Add clicked");
                    if (businessTypeList.length === 0) {
                        alert("Enter a business type");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, dispatch(createBusinessType(businessTypeList[0])).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log("Added business type:", response.message); // Debugging statement
                    alert("Record successfully added: ".concat(response.message));
                    setBusinessTypeList([]); // Reset the state to an empty array
                    return [4 /*yield*/, dispatch(fetchBusinessTypes()).unwrap()];
                case 3:
                    result = _a.sent();
                    console.log("Refreshed business types:", result.data); // Debugging statement
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error adding business type", error_2);
                    alert("Error in adding a record");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Delete clicked, handleDeleteClick");
                    console.log(businessTypeList);
                    if (!businessTypeList) {
                        alert("Enter a business type");
                        return [2 /*return*/];
                    }
                    setIsDeleting(true); // Set deleting state to true
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, dispatch(deleteBusinessType(businessTypeList[0])).unwrap()];
                case 2:
                    response = _a.sent();
                    console.log("Deleted business type:", response.message); // Debugging statement
                    if (response.success) {
                        alert(response.message);
                        setBusinessTypeList([]);
                        // Optimistically remove the business type
                        setBusinessTypeList(function (prevTypes) {
                            return prevTypes.filter(function (type) { return type !== businessTypeList[0]; });
                        });
                    }
                    else {
                        alert("Record does not exist");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error deleting business type", error_3);
                    alert("Error in deleting a record");
                    return [3 /*break*/, 5];
                case 4:
                    setIsDeleting(false); // Reset deleting state
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRowClick = function (bussType) {
        console.log("Row clicked:", bussType);
        //setBusinessTypeList(prevList => [...prevList, bussType.business_Type]);
        setBusinessTypeList([bussType.Business_Type]);
    };
    return (_jsxs(Container, { fluid: true, children: [_jsx(Row, { className: "mb-3", children: _jsx(Col, { children: _jsx("h1", { className: "text-center text-primary", children: "MARCORY MUNICIPAL ASSEMBLY" }) }) }), _jsx(Row, { children: _jsx(Col, { children: _jsx("h3", { className: "text-center text-danger", children: "BUSINESS TYPE DATA ENTRY" }) }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsxs(Form.Group, { controlId: "formBusinessType", children: [_jsx(Form.Label, { children: "Business Type:" }), _jsx(Form.Control, { type: "text", value: businessTypeList, onChange: handleBusinessTypeChange, required: true })] }) }) }), _jsxs(Row, { className: "mt-3", children: [_jsx(Col, { children: _jsx(Button, { variant: "primary", onClick: handleAddClick, children: "Add New Record" }) }), _jsx(Col, { children: _jsx(Button, { variant: "danger", onClick: handleDeleteClick, disabled: isDeleting, children: "Delete Old Record" }) })] }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h2", { children: "List of Business Types" }), loading && _jsx("p", { children: "Loading..." }), error && _jsxs("p", { children: ["Error: ", error] }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsx("tr", { children: _jsx("th", { children: "Business Type" }) }) }), _jsx("tbody", { children: businessTypes.map(function (bussType, index) { return (_jsx("tr", { onClick: function () { return handleRowClick(bussType); }, children: _jsx("td", { children: bussType.Business_Type }) }, index)); }) })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) })] }));
};
export default FrmBusinessType;
