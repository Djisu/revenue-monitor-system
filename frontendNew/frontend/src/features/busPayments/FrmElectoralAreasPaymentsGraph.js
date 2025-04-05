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
import { Bar } from 'react-chartjs-2';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchBusPaymentByElectoralArea } from './busPaymentsSlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import aggregatePaymentsByElectoralArea from '../../utilities/aggregatePaymentsByElectoralArea';
var FrmElectoralAreasPaymentsGraph = function () {
    var dispatch = useAppDispatch();
    var navigate = useNavigate();
    //const [fiscalYear, setFiscalYear] = useState<number>(2023); // Default fiscal year
    var _a = useState([]), localBudgetData = _a[0], setLocalBudgetData = _a[1];
    var _b = useState([]), electoralAreas = _b[0], setElectoralAreas = _b[1];
    var _c = useState(''), electoralArea = _c[0], setElectoralArea = _c[1];
    // const BusPaymentsData = useAppSelector((state) => state.busPayments.busPayments);
    useEffect(function () {
        dispatch(fetchElectoralAreas());
    }, [dispatch]);
    useEffect(function () {
        console.log('localBudgetData: ', localBudgetData);
    }, [localBudgetData, dispatch]);
    var electoralAreaData = useAppSelector(function (state) { return state.electoralArea.electoralAreas; });
    useEffect(function () {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map(function (area) { return area.electoral_area; }));
        }
    }, [electoralAreaData]);
    var handleFetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!electoralArea) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch(fetchBusPaymentByElectoralArea(electoralArea))];
                case 1:
                    answer = _a.sent();
                    console.log('answer.payload: ', answer.payload);
                    //if (Array.isArray(action.payload)) {
                    setLocalBudgetData(answer.payload);
                    return [3 /*break*/, 3];
                case 2:
                    alert('Please select the electoral area.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Aggregate the payments data
    var aggregatedData = aggregatePaymentsByElectoralArea(localBudgetData);
    console.log('localBudgetData:', JSON.stringify(localBudgetData, null, 2));
    var chartData = {
        labels: Object.keys(aggregatedData),
        datasets: [{
                label: 'Total Paid Amount',
                data: Object.values(aggregatedData),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }],
    };
    return (_jsxs("div", { className: "container mt-4", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-4", children: "Electoral Areas Payments Graph" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "electoral_area", children: "Electoral Area:" }), _jsxs("select", { name: "electoralArea", id: "electoralArea", value: electoralArea, onChange: function (e) { return setElectoralArea(e.target.value); }, children: [_jsx("option", { value: "All electoral areas", children: "All electoral areas" }), " ", electoralAreas.map(function (area, index) { return (_jsx("option", { value: area, children: area }, index)); })] })] }), _jsx("button", { className: "btn btn-primary", onClick: handleFetchData, children: "Fetch Data" }), _jsx(Button, { variant: "secondary", onClick: function () { return navigate('/main'); }, children: "Exit" })] }), Object.keys(aggregatedData).length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx(Bar, { data: chartData, options: { scales: { y: { beginAtZero: true } } } }), _jsxs("table", { className: "mt-4", style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Electoral Area" }), _jsx("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Total Paid Amount" })] }) }), _jsx("tbody", { children: Object.entries(aggregatedData).map(function (_a, index) {
                                    var area = _a[0], total = _a[1];
                                    return (_jsxs("tr", { children: [_jsx("td", { style: { border: '1px solid #000', padding: '8px' }, children: area }), _jsx("td", { style: { border: '1px solid #000', padding: '8px' }, children: typeof total === 'number' && !isNaN(total) ? total : '-' })] }, index));
                                }) })] })] }))] }));
};
export default FrmElectoralAreasPaymentsGraph;
