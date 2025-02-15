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
// src/features/gradeRate/gradeRateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    gradeRates: [],
    loading: false,
    error: null,
};
// Set the base URL for the API calls
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch all GradeRate records
export var fetchGradeRates = createAsyncThunk('gradeRate/fetchGradeRates', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/gradeRate/all"))];
            case 1:
                response = _a.sent();
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                return [4 /*yield*/, response.data.data];
            case 2: return [2 /*return*/, _a.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error fetching property classes : ".concat(response.statusText));
        }
    });
}); });
// Async thunk to create a new GradeRate record
export var createGradeRate = createAsyncThunk('gradeRate/createGradeRate', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("in createGradeRate, before axios.post, data: ".concat(JSON.stringify(data)));
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/gradeRate/create"), data, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                console.log("in createGradeRate, after axios.post, response.data: ".concat(JSON.stringify(response.data)));
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _a.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    // Handle specific error responses
                    throw new Error(error_1.response.data.message || 'Failed to create property class');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single GradeRate record by grade, minValuex, and maxValuex
export var fetchGradeRateById = createAsyncThunk('gradeRate/fetchGradeRateById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var grade = _b.grade, minValuex = _b.minValuex, maxValuex = _b.maxValuex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/gradeRate/").concat(grade, "/").concat(minValuex, "/").concat(maxValuex))];
            case 1:
                response = _c.sent();
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                return [4 /*yield*/, response.data.data];
            case 2: return [2 /*return*/, _c.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error fetching property class : ".concat(response.statusText));
        }
    });
}); });
// Async thunk to update a GradeRate record
export var updateGradeRate = createAsyncThunk('gradeRate/updateGradeRate', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var url, response, error_2;
    var grade = _b.grade, minValuex = _b.minValuex, maxValuex = _b.maxValuex, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                url = "".concat(BASE_URL, "/api/propertyClass/update/").concat(grade, "/").concat(minValuex, "/").concat(maxValuex);
                return [4 /*yield*/, axios.put(url, data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_2 = _c.sent();
                if (axios.isAxiosError(error_2) && error_2.response) {
                    // Handle specific error responses
                    throw new Error(error_2.response.data.message || 'Failed to update GradeRate record');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to delete a GradeRate record
export var deleteGradeRate = createAsyncThunk('gradeRate/deleteGradeRate', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var grade = _b.grade, minValuex = _b.minValuex, maxValuex = _b.maxValuex;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/gradeRate/").concat(grade, "/").concat(minValuex, "/").concat(maxValuex))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var gradeRateSlice = createSlice({
    name: 'gradeRate',
    initialState: initialState,
    reducers: {
        setGradeRates: function (state, action) {
            state.gradeRates = action.payload;
        },
        clearError: function (state) {
            state.error = null;
        },
    },
    extraReducers: function (builder) {
        builder
            .addCase(fetchGradeRates.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchGradeRates.fulfilled, function (state, action) {
            state.loading = false;
            state.gradeRates = action.payload;
            state.error = null;
        })
            .addCase(fetchGradeRates.rejected, function (state, action) {
            state.loading = false;
            if (action.error.message === "GradeRate record already exists") {
                state.error = "GradeRate record already exists";
            }
            else {
                state.error = action.error.message || 'Failed to fetch GradeRate records';
            }
        })
            .addCase(createGradeRate.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(createGradeRate.fulfilled, function (state, action) {
            state.loading = false;
            state.gradeRates.push(action.payload); // Add the new GradeRate record
            state.error = null;
        })
            .addCase(createGradeRate.rejected, function (state, action) {
            state.loading = false;
            if (action.error.message === "GradeRate record already exists") {
                state.error = "GradeRate record already exists";
            }
            else {
                state.error = action.error.message || 'Failed to create GradeRate record';
            }
        })
            .addCase(fetchGradeRateById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchGradeRateById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched single GradeRate record as needed
            state.error = null;
        })
            .addCase(fetchGradeRateById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch GradeRate record';
        })
            .addCase(updateGradeRate.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateGradeRate.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.gradeRates.findIndex(function (rate) {
                return rate.grade === action.payload.grade &&
                    rate.minValuex === action.payload.data.minValuex &&
                    rate.maxValuex === action.payload.data.maxValuex;
            });
            if (index !== -1) {
                state.gradeRates[index] = action.payload.data; // Update the existing GradeRate record
            }
            state.error = null;
        })
            .addCase(updateGradeRate.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update GradeRate record';
        })
            .addCase(deleteGradeRate.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteGradeRate.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted GradeRate record from the state
            state.gradeRates = state.gradeRates.filter(function (rate) {
                return !(rate.grade === action.meta.arg.grade &&
                    rate.minValuex === action.meta.arg.minValuex &&
                    rate.maxValuex === action.meta.arg.maxValuex);
            });
            state.error = null;
        })
            .addCase(deleteGradeRate.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete GradeRate record';
        });
    },
});
// Export the actions if needed
export var setGradeRates = (_a = gradeRateSlice.actions, _a.setGradeRates), clearError = _a.clearError;
// Add any synchronous actions if required
// Export the reducer
export default gradeRateSlice.reducer;
