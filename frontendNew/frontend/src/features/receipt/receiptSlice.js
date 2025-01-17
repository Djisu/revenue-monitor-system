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
// src/features/receipt/receiptSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    receipts: [],
    loading: false,
    error: null,
};
// Async thunk to fetch all receipts
export var fetchReceipts = createAsyncThunk('receipt/fetchReceipts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get('/api/receipt')];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to fetch a single receipt by buss_no and receiptno
export var fetchReceiptById = createAsyncThunk('receipt/fetchReceiptById', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var buss_no = _b.buss_no, receiptno = _b.receiptno;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.get("/api/receipt/".concat(buss_no, "/").concat(receiptno))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new receipt
export var createReceipt = createAsyncThunk('receipt/createReceipt', function (receiptData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post('/api/receipt', receiptData)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to update a receipt
export var updateReceipt = createAsyncThunk('receipt/updateReceipt', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var buss_no = _b.buss_no, receiptno = _b.receiptno, receiptData = _b.receiptData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("/api/receipt/".concat(buss_no, "/").concat(receiptno), receiptData)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete a receipt
export var deleteReceipt = createAsyncThunk('receipt/deleteReceipt', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var buss_no = _b.buss_no, receiptno = _b.receiptno;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.delete("/api/receipt/".concat(buss_no, "/").concat(receiptno))];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var receiptSlice = createSlice({
    name: 'receipt',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchReceipts.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchReceipts.fulfilled, function (state, action) {
            state.loading = false;
            state.receipts = action.payload;
            state.error = null;
        })
            .addCase(fetchReceipts.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch receipts';
        })
            .addCase(fetchReceiptById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchReceiptById.fulfilled, function (state) {
            state.loading = false;
            // Optionally handle the fetched receipt data
            state.error = null;
        })
            .addCase(fetchReceiptById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch receipt';
        })
            .addCase(createReceipt.pending, function (state) {
            state.loading = true;
        })
            .addCase(createReceipt.fulfilled, function (state, action) {
            state.loading = false;
            state.receipts.push(action.payload); // Add the new receipt
            state.error = null;
        })
            .addCase(createReceipt.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create receipt';
        })
            .addCase(updateReceipt.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateReceipt.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.receipts.findIndex(function (receipt) { return receipt.receiptno === action.payload.receiptno && receipt.buss_no === action.payload.buss_no; });
            if (index !== -1) {
                state.receipts[index] = action.payload; // Update the receipt
            }
            state.error = null;
        })
            .addCase(updateReceipt.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update receipt';
        })
            .addCase(deleteReceipt.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteReceipt.fulfilled, function (state, action) {
            state.loading = false;
            state.receipts = state.receipts.filter(function (receipt) { return !(receipt.receiptno === action.meta.arg.receiptno && receipt.buss_no === action.meta.arg.buss_no); });
            state.error = null;
        })
            .addCase(deleteReceipt.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete receipt';
        });
    },
});
// Export the reducer
export default receiptSlice.reducer;
