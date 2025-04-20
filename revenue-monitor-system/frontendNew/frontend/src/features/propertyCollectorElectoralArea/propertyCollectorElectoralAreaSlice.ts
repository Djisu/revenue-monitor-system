// src/features/propertyCollectorElectoralArea/propertyCollectorElectoralAreaSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyCollectorElectoralarea data
interface PropertyCollectorElectoralareaData {
    officer_no: string;
    electoralarea: string;
}

// Define the initial state for the slice
interface PropertyCollectorElectoralareaState {
    records: PropertyCollectorElectoralareaData[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertyCollectorElectoralareaState = {
    records: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property collector electoral areas
export const fetchPropertyCollectorElectoralAreas = createAsyncThunk('propertyCollectorElectoralArea/fetchPropertyCollectorElectoralAreas', async () => {
    const response = await axios.get('/api/propertyCollectorElectoralarea');
    return response.data;
});

// Async thunk to fetch a single property collector electoral area by officer_no and electoralarea
export const fetchPropertyCollectorElectoralAreaById = createAsyncThunk('propertyCollectorElectoralArea/fetchPropertyCollectorElectoralAreaById', async ({ officer_no, electoralarea }: { officer_no: string; electoralarea: string }) => {
    const response = await axios.get(`/api/propertyCollectorElectoralarea/${officer_no}/${electoralarea}`);
    return response.data;
});

// Async thunk to create a new property collector electoral area
export const createPropertyCollectorElectoralArea = createAsyncThunk('propertyCollectorElectoralArea/createPropertyCollectorElectoralArea', async (propertyCollectorData: PropertyCollectorElectoralareaData) => {
    const response = await axios.post('/api/propertyCollectorElectoralarea', propertyCollectorData);
    return response.data;
});

// Async thunk to update a property collector electoral area
export const updatePropertyCollectorElectoralArea = createAsyncThunk('propertyCollectorElectoralArea/updatePropertyCollectorElectoralArea', async ({ officer_no, electoralarea, propertyCollectorData }: { officer_no: string; electoralarea: string; propertyCollectorData: PropertyCollectorElectoralareaData }) => {
    const response = await axios.put(`/api/propertyCollectorElectoralarea/${officer_no}/${electoralarea}`, propertyCollectorData);
    return response.data;
});

// Async thunk to delete a property collector electoral area
export const deletePropertyCollectorElectoralArea = createAsyncThunk('propertyCollectorElectoralArea/deletePropertyCollectorElectoralArea', async ({ officer_no, electoralarea }: { officer_no: string; electoralarea: string }) => {
    const response = await axios.delete(`/api/propertyCollectorElectoralarea/${officer_no}/${electoralarea}`);
    return response.data;
});

// Create the slice
const propertyCollectorElectoralAreaSlice = createSlice({
    name: 'propertyCollectorElectoralArea',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyCollectorElectoralAreas.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyCollectorElectoralAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyCollectorElectoralAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property collector electoral areas';
            })
            .addCase(fetchPropertyCollectorElectoralAreaById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyCollectorElectoralAreaById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched property collector electoral area data if needed
                state.error = null;
            })
            .addCase(fetchPropertyCollectorElectoralAreaById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property collector electoral area';
            })
            .addCase(createPropertyCollectorElectoralArea.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyCollectorElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                state.records.push(action.payload); // Add the new property collector electoral area
                state.error = null;
            })
            .addCase(createPropertyCollectorElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property collector electoral area';
            })
            .addCase(updatePropertyCollectorElectoralArea.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyCollectorElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.records.findIndex(record => record.officer_no === action.payload.officer_no && record.electoralarea === action.payload.electoralarea);
                if (index !== -1) {
                    state.records[index] = action.payload; // Update the property collector electoral area
                }
                state.error = null;
            })
            .addCase(updatePropertyCollectorElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property collector electoral area';
            })
            .addCase(deletePropertyCollectorElectoralArea.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyCollectorElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                state.records = state.records.filter(record => !(record.officer_no === action.meta.arg.officer_no && record.electoralarea === action.meta.arg.electoralarea));
                state.error = null;
            })
            .addCase(deletePropertyCollectorElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property collector electoral area';
            });
    },
});

// Export the reducer
export default propertyCollectorElectoralAreaSlice.reducer;