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
// src/features/accReceipt/accReceiptSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    accReceipts: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch all AccReceipts
export var fetchAccReceipts = createAsyncThunk('accReceipts/fetchAccReceipts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in fetchAccReceipts');
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/accReceipts/all"))];
            case 1:
                response = _a.sent();
                console.log('in fetchAccReceipts after response: ', response.data.data);
                console.log(response.data);
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new AccReceipt
export var createAccReceipt = createAsyncThunk('accReceipts/createAccReceipt', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('in createAccReceipt');
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/accReceipts/create"), data)];
            case 1:
                response = _a.sent();
                console.log('in createAccReceipt after response: ', response.data.data);
                return [2 /*return*/, response.data.data];
            case 2:
                error_1 = _a.sent();
                console.log('in createAccReceipt error: ', error_1);
                throw error_1; // Rethrow the error to be caught in the slice
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to fetch a single AccReceipt
export var fetchAccReceiptById = createAsyncThunk('accReceipts/fetchAccReceiptById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var batchno = _b.batchno, fiscalyear = _b.fiscalyear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/accReceipts/").concat(batchno, "/").concat(fiscalyear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data.data];
        }
    });
}); });
// Async thunk to update an AccReceipt
export var updateAccReceipt = createAsyncThunk('accReceipts/updateAccReceipt', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var batchno = _b.batchno, data = _b.data;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/accReceipts/").concat(batchno), data)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data.data];
        }
    });
}); });
// Async thunk to delete an AccReceipt
export var deleteAccReceipt = createAsyncThunk('accReceipts/deleteAccReceipt', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var batchno = _b.batchno, fiscalyear = _b.fiscalyear;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/accReceipts/").concat(batchno, "/").concat(fiscalyear))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var accReceiptSlice = createSlice({
    name: 'accReceipts',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchAccReceipts.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchAccReceipts.fulfilled, function (state, action) {
            state.loading = false;
            state.accReceipts = action.payload;
            state.error = null;
        })
            .addCase(fetchAccReceipts.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch AccReceipts';
        })
            .addCase(createAccReceipt.pending, function (state) {
            state.loading = true;
        })
            .addCase(createAccReceipt.fulfilled, function (state, action) {
            state.loading = false;
            state.accReceipts = action.payload; // Add the new receipt to the list
            state.error = null;
        })
            .addCase(createAccReceipt.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create AccReceipt';
        })
            .addCase(fetchAccReceiptById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchAccReceiptById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched single receipt as needed
            state.error = null;
        })
            .addCase(fetchAccReceiptById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch AccReceipt';
        })
            .addCase(updateAccReceipt.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateAccReceipt.fulfilled, function (state, action) {
            state.loading = false;
            // Update the receipt in the state
            var index = state.accReceipts.findIndex(function (receipt) { return receipt.batchno === action.payload.batchno; });
            if (index !== -1) {
                state.accReceipts[index] = action.payload; // Replace with updated data
            }
            state.error = null;
        })
            .addCase(updateAccReceipt.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update AccReceipt';
        })
            .addCase(deleteAccReceipt.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteAccReceipt.fulfilled, function (state, action) {
            state.loading = false;
            // Remove the deleted receipt from the state
            state.accReceipts = state.accReceipts.filter(function (receipt) {
                return !(receipt.batchno === action.meta.arg.batchno && receipt.fiscalyear === action.meta.arg.fiscalyear);
            });
            state.error = null;
        })
            .addCase(deleteAccReceipt.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete AccReceipt';
        });
    },
});
// Export the actions if needed
export var _b = _a = accReceiptSlice.actions;
// Export the reducer
export default accReceiptSlice.reducer;
