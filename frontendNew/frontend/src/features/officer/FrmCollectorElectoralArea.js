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
import { Link } from 'react-router-dom';
var CollectorElectoralArea = function () {
    var _a = useState([]), electoralAreas = _a[0], setElectoralAreas = _a[1];
    var _b = useState([]), officerNumbers = _b[0], setOfficerNumbers = _b[1];
    var _c = useState(''), selectedElectoralArea = _c[0], setSelectedElectoralArea = _c[1];
    var _d = useState(''), selectedOfficerNo = _d[0], setSelectedOfficerNo = _d[1];
    var _e = useState([]), collectors = _e[0], setCollectors = _e[1];
    useEffect(function () {
        fetchElectoralAreas();
        fetchOfficerNumbers();
        populateListView();
    }, []);
    var fetchElectoralAreas = function () { return __awaiter(void 0, void 0, void 0, function () {
        var areas;
        return __generator(this, function (_a) {
            areas = ['Area 1', 'Area 2', 'Area 3'];
            setElectoralAreas(areas);
            return [2 /*return*/];
        });
    }); };
    var fetchOfficerNumbers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var officers;
        return __generator(this, function (_a) {
            officers = ['Officer 1', 'Officer 2', 'Officer 3'];
            setOfficerNumbers(officers);
            return [2 /*return*/];
        });
    }); };
    var populateListView = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            data = [
                { officerNo: '001', officerName: 'John Doe', electoralArea: 'Area 1' },
                { officerNo: '002', officerName: 'Jane Smith', electoralArea: 'Area 2' },
                // Add more records as needed
            ];
            setCollectors(data);
            return [2 /*return*/];
        });
    }); };
    var addRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!selectedOfficerNo || !selectedElectoralArea) {
                alert('Please select both Officer No and Electoral Area.');
                return [2 /*return*/];
            }
            // Logic to add the record (API call)
            alert("Record added: Officer No ".concat(selectedOfficerNo, ", Electoral Area ").concat(selectedElectoralArea));
            populateListView(); // Refresh the list
            return [2 /*return*/];
        });
    }); };
    var deleteRecord = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Logic to delete the record (API call)
            alert("Record deleted: Officer No ".concat(selectedOfficerNo, ", Electoral Area ").concat(selectedElectoralArea));
            populateListView(); // Refresh the list
            return [2 /*return*/];
        });
    }); };
    return (_jsxs("div", { style: { backgroundColor: '#FFC0C0', padding: '20px', height: '100vh' }, children: [_jsx("h1", { children: "Assign Collector To A Layout" }), _jsxs("label", { children: ["Collector:", _jsxs("select", { value: selectedOfficerNo, onChange: function (e) { return setSelectedOfficerNo(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Officer No" }), officerNumbers.map(function (officer) { return (_jsx("option", { value: officer, children: officer }, officer)); })] })] }), _jsx("br", {}), _jsxs("label", { children: ["Electoral Area:", _jsxs("select", { value: selectedElectoralArea, onChange: function (e) { return setSelectedElectoralArea(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Electoral Area" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }), _jsx("br", {}), _jsx("button", { onClick: addRecord, children: "Add New Record" }), _jsx("button", { onClick: deleteRecord, children: "Delete" }), _jsx("button", { onClick: function () { return alert('Exiting...'); }, children: "Exit" }), _jsxs("div", { children: [_jsx("h2", { children: "List of Collectors And Their Layouts" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Officer No" }), _jsx("th", { children: "Officer Name" }), _jsx("th", { children: "Electoral Area" })] }) }), _jsx("tbody", { children: collectors.map(function (collector) { return (_jsxs("tr", { children: [_jsx("td", { children: collector.officerNo }), _jsx("td", { children: collector.officerName }), _jsx("td", { children: collector.electoralArea })] }, collector.officerNo)); }) })] })] }), _jsx(Link, { to: "/main", className: "primary m-3", children: "Go Back" })] }));
};
export default CollectorElectoralArea;
