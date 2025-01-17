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
// Initial state
var initialState = {
    gradeFees: [],
    loading: false,
    error: null,
};
// Define async thunks
export var fetchGradeFees = createAsyncThunk('gradeFees/fetchGradeFees', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/gradeFees')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var fetchGradeFee = createAsyncThunk('gradeFees/fetchGradeFee', function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("/api/gradeFees/".concat(params.buss_type, "/").concat(params.grade))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var createGradeFee = createAsyncThunk('gradeFees/createGradeFee', function (gradeFeesData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/gradeFees', gradeFeesData)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var updateGradeFee = createAsyncThunk('gradeFees/updateGradeFee', function (params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.put("/api/gradeFees/".concat(params.buss_type, "/").concat(params.grade), params.data)];
            case 1:
                _a.sent();
                return [2 /*return*/, { buss_type: params.buss_type, grade: params.grade, data: params.data }];
        }
    });
}); });
export var deleteGradeFee = createAsyncThunk('gradeFees/deleteGradeFee', function (params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/gradeFees/".concat(params.buss_type, "/").concat(params.grade))];
            case 1:
                _a.sent();
                return [2 /*return*/, { buss_type: params.buss_type, grade: params.grade }];
        }
    });
}); });
// Create the slice
var gradeFeesSlice = createSlice({
    name: 'gradeFees',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchGradeFees.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchGradeFees.fulfilled, function (state, action) {
            state.loading = false;
            state.gradeFees = action.payload;
            state.error = null;
        })
            .addCase(fetchGradeFees.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch grade fees';
        })
            .addCase(fetchGradeFee.fulfilled, function (state, action) {
            var index = state.gradeFees.findIndex(function (fee) { return fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade; });
            if (index !== -1) {
                state.gradeFees[index] = action.payload;
            }
        })
            .addCase(createGradeFee.fulfilled, function (state, action) {
            state.gradeFees.push(action.payload);
        })
            .addCase(updateGradeFee.fulfilled, function (state, action) {
            var index = state.gradeFees.findIndex(function (fee) { return fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade; });
            if (index !== -1) {
                state.gradeFees[index] = action.payload.data;
            }
        })
            .addCase(deleteGradeFee.fulfilled, function (state, action) {
            state.gradeFees = state.gradeFees.filter(function (fee) { return !(fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade); });
        });
    },
});
// Export the async actions
export var _b = _a = gradeFeesSlice.actions;
// Export the reducer
export default gradeFeesSlice.reducer;
