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
var _a;
// src/features/offBudgetAssessment/offBudgetAssessmentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    assessments: [],
    loading: false,
    error: null,
    amountByOfficerAndMonth: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch all OffBudgetAssessment records
export var fetchOffBudgetAssessments = createAsyncThunk('offBudgetAssessment/fetchOffBudgetAssessments', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/offBudgetAssessment"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new OffBudgetAssessment record
export var createOffBudgetAssessment = createAsyncThunk('offBudgetAssessment/createOffBudgetAssessment', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/offBudgetAssessment"), data)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single OffBudgetAssessment record by officer_name
export var fetchOffBudgetAssessmentByOfficer = createAsyncThunk('offBudgetAssessment/fetchOffBudgetAssessmentByOfficer', function (officer_name) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/offBudgetAssessment/").concat(officer_name))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update an OffBudgetAssessment record
export var updateOffBudgetAssessment = createAsyncThunk('offBudgetAssessment/updateOffBudgetAssessment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_name = _b.officer_name, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/offBudgetAssessment/").concat(officer_name), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete an OffBudgetAssessment record
export var deleteOffBudgetAssessment = createAsyncThunk('offBudgetAssessment/deleteOffBudgetAssessment', function (officer_name) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/offBudgetAssessment/").concat(officer_name))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch amount by officer and month
export var fetchAmountByOfficerAndMonth = createAsyncThunk('offBudgetAssessment/fetchAmountByOfficerAndMonth', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officerNo = _b.officerNo, fiscalYear = _b.fiscalYear, monthPaid = _b.monthPaid;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('in fetchAmountByOfficerAndMonth');
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/offBudgetAssessment"), {
                        params: { officerNo: officerNo, fiscalYear: fiscalYear, monthPaid: monthPaid }
                    })];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch amount by officer and month
export var fetchDataByOfficerAndFiscalYear = createAsyncThunk('offBudgetAssessment/fetchDataByOfficerAndFiscalYear', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officerNo = _b.officerNo, fiscalYear = _b.fiscalYear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/offBudgetAssessment/").concat(officerNo, "/").concat(fiscalYear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// // Async thunk to fetch the officer assessment
// export const fetchOfficerAssessment = createAsyncThunk<OfficerAssessment, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchOfficerAssessment',
//     async ({ officerNo, fiscalYear }): Promise<OfficerAssessment> => {
//         console.log('in fetchOfficerAssessment: ',  officerNo, fiscalYear )
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/${officerNo}/${fiscalYear}`);
//         console.log('fetchOfficerAssessment response', response.data)
//         return response.data; // Ensure this matches OfficerAssessment structure
//     }
// );
// Create the slice
var offBudgetAssessmentSlice = createSlice({
    name: 'offBudgetAssessment',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchOffBudgetAssessments.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOffBudgetAssessments.fulfilled, function (state, action) {
            state.loading = false;
            state.assessments = action.payload;
            state.error = null;
        })
            .addCase(fetchOffBudgetAssessments.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch OffBudgetAssessment records';
        })
            .addCase(createOffBudgetAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(createOffBudgetAssessment.fulfilled, function (state, action) {
            state.loading = false;
            state.assessments.push(action.payload); // Add the new OffBudgetAssessment record
            state.error = null;
        })
            .addCase(createOffBudgetAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create OffBudgetAssessment record';
        })
            .addCase(fetchOffBudgetAssessmentByOfficer.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOffBudgetAssessmentByOfficer.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched single OffBudgetAssessment record as needed
            state.error = null;
        })
            .addCase(fetchOffBudgetAssessmentByOfficer.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch OffBudgetAssessment record';
        })
            .addCase(updateOffBudgetAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateOffBudgetAssessment.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.assessments.findIndex(function (assessment) { return assessment.officer_name === action.payload.officer_name; });
            if (index !== -1) {
                state.assessments[index] = action.payload; // Update the existing OffBudgetAssessment record
            }
            state.error = null;
        })
            .addCase(updateOffBudgetAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update OffBudgetAssessment record';
        })
            .addCase(deleteOffBudgetAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteOffBudgetAssessment.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted OffBudgetAssessment record from the state
            state.assessments = state.assessments.filter(function (assessment) { return assessment.officer_name !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteOffBudgetAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete OffBudgetAssessment record';
        })
            .addCase(fetchAmountByOfficerAndMonth.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchAmountByOfficerAndMonth.fulfilled, function (state, action) {
            state.loading = false;
            state.amountByOfficerAndMonth = action.payload; // Update the amountByOfficerAndMonth state
            state.error = null;
        })
            .addCase(fetchAmountByOfficerAndMonth.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch amount by officer and month';
        })
            .addCase(fetchDataByOfficerAndFiscalYear.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchDataByOfficerAndFiscalYear.fulfilled, function (state, action) {
            state.loading = false;
            state.assessments = action.payload; // Update the amountByOfficerAndYear state 
            state.error = null;
        })
            .addCase(fetchDataByOfficerAndFiscalYear.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch amount by officer and month';
        });
    },
});
// Export the actions if needed
export var _b = _a = offBudgetAssessmentSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default offBudgetAssessmentSlice.reducer;
