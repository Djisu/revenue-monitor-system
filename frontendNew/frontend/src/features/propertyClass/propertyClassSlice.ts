// src/features/propertyClass/propertyClassSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyClass data
interface PropertyClassData {
    property_class: string;
    rate: number;
}

// Define the initial state for the slice
interface PropertyClassState {
    propertyClasses: PropertyClassData[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertyClassState = {
    propertyClasses: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property classes
export const fetchPropertyClasses = createAsyncThunk('propertyClass/fetchPropertyClasses', async () => {
    const response = await axios.get('/api/propertyClass');
    return response.data;
});

// Async thunk to fetch a single property class by property_class
export const fetchPropertyClassById = createAsyncThunk('propertyClass/fetchPropertyClassById', async (property_class: string) => {
    const response = await axios.get(`/api/propertyClass/${property_class}`);
    return response.data;
});

// Async thunk to create a new property class
export const createPropertyClass = createAsyncThunk('propertyClass/createPropertyClass', async (propertyClassData: PropertyClassData) => {
    const response = await axios.post('/api/propertyClass', propertyClassData);
    return response.data;
});

// Async thunk to update a property class
export const updatePropertyClass = createAsyncThunk('propertyClass/updatePropertyClass', async ({ property_class, propertyClassData }: { property_class: string; propertyClassData: PropertyClassData }) => {
    const response = await axios.put(`/api/propertyClass/${property_class}`, propertyClassData);
    return response.data;
});

// Async thunk to delete a property class
export const deletePropertyClass = createAsyncThunk('propertyClass/deletePropertyClass', async (property_class: string) => {
    const response = await axios.delete(`/api/propertyClass/${property_class}`);
    return response.data;
});

// Create the slice
const propertyClassSlice = createSlice({
    name: 'propertyClass',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyClasses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyClasses = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property classes';
            })
            .addCase(fetchPropertyClassById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyClassById.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched property class data if needed
                state.error = null;
            })
            .addCase(fetchPropertyClassById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property class';
            })
            .addCase(createPropertyClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyClass.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyClasses.push(action.payload); // Add the new property class
                state.error = null;
            })
            .addCase(createPropertyClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property class';
            })
            .addCase(updatePropertyClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyClass.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.propertyClasses.findIndex(cls => cls.property_class === action.payload.property_class);
                if (index !== -1) {
                    state.propertyClasses[index] = action.payload; // Update the property class
                }
                state.error = null;
            })
            .addCase(updatePropertyClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property class';
            })
            .addCase(deletePropertyClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyClass.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyClasses = state.propertyClasses.filter(cls => cls.property_class !== action.meta.arg);
                state.error = null;
            })
            .addCase(deletePropertyClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property class';
            });
    },
});

// Export the reducer
export default propertyClassSlice.reducer;