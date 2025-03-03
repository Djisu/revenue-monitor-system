import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchCollectorElectoralAreas, createCollectorElectoralArea, updateCollectorElectoralArea, deleteCollectorElectoralArea, } from './collectorElectoralAreaSlice'; // Adjust the import path as necessary
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice'; // Adjust the import path as necessary
import { fetchOfficers } from '../officer/officerSlice'; // Adjust the import path as necessary
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
var CollectorElectoralAreaForm = function () {
    var navigate = useNavigate();
    var dispatch = useAppDispatch();
    var _a = useAppSelector(function (state) { return state.collectorElectoralArea; }), areas = _a.areas, loading = _a.loading, error = _a.error;
    console.log('areas: ', areas);
    var electoralAreas = useAppSelector(function (state) { return state.electoralArea.electoralAreas; }); //  areas); // Assuming this is where electoral areas are stored
    var officers = useAppSelector(function (state) { return state.officer.officers; }); // Assuming this is where officers are stored
    console.log('electoralAreas: ', electoralAreas);
    console.log('officers: ', officers);
    var _b = useState(''), selectedOfficerNo = _b[0], setSelectedOfficerNo = _b[1];
    var _c = useState(''), selectedElectoralArea = _c[0], setSelectedElectoralArea = _c[1];
    var _d = useState(false), isUpdating = _d[0], setIsUpdating = _d[1];
    useEffect(function () {
        dispatch(fetchElectoralAreas());
    }, [dispatch]);
    useEffect(function () {
        dispatch(fetchOfficers());
    }, [dispatch]);
    useEffect(function () {
        dispatch(fetchCollectorElectoralAreas());
    }, [dispatch]);
    var handleSubmit = function (e) {
        console.log('in handlesubmitting');
        console.log('selectedOfficerNo: ', selectedOfficerNo);
        console.log('selectedElectoralArea: ', selectedElectoralArea);
        e.preventDefault();
        if (isUpdating) {
            dispatch(updateCollectorElectoralArea({ officer_no: selectedOfficerNo, electoralarea: selectedElectoralArea }));
        }
        else {
            dispatch(createCollectorElectoralArea({ officer_no: selectedOfficerNo, electoralarea: selectedElectoralArea }));
        }
        setSelectedOfficerNo('');
        setSelectedElectoralArea('');
        setIsUpdating(false);
    };
    var handleEdit = function (area) {
        setSelectedOfficerNo(area.officer_no);
        setSelectedElectoralArea(area.electoralarea);
        setIsUpdating(true);
    };
    var handleDelete = function (officer_no) {
        dispatch(deleteCollectorElectoralArea(officer_no));
    };
    return (_jsxs("div", { className: "container mt-4", children: [loading && _jsx("p", { className: "text-center", children: "Loading..." }), error && _jsx("p", { className: "text-danger text-center", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "mb-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "officerSelect", children: "Officer No" }), _jsxs("select", { id: "officerSelect", className: "form-control", value: selectedOfficerNo, onChange: function (e) {
                                    setSelectedOfficerNo(e.target.value);
                                }, onBlur: function (e) {
                                    var selectedOfficerNo = e.target.value;
                                    setSelectedOfficerNo(selectedOfficerNo);
                                }, required: true, children: [_jsx("option", { value: "", children: "Select Officer No" }), officers.map(function (officer, index) { return (_jsxs("option", { value: officer.officer_no, children: [officer.officer_no, "    ", officer.officer_name] }, index)); })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "electoralAreaSelect", children: "Electoral Area" }), _jsxs("select", { id: "electoralAreaSelect", className: "form-control", value: selectedElectoralArea, onChange: function (e) { return setSelectedElectoralArea(e.target.value); }, required: true, children: [_jsx("option", { value: "", children: "Select Electoral Area" }), electoralAreas.map(function (electoralArea, index) { return (_jsx("option", { value: electoralArea.electoral_area, children: electoralArea.electoral_area }, index)); })] })] }), _jsxs("div", { className: "d-flex justify-content-between mt-4", children: [_jsx("button", { type: "submit", className: "btn btn-success", children: isUpdating ? 'Update' : 'Add' }), _jsx("button", { type: "button", className: "btn btn-primary", onClick: function () { return navigate('/main'); }, children: "Go Back" })] })] }), _jsx("p", { className: "mb-3", children: "Existing Areas" }), _jsxs("table", { className: "table table-bordered", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Officer No" }), _jsx("th", { children: "Electoral Area" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: areas.map(function (area, index) { return (_jsxs("tr", { children: [_jsx("td", { children: area.officer_no }), _jsx("td", { children: area.electoralarea }), _jsxs("td", { children: [_jsx("button", { className: "btn btn-warning btn-sm me-2", onClick: function () { return handleEdit(area); }, children: "Edit" }), _jsx("button", { className: "btn btn-danger btn-sm", onClick: function () { return handleDelete(area.officer_no); }, children: "Delete" })] })] }, index)); }) })] })] }));
};
export default CollectorElectoralAreaForm;
