// src/features/businessType/businessTypeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for BusinessType data
interface BusinessTypeData {
    Business_Type: string;
}

// Define the initial state for the slice
interface BusinessTypeState {
    businessTypes: BusinessTypeData[];
    loading: boolean;
    error: string | null;
}

const initialState: BusinessTypeState = {
    businessTypes: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all BusinessType records
export const fetchBusinessTypes = createAsyncThunk('businessType/fetchBusinessTypes', async () => {
    const response = await axios.get('/api/businessType');
    return response.data;
});

// Async thunk to create a new BusinessType record
export const createBusinessType = createAsyncThunk('businessType/createBusinessType', async (data: BusinessTypeData) => {
    const response = await axios.post('/api/businessType', data);
    return response.data;
});

// Async thunk to fetch a single BusinessType record by Business_Type
export const fetchBusinessTypeById = createAsyncThunk('businessType/fetchBusinessTypeById', async (Business_Type: string) => {
    const response = await axios.get(`/api/businessType/${Business_Type}`);
    return response.data;
});

// Async thunk to update a BusinessType record
export const updateBusinessType = createAsyncThunk(
    'businessType/updateBusinessType',
    async ({ Business_Type, data }: { Business_Type: string; data: BusinessTypeData }) => {
        const response = await axios.put(`/api/businessType/${Business_Type}`, data);
        return response.data;
    }
);

// Async thunk to delete a BusinessType record
export const deleteBusinessType = createAsyncThunk('businessType/deleteBusinessType', async (Business_Type: string) => {
    const response = await axios.delete(`/api/businessType/${Business_Type}`);
    return response.data;
});

// Create the slice
const businessTypeSlice = createSlice({
    name: 'businessType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusinessTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusinessTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.businessTypes = action.payload;
                state.error = null;
            })
            .addCase(fetchBusinessTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch Business Types';
            })
            .addCase(createBusinessType.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBusinessType.fulfilled, (state, action) => {
                state.loading = false;
                state.businessTypes.push(action.payload); // Add the new Business Type
                state.error = null;
            })
            .addCase(createBusinessType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create Business Type';
            })
            .addCase(fetchBusinessTypeById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusinessTypeById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single Business Type as needed
                state.error = null;
            })
            .addCase(fetchBusinessTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch Business Type';
            })
            .addCase(updateBusinessType.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBusinessType.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.businessTypes.findIndex(businessType => businessType.Business_Type === action.payload.Business_Type);
                if (index !== -1) {
                    state.businessTypes[index] = action.payload; // Update the existing Business Type
                }
                state.error = null;
            })
            .addCase(updateBusinessType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update Business Type';
            })
            .addCase(deleteBusinessType.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBusinessType.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted Business Type from the state
                state.businessTypes = state.businessTypes.filter(businessType => businessType.Business_Type !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteBusinessType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete Business Type';
            });
    },
});

// Export the actions if needed
export const {} = businessTypeSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default businessTypeSlice.reducer;