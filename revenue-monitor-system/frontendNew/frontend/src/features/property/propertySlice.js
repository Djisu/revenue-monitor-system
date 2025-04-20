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
// src/features/property/propertySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    properties: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all properties
export var fetchProperties = createAsyncThunk('property/fetchProperties', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/property')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single property by house_no
export var fetchPropertyById = createAsyncThunk('property/fetchPropertyById', function (house_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("/api/property/".concat(house_no))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new property
export var createProperty = createAsyncThunk('property/createProperty', function (propertyData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/property', propertyData)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a property
export var updateProperty = createAsyncThunk('property/updateProperty', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var house_no = _b.house_no, propertyData = _b.propertyData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/property/".concat(house_no), propertyData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a property
export var deleteProperty = createAsyncThunk('property/deleteProperty', function (house_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/property/".concat(house_no))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var propertySlice = createSlice({
    name: 'property',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchProperties.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchProperties.fulfilled, function (state, action) {
            state.loading = false;
            state.properties = action.payload;
            state.error = null;
        })
            .addCase(fetchProperties.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch properties';
        })
            .addCase(fetchPropertyById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyById.fulfilled, function (state) {
            state.loading = false;
            // Optionally handle the fetched property data
            state.error = null;
        })
            .addCase(fetchPropertyById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property';
        })
            .addCase(createProperty.pending, function (state) {
            state.loading = true;
        })
            .addCase(createProperty.fulfilled, function (state, action) {
            state.loading = false;
            state.properties.push(action.payload); // Add the new property
            state.error = null;
        })
            .addCase(createProperty.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create property';
        })
            .addCase(updateProperty.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateProperty.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.properties.findIndex(function (property) { return property.house_no === action.payload.house_no; });
            if (index !== -1) {
                state.properties[index] = action.payload; // Update the property
            }
            state.error = null;
        })
            .addCase(updateProperty.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update property';
        })
            .addCase(deleteProperty.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteProperty.fulfilled, function (state, action) {
            state.loading = false;
            state.properties = state.properties.filter(function (property) { return property.house_no !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteProperty.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete property';
        });
    },
});
// Export the reducer
export default propertySlice.reducer;
