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

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

console.log('in propertyClassSlice.ts')

console.log('BASE_URL:', BASE_URL);

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('BASE_URL: ', BASE_URL)

// Async thunk to fetch all property classes
export const fetchPropertyClasses = createAsyncThunk('propertyClass/fetchPropertyClasses', async () => {
    const response = await axios.get(`${BASE_URL}/api/propertyClass/all`);

    if (response.status >= 200 && response.status < 300) {
        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching property classes : ${response.statusText}`);
    }
});

// Async thunk to fetch a single property class by property_class
export const fetchPropertyClassById = createAsyncThunk('propertyClass/fetchPropertyClassById', async (property_class: string) => {
    const response = await axios.get(`${BASE_URL}/api/propertyClass/${property_class}`);

     if (response.status >= 200 && response.status < 300) {
        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching property class by id    : ${response.statusText}`);
    }
});

// Async thunk to create a new property class
export const createPropertyClass = createAsyncThunk('propertyClass/createPropertyClass', async (propertyClassData: PropertyClassData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/propertyClass`,
             propertyClassData,
             {
                headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to create property class');
        }
        throw new Error('Network error or other issue');
    }
   
});

// Async thunk to update a property class
export const updatePropertyClass = createAsyncThunk('propertyClass/updatePropertyClass', async ({ property_class, propertyClassData }: { property_class: string; propertyClassData: PropertyClassData }) => {
    console.log('in updatePropertyClass')

    try {
        const response = await axios.put(`${BASE_URL}/api/propertyClass/update/${property_class}`, propertyClassData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to delete electoral area');
        }
        throw new Error('Network error or other issue');
    }
    
});

// Async thunk to delete a property class
export const deletePropertyClass = createAsyncThunk('propertyClass/deletePropertyClass', async (property_class: string) => {
    const response = await axios.delete(`${BASE_URL}/api/propertyClass/${property_class}`);
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
                state.error = null;
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
            .addCase(fetchPropertyClassById.fulfilled, (state) => {
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
                state.error = null;
            })
            .addCase(createPropertyClass.fulfilled, (state, action) => {
                state.loading = false;

                 console.log('Before push, property classes:', state.propertyClasses);

                if (action.payload.success) {
                    if (!Array.isArray(state.propertyClasses)) {
                        console.warn('Resetting propertyClasses to an empty array');
                        state.propertyClasses = [];
                    }
                   // Ensure the payload includes a rate, or provide a default value
                const newPropertyClass: PropertyClassData = {
                    property_class: action.payload.message,
                    rate: action.payload.rate !== undefined ? action.payload.rate : 0, // Provide a default rate value if necessary
                };

                state.propertyClasses.push(newPropertyClass);
                console.log('After push, propertyClasses:', state.propertyClasses);
                        } else {
                            state.error = action.payload.message;
                        }
                        // state.propertyClasses.push(action.payload); // Add the new property class
                        // state.error = null;
            })
            .addCase(createPropertyClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred while creating the property class';
            })
            .addCase(updatePropertyClass.pending, (state) => {
                state.loading = true;
                state.error = null;
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
                state.error = null;
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