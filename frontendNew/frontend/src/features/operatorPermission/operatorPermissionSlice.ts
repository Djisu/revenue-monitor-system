// src/features/operatorPermission/operatorPermissionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for OperatorPermission data
interface OperatorPermissionData {
    OperatorID: string;
    Menus: string;
    Reports: string;
    databasesx: string;
    password: string;
}

// Define the initial state for the slice
interface OperatorPermissionState {
    operatorPermissions: OperatorPermissionData[];
    loading: boolean;
    error: string | null;
}

const initialState: OperatorPermissionState = {
    operatorPermissions: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all operator permissions
export const fetchOperatorPermissions = createAsyncThunk('operatorPermission/fetchOperatorPermissions', async () => {
    const response = await axios.get('/api/operatorPermission');
    return response.data;
});

// Async thunk to fetch a single operator permission by OperatorID
export const fetchOperatorPermissionById = createAsyncThunk('operatorPermission/fetchOperatorPermissionById', async (OperatorID: string) => {
    const response = await axios.get(`/api/operatorPermission/${OperatorID}`);
    return response.data;
});

// Async thunk to create a new operator permission
export const createOperatorPermission = createAsyncThunk('operatorPermission/createOperatorPermission', async (operatorPermissionData: OperatorPermissionData) => {
    const response = await axios.post('/api/operatorPermission', operatorPermissionData);
    return response.data;
});

// Async thunk to update an operator permission
export const updateOperatorPermission = createAsyncThunk('operatorPermission/updateOperatorPermission', async ({ OperatorID, operatorPermissionData }: { OperatorID: string; operatorPermissionData: OperatorPermissionData }) => {
    const response = await axios.put(`/api/operatorPermission/${OperatorID}`, operatorPermissionData);
    return response.data;
});

// Async thunk to delete an operator permission
export const deleteOperatorPermission = createAsyncThunk('operatorPermission/deleteOperatorPermission', async (OperatorID: string) => {
    const response = await axios.delete(`/api/operatorPermission/${OperatorID}`);
    return response.data;
});

// Create the slice
const operatorPermissionSlice = createSlice({
    name: 'operatorPermission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOperatorPermissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOperatorPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.operatorPermissions = action.payload;
                state.error = null;
            })
            .addCase(fetchOperatorPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operator permissions';
            })
            .addCase(fetchOperatorPermissionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOperatorPermissionById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched operator permission data if needed
                state.error = null;
            })
            .addCase(fetchOperatorPermissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operator permission';
            })
            .addCase(createOperatorPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOperatorPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.operatorPermissions.push(action.payload); // Add the new operator permission
                state.error = null;
            })
            .addCase(createOperatorPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create operator permission';
            })
            .addCase(updateOperatorPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOperatorPermission.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.operatorPermissions.findIndex(permission => permission.OperatorID === action.payload.OperatorID);
                if (index !== -1) {
                    state.operatorPermissions[index] = action.payload; // Update the operator permission
                }
                state.error = null;
            })
            .addCase(updateOperatorPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update operator permission';
            })
            .addCase(deleteOperatorPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOperatorPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.operatorPermissions = state.operatorPermissions.filter(permission => permission.OperatorID !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteOperatorPermission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete operator permission';
            });
    },
});

// Export the actions if needed
export const {} = operatorPermissionSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default operatorPermissionSlice.reducer;