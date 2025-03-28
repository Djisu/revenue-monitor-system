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
// Create async thunks for CRUD operations
export var fetchReports = createAsyncThunk('reports/fetchReports', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/bustypeDetailedReport"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var createReport = createAsyncThunk('reports/createReport', function (report) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/bustypeDetailedReport"), report)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var updateReport = createAsyncThunk('reports/updateReport', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var buss_no = _b.buss_no, report = _b.report;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/bustypeDetailedReport/").concat(buss_no), report)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var deleteReport = createAsyncThunk('reports/deleteReport', function (buss_no) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "api/bustypeDetailedReport/").concat(buss_no))];
            case 1:
                _a.sent(); // Adjust the endpoint as necessary
                return [2 /*return*/, buss_no]; // Return the buss_no to update the state
        }
    });
}); });
// Create async thunk for fetching reports based on criteria  export const fetchReportsByCriteria = createAsyncThunk<BusTypeDetailedReport[], FetchReportsParams>(
export var fetchReportsByCriteria = createAsyncThunk('reports/fetchReportsByCriteria', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var newFiscalYear, response;
    var _c = _b.zone, zone = _c === void 0 ? '' : _c, _d = _b.businessType, businessType = _d === void 0 ? '' : _d, fiscalYear = _b.fiscalYear;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                newFiscalYear = parseInt(fiscalYear, 10);
                console.log('in fetchReportsByCriteria thunk');
                console.log('zone: ', zone);
                console.log('businessType: ', businessType);
                console.log('fiscalYear: ', fiscalYear);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/bustypeDetailedReport/").concat(zone, "/").concat(businessType, "/").concat(newFiscalYear))];
            case 1:
                response = _e.sent();
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchReportsByCriteria fulfilled::: ', response.data);
                    // Ensure response.data is an array
                    return [2 /*return*/, Array.isArray(response.data.data) ? response.data.data : []];
                }
                else {
                    throw new Error("Error fetching grade fees. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
export var fetchAllRecords = createAsyncThunk('reports/fetchAllRecords', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Call the API to fetch all businesses
                console.log('in fetchAllRecords slice, Fetching all Records');
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/bustypeDetailedReport/all"))];
            case 1:
                response = _a.sent();
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchAllRecords fulfilled::: ', response.data);
                    // Ensure response.data is an array
                    return [2 /*return*/, Array.isArray(response.data) ? response.data : []]; //
                    // return data; // This data will be available as `action.payload`
                }
                else {
                    throw new Error("Error fetching fetchAllRecords. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Create the async thunk
export var fetchDetailedReports = createAsyncThunk('reports/fetchDetailedReports', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, error_1;
    var zone = _c.zone, businessType = _c.businessType, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchDetailedReports thunk');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/bustypeDetailedReport/").concat(zone, "/").concat(businessType, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                console.log('response.data.data XXXXXXX: ', response.data.data);
                // Access the `data` property of the response
                if (response.data.message === 'BusTypeDetailedReport fetched') {
                    return [2 /*return*/, response.data.data]; // Return the array of reports
                }
                else {
                    // Handle unexpected message
                    console.warn('Unexpected response message: ', response.data.message);
                    return [2 /*return*/, rejectWithValue('Unexpected response structure')];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _e.sent();
                // Custom error handling
                if (axios.isAxiosError(error_1)) {
                    return [2 /*return*/, rejectWithValue(error_1.message)];
                }
                return [2 /*return*/, rejectWithValue('An unexpected error occurred')];
            case 4: return [2 /*return*/];
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
            .addCase(fetchReports.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchReports.fulfilled, function (state, action) {
            state.loading = false;
            state.reports = action.payload;
            state.error = null;
        })
            .addCase(fetchReports.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch reports';
        })
            .addCase(fetchReportsByCriteria.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchReportsByCriteria.fulfilled, function (state, action) {
            state.loading = false;
            state.reports = action.payload;
            state.error = null;
        })
            .addCase(fetchReportsByCriteria.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch reports';
        })
            .addCase(fetchDetailedReports.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchDetailedReports.fulfilled, function (state, action) {
            state.loading = false;
            state.reports = action.payload;
            state.error = null;
        })
            .addCase(fetchDetailedReports.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch reports';
        })
            .addCase(createReport.fulfilled, function (state, action) {
            state.reports.push(action.payload);
            state.error = null;
        })
            .addCase(updateReport.fulfilled, function (state, action) {
            var index = state.reports.findIndex(function (report) { return report.buss_no === action.payload.buss_no; });
            if (index !== -1) {
                state.reports[index] = action.payload;
            }
            state.error = null;
        })
            .addCase(deleteReport.fulfilled, function (state, action) {
            state.reports = state.reports.filter(function (report) { return report.buss_no !== action.payload; });
            state.error = null;
        });
    },
});
// Export actions and reducer
export var clearError = reportsSlice.actions.clearError;
export default reportsSlice.reducer;
