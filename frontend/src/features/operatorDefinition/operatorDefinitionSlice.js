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
// src/features/operator/operatorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    operators: [],
    loading: false,
    error: null
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Function to get headers
var getAuthHeaders = function () {
    var token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: "Bearer ".concat(token),
        },
    };
};
// Async thunk to fetch all operators
export var fetchOperators = createAsyncThunk('operator/fetchOperators', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/operatorDefinition/all"), getAuthHeaders())];
            case 1:
                response = _a.sent();
                if (response.status !== 200) {
                    throw new Error('Failed to fetch operators');
                }
                return [2 /*return*/, Array.isArray(response.data) ? response.data : [response.data]];
        }
    });
}); });
// Async thunk to fetch a single operator by OperatorID
export var fetchOperatorById = createAsyncThunk('operator/fetchOperatorById', function (OperatorID) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/operatorDefinition/").concat(OperatorID), getAuthHeaders())];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new operator
export var createOperator = createAsyncThunk('operator/createOperator', function (operatorData) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('in createOperator slice');
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/operatorDefinition/create"), operatorData, getAuthHeaders())];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.message]; // Return only the message from the response
        }
    });
}); });
// Async thunk to update an operator
export var updateOperator = createAsyncThunk('operator/updateOperator', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var OperatorID = _b.OperatorID, operatorData = _b.operatorData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/operatorDefinition/").concat(OperatorID), operatorData, getAuthHeaders())];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response];
        }
    });
}); });
// Async thunk to delete an operator
export var deleteOperator = createAsyncThunk('operator/deleteOperator', function (OperatorID) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/operatorDefinition/").concat(OperatorID), getAuthHeaders())];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); });
// Create the slice
var operatorDefinitionSlice = createSlice({
    name: 'operator',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchOperators.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOperators.fulfilled, function (state, action) {
            state.loading = false;
            state.operators = action.payload;
            state.error = null;
        })
            .addCase(fetchOperators.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch operators';
        })
            .addCase(fetchOperatorById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOperatorById.fulfilled, function (state, action) {
            state.loading = false;
            state.operators.push(action.payload);
            state.error = null;
        })
            .addCase(fetchOperatorById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch operator';
        })
            .addCase(createOperator.pending, function (state) {
            state.loading = true;
        })
            .addCase(createOperator.fulfilled, function (state, action) {
            state.loading = false;
            // Handle the message returned from the API
            console.log(action.payload); // Log success message
            state.error = null;
        })
            .addCase(createOperator.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create operator';
        })
            .addCase(updateOperator.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateOperator.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.operators.findIndex(function (operator) { return operator.operatorid === action.payload.data.operatorid; });
            if (index !== -1) {
                state.operators[index] = action.payload.data; // Update the operator
            }
            console.log(action.payload.data.message); // Log success message
            state.error = null;
        })
            .addCase(updateOperator.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update operator';
        })
            .addCase(deleteOperator.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteOperator.fulfilled, function (state, action) {
            state.loading = false;
            state.operators = state.operators.filter(function (operator) { return operator.operatorid !== action.meta.arg; });
            state.error = null;
            console.log(action.payload.data.message); // Log success message
        })
            .addCase(deleteOperator.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete operator';
        });
    },
});
// Export the actions if needed
export var _b = _a = operatorDefinitionSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default operatorDefinitionSlice.reducer;
// // src/features/operator/operatorSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// // Define the type for Operator data
// interface OperatorData {
//     OperatorID: string;
//     OperatorName: string;
//     password: string;
//     firstname: string;
//     lastname: string;
// }
// // Define the initial state for the slice
// interface OperatorState {
//     operators: OperatorData[];
//     loading: boolean;
//     error: string | null;
// }
// const initialState: OperatorState = {
//     operators: [],
//     loading: false,
//     error: null,
// };
// const BASE_URL = import.meta.env.VITE_BASE_URL || 
// (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// // Async thunk to fetch all operators
// export const fetchOperators = createAsyncThunk('operator/fetchOperators', async () => {
//     console.log('in fetchOperators slice');
//     const response = await axios.get(`${BASE_URL}/api/operatorDefinition/all`);
//     if (response.status!== 200){
//         throw new Error('Failed to fetch operators');
//     }
//     const data = Array.isArray(response.data) ? response.data : [response.data];
//     return data;
// });
// // Async thunk to fetch a single operator by OperatorID
// export const fetchOperatorById = createAsyncThunk('operator/fetchOperatorById', async (OperatorID: string) => {
//     const response = await axios.get(`${BASE_URL}/api/operatorDefinition/${OperatorID}`);
//     console.log(response.data);
//     return response.data;
// });
// // Async thunk to create a new operator
// export const createOperator = createAsyncThunk('operator/createOperator', async (operatorData: OperatorData) => {
//     const response = await axios.post(`${BASE_URL}/api/operatorDefinition`, operatorData);
//     return response.data;
// });
// // Async thunk to update an operator
// export const updateOperator = createAsyncThunk('operator/updateOperator', async (
//       { OperatorID, operatorData }: { OperatorID: string; operatorData: OperatorData }
//     ) => {
//     const response = await axios.put(`${BASE_URL}/api/operatorDefinition/${OperatorID}`, operatorData);
//     return response.data;
// });
// // Async thunk to delete an operator
// export const deleteOperator = createAsyncThunk('operator/deleteOperator', async (OperatorID: string) => {
//     const response = await axios.delete(`${BASE_URL}/api/operatorDefinition/${OperatorID}`);
//     return response.data;
// });
// // Create the slice
// const operatorDefinitionSlice = createSlice({
//     name: 'operator',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchOperators.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperators.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operators = action.payload;
//                 state.error = null;
//             })
//             .addCase(fetchOperators.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operators';
//             })
//             .addCase(fetchOperatorById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperatorById.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // Handle the fetched operator data if needed
//                 state.operators.push(action.payload); // Add the new operator
//                 state.error = null;
//             })
//             .addCase(fetchOperatorById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operator';
//             })
//             .addCase(createOperator.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createOperator.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operators.push(action.payload); // Add the new operator
//                 state.error = null;
//             })
//             .addCase(createOperator.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create operator';
//             })
//             .addCase(updateOperator.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(updateOperator.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.operators.findIndex(operator => operator.OperatorID === action.payload.OperatorID);
//                 if (index !== -1) {
//                     state.operators[index] = action.payload; // Update the operator
//                 }
//                 state.error = null;
//             })
//             .addCase(updateOperator.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to update operator';
//             })
//             .addCase(deleteOperator.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deleteOperator.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operators = state.operators.filter(operator => operator.OperatorID !== action.meta.arg);
//                 state.error = null;
//             })
//             .addCase(deleteOperator.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to delete operator';
//             });
//     },
// });
// // Export the actions if needed
// export const {} = operatorDefinitionSlice.actions; // Add any synchronous actions if required
// // Export the reducer
// export default operatorDefinitionSlice.reducer;
