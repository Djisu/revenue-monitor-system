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
// src/features/officerAssessment/officerAssessmentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    assessments: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all OfficerAssessment records
export var fetchOfficerAssessments = createAsyncThunk('officerAssessment/fetchOfficerAssessments', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/officerAssessment')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new OfficerAssessment record
export var createOfficerAssessment = createAsyncThunk('officerAssessment/createOfficerAssessment', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/officerAssessment', data)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single OfficerAssessment record by officer_no and bus_year
export var fetchOfficerAssessmentById = createAsyncThunk('officerAssessment/fetchOfficerAssessmentById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, bus_year = _b.bus_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("/api/officerAssessment/".concat(officer_no, "/").concat(bus_year))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update an OfficerAssessment record
export var updateOfficerAssessment = createAsyncThunk('officerAssessment/updateOfficerAssessment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, bus_year = _b.bus_year, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/officerAssessment/".concat(officer_no, "/").concat(bus_year), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete an OfficerAssessment record
export var deleteOfficerAssessment = createAsyncThunk('officerAssessment/deleteOfficerAssessment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, bus_year = _b.bus_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/officerAssessment/".concat(officer_no, "/").concat(bus_year))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var officerAssessmentSlice = createSlice({
    name: 'officerAssessment',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchOfficerAssessments.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOfficerAssessments.fulfilled, function (state, action) {
            state.loading = false;
            state.assessments = action.payload;
            state.error = null;
        })
            .addCase(fetchOfficerAssessments.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch OfficerAssessment records';
        })
            .addCase(createOfficerAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(createOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            state.assessments.push(action.payload); // Add the new OfficerAssessment record
            state.error = null;
        })
            .addCase(createOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create OfficerAssessment record';
        })
            .addCase(fetchOfficerAssessmentById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOfficerAssessmentById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched single OfficerAssessment record as needed
            state.error = null;
        })
            .addCase(fetchOfficerAssessmentById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch OfficerAssessment record';
        })
            .addCase(updateOfficerAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.assessments.findIndex(function (assessment) { return assessment.officer_no === action.payload.officer_no && assessment.bus_year === action.payload.bus_year; });
            if (index !== -1) {
                state.assessments[index] = action.payload; // Update the existing OfficerAssessment record
            }
            state.error = null;
        })
            .addCase(updateOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update OfficerAssessment record';
        })
            .addCase(deleteOfficerAssessment.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted OfficerAssessment record from the state
            state.assessments = state.assessments.filter(function (assessment) { return !(assessment.officer_no === action.meta.arg.officer_no && assessment.bus_year === action.meta.arg.bus_year); });
            state.error = null;
        })
            .addCase(deleteOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete OfficerAssessment record';
        });
    },
});
// Export the actions if needed
export var _b = _a = officerAssessmentSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default officerAssessmentSlice.reducer;
