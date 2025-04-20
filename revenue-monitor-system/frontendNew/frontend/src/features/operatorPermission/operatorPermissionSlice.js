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
import axios from 'axios';
var initialState = {
    operatorPermissions: [],
    loading: false,
    error: null,
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Function to get authorization headers
var getAuthHeaders = function () {
    var token = localStorage.getItem('token'); // Retrieve token from localStorage
    return {
        headers: {
            Authorization: token ? "Bearer ".concat(token) : '',
        },
    };
};
// Async thunk to fetch all operator permissions
export var fetchOperatorPermissionsThunk = createAsyncThunk('operatorPermission/fetchOperatorPermissions', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/operatorPermissions/all"), getAuthHeaders())];
            case 1:
                response = _a.sent();
                if (response.status !== 200) {
                    throw new Error('Failed to fetch operators');
                }
                console.log('API Response:', response.data); // Log the response data
                return [2 /*return*/, response.data.data]; // Access data from the Axios response
        }
    });
}); });
// Async thunk to fetch a single operator permission by OperatorID
export var fetchOperatorPermissionById = createAsyncThunk('operatorPermission/fetchOperatorPermissionById', function (OperatorID) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("".concat(BASE_URL, "/api/operatorPermissions/").concat(OperatorID), getAuthHeaders())];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to create a new operator permission
export var createOperatorPermission = createAsyncThunk('operatorPermission/createOperatorPermission', function (operatorPermissionData) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1, message;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('in createOperatorPermission thunk');
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/operatorPermissions/create"), operatorPermissionData, getAuthHeaders())];
            case 2:
                response = _c.sent();
                return [2 /*return*/, response.data]; // Return the whole response object
            case 3:
                error_1 = _c.sent();
                message = ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Unknown error occurred';
                throw new Error(message);
            case 4: return [2 /*return*/];
        }
    });
}); });
// Async thunk to update an operator permission
export var updateOperatorPermission = createAsyncThunk('operatorPermission/updateOperatorPermission', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var response;
    var OperatorID = _b.OperatorID, operatorPermissionData = _b.operatorPermissionData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, axios.put("".concat(BASE_URL, "/api/operatorPermissions/").concat(OperatorID), operatorPermissionData, getAuthHeaders())];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Async thunk to delete an operator permission
