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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Define the initial state
var initialState = {
    reports: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Create async thunk for fetching reports
export var fetchBusTypeSummaryReports = createAsyncThunk('reports/fetchBusTypeSummaryReports', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user, response;
    var firstDate = _b.firstDate, lastDate = _b.lastDate, zone = _b.zone, // Default to empty string if not provided
    bussType = _b.bussType;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                user = localStorage.getItem('operatorId');
                if (!user) {
                    console.warn('User not logged in');
                    return [2 /*return*/, []];
                }
                console.log('user: ', user);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/bustypeSummaryReport/create/").concat(firstDate, "/").concat(lastDate, "/").concat(zone, "/").concat(bussType, "/").concat(user))];
            case 1:
                response = _c.sent();
                console.log('response.data.data XXXXXXX: ', response.data.data);
                // Access the `data` property of the response BusTypeSummaryReport fetched
                console.log('response.data.message: ', response.data.message);
                if (response.data.message === 'BusTypeSummaryReport fetched') {
                    return [2 /*return*/, response.data.data]; // Return the array of reports
                }
                else {
                    // Handle unexpected message
                    console.warn('Unexpected response message: ', response.data.message);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
        }
    });
}); });
// Create the slice
var reportsSlice = createSlice({
    name: 'reports',
    initialState: initialState,
    reducers: {
        clearError: function (state) {
            state.error = null;
        },
    },
    extraReducers: function (builder) {
        builder
            .addCase(fetchBusTypeSummaryReports.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusTypeSummaryReports.fulfilled, function (state, action) {
            state.loading = false;
            state.reports = action.payload; // Update reports with the new data
            state.error = null;
        })
            .addCase(fetchBusTypeSummaryReports.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch reports';
        });
    },
});
// Export actions and reducer
export var clearError = reportsSlice.actions.clearError;
export default reportsSlice.reducer;
