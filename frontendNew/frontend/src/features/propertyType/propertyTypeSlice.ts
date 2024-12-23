// src/features/propertyType/propertyTypeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyType data
interface PropertyTypeData {
    property_type: string;
    rate: number;
}

// Define the initial state for the slice
interface PropertyTypeState {
    propertyTypes: PropertyTypeData[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertyTypeState = {
    propertyTypes: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property types
export const fetchPropertyTypes = createAsyncThunk('propertyType/fetchPropertyTypes', async () => {
    const response = await axios.get('/api/propertyType');
    return response.data;
});

// Async thunk to fetch a single property type by property_type
export const fetchPropertyTypeById = createAsyncThunk('propertyType/fetchPropertyTypeById', async (property_type: string) => {
    const response = await axios.get(`/api/propertyType/${property_type}`);
    return response.data;
});

// Async thunk to create a new property type
export const createPropertyType = createAsyncThunk('propertyType/createPropertyType', async (propertyTypeData: PropertyTypeData) => {
    const response = await axios.post('/api/propertyType', propertyTypeData);
    return response.data;
});

// Async thunk to update a property type
export const updatePropertyType = createAsyncThunk('propertyType/updatePropertyType', async ({ property_type, propertyTypeData }: { property_type: string; propertyTypeData: PropertyTypeData }) => {
    const response = await axios.put(`/api/propertyType/${property_type}`, propertyTypeData);
    return response.data;
});

// Async thunk to delete a property type
export const deletePropertyType = createAsyncThunk('propertyType/deletePropertyType', async (property_type: string) => {
    const response = await axios.delete(`/api/propertyType/${property_type}`);
    return response.data;
});

// Create the slice
const propertyTypeSlice = createSlice({
    name: 'propertyType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyTypes = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property types';
            })
            .addCase(fetchPropertyTypeById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyTypeById.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally handle the fetched property type data
                state.error = null;
            })
            .addCase(fetchPropertyTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property type';
            })
            .addCase(createPropertyType.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyType.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyTypes.push(action.payload); // Add the new property type
                state.error = null;
            })
            .addCase(createPropertyType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property type';
            })
            .addCase(updatePropertyType.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyType.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.propertyTypes.findIndex(type => type.property_type === action.payload.property_type);
                if (index !== -1) {
                    state.propertyTypes[index] = action.payload; // Update the property type
                }
                state.error = null;
            })
            .addCase(updatePropertyType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property type';
            })
            .addCase(deletePropertyType.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyType.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyTypes = state.propertyTypes.filter(type => type.property_type !== action.meta.arg);
                state.error = null;
            })
            .addCase(deletePropertyType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property type';
            });
    },
});

// Export the reducer
export default propertyTypeSlice.reducer;