var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Form, Table, Container, Row, Col, Card } from 'react-bootstrap';
var FrmPropertyCollectorElectoralArea = function () {
    var _a = useState(''), officerNo = _a[0], setOfficerNo = _a[1];
    var _b = useState(''), electoralArea = _b[0], setElectoralArea = _b[1];
    var _c = useState([]), collectors = _c[0], setCollectors = _c[1];
    // Mock data for dropdowns
    var officerNos = ['001', '002', '003'];
    var electoralAreas = ['Area1', 'Area2', 'Area3'];
    // Mock function to simulate adding a record
    var handleAddRecord = function () {
        if (!officerNo || !electoralArea) {
            alert('Please fill in all fields');
            return;
        }
        var newCollector = { officerNo: officerNo, officerName: 'John Doe', electoralArea: electoralArea };
        setCollectors(__spreadArray(__spreadArray([], collectors, true), [newCollector], false));
    };
    // Mock function to simulate deleting a record
    var handleDeleteRecord = function (index) {
        var updatedCollectors = collectors.filter(function (_, i) { return i !== index; });
        setCollectors(updatedCollectors);
    };
    return (_jsxs(Container, { children: [_jsx(Row, { className: "mt-4", children: _jsx(Col, { children: _jsxs(Card, { children: [_jsx(Card.Header, { as: "h5", className: "text-center bg-primary text-white", children: "MARCORY MUNICIPAL ASSEMBLY" }), _jsx(Card.Body, { children: _jsxs(Form, { children: [_jsxs(Form.Group, { controlId: "formOfficerNo", children: [_jsx(Form.Label, { children: "Collector:" }), _jsxs(Form.Control, { as: "select", value: officerNo, onChange: function (e) { return setOfficerNo(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Officer No" }), officerNos.map(function (no) { return (_jsx("option", { value: no, children: no }, no)); })] })] }), _jsxs(Form.Group, { controlId: "formElectoralArea", children: [_jsx(Form.Label, { children: "Suburb:" }), _jsxs(Form.Control, { as: "select", value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { value: "", children: "Select Electoral Area" }), electoralAreas.map(function (area) { return (_jsx("option", { value: area, children: area }, area)); })] })] }), _jsx(Button, { variant: "primary", onClick: handleAddRecord, children: "Add New Record" })] }) })] }) }) }), _jsx(Row, { className: "mt-4", children: _jsx(Col, { children: _jsxs(Card, { children: [_jsx(Card.Header, { as: "h5", className: "bg-primary text-white", children: "List of Collectors And Their Layouts" }), _jsx(Card.Body, { children: _jsxs(Table, { striped: true, bordered: true, hover: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "OFFICER NO" }), _jsx("th", { children: "OFFICER NAME" }), _jsx("th", { children: "ELECTORAL AREA" }), _jsx("th", { children: "ACTION" })] }) }), _jsx("tbody", { children: collectors.map(function (collector, index) { return (_jsxs("tr", { children: [_jsx("td", { children: collector.officerNo }), _jsx("td", { children: collector.officerName }), _jsx("td", { children: collector.electoralArea }), _jsx("td", { children: _jsx(Button, { variant: "danger", onClick: function () { return handleDeleteRecord(index); }, children: "Delete" }) })] }, index)); }) })] }) })] }) }) }), _jsx(Row, { className: "mt-4", children: _jsx(Col, { children: _jsxs(Card, { children: [_jsx(Card.Header, { as: "h5", className: "bg-primary text-white", children: "Activity" }), _jsx(Card.Body, { children: _jsx(Button, { variant: "secondary", onClick: function () { return alert('Exit clicked'); }, children: "Exit" }) })] }) }) })] }));
};
export default FrmPropertyCollectorElectoralArea;
