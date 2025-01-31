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
// src/store/gradeFeesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Initial state as GradeFeesData[]
var initialState = {
    gradeFees: [],
    loading: false,
    successMessage: '',
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch all grade fees
export var fetchGradeFees = createAsyncThunk('gradeFees/fetchgradeFees', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('fetchGradeFees slice called');
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/gradeFees/all"))];
            case 1:
                response = _a.sent();
                console.log("after axios.get, response.data: ".concat(JSON.stringify(response.data)));
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchGradeFees fulfilled::: ', response.data);
                    // Ensure response.data is an array
                    return [2 /*return*/, Array.isArray(response.data) ? response.data : []]; //
                    // return data; // This data will be available as `action.payload`
                }
                else {
                    throw new Error("Error fetching grade fees. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
export var createGradeFee = createAsyncThunk('gradeFees/createGradeFee', function (gradeFeesData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/gradeFees/create"), gradeFeesData, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                console.log("after axios.post, response.data: ".concat(JSON.stringify(response.data)));
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _a.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    throw new Error(error_1.response.data.message || 'Failed to create property class');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
export var updateGradeFee = createAsyncThunk('gradeFees/updateGradeFee', function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/gradeFees/update/").concat(params.buss_type, "/").concat(params.grade), params.data, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                console.log("after axios.put, response.data: ".concat(JSON.stringify(response.data)));
                return [2 /*return*/, { buss_type: params.buss_type, grade: params.grade, data: params.data }];
            case 2:
                error_2 = _a.sent();
                if (axios.isAxiosError(error_2) && error_2.response) {
                    throw new Error(error_2.response.data.message || 'Failed to create property class');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
export var deleteGradeFee = createAsyncThunk('gradeFees/deleteGradeFee', function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/gradeFees/").concat(params.buss_type, "/").concat(params.grade))];
            case 1:
                response = _a.sent();
                console.log("after axios.delete, response.data: ".concat(JSON.stringify(response.data)));
                return [2 /*return*/, { buss_type: params.buss_type, grade: params.grade }];
        }
    });
}); });
// Create the slice
var gradeFeesSlice = createSlice({
    name: 'gradeFees',
    initialState: initialState,
    reducers: {
        setGradeFees: function (state, action) {
            state.gradeFees = action.payload;
        },
        addGradeFee: function (state, action) {
            state.gradeFees.push(action.payload);
        },
        setLoading: function (state, action) {
            state.loading = action.payload;
        },
        setError: function (state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: function (builder) {
        builder
            .addCase(fetchGradeFees.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchGradeFees.fulfilled, function (state, action) {
            state.loading = false;
            state.gradeFees = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        })
            .addCase(fetchGradeFees.rejected, function (state) {
            state.loading = false;
            if (state.error !== null) {
                // Handle the case where state.error is a string
                state.error = state.error && 'Failed to fetch grade fees';
            }
            else {
                // Handle the case where state.error is null
                state.error = null;
            }
        })
            .addCase(createGradeFee.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(createGradeFee.fulfilled, function (state, action) {
            state.loading = false;
            state.gradeFees.push(action.payload); // Add the new GradeRate record
            state.error = null;
            // state.loading = false;
            // console.log('Before push, propertyClasses:', state.gradeFees);
            // if (action.payload.success) {               
            //     const newGradeFees: GradeFeesData = {                  
            //         buss_type: action.payload.message.buss_type,
            //         grade: action.payload.message.grade,
            //         description: action.payload.message.description,
            //         fees: action.payload.message.fees                   
            //     }
            //     state.gradeFees.push(newGradeFees);
            //     console.log('After push, gradeFees:', state.gradeFees);
            // } else {
            //     state.error = action.payload.message;
            // };
        })
            .addCase(createGradeFee.rejected, function (state, action) {
            state.loading = false;
            if (action.error.message === "GradeRate record already exists") {
                state.error = "GradeRate record already exists";
            }
            else {
                state.error = action.error.message || 'Failed to create GradeRate record';
            }
            // state.loading = false;
            // if (state.error !== null) {
            //     // Handle the case where state.error is a string
            //     state.error =  state.error  && 'Failed to fetch grade fees' 
            // } else {
            //     // Handle the case where state.error is null
            //     state.error = null;
            // }
        })
            .addCase(updateGradeFee.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateGradeFee.fulfilled, function (state, action) {
            var index = state.gradeFees.findIndex(function (fee) { return fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade; });
            if (index !== -1) {
                state.gradeFees[index] = action.payload.data; // No type assertion needed if types are correct
                state.successMessage = 'Grade fee updated successfully';
            }
            else {
                console.warn("Could not find grade fee with buss_type ".concat(action.payload.buss_type, " and grade ").concat(action.payload.grade, " to update"));
                state.error = "Could not find grade fee with buss_type ".concat(action.payload.buss_type, " and grade ").concat(action.payload.grade, " to update");
            }
        })
            .addCase(updateGradeFee.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update GradeRate record';
            // if (state.error !== null) {
            //     // Handle the case where state.error is a string
            //     state.error =  state.error  && 'Failed to fetch grade fees' 
            // } else {
            //     // Handle the case where state.error is null
            //     state.error = null;
            // };
        })
            .addCase(deleteGradeFee.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteGradeFee.fulfilled, function (state, action) {
            state.gradeFees = state.gradeFees.filter(function (fee) { return !(fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade); });
        })
            .addCase(deleteGradeFee.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete GradeRate record';
            // if (state.error !== null) {
            //     // Handle the case where state.error is a string
            //     state.error =  state.error  && 'Failed to delete grade fee' 
            // } else {
            //     // Handle the case where state.error is null
            //     state.error = null;
            // }
        });
    },
});
// Export the async actions
export var setGradeFees = (_a = gradeFeesSlice.actions, _a.setGradeFees), addGradeFee = _a.addGradeFee, setLoading = _a.setLoading, setError = _a.setError;
// Export the reducer
export default gradeFeesSlice.reducer;
