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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    areas: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Thunks
export var fetchCollectorElectoralAreas = createAsyncThunk('collectorElectoralArea/fetchAll', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/CollectorElectoralArea/all"))];
            case 1:
                response = _a.sent();
                console.log('response: ', response);
                return [2 /*return*/, response.data];
        }
    });
}); });
export var createCollectorElectoralArea = createAsyncThunk('collectorElectoralArea/create', function (newArea) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in createCollectorElectoralArea thunk: ', newArea);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/CollectorElectoralArea/create"), newArea)];
            case 1:
                response = _a.sent();
                console.log('after await axios.postresponse: ', response);
                return [2 /*return*/, response.data]; // Assuming it returns the created area
        }
    });
}); });
export var updateCollectorElectoralArea = createAsyncThunk('collectorElectoralArea/update', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, electoralarea = _b.electoralarea;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/CollectorElectoralArea/update/").concat(officer_no), { electoralarea: electoralarea })];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Assuming it returns the updated area
        }
    });
}); });
export var deleteCollectorElectoralArea = createAsyncThunk('collectorElectoralArea/delete', function (officer_no) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/CollectorElectoralArea/delete/").concat(officer_no))];
            case 1:
                _a.sent();
                return [2 /*return*/, officer_no]; // Return officer_no for the reducer to use
        }
    });
}); });
// Slice
var collectorElectoralAreaSlice = createSlice({
    name: 'collectorElectoralArea',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchCollectorElectoralAreas.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchCollectorElectoralAreas.fulfilled, function (state, action) {
            state.loading = false;
            state.areas = action.payload;
        })
            .addCase(fetchCollectorElectoralAreas.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch areas.';
        })
            .addCase(createCollectorElectoralArea.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(createCollectorElectoralArea.fulfilled, function (state, action) {
            state.loading = false;
            state.areas.push(action.payload);
        })
            .addCase(createCollectorElectoralArea.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create area.';
        })
            .addCase(updateCollectorElectoralArea.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateCollectorElectoralArea.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.areas.findIndex(function (area) { return area.officer_no === action.payload.officer_no; });
            if (index !== -1) {
                state.areas[index] = action.payload;
            }
        })
            .addCase(updateCollectorElectoralArea.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update area.';
        })
            .addCase(deleteCollectorElectoralArea.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteCollectorElectoralArea.fulfilled, function (state, action) {
            state.loading = false;
            state.areas = state.areas.filter(function (area) { return area.officer_no !== action.payload; });
        })
            .addCase(deleteCollectorElectoralArea.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete area.';
        });
    },
});
// Export the async thunks and reducer
export var collectorElectoralAreaReducer = collectorElectoralAreaSlice.reducer;
