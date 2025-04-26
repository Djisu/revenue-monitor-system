// src/features/propertyUse/propertyUseSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyUse data
export interface PropertyUseData {
    PropertyUse: string;
    Propertyrate: number;
}

// Define the initial state for the slice
export interface PropertyUseState {
    propertyUses: PropertyUseData[];
    loading: boolean;
    error: string | null;
}

export const initialState: PropertyUseState = {
    propertyUses: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property uses
export const fetchPropertyUses = createAsyncThunk('propertyUse/fetchPropertyUses', async () => {
    const response = await axios.get('/api/propertyUse');
    return response.data;
});

// Async thunk to fetch a single property use by PropertyUse
export const fetchPropertyUseById = createAsyncThunk('propertyUse/fetchPropertyUseById', async (PropertyUse: string) => {
    const response = await axios.get(`/api/propertyUse/${PropertyUse}`);
    return response.data;
});

// Async thunk to create a new property use
export const createPropertyUse = createAsyncThunk('propertyUse/createPropertyUse', async (propertyUseData: PropertyUseData) => {
    const response = await axios.post('/api/propertyUse', propertyUseData);
    return response.data;
});

// Async thunk to update a property use
export const updatePropertyUse = createAsyncThunk('propertyUse/updatePropertyUse', async ({ PropertyUse, propertyUseData }: { PropertyUse: string; propertyUseData: PropertyUseData }) => {
    const response = await axios.put(`/api/propertyUse/${PropertyUse}`, propertyUseData);
    return response.data;
});

// Async thunk to delete a property use
export const deletePropertyUse = createAsyncThunk('propertyUse/deletePropertyUse', async (PropertyUse: string) => {
    const response = await axios.delete(`/api/propertyUse/${PropertyUse}`);
    return response.data;
});

// Create the slice
const propertyUseSlice = createSlice({
    name: 'propertyUse',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyUses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyUses.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyUses = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyUses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property uses';
            })
            .addCase(fetchPropertyUseById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyUseById.fulfilled, (state) => {
                state.loading = false;
                // Optionally handle the fetched property use data
                state.error = null;
            })
            .addCase(fetchPropertyUseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property use';
            })
            .addCase(createPropertyUse.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyUse.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyUses.push(action.payload); // Add the new property use
                state.error = null;
            })
            .addCase(createPropertyUse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property use';
            })
            .addCase(updatePropertyUse.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyUse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.propertyUses.findIndex(use => use.PropertyUse === action.payload.PropertyUse);
                if (index !== -1) {
                    state.propertyUses[index] = action.payload; // Update the property use
                }
                state.error = null;
            })
            .addCase(updatePropertyUse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property use';
            })
            .addCase(deletePropertyUse.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyUse.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyUses = state.propertyUses.filter(use => use.PropertyUse !== action.meta.arg);
                state.error = null;
            })
            .addCase(deletePropertyUse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property use';
            });
    },
});

// Export the reducer
export default propertyUseSlice.reducer;