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
// src/features/propertyOfficerAssessment/propertyOfficerAssessmentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    records: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all property officer assessments
export var fetchPropertyOfficerAssessments = createAsyncThunk('propertyOfficerAssessment/fetchPropertyOfficerAssessments', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/propertyOfficerAssessment')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single property officer assessment by officer_no and bus_year
export var fetchPropertyOfficerAssessmentById = createAsyncThunk('propertyOfficerAssessment/fetchPropertyOfficerAssessmentById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, bus_year = _b.bus_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("/api/propertyOfficerAssessment/".concat(officer_no, "/").concat(bus_year))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new property officer assessment
export var createPropertyOfficerAssessment = createAsyncThunk('propertyOfficerAssessment/createPropertyOfficerAssessment', function (propertyOfficerAssessmentData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/propertyOfficerAssessment', propertyOfficerAssessmentData)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a property officer assessment
export var updatePropertyOfficerAssessment = createAsyncThunk('propertyOfficerAssessment/updatePropertyOfficerAssessment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, bus_year = _b.bus_year, propertyOfficerAssessmentData = _b.propertyOfficerAssessmentData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/propertyOfficerAssessment/".concat(officer_no, "/").concat(bus_year), propertyOfficerAssessmentData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a property officer assessment
export var deletePropertyOfficerAssessment = createAsyncThunk('propertyOfficerAssessment/deletePropertyOfficerAssessment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, bus_year = _b.bus_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/propertyOfficerAssessment/".concat(officer_no, "/").concat(bus_year))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var propertyOfficerAssessmentSlice = createSlice({
    name: 'propertyOfficerAssessment',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchPropertyOfficerAssessments.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyOfficerAssessments.fulfilled, function (state, action) {
            state.loading = false;
            state.records = action.payload;
            state.error = null;
        })
            .addCase(fetchPropertyOfficerAssessments.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property officer assessments';
        })
            .addCase(fetchPropertyOfficerAssessmentById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyOfficerAssessmentById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched property officer assessment data if needed
            state.error = null;
        })
            .addCase(fetchPropertyOfficerAssessmentById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property officer assessment';
        })
            .addCase(createPropertyOfficerAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(createPropertyOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            state.records.push(action.payload); // Add the new property officer assessment
            state.error = null;
        })
            .addCase(createPropertyOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create property officer assessment';
        })
            .addCase(updatePropertyOfficerAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(updatePropertyOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.records.findIndex(function (record) { return record.officer_no === action.payload.officer_no && record.bus_year === action.payload.bus_year; });
            if (index !== -1) {
                state.records[index] = action.payload; // Update the property officer assessment
            }
            state.error = null;
        })
            .addCase(updatePropertyOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update property officer assessment';
        })
            .addCase(deletePropertyOfficerAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(deletePropertyOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            state.records = state.records.filter(function (record) { return !(record.officer_no === action.meta.arg.officer_no && record.bus_year === action.meta.arg.bus_year); });
            state.error = null;
        })
            .addCase(deletePropertyOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete property officer assessment';
        });
    },
});
// Export the reducer
export default propertyOfficerAssessmentSlice.reducer;
