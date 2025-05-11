// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, SerializedError, Slice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface OperatorDefinition {
    OperatorID: string;
    OperatorName: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    resetToken?: string; // Optional because it may not always be set
    resetTokenExpiration?: Date; // Optional
}

// Define the initial state
export interface AuthState {
    user: { firstname: string; lastname: string } | null;
    loading: boolean;
    error: string | null;
    message: string | null; // To store success messages
}

export const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    message: null, // Initialize message
};

// Define the response type for successful login
export interface LoginResponse {
    token: string;
    user: OperatorDefinition; // The user object returned from the backend
}
  
// Define the error response type for login
export interface LoginError {
    message: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://revenue-monitor-system.onrender.com/api');

console.log('BASE_URL: ', BASE_URL)

// Define the async thunk for login
export const loginUser = createAsyncThunk<LoginResponse, { username: string; password: string }, { rejectValue: LoginError }>(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        console.log('Sending login request:', { username: credentials.username, password: credentials.password });

        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username: credentials.username, // Ensure this matches 'OperatorName'
                password: credentials.password
            },
            { withCredentials: true }
            );

            console.log('Login response:', response.data);

            // Check if the response contains a token
            if (!response.data.token) {
                // Handle invalid credentials based on the backend response
                return rejectWithValue({ message: response.data.message || 'Invalid credentials' });
            }

            //console.log('Token:', response.data.token);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            console.log(response.data.user.firstname +  ' ' + response.data.user.lastname)
            localStorage.setItem('operatorId', JSON.stringify(response.data.user.operatorid));

            console.log('userId:', response.data.user.operatorid);

            console.log('Stored token:', localStorage.getItem('token'));
            console.log('Stored user:', localStorage.getItem('user'));
            console.log('Stored operatorId:', localStorage.getItem('operatorId'));


            // Assuming existingPermissions is an array
            const permissions = response.data.user.existingPermissions; 
            //console.log('Permissions:', permissions);
            
            // Store permissions if they exist
            localStorage.setItem('existingPermissions', JSON.stringify(permissions));

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('Axios Error:', axiosError.response?.status, axiosError.response?.data);
                if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
                    // Assuming that the object could have a message property
                    const { message = 'An error occurred during login' } = axiosError.response.data as { message?: string };
                    return rejectWithValue({ message });
                } else {
                    return rejectWithValue({ message: 'An error occurred during login' });
                }
            }           
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
            
        }
);


// Define the async thunk for requesting a password reset
export const requestPasswordReset = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/request-password-reset`, { email });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error){
                // Handle errors from the backend
                return rejectWithValue({ message: 'An error occurred' });
            }
            
        }
    }
);

// Define the async thunk for resetting the password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (payload: { token: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, payload);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error){
                // Handle errors from the backend
                return rejectWithValue({ message: 'An error occurred' });
            }
            
        }
    }
);

// Create the auth slice
const authSlice: Slice<AuthState> = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.message = null; // Clear message on logout
        },
    },
   // src/redux/slices/authSlice.ts

extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null; // Clear previous error
            state.message = null; // Clear message
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = {
                firstname: action.payload.user.firstname,
                lastname: action.payload.user.lastname
            };
            state.error = null; // Clear error on success
        })
        .addCase(loginUser.rejected, (state, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
            state.loading = false;
            state.error = action.error.message || 'Login failed'; // Set error message
        })
        .addCase(requestPasswordReset.pending, (state) => {
            state.loading = true;
            state.error = null; // Clear previous error
            state.message = null; // Clear message
        })
        .addCase(requestPasswordReset.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message; // Success message
            state.error = null; // Clear error on success
        })
        .addCase(requestPasswordReset.rejected, (state, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
            state.loading = false;
            state.error = action.error.message || 'Password reset request failed'; // Set error message
        })
        .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null; // Clear previous error
            state.message = null; // Clear message
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message; // Success message
            state.error = null; // Clear error on success
        })
        .addCase(resetPassword.rejected, (state, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
            state.loading = false;
            state.error = action.error.message || 'Password reset failed'; // Set error message
        });
}
});

// Export the actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
