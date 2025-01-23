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
// src/features/business/businessSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    businesses: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// console.log('in authSlice.ts')
// console.log('BASE_URL:', BASE_URL);
// console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
// console.log('BASE_URL: ', BASE_URL)
// Async thunk to fetch all businesses
export var fetchBusinesses = createAsyncThunk('business/fetchBusinesses', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/business"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new business
export var createBusiness = createAsyncThunk('business/createBusiness', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/business"), data)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single business by buss_no
export var fetchBusinessById = createAsyncThunk('business/fetchBusinessById', function (buss_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/business/").concat(buss_no))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a business
export var updateBusiness = createAsyncThunk('business/updateBusiness', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var buss_no = _b.buss_no, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/business/").concat(buss_no), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a business
export var deleteBusiness = createAsyncThunk('business/deleteBusiness', function (buss_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/business/").concat(buss_no))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var businessSlice = createSlice({
    name: 'business',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchBusinesses.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusinesses.fulfilled, function (state, action) {
            state.loading = false;
            state.businesses = action.payload;
            state.error = null;
        })
            .addCase(fetchBusinesses.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch businesses';
        })
            .addCase(createBusiness.pending, function (state) {
            state.loading = true;
        })
            .addCase(createBusiness.fulfilled, function (state, action) {
            state.loading = false;
            state.businesses.push(action.payload); // Add the new business
            state.error = null;
        })
            .addCase(createBusiness.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create business';
        })
            .addCase(fetchBusinessById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusinessById.fulfilled, function (state, action) {
            state.loading = false;
            // Handle the fetched single business as needed
            state.businesses.push(action.payload); // Add the new business
            state.error = null;
        })
            .addCase(fetchBusinessById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch business';
        })
            .addCase(updateBusiness.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateBusiness.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.businesses.findIndex(function (business) { return business.buss_no === action.payload.buss_no; });
            if (index !== -1) {
                state.businesses[index] = action.payload; // Update the existing business
            }
            state.error = null;
        })
            .addCase(updateBusiness.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update business';
        })
            .addCase(deleteBusiness.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteBusiness.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted business from the state
            state.businesses = state.businesses.filter(function (business) { return (business.buss_no).toString() !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteBusiness.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete business';
        });
    },
});
// Export the actions if needed
export var _b = _a = businessSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default businessSlice.reducer;
