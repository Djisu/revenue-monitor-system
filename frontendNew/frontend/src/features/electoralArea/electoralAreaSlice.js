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
// src/features/electoralArea/electoralAreaSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    electoralAreas: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunks for API calls
export var fetchElectoralAreas = createAsyncThunk('electoralArea/fetchElectoralAreas', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/electoralArea/all"))];
            case 1:
                response = _a.sent();
                if (response.status >= 200 && response.status < 300) {
                    // console.log('fetchElectoralAreas response:', response.data)
                    return [2 /*return*/, Array.isArray(response.data) ? response.data : []]; //
                    //return await response.data // This data will be available as `action.payload`
                }
                else {
                    throw new Error("Error fetching electoral areas: ".concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
export var createElectoralArea = createAsyncThunk('electoralArea/createElectoralArea', function (electoralArea) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/electoralArea/create"), { electoral_area: electoralArea }, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Assuming this is your success response
            case 2:
                error_1 = _a.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    // Handle specific error responses
                    throw new Error(error_1.response.data.message || 'Failed to create electoral area');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
export var updateElectoralArea = createAsyncThunk('electoralArea/updateElectoralArea', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response, error_2;
    var electoral_area = _b.electoral_area, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/electoralArea/update/").concat(electoral_area), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_2 = _c.sent();
                if (axios.isAxiosError(error_2) && error_2.response) {
                    // Handle specific error responses
                    throw new Error(error_2.response.data.message || 'Failed to delete electoral area');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
export var deleteElectoralArea = createAsyncThunk('electoralArea/deleteElectoralArea', function (electoral_area) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/electoralArea/delete/").concat(electoral_area))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var electoralAreaSlice = createSlice({
    name: 'electoralArea',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchElectoralAreas.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchElectoralAreas.fulfilled, function (state, action) {
            state.loading = false;
            state.electoralAreas = action.payload;
            state.error = null;
        })
            .addCase(fetchElectoralAreas.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch electoral areas';
        })
            .addCase(createElectoralArea.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(createElectoralArea.fulfilled, function (state, action) {
            state.loading = false;
            console.log('Before push, electoralAreas:', state.electoralAreas);
            if (action.payload.success) {
                if (!Array.isArray(state.electoralAreas)) {
                    console.warn('Resetting electoralAreas to an empty array');
                    state.electoralAreas = [];
                }
                state.electoralAreas.push({ electoral_area: action.payload.message });
                console.log('After push, electoralAreas:', state.electoralAreas);
            }
            else {
                state.error = action.payload.message;
            }
        })
            .addCase(createElectoralArea.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create electoral area';
        })
            .addCase(updateElectoralArea.fulfilled, function (state, action) {
            var index = state.electoralAreas.findIndex(function (area) { return area.electoral_area === action.meta.arg.electoral_area; });
            if (index !== -1) {
                state.electoralAreas[index] = action.payload;
            }
        })
            .addCase(deleteElectoralArea.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteElectoralArea.fulfilled, function (state, action) {
            console.log('Current electoralAreas before delete:', state.electoralAreas);
            if (!Array.isArray(state.electoralAreas)) {
                console.warn('electoralAreas is not an array, resetting to empty array');
                state.electoralAreas = [];
            }
            state.electoralAreas = state.electoralAreas.filter(function (area) { return area.electoral_area !== action.meta.arg; });
            state.error = null;
            console.log('electoralAreas after delete:', state.electoralAreas);
        })
            .addCase(deleteElectoralArea.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete electoral area';
        });
    },
});
// Export the async actions
//export { fetchElectoralAreas, createElectoralArea, updateElectoralArea, deleteElectoralArea };
// Export the reducer
export default electoralAreaSlice.reducer;
