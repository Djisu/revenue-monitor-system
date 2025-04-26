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
// src/features/budgetAssess/budgetAssessSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    budgetAssessRecords: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all BudgetAssess records
export var fetchBudgetAssessRecords = createAsyncThunk('budgetAssess/fetchRecords', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/budgetAssess')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new BudgetAssess record
export var createBudgetAssessRecord = createAsyncThunk('budgetAssess/createRecord', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/budgetAssess', data)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single BudgetAssess record by month and fiscal year
export var fetchBudgetAssessRecordById = createAsyncThunk('budgetAssess/fetchRecordById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var month = _b.month, fiscalyear = _b.fiscalyear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("/api/budgetAssess/".concat(month, "/").concat(fiscalyear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a BudgetAssess record
export var updateBudgetAssessRecord = createAsyncThunk('budgetAssess/updateRecord', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var month = _b.month, fiscalyear = _b.fiscalyear, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/budgetAssess/".concat(month, "/").concat(fiscalyear), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a BudgetAssess record
export var deleteBudgetAssessRecord = createAsyncThunk('budgetAssess/deleteRecord', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var month = _b.month, fiscalyear = _b.fiscalyear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/budgetAssess/".concat(month, "/").concat(fiscalyear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var budgetAssessSlice = createSlice({
    name: 'budgetAssess',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchBudgetAssessRecords.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBudgetAssessRecords.fulfilled, function (state, action) {
            state.loading = false;
            state.budgetAssessRecords = action.payload;
            state.error = null;
        })
            .addCase(fetchBudgetAssessRecords.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch budget assessments';
        })
            .addCase(createBudgetAssessRecord.pending, function (state) {
            state.loading = true;
        })
            .addCase(createBudgetAssessRecord.fulfilled, function (state, action) {
            state.loading = false;
            state.budgetAssessRecords.push(action.payload); // Add the new record
            state.error = null;
        })
            .addCase(createBudgetAssessRecord.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create budget assessment';
        })
            .addCase(fetchBudgetAssessRecordById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBudgetAssessRecordById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched single record as needed
            state.error = null;
        })
            .addCase(fetchBudgetAssessRecordById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch budget assessment';
        })
            .addCase(updateBudgetAssessRecord.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateBudgetAssessRecord.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.budgetAssessRecords.findIndex(function (record) {
                return record.month === action.payload.month && record.fiscalyear === action.payload.fiscalyear;
            });
            if (index !== -1) {
                state.budgetAssessRecords[index] = action.payload; // Update the existing record
            }
            state.error = null;
        })
            .addCase(updateBudgetAssessRecord.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update budget assessment';
        })
            .addCase(deleteBudgetAssessRecord.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteBudgetAssessRecord.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted record from the state
            state.budgetAssessRecords = state.budgetAssessRecords.filter(function (record) {
                return !(record.month === action.meta.arg.month && record.fiscalyear === action.meta.arg.fiscalyear);
            });
            state.error = null;
        })
            .addCase(deleteBudgetAssessRecord.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete budget assessment';
        });
    },
});
// Export the actions if needed
export var _b = _a = budgetAssessSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default budgetAssessSlice.reducer;
