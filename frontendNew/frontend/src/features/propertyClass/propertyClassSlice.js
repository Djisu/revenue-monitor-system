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
console.log('in authSlice.ts');
console.log('BASE_URL:', BASE_URL);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
console.log('BASE_URL: ', BASE_URL);
// Async thunk to fetch all property classes
export var fetchPropertyClasses = createAsyncThunk('propertyClass/fetchPropertyClasses', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/propertyClass"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
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
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new property class
export var createPropertyClass = createAsyncThunk('propertyClass/createPropertyClass', function (propertyClassData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/propertyClass"), propertyClassData)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a property class
export var updatePropertyClass = createAsyncThunk('propertyClass/updatePropertyClass', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var property_class = _b.property_class, propertyClassData = _b.propertyClassData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/propertyClass/").concat(property_class), propertyClassData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a property class
export var deletePropertyClass = createAsyncThunk('propertyClass/deletePropertyClass', function (property_class) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/propertyClass/").concat(property_class))];
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
        })
            .addCase(createPropertyClass.fulfilled, function (state, action) {
            state.loading = false;
            state.propertyClasses.push(action.payload); // Add the new property class
            state.error = null;
        })
            .addCase(createPropertyClass.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create property class';
        })
            .addCase(updatePropertyClass.pending, function (state) {
            state.loading = true;
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
        })
            .addCase(deletePropertyClass.fulfilled, function (state, action) {
            state.loading = false;
            state.propertyClasses = state.propertyClasses.filter(function (cls) { return cls.property_class !== action.meta.arg; });
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
