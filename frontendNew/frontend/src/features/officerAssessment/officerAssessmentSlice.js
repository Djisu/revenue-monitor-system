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
import apiClient from '../../utilities/apiClient';
// Initial state
var initialState = {
    officerAssessment: null,
    loading: false,
    error: null,
    januaryAmount: null,
    februaryAmount: null,
    marchAmount: null,
    aprilAmount: null,
    mayAmount: null,
    juneAmount: null,
    julyAmount: null,
    augustAmount: null,
    septemberAmount: null,
    octoberAmount: null,
    novemberAmount: null,
    decemberAmount: null,
    fiscalYears: [], // Initialize as an empty array
};
// Base URL setup
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
var token = localStorage.getItem('token');
// Async thunk to create clients served
export var createClientsServed = createAsyncThunk('officerAssessment/createClientsServed', function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //console.clear();
                console.log('in createClientsServed thunk', params);
                return [4 /*yield*/, apiClient.post("".concat(BASE_URL, "/api/officerAssessment/create"), params, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(token),
                        },
                    })];
            case 1:
                response = _a.sent();
                console.log('createClientsServed response', response.data);
                return [2 /*return*/, response.data]; // Adjust based on your API response
        }
    });
}); });
// function isNumber(value: any): value is number {
//     return typeof value === 'number' && !isNaN(value);
// }
// Async thunk to fetch the number of clients served
export var fetchClientsServed = createAsyncThunk('officerAssessment/fetchClientsServed', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officerNo = _b.officerNo, fiscalYear = _b.fiscalYear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('fetchClientsServed thunk called');
                // Check if fiscalYear is a number
                if (typeof fiscalYear !== 'number' || isNaN(fiscalYear)) {
                    throw new Error('Invalid fiscalYear: must be a number');
                }
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/buspayments/fetchClientsServed/").concat(officerNo, "/").concat(fiscalYear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch the value of bills distributed
export var fetchBillsDistributed = createAsyncThunk('officerAssessment/fetchBillsDistributed', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officerNo = _b.officerNo, fiscalYear = _b.fiscalYear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/billsDistributed/").concat(officerNo, "/").concat(fiscalYear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch fiscal years    
export var fetchFiscalYears = createAsyncThunk('officerAssessment/fetchFiscalYears', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/fiscalyears"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data]; // Ensure this is an array
        }
    });
}); });
// Create the thunk for fetching January amount
export var fetchJanuaryAmount = createAsyncThunk('payments/fetchJanuaryAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_1;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchJanuaryAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/January/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_1 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_1.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching February amount
export var fetchFebruaryAmount = createAsyncThunk('payments/fetchFebruaryAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_2;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchFebruaryAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/February/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_2 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_2.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching March amount
export var fetchMarchAmount = createAsyncThunk('payments/fetchMarchAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_3;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchMarchAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/March/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_3 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_3.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching April amount
export var fetchAprilAmount = createAsyncThunk('payments/fetchAprilAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_4;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchAprilAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/April/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_4 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_4.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching May amount
export var fetchMayAmount = createAsyncThunk('payments/fetchMayAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_5;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchMayAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/May/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_5 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_5.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching June amount
export var fetchJuneAmount = createAsyncThunk('payments/fetchJuneAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_6;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchJuneAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/June/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_6 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_6.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching July amount
export var fetchJulyAmount = createAsyncThunk('payments/fetchJulyAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_7;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchJulyAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/July/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_7 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_7.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching August amount
export var fetchAugustAmount = createAsyncThunk('payments/fetchAugustAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_8;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchAugustAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/August/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_8 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_8.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching September amount
export var fetchSeptemberAmount = createAsyncThunk('payments/fetchSeptemberAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_9;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchSeptemberAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/September/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_9 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_9.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching October amount
export var fetchOctoberAmount = createAsyncThunk('payments/fetchOctoberAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_10;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchOctoberAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/October/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_10 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_10.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching November amount
export var fetchNovemberAmount = createAsyncThunk('payments/fetchNovemberAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_11;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchNovemberAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/November/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_11 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_11.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create the thunk for fetching December amount
export var fetchDecemberAmount = createAsyncThunk('payments/fetchDecemberAmount', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var response, totsum, error_12;
    var officerNo = _c.officerNo, fiscalYear = _c.fiscalYear;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('in fetchDecemberAmount');
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/December/").concat(officerNo, "/").concat(fiscalYear))];
            case 2:
                response = _e.sent();
                totsum = Number(response.data.totsum);
                console.log('totsum', totsum);
                // Check if the conversion was successful
                if (isNaN(totsum)) {
                    throw new Error('Received an invalid number for totsum');
                }
                return [2 /*return*/, totsum]; // Now returning a number
            case 3:
                error_12 = _e.sent();
                return [2 /*return*/, rejectWithValue(error_12.message)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch the officer assessment
export var fetchOfficerAssessment = createAsyncThunk('officerAssessment/fetchOfficerAssessment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officerNo = _b.officerNo, fiscalYear = _b.fiscalYear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerAssessment/").concat(officerNo, "/").concat(fiscalYear))];
            case 1:
                response = _c.sent();
                console.log('fetchOfficerAssessment response', response.data);
                return [2 /*return*/, response.data]; // Ensure this matches OfficerAssessment structure
        }
    });
}); });
// Create slice
var officerAssessmentSlice = createSlice({
    name: 'officerAssessment',
    initialState: initialState,
    reducers: {
        resetData: function (state) {
            state.officerAssessment = null;
            state.fiscalYears = [];
            state.loading = false;
            state.error = null;
            state.januaryAmount = null;
            state.februaryAmount = null;
            state.marchAmount = null;
            state.aprilAmount = null;
            state.mayAmount = null;
            state.juneAmount = null;
            state.julyAmount = null;
            state.augustAmount = null;
            state.septemberAmount = null;
            state.octoberAmount = null;
            state.novemberAmount = null;
            state.decemberAmount = null;
        },
    },
    extraReducers: function (builder) {
        builder
            .addCase(fetchClientsServed.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchClientsServed.fulfilled, function (state, action) {
            state.loading = false;
            if (state.officerAssessment) {
                state.officerAssessment.Noofclientsserved = action.payload;
            }
            else {
                console.warn('officerAssessment is null, cannot set Noofclientsserved');
            }
        })
            .addCase(fetchClientsServed.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch clients served';
        })
            .addCase(fetchBillsDistributed.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchBillsDistributed.fulfilled, function (state, action) {
            state.loading = false;
            if (state.officerAssessment) {
                state.officerAssessment.valueofbillsdistributed = action.payload;
            }
            else {
                console.warn('officerAssessment is null, cannot set valueofbillsdistributed');
            }
        })
            .addCase(fetchBillsDistributed.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch bills distributed';
        })
            .addCase(fetchFiscalYears.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchFiscalYears.fulfilled, function (state, action) {
            state.loading = false;
            state.fiscalYears = action.payload; // This will now be an array of FiscalYear objects
        })
            .addCase(fetchFiscalYears.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch fiscal years';
        })
            .addCase(fetchOfficerAssessment.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchOfficerAssessment.fulfilled, function (state, action) {
            state.loading = false;
            state.officerAssessment = action.payload;
        })
            .addCase(fetchOfficerAssessment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch officer assessment';
        })
            .addCase(fetchJanuaryAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchJanuaryAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.januaryAmount = action.payload; // Set January amount
        })
            .addCase(fetchJanuaryAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch January amount';
        })
            .addCase(fetchFebruaryAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchFebruaryAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.februaryAmount = action.payload; // Set februaryAmount amount
        })
            .addCase(fetchFebruaryAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch February amount';
        })
            .addCase(fetchMarchAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchMarchAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.marchAmount = action.payload; // Set marchAmount amount
        })
            .addCase(fetchMarchAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch March amount';
        })
            .addCase(fetchAprilAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAprilAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.aprilAmount = action.payload; // Set aprilAmount amount
        })
            .addCase(fetchAprilAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch April amount';
        })
            .addCase(fetchMayAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchMayAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.mayAmount = action.payload; // Set mayAmount amount
        })
            .addCase(fetchMayAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch May amount';
        })
            .addCase(fetchJuneAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchJuneAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.juneAmount = action.payload; // Set juneAmount amount
        })
            .addCase(fetchJuneAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch June amount';
        })
            .addCase(fetchJulyAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchJulyAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.julyAmount = action.payload; // Set julyAmount amount
        })
            .addCase(fetchJulyAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch July amount';
        })
            .addCase(fetchAugustAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAugustAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.augustAmount = action.payload; // Set augustAmount amount
        })
            .addCase(fetchAugustAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch August amount';
        })
            .addCase(fetchSeptemberAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchSeptemberAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.septemberAmount = action.payload; // Set septemberAmount amount
        })
            .addCase(fetchSeptemberAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch September amount';
        })
            .addCase(fetchOctoberAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchOctoberAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.octoberAmount = action.payload; // Set octoberAmount amount
        })
            .addCase(fetchOctoberAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch October amount';
        })
            .addCase(fetchNovemberAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchNovemberAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.novemberAmount = action.payload; // Set novemberAmount amount
        })
            .addCase(fetchNovemberAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch November amount';
        })
            .addCase(fetchDecemberAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchDecemberAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.decemberAmount = action.payload; // Set decemberAmount amount
        })
            .addCase(fetchDecemberAmount.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch December amount';
        })
            .addCase(createClientsServed.pending, function (state) {
            state.loading = true;
            state.error = null; // Reset error on new request
        })
            .addCase(createClientsServed.fulfilled, function (state) {
            state.loading = false;
            // Update relevant fields in officerAssessment if needed
        })
            .addCase(createClientsServed.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create clients served'; // Capture error message
        });
    },
});
// Exporting the reset action and the reducer
export var resetData = officerAssessmentSlice.actions.resetData;
export default officerAssessmentSlice.reducer;
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import apiClient from '../../utilities/apiClient';
// // Define the types for the state based on OfficerAssessment
// export interface OfficerAssessment {
//     officer_no: string;
//     officer_name: string;
//     Noofclientsserved: number;
//     valueofbillsdistributed: number;
//     bus_year: number;
//     JanuaryAmount: number;
//     FebruaryAmount: number;
//     MarchAmount: number;
//     AprilAmount: number;
//     MayAmount: number;
//     JuneAmount: number;
//     JulyAmount: number;
//     AugustAmount: number;
//     SeptemberAmount: number;
//     OctoberAmount: number;
//     NovemberAmount: number;
//     DecemberAmount: number;
//     totalReceiptTodate: number;
//     balance: number;
//     remarks: string;
// }
// // Define the types for the state
// interface DataState {
//     officerAssessment: OfficerAssessment | null;
//     loading: boolean;
//     error: string | null;
// }
// // Define the types for thunk parameters
// export interface { officerNo: string; fiscalYear: number } {
//     officerNo: string;
//     fiscalYear: number;
// }
// export interface CreateClientsServedParams {
//     officerNo: string;
//     fiscalYear: number;
//     noOfClientsServed: number;
//     valueOfBillsDistributed: number;
//     JanuaryAmount: number;
//     FebruaryAmount: number;
//     MarchAmount: number;
//     AprilAmount: number;
//     MayAmount: number;
//     JuneAmount: number;
//     JulyAmount: number;
//     AugustAmount: number;
//     SeptemberAmount: number;
//     OctoberAmount: number;
//     NovemberAmount: number;
//     DecemberAmount: number;
//     totalReceiptToDate: number;
//     balance: number;
//     remarks: string;
// }
// interface FiscalYear {
//     FiscalYear: number;
// }
// interface FetchJanuaryAmountParams {
//     officerNo: string;
//     fiscalYear: number;
// }
// // Define the response type based on your API response structure
// interface JanuaryAmountResponse {
//     // Define the fields you expect to receive from the API
//     amount: number; // Adjust based on actual API response
// }
// interface PaymentsState {
//     januaryAmount: JanuaryAmountResponse | null;
//     loading: boolean;
//     error: string | null;
// }
// // Base URL setup
// const BASE_URL = import.meta.env.VITE_BASE_URL || 
// (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// const token = localStorage.getItem('token');
// // Async thunk to create clients served
// export const createClientsServed = createAsyncThunk<number, CreateClientsServedParams>(
//     'officerAssessment/createClientsServed',
//     async (params: CreateClientsServedParams): Promise<number> => {
//         const response = await apiClient.post(`${BASE_URL}/api/officerAssessment/create`, params, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });
//         return response.data.totalClientsServed; // Adjust based on your API response
//     }
// );
// // Async thunk to fetch the number of clients served
// export const fetchClientsServed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchClientsServed',
//     async ({ officerNo, fiscalYear }): Promise<number> => {
//         console.log('in fetchClientsServed thunk')
//         const response = await apiClient.get(`${BASE_URL}/api/buspayments/fetchClientsServed/${officerNo}/${fiscalYear}`);
//         console.log('fetchClientsServed response: ', response)
//         return response.data
//     }
// );
// // Async thunk to fetch the value of bills distributed
// export const fetchBillsDistributed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchBillsDistributed',
//     async ({ officerNo, fiscalYear }): Promise<number> => {
//         console.log('in fetchBillsDistributed thunk')
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/billsDistributed/${officerNo}/${fiscalYear}`);
//         return response.data;
//     }
// );
// // Async thunk to fetch fiscal years    
// export const fetchFiscalYears = createAsyncThunk<FiscalYear[], void>(
//     'officerAssessment/fetchFiscalYears',
//     async (): Promise<FiscalYear[]> => {
//         console.log('in fetchFiscalYears thunk')
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/fiscalyears`); 
//         console.log('fetchFiscalYears thunk response: ', response)
//         return response.data; // Ensure this is an array
//     }
// );
// /////////////////////////////////////////////////////////////////////////////
// // Define the parameters for the thunk
// // Create the thunk for fetching January amount
// export const fetchJanuaryAmount = createAsyncThunk<JanuaryAmountResponse, FetchJanuaryAmountParams>(
//     'payments/fetchJanuaryAmount',
//     async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/January/${officerNo}/${fiscalYear}`);
//             return response.data; // Ensure this matches the JanuaryAmountResponse structure
//         } catch (error: any) {
//             return rejectWithValue(error.message);
//         }
//     }
// );
// ////////////////////////////////////////////////////////////////////////
// // Async thunk to fetch the officer assessment
// export const fetchOfficerAssessment = createAsyncThunk<OfficerAssessment, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchOfficerAssessment',
//     async ({ officerNo, fiscalYear }): Promise<OfficerAssessment> => {
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/${officerNo}/${fiscalYear}`);
//         return response.data; // Ensure this matches OfficerAssessment structure
//     }
// );
// // Create slice
// const officerAssessmentSlice = createSlice({
//     name: 'officerAssessment',
//     initialState: {
//         officerAssessment: null,
//         loading: false,
//         error: null,
//     } as DataState,
//     reducers: {
//         resetData: (state) => {
//             state.officerAssessment = null;
//             state.loading = false;
//             state.error = null;
//         },
//         //////////////////////////////////
//         // Define any synchronous actions if needed
//         resetJanuaryAmount: (state) => {
//             state.januaryAmount = null;
//             state.loading = false;
//             state.error = null;
//         },
//         //////////////////////////////////
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchClientsServed.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchClientsServed.fulfilled, (state, action: PayloadAction<number>) => {
//                 state.loading = false;
//                 if (state.officerAssessment) { // Check if officerAssessment is not null
//                     state.officerAssessment.Noofclientsserved = action.payload;
//                 } else {
//                     console.warn('officerAssessment is null, cannot set Noofclientsserved');
//                 }        
//             })
//             .addCase(fetchClientsServed.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch clients served';
//             })
//             // Handle fetchBillsDistributed actions
//             .addCase(fetchBillsDistributed.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchBillsDistributed.fulfilled, (state, action: PayloadAction<number>) => {
//                 state.loading = false;              
//                 if (state.officerAssessment) { // Check if officerAssessment is not null
//                     state.officerAssessment.valueofbillsdistributed = action.payload;
//                 } else {
//                     console.warn('officerAssessment is null, cannot set valueofbillsdistributed');
//                 }      
//             })
//             .addCase(fetchBillsDistributed.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch bills distributed';
//             })
//                         // Handle fetchFiscalYears actions
//             .addCase(fetchFiscalYears.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchFiscalYears.fulfilled, (state, action: PayloadAction<FiscalYear[]>) => {
//                 state.loading = false;
//                 if (state.officerAssessment) { // Check if officerAssessment is not null
//                     state.officerAssessment.bus_year = action.payload[0].FiscalYear;
//                 } else {
//                     console.warn('officerAssessment is null, cannot set bus_year');
//                     console.warn('officerAssessment is null, cannot set valueofbillsdistributed');
//                 }      
//             })
//             .addCase(fetchFiscalYears.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch fiscal years';
//             })
//             .addCase(fetchOfficerAssessment.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchOfficerAssessment.fulfilled, (state, action: PayloadAction<OfficerAssessment>) => {
//                 state.loading = false;
//                 state.officerAssessment = action.payload;
//             })
//             .addCase(fetchOfficerAssessment.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch officer assessment';
//             })
//             // Handle createClientsServed actions
//             .addCase(createClientsServed.pending, (state) => {
//                 state.loading = true;
//                 state.error = null; // Reset error on new request
//             })
//             .addCase(createClientsServed.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // Update relevant fields in officerAssessment if needed
//                 // This would require you to fetch the updated assessment again or handle this logic accordingly
//             })
//             .addCase(createClientsServed.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create clients served'; // Capture error message
//             });
//     },
// });
// // Exporting the reset action and the reducer
// export const { resetData } = officerAssessmentSlice.actions;
// export default officerAssessmentSlice.reducer;
// // import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// // import apiClient from '../../utilities/apiClient';
// // // Define the types for the state
// // interface DataState {
// //     clientsServed: number | null;
// //     billsDistributed: number | null;
// //     JanuaryAmount: number;
// //     FebruaryAmount: number;
// //     MarchAmount: number;
// //     AprilAmount: number;
// //     MayAmount: number;
// //     JuneAmount: number;
// //     JulyAmount: number;
// //     AugustAmount: number;
// //     SeptemberAmount: number;
// //     OctoberAmount: number;
// //     NovemberAmount: number;
// //     DecemberAmount: number;
// //     fiscalYears: FiscalYear[];  
// //     loading: boolean;
// //     error: string | null;
// // }
// // // Define the types for thunk parameters
// // export interface { officerNo: string; fiscalYear: number } {
// //     officerNo: string;
// //     fiscalYear: number;
// // }
// // interface FetchBillsDistributedParams {
// //     officerNo: string;
// //     fiscalYear: number;
// // }
// // interface FetchDecemberAmountParams {
// //     month: string;
// //     officerNo: string;
// //     fiscalYear: number;
// // }
// // export interface FiscalYear {
// //     fiscal_year: number;
// // }
// // interface PaymentsState {
// //     loading: boolean;
// //     error: string | null;
// // }
// // const initialState: PaymentsState = {
// //     JanuaryAmount: 0,
// //     FebruaryAmount: 0,
// //     MarchAmount: 0,
// //     AprilAmount: 0,
// //     MayAmount: 0,
// //     JuneAmount: 0,
// //     JulyAmount: 0,
// //     AugustAmount: 0,
// //     SeptemberAmount: 0,
// //     OctoberAmount: 0,
// //     NovemberAmount: 0,
// //     DecemberAmount: 0,
// //     loading: false,
// //     error: null,
// // };
// // interface CreateClientsServedParams {
// //     officerNo: string;
// //     fiscalYear: number;
// //     noOfClientsServed: number;
// //     valueOfBillsDistributed: number;
// //     JanuaryAmount: number;
// //     FebruaryAmount: number;
// //     MarchAmount: number;
// //     AprilAmount: number;
// //     MayAmount: number;
// //     JuneAmount: number;
// //     JulyAmount: number;
// //     AugustAmount: number;
// //     SeptemberAmount: number;
// //     OctoberAmount: number;
// //     NovemberAmount: number;
// //     DecemberAmount: number;
// //     totalReceiptToDate: number;
// //     balance: number;
// //     remarks: number;
// // }
// // const BASE_URL = import.meta.env.VITE_BASE_URL || 
// // (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// // const token = localStorage.getItem('token');
// // // Async thunk to create clients served
// // export const createClientsServed = createAsyncThunk<number, CreateClientsServedParams>(
// //     'officerAssessment/createClientsServed',
// //     async (params: CreateClientsServedParams): Promise<number> => {
// //         console.log('in createClientsServed thunk')
// //         const response = await apiClient.post(`${BASE_URL}/api/officerAssessment/create`, params, {
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${token}`,
// //             },
// //         });
// //         return response.data.totalClientsServed; // Adjust based on your API response
// //     }
// // );
// // // Async thunk to fetch the number of clients served
// // export const fetchClientsServed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
// //     'officerAssessment/fetchClientsServed',
// //     async ({ officerNo, fiscalYear }): Promise<number> => {
// //         console.log('in fetchClientsServed thunk')
// //         const response = await apiClient.get(`${BASE_URL}/api/buspayments/fetchClientsServed/${officerNo}/${fiscalYear}`);
// //         console.log('fetchClientsServed response: ', response)
// //         return response.data
// //     }
// // );
// // // Async thunk to fetch the value of bills distributed
// // export const fetchBillsDistributed = createAsyncThunk<number, FetchBillsDistributedParams>(
// //     'officerAssessment/fetchBillsDistributed',
// //     async ({ officerNo, fiscalYear }): Promise<number> => {
// //         console.log('in fetchBillsDistributed thunk')
// //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/billsDistributed/${officerNo}/${fiscalYear}`);
// //         return response.data;
// //     }
// // );
// // // Async thunk to fetch fiscal years    
// // export const fetchFiscalYears = createAsyncThunk<FiscalYear[], void>(
// //     'officerAssessment/fetchFiscalYears',
// //     async (): Promise<FiscalYear[]> => {
// //         console.log('in fetchFiscalYears thunk')
// //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/fiscalyears`); 
// //         console.log('fetchFiscalYears thunk response: ', response)
// //         return response.data; // Ensure this is an array
// //     }
// // );
// // // Async thunk to fetch fiscal years    
// // export const fetchOfficerAssessments = createAsyncThunk<FiscalYear[], void>(
// //     'officerAssessment/fetchOfficerAssessments',
// //     async (): Promise<FiscalYear[]> => {
// //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/all`); 
// //         return response.data.fiscalYears; // Ensure this is an array
// //     }
// // );
// // // // Async thunk to fetch amounts for each month
// // // export const fetchMonthlyAmount = createAsyncThunk<number, FetchMonthlyAmountParams>(
// // //     'officerAssessment/fetchMonthlyAmount',
// // //     async ({ month, officerNo, fiscalYear }): Promise<number> => {
// // //         console.log('in fetchMonthlyAmount thunk')
// // //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/monthlyAmount/${month}/${officerNo}/${fiscalYear}`);
// // //         return response.data.totalAmount;
// // //     }
// // // );
// // // December
// // // Async thunk for fetching December amount
// // export const fetchDecemberAmount = createAsyncThunk<number, FetchDecemberAmountParams>(
// //     'payments/fetchDecemberAmount',
// //     async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
// //         try {
// //             const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/December/${officerNo}/${fiscalYear}`);
// //             return response.data;
// //         } catch (error: any) {
// //             return rejectWithValue(error.message);
// //         }
// //     }
// // );
// // // Create slice
// // const dataSlice = createSlice({
// //     name: 'data',
// //     initialState: {
// //         clientsServed: null,
// //         billsDistributed: null,
// //         monthlyAmount: null,
// //         fiscalYears: [],
// //         loading: false,
// //         error: null,
// //     } as DataState,
// //     reducers: {
// //         resetData: (state) => {
// //             state.clientsServed = null;
// //             state.billsDistributed = null;
// //             state.monthlyAmount = null;
// //             state.fiscalYears = [];
// //             state.error = null;
// //         },
// //     },
// //     extraReducers: (builder) => {
// //         // Handle fetchClientsServed actions
// //         builder
// //             .addCase(fetchClientsServed.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchClientsServed.fulfilled, (state, action: PayloadAction<number>) => {
// //                 state.loading = false;
// //                 state.clientsServed = action.payload;
// //             })
// //             .addCase(fetchClientsServed.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch clients served';
// //             })
// //             // Handle fetchBillsDistributed actions
// //             .addCase(fetchBillsDistributed.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchBillsDistributed.fulfilled, (state, action: PayloadAction<number>) => {
// //                 state.loading = false;
// //                 state.billsDistributed = action.payload;
// //             })
// //             .addCase(fetchBillsDistributed.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch bills distributed';
// //             })
// //             // Handle fetchMonthlyAmount actions
// //             .addCase(fetchDecemberAmount.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchDecemberAmount.fulfilled, (state, action: PayloadAction<number>) => {
// //                 state.loading = false;
// //                 state.DecemberAmount = action.payload;
// //             })
// //             .addCase(fetchDecemberAmount.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch monthly amount';
// //             })
// //             // Handle fetchFiscalYears actions
// //             .addCase(fetchFiscalYears.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchFiscalYears.fulfilled, (state, action: PayloadAction<FiscalYear[]>) => {
// //                 state.loading = false;
// //                 state.fiscalYears = action.payload;
// //             })
// //             .addCase(fetchFiscalYears.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch fiscal years';
// //             })
// //             // Handle createClientsServed actions
// //             .addCase(createClientsServed.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null; // Reset error on new request
// //             })
// //             .addCase(createClientsServed.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.clientsServed = action.payload; // Update state with the number of clients served
// //             })
// //             .addCase(createClientsServed.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to create clients served'; // Capture error message
// //             });
// //     },
// // });
// // // Exporting the reset action and the reducer
// // export const { resetData } = dataSlice.actions;
// // export default dataSlice.reducer;
