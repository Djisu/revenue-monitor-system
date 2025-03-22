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
// src/features/businessType/businessTypeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    businessTypes: [],
    loading: false,
    error: null,
    bussTypesData: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch all BusinessType records
export var fetchBusinessTypes = createAsyncThunk('businessType/fetchBusinessTypes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('inside fetchBusinessTypes thunk');
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/businessType/all"))];
            case 1:
                response = _a.sent();
                console.log('after fetchBusinessTypes thunk, Response data:', response.data);
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchBusinessTypes thunk, response data:', response.data);
                    return [2 /*return*/, Array.isArray(response.data) ? response.data : []]; //
                }
                else {
                    throw new Error("Error fetching business types: ".concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to create a new BusinessType record
export var createBusinessType = createAsyncThunk('businessType/createBusinessType', function (businessType) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/businessType/create"), { Business_Type: businessType }, // Wrapping the string in an object
                    {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Ensure this returns the correct structure
            case 2:
                error_1 = _a.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    throw new Error(error_1.response.data.message || 'Failed to create business type');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single BusinessType record by Business_Type
// export const fetchBusinessTypeById = createAsyncThunk('businessType/fetchBusinessTypeById', async (Business_Type: string) => {
//     const response = await axios.get(`${BASE_URL}/api/businessType/${Business_Type}`);
//     return response.data;
// });
// Async thunk to update a BusinessType record
export var updateBusinessType = createAsyncThunk('businessType/updateBusinessType', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var Business_Type = _b.Business_Type, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/businessType/").concat(Business_Type), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a BusinessType record
export var deleteBusinessType = createAsyncThunk('businessType/deleteBusinessType', function (Business_Type) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/businessType/").concat(Business_Type))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Ensure this returns the correct structure
        }
    });
}); });
// Create the slice
var businessTypeSlice = createSlice({
    name: 'businessType',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchBusinessTypes.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchBusinessTypes.fulfilled, function (state, action) {
            state.loading = false;
            //state.businessTypes.push(...action.payload);
            state.businessTypes = action.payload; // Ensure this returns the correct structure
            state.error = null;
        })
            .addCase(fetchBusinessTypes.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch Business Types';
        })
            .addCase(createBusinessType.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(createBusinessType.fulfilled, function (state, action) {
            state.loading = false;
            console.log('Before push, businessTypes:', state.businessTypes);
            if (action.payload.success) {
                if (!Array.isArray(state.businessTypes)) {
                    console.warn('Resetting businessTypes to an empty array');
                    state.businessTypes = [];
                }
                state.businessTypes.push({ Business_Type: action.payload.message });
                //console.log('After push, businessTypes:', state.businessTypes);
            }
            else {
                state.error = action.payload.message;
            }
        })
            .addCase(createBusinessType.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create Business Type';
        })
            // .addCase(fetchBusinessTypeById.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(fetchBusinessTypeById.fulfilled, (state) => {
            //     state.loading = false;
            //     // Handle the fetched single Business Type as needed
            //     state.error = null;
            // })
            // .addCase(fetchBusinessTypeById.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message || 'Failed to fetch Business Type';
            // })
            .addCase(updateBusinessType.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateBusinessType.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.businessTypes.findIndex(function (businessType) { return businessType.Business_Type === action.payload.Business_Type; });
            if (index !== -1) {
                state.businessTypes[index] = action.payload; // Update the existing Business Type
            }
            state.error = null;
        })
            .addCase(updateBusinessType.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update Business Type';
        })
            .addCase(deleteBusinessType.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteBusinessType.fulfilled, function (state, action) {
            console.log('Current electoralAreas before delete:', state.businessTypes);
            if (!Array.isArray(state.businessTypes)) {
                console.warn('businessTypes is not an array, resetting to empty array');
                state.businessTypes = [];
            }
            // Remove the deleted Business Type from the state
            state.businessTypes = state.businessTypes.filter(function (businessType) { return businessType.Business_Type !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteBusinessType.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete Business Type';
        });
    },
});
// Export the actions if needed
export var _b = _a = businessTypeSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default businessTypeSlice.reducer;
