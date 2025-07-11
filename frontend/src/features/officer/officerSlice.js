var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// src/features/officer/officerSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    officers: [],
    loading: false,
    error: null,
    currentOfficer: null,
    message: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://revenue-monitor-system.onrender.com');
console.log('BASE_URL: ', BASE_URL);
// Async thunk to fetch all officers
export var fetchOfficers = createAsyncThunk('officer/fetchOfficers', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in fetchOfficers thunk');
                console.log('BASE_URL: ', BASE_URL);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/officer/all"), {
                        responseType: 'json' // Ensure we expect JSON response
                    })];
            case 1:
                response = _a.sent();
                if (response.status >= 200 && response.status < 300) {
                    console.log('officeSlicer.ts: officers fetched successfully');
                    console.log('response.data:', response.data);
                    // Each officer already includes the photoUrl and photo Blob
                    return [2 /*return*/, response.data]; // This data will be available as `action.payload`
                }
                else {
                    throw new Error("Error fetching officers: ".concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single officer by officer_no
export var fetchOfficerById = createAsyncThunk('officer/fetchOfficerById', function (officer_no) { return __awaiter(void 0, void 0, void 0, function () {
    var officerResponse, photoResponse, photoUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Fetching officer by id:', officer_no);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/officer/retrieve/").concat(officer_no))];
            case 1:
                officerResponse = _a.sent();
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/photos/retrieve/").concat(officer_no), {
                        responseType: 'blob', // Ensure we get the photo as a Blob
                    })];
            case 2:
                photoResponse = _a.sent();
                photoUrl = URL.createObjectURL(photoResponse.data);
                // Return officer data along with the photo URL
                return [2 /*return*/, __assign(__assign({}, officerResponse.data), { photoUrl: photoUrl })];
        }
    });
}); });
// Async thunk to create a new officer
export var createOfficer = createAsyncThunk('officers/create', function (officerData_1, _a) { return __awaiter(void 0, [officerData_1, _a], void 0, function (officerData, _b) {
    var response, error_1;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/officer/create"), officerData, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _c.sent();
                return [2 /*return*/, { message: response.data.message }]; // Ensure this is cast correctly
            case 2:
                error_1 = _c.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    return [2 /*return*/, rejectWithValue({ message: error_1.response.data.message || 'Failed to create officer' })];
                }
                return [2 /*return*/, rejectWithValue({ message: 'Failed to create officer' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to update an officer
export var updateOfficer = createAsyncThunk('officer/updateOfficer', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response, error_2;
    var officer_no = _b.officer_no, officerData = _b.officerData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/officer/update/").concat(officer_no), officerData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_2 = _c.sent();
                if (axios.isAxiosError(error_2) && error_2.response) {
                    // Handle specific error responses
                    throw new Error(error_2.response.data.message || 'Failed to update officer');
                }
                throw new Error('Network error or other issue');
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to delete an officer
export var deleteOfficer = createAsyncThunk('officer/deleteOfficer', function (officer_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/officer/delete/").concat(officer_no))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var officerSlice = createSlice({
    name: 'officer',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchOfficers.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchOfficers.fulfilled, function (state, action) {
            state.loading = false;
            state.officers = action.payload;
            state.error = null;
        })
            .addCase(fetchOfficers.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch officers';
        })
            .addCase(fetchOfficerById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOfficerById.fulfilled, function (state, action) {
            state.loading = false;
            // Assuming you want to store a single officer in state
            state.currentOfficer = action.payload; // Store the fetched officer data
            state.error = null;
        })
            .addCase(fetchOfficerById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch officer';
        })
            .addCase(createOfficer.pending, function (state) {
            state.loading = true;
        })
            .addCase(createOfficer.fulfilled, function (state, action) {
            state.loading = false;
            if ('message' in action.payload) {
                if (action.payload.message === 'Officer record created successfully') {
                    state.officers.push(action.meta.arg); // Add the officer data from the request
                }
                else {
                    state.error = action.payload.message;
                }
            }
        })
            .addCase(createOfficer.rejected, function (state, action) {
            var _a;
            state.loading = false;
            state.error = ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to create officer'; // Safely access message
        })
            .addCase(updateOfficer.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateOfficer.fulfilled, function (state, action) {
            state.loading = false;
            if (action.payload.message === 'Officer record updated successfully') {
                var index = state.officers.findIndex(function (officer) { return officer.officer_no === action.meta.arg.officer_no; });
                if (index !== -1) {
                    state.officers[index] = action.meta.arg.officerData; // Update the officer data using the request data
                }
            }
            else {
                state.error = action.payload.message;
            }
        })
            .addCase(updateOfficer.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update officer';
        })
            .addCase(deleteOfficer.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteOfficer.fulfilled, function (state, action) {
            state.loading = false;
            state.officers = state.officers.filter(function (officer) { return officer.officer_no !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteOfficer.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete officer';
        });
    },
});
// Export the actions if needed
export var _b = _a = officerSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default officerSlice.reducer;
