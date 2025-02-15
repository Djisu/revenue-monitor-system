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
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';
import { fetchBusinesses, processOperatingPermits } from '../business/businessSlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
var frmBusinessOperatingPermit = function () {
    var BusinessesData = useAppSelector(function (state) { return state.business.businesses; });
    var ElectoralAreasData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    var _a = useState(0), fiscalYear = _a[0], setFiscalYear = _a[1];
    var _b = useState(''), electoralArea = _b[0], setElectoralArea = _b[1];
    var _c = useState([]), electoralAreas = _c[0], setElectoralAreas = _c[1];
    var dispatch = useAppDispatch();
    useEffect(function () {
        dispatch(fetchBusinesses());
        dispatch(fetchElectoralAreas()); // Ensure the action creator is called
    }, []);
    useEffect(function () {
        if (ElectoralAreasData && Array.isArray(ElectoralAreasData)) {
            setElectoralAreas(ElectoralAreasData.map(function (area) { return area.electoral_area; }));
            console.log('electoralAreasData:', ElectoralAreasData); // Debugging statement
            console.log('electoralAreas:', electoralAreas);
        }
        else {
            console.error('Expected ElectoralAreasData to be an array but got:', ElectoralAreasData);
        }
    }, [ElectoralAreasData]); // Only listen to changes in ElectoralAreasData
    var handleElectoralAreaChange = function (event) {
        var target = event.target; //as HTMLSelectElement;
        var selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
    };
    var handleFiscalYearChange = function (event) {
        console.log('handleFiscalYearChange:', event.target.value);
        setFiscalYear(parseInt(event.target.value, 10));
    };
    var handlePreviewDemandNotices = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fiscalYear === 0) {
                        alert("Kindly select the fiscal year");
                        return [2 /*return*/];
                    }
                    if (!electoralArea) {
                        alert("Kindly select the electoral area");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(processOperatingPermits({ electoralArea: electoralArea, fiscalYear: fiscalYear }))];
                case 2:
                    response = _a.sent();
                    if (processOperatingPermits.fulfilled.match(response)) {
                        alert(response.payload.message); // Assuming response contains a payload with a message
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    alert("Error in processing demand notices");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx(Container, { children: _jsxs("div", { children: [_jsx(Row, { children: _jsxs(Col, { className: "text-center mt-3", children: [_jsx("h2", { className: "text-primary", children: "Business Operating Permit Demand Notice" }), _jsx("h4", { className: "text-info", children: "MARCORY MUNICIPAL ASSEMBLY" })] }) }), _jsxs("div", { children: [_jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Electoral Area:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: handleElectoralAreaChange, children: [_jsx("option", { value: "", children: "Select..." }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { className: "mt-3", children: [_jsx(Form.Label, { className: "font-weight-bold", children: "Fiscal Year:" }), _jsx(Form.Control, { type: "number", value: fiscalYear.toString(), onChange: handleFiscalYearChange })] }) })] }), _jsxs("div", { children: [_jsx(Row, { className: "mt-3", children: _jsx(Col, { className: "text-center", children: _jsx(Button, { variant: "primary", onClick: handlePreviewDemandNotices, children: "Produce Demand Notices" }) }) }), _jsx(Row, { className: "mt-3", children: _jsxs(Col, { children: [_jsx("h3", { className: "font-weight-bold", children: "List of Properties" }), _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "BUSS NO" }), _jsx("th", { children: "BUSS NAME" })] }) }), _jsx("tbody", { children: BusinessesData.map(function (property) { return (_jsxs("tr", { children: [_jsx("td", { children: property.buss_no }), _jsx("td", { children: property.buss_name })] }, property.buss_no)); }) })] })] }) })] }), _jsx("div", { children: _jsx(Row, { className: "mt-3", children: _jsx(Col, { children: _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" }) }) }) })] }) }));
};
export default frmBusinessOperatingPermit;
