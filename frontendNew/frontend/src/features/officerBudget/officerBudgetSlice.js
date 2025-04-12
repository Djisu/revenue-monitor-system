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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utilities/apiClient';
import axios from 'axios';
var initialState = {
    data: [],
    loading: false,
    error: null,
    exists: false,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Async thunk to fetch officer budget data
export var fetchOfficerBudget = createAsyncThunk('officerBudget/fetchOfficerBudget', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var officer_no = _b.officer_no, fiscal_year = _b.fiscal_year;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('in fetchOfficerBudget thunk');
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/officerbudget/").concat(officer_no, "/").concat(fiscal_year))];
            case 1:
                response = _c.sent();
                console.log('response data: ', response.data);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch officer budget');
                }
                return [2 /*return*/, {
                        exists: response.data.exists, // Include exists from the API response
                        data: response.data.data, // Include only the data part
                        status: response.status,
                        statusText: response.statusText,
                    }];
        }
    });
}); });
// Async thunk to fetch officer budget data
export var fetchOfficerBudgetAll = createAsyncThunk('officerBudget/fetchOfficerBudgetAll', function (_, thunkAPI) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('in fetchOfficerBudgetAll thunk');
                return [4 /*yield*/, apiClient.get("".concat(BASE_URL, "/api/OfficerBudget/all"))];
            case 1:
                response = _a.sent();
                // response = await axios.get(`${BASE_URL}/api/OfficerBudget/all`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch officer budgets');
                }
                return [2 /*return*/, response.data]; // Return the data from the response
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching officer budgets:', error_1);
                return [2 /*return*/, thunkAPI.rejectWithValue(error_1.response.data)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Async thunk to add a budget record
export var addBudget = createAsyncThunk('budget/addBudget', function (budgetData) { return __awaiter(void 0, void 0, void 0, function () {
    var token, headers, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in addBudget thunk');
                token = localStorage.getItem('token');
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(token), // Include the token in the Authorization header
                };
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/officerbudget/addBudget"), budgetData, { headers: headers })];
            case 1:
                response = _a.sent();
                if (response.status !== 200) {
                    throw new Error('Failed to add budget');
                }
                return [2 /*return*/, response.data.data]; // Access the new data structure
        }
    });
}); });
// // Async thunk to update a budget record
// export const updateBudget = createAsyncThunk(
//     'budget/updateBudget',
//     async (budgetData: any) => {
//         const response = await axios.put(`${BASE_URL}/api/updateBudget`, budgetData);
//         if (response.status!== 200) {
//             throw new Error('Failed to add budget');
//         }
//         return response.data; // Assuming the server returns a success message
//     }
// );
// Create the budget slice
var officerBudgetSlice = createSlice({
    name: 'budget',
    initialState: initialState,
    reducers: {
        resetBudgetState: function (state) {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.exists = false;
        },
        resetError: function (state) {
            state.error = null;
        },
    },
    extraReducers: function (builder) {
        builder
            .addCase(addBudget.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(addBudget.fulfilled, function (state, action) {
            state.loading = false;
            if (action.payload) {
                if (state.data) {
                    state.data.push(action.payload); // Add the new budget to the state
                }
                else {
                    state.data = [action.payload]; // Initialize the array if it's null
                }
            }
        })
            .addCase(addBudget.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to add budget';
        })
            .addCase(fetchOfficerBudgetAll.pending, function (state) {
            state.error = null; // Reset error on new fetch
        })
            .addCase(fetchOfficerBudgetAll.fulfilled, function (state, action) {
            state.data = action.payload;
            state.error = null;
        })
            .addCase(fetchOfficerBudgetAll.rejected, function (state, action) {
            var _a;
            state.error = (_a = action.error.message) !== null && _a !== void 0 ? _a : 'Failed to fetch officer budget';
        });
        // .addCase(updateBudget.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(updateBudget.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.data = action.payload.data || null; // Set data to the response data
        //     state.exists = action.payload.exists; // Set exists based on the response
        //     // Update the existing budget in the state
        //     // if (state.data) {
        //     //     const index = state.data.findIndex(b => b.officer_no === action.payload.officer_no && b.fiscal_year === action.payload.fiscal_year);
        //     //     if (index !== -1) {
        //     //         state.data[index] = { ...state.data[index], ...action.payload };
        //     //     }
        //     // }
        // })
        // .addCase(updateBudget.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.error.message || 'Failed to fetch officer budget';
        //     state.exists = false; // Set exists to false on error
        // });
    },
});
// Export actions and reducer
export var resetError = (_a = officerBudgetSlice.actions, _a.resetError), resetBudgetState = _a.resetBudgetState;
export default officerBudgetSlice.reducer;
