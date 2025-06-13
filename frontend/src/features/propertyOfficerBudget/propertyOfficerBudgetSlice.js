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
// src/features/propertyOfficerBudget/propertyOfficerBudgetSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    records: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all property officer budgets
export var fetchPropertyOfficerBudgets = createAsyncThunk('propertyOfficerBudget/fetchPropertyOfficerBudgets', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/propertyOfficerBudget')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single property officer budget by officer_no and fiscal_year
export var fetchPropertyOfficerBudgetById = createAsyncThunk('propertyOfficerBudget/fetchPropertyOfficerBudgetById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, fiscal_year = _b.fiscal_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("/api/propertyOfficerBudget/".concat(officer_no, "/").concat(fiscal_year))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new property officer budget
export var createPropertyOfficerBudget = createAsyncThunk('propertyOfficerBudget/createPropertyOfficerBudget', function (propertyOfficerBudgetData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/propertyOfficerBudget', propertyOfficerBudgetData)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a property officer budget
export var updatePropertyOfficerBudget = createAsyncThunk('propertyOfficerBudget/updatePropertyOfficerBudget', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, fiscal_year = _b.fiscal_year, propertyOfficerBudgetData = _b.propertyOfficerBudgetData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/propertyOfficerBudget/".concat(officer_no, "/").concat(fiscal_year), propertyOfficerBudgetData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a property officer budget
export var deletePropertyOfficerBudget = createAsyncThunk('propertyOfficerBudget/deletePropertyOfficerBudget', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, fiscal_year = _b.fiscal_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/propertyOfficerBudget/".concat(officer_no, "/").concat(fiscal_year))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var propertyOfficerBudgetSlice = createSlice({
    name: 'propertyOfficerBudget',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchPropertyOfficerBudgets.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyOfficerBudgets.fulfilled, function (state, action) {
            state.loading = false;
            state.records = action.payload;
            state.error = null;
        })
            .addCase(fetchPropertyOfficerBudgets.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property officer budgets';
        })
            .addCase(fetchPropertyOfficerBudgetById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyOfficerBudgetById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched property officer budget data if needed
            state.error = null;
        })
            .addCase(fetchPropertyOfficerBudgetById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property officer budget';
        })
            .addCase(createPropertyOfficerBudget.pending, function (state) {
            state.loading = true;
        })
            .addCase(createPropertyOfficerBudget.fulfilled, function (state, action) {
            state.loading = false;
            state.records.push(action.payload); // Add the new property officer budget
            state.error = null;
        })
            .addCase(createPropertyOfficerBudget.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create property officer budget';
        })
            .addCase(updatePropertyOfficerBudget.pending, function (state) {
            state.loading = true;
        })
            .addCase(updatePropertyOfficerBudget.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.records.findIndex(function (record) { return record.officer_no === action.payload.officer_no && record.fiscal_year === action.payload.fiscal_year; });
            if (index !== -1) {
                state.records[index] = action.payload; // Update the property officer budget
            }
            state.error = null;
        })
            .addCase(updatePropertyOfficerBudget.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update property officer budget';
        })
            .addCase(deletePropertyOfficerBudget.pending, function (state) {
            state.loading = true;
        })
            .addCase(deletePropertyOfficerBudget.fulfilled, function (state, action) {
            state.loading = false;
            state.records = state.records.filter(function (record) { return !(record.officer_no === action.meta.arg.officer_no && record.fiscal_year === action.meta.arg.fiscal_year); });
            state.error = null;
        })
            .addCase(deletePropertyOfficerBudget.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete property officer budget';
        });
    },
});
// Export the reducer
export default propertyOfficerBudgetSlice.reducer;
