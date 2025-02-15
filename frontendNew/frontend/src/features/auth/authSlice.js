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
// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
var initialState = {
    user: null,
    loading: false,
    error: null,
    message: null, // Initialize message
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Define the async thunk for login
export var loginUser = createAsyncThunk('auth/loginUser', function (credentials_1, _a) { return __awaiter(void 0, [credentials_1, _a], void 0, function (credentials, _b) {
    var response, permissions, error_1;
    var _c;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/auth/login"), {
                        username: credentials.username, // Ensure this matches 'OperatorName'
                        password: credentials.password
                    })];
            case 1:
                response = _d.sent();
                //console.log('Login response:', response.data);
                // Check if the response contains a token
                if (!response.data.token) {
                    // Handle invalid credentials based on the backend response
                    return [2 /*return*/, rejectWithValue({ message: response.data.message || 'Invalid credentials' })];
                }
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log(response.data.user.firstname + ' ' + response.data.user.lastname);
                localStorage.setItem('operatorId', JSON.stringify(response.data.user.firstname + ' ' + response.data.user.lastname));
                console.log('User:', response.data.user);
                permissions = response.data.user.existingPermissions;
                //console.log('Permissions:', permissions);
                // Store permissions if they exist
                localStorage.setItem('existingPermissions', JSON.stringify(permissions));
                return [2 /*return*/, response.data];
            case 2:
                error_1 = _d.sent();
                // Handle errors from the backend
                return [2 /*return*/, rejectWithValue(((_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data) || { message: 'An error occurred' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Define the async thunk for requesting a password reset
export var requestPasswordReset = createAsyncThunk('auth/requestPasswordReset', function (email_1, _a) { return __awaiter(void 0, [email_1, _a], void 0, function (email, _b) {
    var response, error_2;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/auth/request-password-reset"), { email: email })];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_2 = _c.sent();
                return [2 /*return*/, rejectWithValue(error_2.response.data)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Define the async thunk for resetting the password
export var resetPassword = createAsyncThunk('auth/resetPassword', function (payload_1, _a) { return __awaiter(void 0, [payload_1, _a], void 0, function (payload, _b) {
    var response, error_3;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/auth/reset-password"), payload)];
            case 1:
                response = _c.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_3 = _c.sent();
                return [2 /*return*/, rejectWithValue(error_3.response.data)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create the auth slice
var authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logout: function (state) {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.message = null; // Clear message on logout
        },
    },
    // src/redux/slices/authSlice.ts
    extraReducers: function (builder) {
        builder
            .addCase(loginUser.pending, function (state) {
            state.loading = true;
            state.error = null; // Clear previous error
            state.message = null; // Clear message
        })
            .addCase(loginUser.fulfilled, function (state, action) {
            state.loading = false;
            state.user = {
                firstname: action.payload.user.firstname,
                lastname: action.payload.user.lastname
            };
            state.error = null; // Clear error on success
        })
            .addCase(loginUser.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Login failed'; // Set error message
        })
            .addCase(requestPasswordReset.pending, function (state) {
            state.loading = true;
            state.error = null; // Clear previous error
            state.message = null; // Clear message
        })
            .addCase(requestPasswordReset.fulfilled, function (state, action) {
            state.loading = false;
            state.message = action.payload.message; // Success message
            state.error = null; // Clear error on success
        })
            .addCase(requestPasswordReset.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Password reset request failed'; // Set error message
        })
            .addCase(resetPassword.pending, function (state) {
            state.loading = true;
            state.error = null; // Clear previous error
            state.message = null; // Clear message
        })
            .addCase(resetPassword.fulfilled, function (state, action) {
            state.loading = false;
            state.message = action.payload.message; // Success message
            state.error = null; // Clear error on success
        })
            .addCase(resetPassword.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Password reset failed'; // Set error message
        });
    }
});
// Export the actions and reducer
export var logout = authSlice.actions.logout;
export default authSlice.reducer;
