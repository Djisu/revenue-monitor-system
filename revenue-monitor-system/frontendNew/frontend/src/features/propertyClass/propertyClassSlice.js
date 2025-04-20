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
// src/features/propertyClass/propertyClassSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    propertyClasses: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch all property classes
export var fetchPropertyClasses = createAsyncThunk('propertyClass/fetchPropertyClasses', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/propertyClass/all"))];
            case 1:
                response = _a.sent();
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                return [4 /*yield*/, response.data.data];
            case 2: return [2 /*return*/, _a.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error fetching property classes : ".concat(response.statusText));
        }
    });
}); });
// Async thunk to fetch a single property class by property_class
export var fetchPropertyClassById = createAsyncThunk('propertyClass/fetchPropertyClassById', function (property_class) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/propertyClass/").concat(property_class))];
            case 1:
                response = _a.sent();
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                return [4 /*yield*/, response.data];
            case 2: return [2 /*return*/, _a.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error fetching property class by id    : ".concat(response.statusText));
        }
    });
}); });
// Async thunk to create a new property class
export var createPropertyClass = createAsyncThunk('propertyClass/createPropertyClass', function (propertyClassData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in createPropertyClass');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/propertyClass/create"), propertyClassData, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 2:
                response = _a.sent();
                console.log("after axios.post, response.data: ".concat(JSON.stringify(response.data)));
                return [2 /*return*/, response.data];
            case 3:
                error_1 = _a.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    // Handle specific error responses
                    throw new Error(error_1.response.data.message || 'Failed to create property class');
                }
                throw new Error('Network error or other issue');
            case 4: return [2 /*return*/];
        }
    });
}); });
// Async thunk to update a property class
export var updatePropertyClass = createAsyncThunk('propertyClass/updatePropertyClass', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response, error_2;
    var property_class = _b.property_class, propertyClassData = _b.propertyClassData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('in updatePropertyClass');
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/propertyClass/update/").concat(property_class), propertyClassData)];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 3:
                error_2 = _c.sent();
                if (axios.isAxiosError(error_2) && error_2.response) {
                    // Handle specific error responses
                    throw new Error(error_2.response.data.message || 'Failed to delete electoral area');
                }
                throw new Error('Network error or other issue');
            case 4: return [2 /*return*/];
        }
    });
}); });
// Async thunk to delete a property class
export var deletePropertyClass = createAsyncThunk('propertyClass/deletePropertyClass', function (property_class) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in deletePropertyClass');
                return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/propertyClass/delete/").concat(property_class))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var propertyClassSlice = createSlice({
    name: 'propertyClass',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchPropertyClasses.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchPropertyClasses.fulfilled, function (state, action) {
            state.loading = false;
            state.propertyClasses = action.payload;
            state.error = null;
        })
            .addCase(fetchPropertyClasses.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property classes';
        })
            .addCase(fetchPropertyClassById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchPropertyClassById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched property class data if needed
            state.error = null;
        })
            .addCase(fetchPropertyClassById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch property class';
        })
            .addCase(createPropertyClass.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(createPropertyClass.fulfilled, function (state, action) {
            state.loading = false;
            console.log('Before push, propertyClasses:', state.propertyClasses);
            if (action.payload.success) {
                if (!Array.isArray(state.propertyClasses)) {
                    console.warn('Resetting propertyClasses to an empty array');
                    state.propertyClasses = [];
                }
                // Ensure the payload includes a rate, or provide a default value
                var newPropertyClass = {
                    property_class: action.payload.message,
                    rate: action.payload.rate !== undefined ? action.payload.rate : 0, // Provide a default rate value if necessary
                };
                state.propertyClasses.push(newPropertyClass);
                console.log('After push, propertyClasses:', state.propertyClasses);
            }
            else {
                state.error = action.payload.message;
            }
        })
            .addCase(createPropertyClass.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'An error occurred while creating the property class';
        })
            .addCase(updatePropertyClass.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(updatePropertyClass.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.propertyClasses.findIndex(function (cls) { return cls.property_class === action.payload.property_class; });
            if (index !== -1) {
                state.propertyClasses[index] = action.payload; // Update the property class
            }
            state.error = null;
        })
            .addCase(updatePropertyClass.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update property class';
        })
            .addCase(deletePropertyClass.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(deletePropertyClass.fulfilled, function (state, action) {
            state.loading = false;
            // Add logging to check the type of state.propertyClasses
            console.log('Before filter, state.propertyClasses:', state.propertyClasses);
            console.log('Type of state.propertyClasses:', Array.isArray(state.propertyClasses) ? 'array' : 'not array');
            if (!Array.isArray(state.propertyClasses)) {
                console.error('state.propertyClasses is not an array:', state.propertyClasses);
                state.propertyClasses = []; // Reset to an empty array if it's not an array
            }
            else {
                state.propertyClasses = state.propertyClasses.filter(function (cls) { return cls.property_class !== action.meta.arg; });
            }
            state.error = null;
        })
            .addCase(deletePropertyClass.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete property class';
        });
    },
});
// Export the reducer
export default propertyClassSlice.reducer;
