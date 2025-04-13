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
// src/features/busPayments/busPaymentsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    busPayments: [],
    loading: false,
    error: null,
    billedAmount: 0,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
export var selectBusPayments = function (state) { return state.busPayments.busPayments; };
// Async thunk to fetch all BusPayments records
export var fetchPaymentDefaulters = createAsyncThunk('busPayments/fetchPaymentDefaulters', function (electoralarea) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in fetchPaymentDefaulters slice', electoralarea);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/defaulters/").concat(electoralarea))];
            case 1:
                response = _a.sent();
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchPaymentDefaulters fulfilled::: ', response.data.data);
                    return [2 /*return*/, response.data]; // Return the correct data
                }
                else {
                    throw new Error("Error fetching bus payment. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch all BusPayments records
export var fetchBusPayments = createAsyncThunk('busPayments/fetchBusPayments', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var fetchTransSavings = createAsyncThunk('busPayments/fetchBusPayments', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/transsavings"))];
            case 1:
                response = _a.sent();
                console.log('response data', response.data);
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchBusPayments fulfilled::: ', response.data.data);
                    return [2 /*return*/, response.data.data]; // Return the correct data
                }
                else {
                    throw new Error("Error fetching bus payment. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to create a new BusPayments record
export var createBusPayment = createAsyncThunk('busPayments/createBusPayment', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('createBusPayment slice', data);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/busPayments/create"), data, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 2:
                response = _a.sent();
                console.log('AFTER APIresponse data', response.data.message);
                if (response.status >= 200 && response.status < 300) {
                    console.log('response.data: ', response.data);
                    // Ensure response.data is an array
                    //return Array.isArray(response.data) ? response.data : []; //
                    return [2 /*return*/, response.data]; // This data will be available as `action.payload`
                }
                else {
                    throw new Error("Error fetching business client payment. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                if (axios.isAxiosError(error_1) && error_1.response) {
                    throw new Error(error_1.response.data.message || 'Failed to create business');
                }
                throw new Error('Network error or other issue');
            case 4: return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single BusPayments record by buss_no
export var fetchBilledAmount = createAsyncThunk('busPayments/fetchBilledAmount', function (buss_no) { return __awaiter(void 0, void 0, void 0, function () {
    var bussNo, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in fetchBilledAmount slice', buss_no);
                bussNo = parseInt(buss_no);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/billedAmount/").concat(bussNo))];
            case 1:
                response = _a.sent();
                console.log('response data', response.data);
                if (response.status >= 200 && response.status < 300) {
                    console.log('busPayments fulfilled::: ', response.data.billedAmount);
                    return [2 /*return*/, response.data.billedAmount || 0];
                }
                else {
                    throw new Error("Error fetching bus payment. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single BusPayments record by buss_no
export var fetchBusPaymentByBussNo = createAsyncThunk('busPayments/fetchBusPaymentByBussNo', function (buss_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/").concat(buss_no))];
            case 1:
                response = _a.sent();
                if (response.status >= 200 && response.status < 300) {
                    console.log('busPayments fulfilled::: ', response.data);
                    // Ensure response.data is an array
                    return [2 /*return*/, Array.isArray(response.data) ? response.data : []]; //        
                }
                else {
                    throw new Error("Error fetching bus payment. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single BusPayments record by buss_no
export var fetchBusPaymentByElectoralArea = createAsyncThunk('busPayments/fetchBusPaymentByElectoralArea', function (electoralArea) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in fetchBusPaymentByElectoralArea: ', electoralArea);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/busPayments/").concat(electoralArea))];
            case 1:
                response = _a.sent();
                if (Array.isArray(response.data)) {
                    console.log('fetchBusPaymentByElectoralArea fulfilled::: ', response.data);
                    // Ensure response.data is an array 
                    return [2 /*return*/, Array.isArray(response.data) ? response.data : []]; //
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single BusPayments record by buss_no
export var fetchBusPaymentByPaymentDate = createAsyncThunk('busPayments/fetchBusPaymentByPaymentDate', function (payment_date) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/").concat(payment_date))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
export var fetchBusPaymentByTwoDates = createAsyncThunk('busPayments/fetchBusPaymentByTwoDates', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var formattedStartDate, formattedEndDate, response;
    var bussNo = _b.bussNo, startDate = _b.startDate, endDate = _b.endDate;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('in fetchBusPaymentByTwoDates slice', bussNo, startDate, endDate);
                formattedStartDate = startDate.toISOString().split('T')[0];
                formattedEndDate = endDate.toISOString().split('T')[0];
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/").concat(bussNo, "/").concat(formattedStartDate, "/").concat(formattedEndDate))];
            case 1:
                response = _c.sent();
                console.log('response data', response.data);
                if (response.status >= 200 && response.status < 300) {
                    console.log('busPayments fulfilled::: ', response.data.data);
                    return [2 /*return*/, response.data.data]; // Return the correct data
                }
                else {
                    throw new Error("Error fetching bus payment. Status: ".concat(response.status, " - Error: ").concat(response.statusText));
                }
                return [2 /*return*/];
        }
    });
}); });
// Async thunk to update a BusPayments record
export var updateBusPayment = createAsyncThunk('busPayments/updateBusPayment', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var buss_no = _b.buss_no, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/busPayments/").concat(buss_no), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a BusPayments record
export var deleteBusPayment = createAsyncThunk('busPayments/deleteBusPayment', function (buss_no) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/busPayments/").concat(buss_no))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Newly added actions
// Async thunk to fetch all BusinessType records
export var billAllBusinesses = createAsyncThunk('businessType/billAllBusinesses', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('inside billAllBusinesses thunk');
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/busPayments/billallbusinesses"))];
            case 1:
                response = _a.sent();
                console.log('after billallbusinesses thunk, Response data:', response.data);
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                console.log('billallbusinesses thunk, response data:', response.data);
                return [4 /*yield*/, response.data];
            case 2: return [2 /*return*/, _a.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error fetching business types: ".concat(response.statusText));
        }
    });
}); });
export var billOneBusiness = createAsyncThunk('businessType/billoneBusiness', function (bussNo) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('inside billOneBusiness thunk');
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/busPayments/billonebusiness/").concat(bussNo), {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                console.log('after billonebusiness thunk, Response data:', response.data);
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                console.log('billonebusiness thunk, response data:', response.data);
                return [4 /*yield*/, response.data];
            case 2: return [2 /*return*/, _a.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error billing one business types: ".concat(response.statusText));
        }
    });
}); });
export var fetchDailyPayments = createAsyncThunk('businessType/dailypayments', function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var firstDate, lastDate, electoralarea, bussType, formattedFirstDate, formattedLastDate, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('inside fetchDailyPayments thunk');
                firstDate = args.firstDate, lastDate = args.lastDate, electoralarea = args.electoralarea, bussType = args.bussType;
                formattedFirstDate = new Date(firstDate).toISOString().split('T')[0];
                formattedLastDate = new Date(lastDate).toISOString().split('T')[0];
                console.log('formattedFirstDate:', formattedFirstDate, 'formattedLastDate:', formattedLastDate);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/dailypayments/").concat(formattedFirstDate, "/").concat(formattedLastDate, "/").concat(electoralarea, "/").concat(bussType), {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 2:
                response = _a.sent();
                console.log('after fetchDailyPayments thunk, Response data:', response.data);
                if (response.status >= 200 && response.status < 300) {
                    console.log('fetchDailyPayments thunk, response data.data:', response.data.data);
                    return [2 /*return*/, response.data.data];
                }
                else {
                    throw new Error("Error fetching one business types: ".concat(response.statusText));
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                if (error_2.response && error_2.response.status === 404) {
                    throw new Error('Payment not found for the specified criteria.');
                }
                else {
                    throw new Error("Error fetching daily payments: ".concat(error_2.message));
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
export var fetchFiscalyearReceiptno = createAsyncThunk('businessType/fetchFiscalyearReceiptno', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var year, response;
    var fiscalyear = _b.fiscalyear, receiptno = _b.receiptno;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('inside fetchFiscalyearReceiptno thunk');
                console.log('fiscalyear: ', fiscalyear);
                console.log('receiptno: ', receiptno);
                year = fiscalyear.split('-')[0];
                fiscalyear = year;
                console.log('fiscalyear: ', fiscalyear);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/busPayments/").concat(fiscalyear, "/").concat(receiptno), {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                response = _c.sent();
                console.log('after fetchFiscalyearReceiptno thunk, Response data:', response.data);
                if (!(response.status >= 200 && response.status < 300)) return [3 /*break*/, 3];
                console.log('fetchFiscalyearReceiptno thunk, response data.data:', response.data.data);
                return [4 /*yield*/, response.data];
            case 2: return [2 /*return*/, _c.sent()]; // This data will be available as `action.payload`
            case 3: throw new Error("Error fetching one business types: ".concat(response.statusText));
        }
    });
}); });
// Create the slice 
var busPaymentsSlice = createSlice({
    name: 'busPayments',
    initialState: initialState,
    reducers: {
        setBusPayments: function (state, action) {
            state.busPayments = action.payload;
        },
        addBusPayment: function (state, action) {
            state.busPayments.push(action.payload);
        },
        setLoading: function (state, action) {
            state.loading = action.payload;
        },
        setError: function (state, action) {
            state.error = action.payload;
        },
        setBilledAmount: function (state, action) {
            state.billedAmount = action.payload;
        },
    },
    extraReducers: function (builder) {
        builder
            .addCase(billAllBusinesses.pending, function (state) {
            state.loading = true;
        })
            .addCase(billAllBusinesses.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            (_a = state.busPayments).push.apply(_a, action.payload); // Add the new business
            state.error = null;
        })
            .addCase(billAllBusinesses.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create BusPayments record';
        })
            .addCase(fetchBilledAmount.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchBilledAmount.fulfilled, function (state, action) {
            state.loading = false;
            state.billedAmount = action.payload;
            state.error = null;
        })
            .addCase(fetchBilledAmount.rejected, function (state) {
            state.loading = false;
            state.error = null;
        })
            .addCase(fetchBusPayments.fulfilled, function (state, action) {
            state.loading = false;
            state.busPayments = action.payload;
            state.error = null;
        })
            .addCase(fetchBusPayments.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch BusPayments records';
        })
            .addCase(createBusPayment.pending, function (state) {
            state.loading = true;
        })
            .addCase(createBusPayment.fulfilled, function (state, action) {
            state.loading = false;
            state.busPayments.push(action.payload); // Add the new business
            state.error = null;
        })
            .addCase(createBusPayment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create BusPayments record';
        })
            .addCase(fetchBusPaymentByBussNo.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusPaymentByBussNo.fulfilled, function (state, action) {
            state.loading = false;
            action.payload.forEach(function (payment) { return state.busPayments.push(payment); }); // Add each BusPayments record
            state.error = null;
        })
            .addCase(fetchBusPaymentByBussNo.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch BusPayments record';
        })
            .addCase(fetchBusPaymentByElectoralArea.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusPaymentByElectoralArea.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            if (action.payload && Array.isArray(action.payload)) {
                (_a = state.busPayments).push.apply(_a, action.payload); // Use spread operator if payload is an array
            }
            state.error = null;
        })
            .addCase(fetchBusPaymentByElectoralArea.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch BusPayments record';
        })
            .addCase(fetchBusPaymentByPaymentDate.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusPaymentByPaymentDate.fulfilled, function (state, action) {
            state.loading = false;
            state.busPayments.push(action.payload); // Add the new BusPayments record
            state.error = null;
        })
            .addCase(fetchBusPaymentByPaymentDate.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch BusPayments record';
        })
            .addCase(fetchBusPaymentByTwoDates.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchBusPaymentByTwoDates.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            (_a = state.busPayments).push.apply(_a, action.payload); // Add the new BusPayments record
            state.error = null;
        })
            .addCase(fetchBusPaymentByTwoDates.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch BusPayments record';
        })
            .addCase(updateBusPayment.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateBusPayment.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.busPayments.findIndex(function (busPayment) { return busPayment.buss_no === action.payload.buss_no; });
            if (index !== -1) {
                state.busPayments[index] = action.payload; // Update the existing BusPayments record
            }
            state.error = null;
        })
            .addCase(updateBusPayment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update BusPayments record';
        })
            .addCase(deleteBusPayment.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteBusPayment.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted BusPayments record from the state   
            state.busPayments = state.busPayments.filter(function (busPayment) { return busPayment.buss_no !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteBusPayment.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete BusPayments record';
        })
            .addCase(fetchFiscalyearReceiptno.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchFiscalyearReceiptno.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            (_a = state.busPayments).push.apply(_a, action.payload); // Add the new BusPayments record
            state.error = null;
        })
            .addCase(fetchFiscalyearReceiptno.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch BusPayments record';
        });
    },
});
// Export the actions if needed
export var setBusPayments = (_a = busPaymentsSlice.actions, _a.setBusPayments), addBusPayment = _a.addBusPayment, setLoading = _a.setLoading, setError = _a.setError;
export default busPaymentsSlice.reducer;
