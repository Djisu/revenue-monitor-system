// src/features/propertyOfficer/propertyOfficerSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyOfficer data
export interface PropertyOfficerData {
    officer_no: string;
    officer_name: string;
    photo: string;
}

// Define the initial state for the slice
export interface PropertyOfficerState {
    officers: PropertyOfficerData[];
    loading: boolean;
    error: string | null;
}

export const initialState: PropertyOfficerState = {
    officers: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property officers
export const fetchPropertyOfficers = createAsyncThunk('propertyOfficer/fetchPropertyOfficers', async () => {
    const response = await axios.get('/api/propertyOfficer');
    return response.data;
});

// Async thunk to fetch a single property officer by officer_no
export const fetchPropertyOfficerById = createAsyncThunk('propertyOfficer/fetchPropertyOfficerById', async (officer_no: string) => {
    const response = await axios.get(`/api/propertyOfficer/${officer_no}`);
    return response.data;
});

// Async thunk to create a new property officer
export const createPropertyOfficer = createAsyncThunk('propertyOfficer/createPropertyOfficer', async (propertyOfficerData: PropertyOfficerData) => {
    const response = await axios.post('/api/propertyOfficer', propertyOfficerData);
    return response.data;
});

// Async thunk to update a property officer
export const updatePropertyOfficer = createAsyncThunk('propertyOfficer/updatePropertyOfficer', async ({ officer_no, propertyOfficerData }: { officer_no: string; propertyOfficerData: PropertyOfficerData }) => {
    const response = await axios.put(`/api/propertyOfficer/${officer_no}`, propertyOfficerData);
    return response.data;
});

// Async thunk to delete a property officer
export const deletePropertyOfficer = createAsyncThunk('propertyOfficer/deletePropertyOfficer', async (officer_no: string) => {
    const response = await axios.delete(`/api/propertyOfficer/${officer_no}`);
    return response.data;
});

// Create the slice
const propertyOfficerSlice = createSlice({
    name: 'propertyOfficer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyOfficers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyOfficers.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyOfficers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property officers';
            })
            .addCase(fetchPropertyOfficerById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyOfficerById.fulfilled, (state) => {
                state.loading = false;
                // Optionally handle the fetched officer data
                state.error = null;
            })
            .addCase(fetchPropertyOfficerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property officer';
            })
            .addCase(createPropertyOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyOfficer.fulfilled, (state, action) => {
                state.loading = false;
                state.officers.push(action.payload); // Add the new officer
                state.error = null;
            })
            .addCase(createPropertyOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property officer';
            })
            .addCase(updatePropertyOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyOfficer.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.officers.findIndex(officer => officer.officer_no === action.payload.officer_no);
                if (index !== -1) {
                    state.officers[index] = action.payload; // Update the officer data
                }
                state.error = null;
            })
            .addCase(updatePropertyOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property officer';
            })
            .addCase(deletePropertyOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyOfficer.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = state.officers.filter(officer => officer.officer_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deletePropertyOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property officer';
            });
    },
});

// Export the reducer
export default propertyOfficerSlice.reducer;