export var deleteOperatorPermission = createAsyncThunk('operatorPermission/deleteOperatorPermission', function (operatorID) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/api/operatorPermissions/").concat(operatorID), getAuthHeaders())];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); });
// Create the slice
var operatorPermissionSlice = createSlice({
    name: 'operatorPermission',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(fetchOperatorPermissionsThunk.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOperatorPermissionsThunk.fulfilled, function (state, action) {
            state.loading = false;
            state.operatorPermissions = action.payload;
            state.error = null;
        })
            .addCase(fetchOperatorPermissionsThunk.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch operator permissions';
        })
            .addCase(fetchOperatorPermissionById.pending, function (state) {
            state.loading = true;
        })
            .addCase(fetchOperatorPermissionById.fulfilled, function (state) {
            state.loading = false;
            // Handle the fetched operator permission data if needed
            state.error = null;
        })
            .addCase(fetchOperatorPermissionById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch operator permission';
        })
            .addCase(createOperatorPermission.pending, function (state) {
            state.loading = true;
        })
            .addCase(createOperatorPermission.fulfilled, function (state, action) {
            state.loading = false;
            // Assuming the action.payload contains the message
            state.error = null; // Clear error on successful creation
            // Optionally, you can log or handle the success message
            console.log(action.payload.message); // Success message from the API
            // If you want to fetch the updated list of permissions after creation, you could do that here
        })
            .addCase(createOperatorPermission.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create operator permission';
        })
            .addCase(updateOperatorPermission.pending, function (state) {
            state.loading = true;
        })
            .addCase(updateOperatorPermission.fulfilled, function (state, action) {
            state.loading = false;
            var index = state.operatorPermissions.findIndex(function (permission) { return permission.operatorid === action.payload.OperatorID; });
            if (index !== -1) {
                state.operatorPermissions[index] = action.payload; // Update the operator permission
            }
            state.error = null;
        })
            .addCase(updateOperatorPermission.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update operator permission';
        })
            .addCase(deleteOperatorPermission.pending, function (state) {
            state.loading = true;
        })
            .addCase(deleteOperatorPermission.fulfilled, function (state, action) {
            state.loading = false;
            state.operatorPermissions = state.operatorPermissions.filter(function (permission) { return permission.operatorid !== action.meta.arg; });
            state.error = null;
        })
            .addCase(deleteOperatorPermission.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete operator permission';
        });
    },
});
// Export the actions if needed
export var _b = _a = operatorPermissionSlice.actions; // Add any synchronous actions if required
// Export the reducer
export default operatorPermissionSlice.reducer;
// // src/features/operatorPermission/operatorPermissionSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// // Define the type for OperatorPermission data
// interface OperatorPermissionData {
//     OperatorID: string;
//     Menus: string;
//     Reports: string;
//     databasesx: string;
//     password: string;
// }
// // Define the initial state for the slice
// interface OperatorPermissionState {
//     operatorPermissions: OperatorPermissionData[];
//     loading: boolean;
//     error: string | null;
// }
// const initialState: OperatorPermissionState = {
//     operatorPermissions: [],
//     loading: false,
//     error: null,
// };
// const BASE_URL = import.meta.env.VITE_BASE_URL || 
// (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// // Async thunk to fetch all operator permissions
// export const fetchOperatorPermissions = createAsyncThunk('operatorPermission/fetchOperatorPermissions', async () => {
//     const response = await axios.get(`${BASE_URL}/api/operatorPermission`);
//     return response.data;
// });
// // Async thunk to fetch a single operator permission by OperatorID
// export const fetchOperatorPermissionById = createAsyncThunk('operatorPermission/fetchOperatorPermissionById', async (OperatorID: string) => {
//     const response = await axios.get(`${BASE_URL}/api/operatorPermission/${OperatorID}`);   
//     return response.data;
// });
// // Async thunk to create a new operator permission
// export const createOperatorPermission = createAsyncThunk('operatorPermission/createOperatorPermission', async (operatorPermissionData: OperatorPermissionData) => {
//     const response = await axios.post(`${BASE_URL}/api/operatorPermission`, operatorPermissionData);
//     return response.data;
// });
// // Async thunk to update an operator permission
// export const updateOperatorPermission = createAsyncThunk('operatorPermission/updateOperatorPermission', async ({ OperatorID, operatorPermissionData }: { OperatorID: string; operatorPermissionData: OperatorPermissionData }) => {
//     const response = await axios.put(`${BASE_URL}/api/operatorPermission/${OperatorID}`, operatorPermissionData);
//     return response.data;
// });
// // Async thunk to delete an operator permission
// export const deleteOperatorPermission = createAsyncThunk('operatorPermission/deleteOperatorPermission', async (OperatorID: string) => {
//     const response = await axios.delete(`${BASE_URL}/api/operatorPermission/${OperatorID}`);
//     return response.data;
// });
// // Create the slice
// const operatorPermissionSlice = createSlice({
//     name: 'operatorPermission',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchOperatorPermissions.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperatorPermissions.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operatorPermissions = action.payload;
//                 state.error = null;
//             })
//             .addCase(fetchOperatorPermissions.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operator permissions';
//             })
//             .addCase(fetchOperatorPermissionById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperatorPermissionById.fulfilled, (state) => {
//                 state.loading = false;
//                 // Handle the fetched operator permission data if needed
//                 state.error = null;
//             })
//             .addCase(fetchOperatorPermissionById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operator permission';
//             })
//             .addCase(createOperatorPermission.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createOperatorPermission.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operatorPermissions.push(action.payload); // Add the new operator permission
//                 state.error = null;
//             })
//             .addCase(createOperatorPermission.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create operator permission';
//             })
//             .addCase(updateOperatorPermission.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(updateOperatorPermission.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.operatorPermissions.findIndex(permission => permission.OperatorID === action.payload.OperatorID);
//                 if (index !== -1) {
//                     state.operatorPermissions[index] = action.payload; // Update the operator permission
//                 }
//                 state.error = null;
//             })
//             .addCase(updateOperatorPermission.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to update operator permission';
//             })
//             .addCase(deleteOperatorPermission.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deleteOperatorPermission.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operatorPermissions = state.operatorPermissions.filter(permission => permission.OperatorID !== action.meta.arg);
//                 state.error = null;
//             })
//             .addCase(deleteOperatorPermission.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to delete operator permission';
//             });
//     },
// });
// // Export the actions if needed
// export const {} = operatorPermissionSlice.actions; // Add any synchronous actions if required
// // Export the reducer
// export default operatorPermissionSlice.reducer;
