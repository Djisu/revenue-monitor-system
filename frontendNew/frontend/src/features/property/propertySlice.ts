// src/features/property/propertySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Property data
interface PropertyData {
    house_no: string;
    owner: string;
    tenant: string;
    propertyuse: string;
    propertytype: string;
    propertyclass: string;
    electroral_area: string;
    landmark: string;
    street_name: string;
    lattitude: number;
    longitude: number;
    code: string;
    elevation: number;
    rate: number;
    Assessmentby: string;
    balance: number;
    PropertyUseRate: number;
    PropertytypeRate: number;
    PropertyclassRate: number;
}

// Define the initial state for the slice
interface PropertyState {
    properties: PropertyData[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertyState = {
    properties: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all properties
export const fetchProperties = createAsyncThunk('property/fetchProperties', async () => {
    const response = await axios.get('/api/property');
    return response.data;
});

// Async thunk to fetch a single property by house_no
export const fetchPropertyById = createAsyncThunk('property/fetchPropertyById', async (house_no: string) => {
    const response = await axios.get(`/api/property/${house_no}`);
    return response.data;
});

// Async thunk to create a new property
export const createProperty = createAsyncThunk('property/createProperty', async (propertyData: PropertyData) => {
    const response = await axios.post('/api/property', propertyData);
    return response.data;
});

// Async thunk to update a property
export const updateProperty = createAsyncThunk('property/updateProperty', async ({ house_no, propertyData }: { house_no: string; propertyData: PropertyData }) => {
    const response = await axios.put(`/api/property/${house_no}`, propertyData);
    return response.data;
});

// Async thunk to delete a property
export const deleteProperty = createAsyncThunk('property/deleteProperty', async (house_no: string) => {
    const response = await axios.delete(`/api/property/${house_no}`);
    return response.data;
});

// Create the slice
const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload;
                state.error = null;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch properties';
            })
            .addCase(fetchPropertyById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally handle the fetched property data
                state.error = null;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property';
            })
            .addCase(createProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.properties.push(action.payload); // Add the new property
                state.error = null;
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property';
            })
            .addCase(updateProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.properties.findIndex(property => property.house_no === action.payload.house_no);
                if (index !== -1) {
                    state.properties[index] = action.payload; // Update the property
                }
                state.error = null;
            })
            .addCase(updateProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property';
            })
            .addCase(deleteProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = state.properties.filter(property => property.house_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property';
            });
    },
});

// Export the reducer
export default propertySlice.reducer;