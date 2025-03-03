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
// src/features/propertyRate/propertyRateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    rates: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all property rates
export var fetchPropertyRates = createAsyncThunk('propertyRate/fetchPropertyRates', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/propertyRate')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single property rate by property_Class and fiscalyear
export var fetchPropertyRateByPropertyClassAndFiscalyear = createAsyncThunk('propertyRate/fetchPropertyRateByPropertyClassAndFiscalyear', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var property_Class = _b.property_Class, fiscalyear = _b.fiscalyear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("fetchPropertyRateByPropertyClassAndFiscalyear: ".concat(property_Class, ", fiscalyear: ").concat(fiscalyear));
                return [4 /*yield*/, axios.get("/api/propertyRate/".concat(property_Class, "/").concat(fiscalyear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new property rate
export var createPropertyRate = createAsyncThunk('propertyRate/createPropertyRate', function (propertyRateData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('createPropertyRate action called with ', propertyRateData);
                return [4 /*yield*/, axios.post('/api/propertyRate/create', propertyRateData)];
            case 1:
                response = _a.sent();
                console.log("after axios.post, response.data: ".concat(JSON.stringify(response.data)));
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a property rate
export var updatePropertyRate = createAsyncThunk('propertyRate/updatePropertyRate', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var property_Class = _b.property_Class, fiscalyear = _b.fiscalyear, propertyRateData = _b.propertyRateData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/propertyRate/update".concat(property_Class, "/").concat(fiscalyear), propertyRateData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a property rate
export var deletePropertyRate = createAsyncThunk('propertyRate/deletePropertyRate', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var property_Class = _b.property_Class, fiscalyear = _b.fiscalyear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/propertyRate/".concat(property_Class, "/").concat(fiscalyear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var propertyRateSlice = createSlice({
    name: 'propertyRate',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchPropertyRates.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyRates.fulfilled, function (state, action) {
            state.loading = false;
            state.rates = action.payload;
            state.error = null;
        })
            .addCase(fetchPropertyRates.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property rates';
        })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.fulfilled, function (state, action) {
            state.loading = false;
            state.rates = action.payload;
            state.error = null;
        })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property rate';
        })
            .addCase(createPropertyRate.pending, function (state) {
            state.loading = true;
        })
            .addCase(createPropertyRate.fulfilled, function (state, action) {
            state.loading = false;
            state.rates.push(action.payload); // Add the new property rate
            state.error = null;
        })
            .addCase(createPropertyRate.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create property rate';
        })
            .addCase(updatePropertyRate.pending, function (state) {
            state.loading = true;
        })
            .addCase(updatePropertyRate.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.rates.findIndex(function (rate) { return rate.property_class === action.payload.property_class && rate.fiscalyear === action.payload.fiscalyear; });
            if (index !== -1) {
                state.rates[index] = action.payload; // Update the property rate
            }
            state.error = null;
        })
            .addCase(updatePropertyRate.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update property rate';
        })
            .addCase(deletePropertyRate.pending, function (state) {
            state.loading = true;
        })
            .addCase(deletePropertyRate.fulfilled, function (state, action) {
            state.loading = false;
            state.rates = state.rates.filter(function (rate) { return !(rate.property_class === action.meta.arg.property_Class && rate.fiscalyear === action.meta.arg.fiscalyear); });
            state.error = null;
        })
            .addCase(deletePropertyRate.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete property rate';
        });
    },
});
// Export the reducer
export default propertyRateSlice.reducer;
