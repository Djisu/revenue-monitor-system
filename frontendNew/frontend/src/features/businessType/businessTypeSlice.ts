// src/features/businessType/businessTypeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for BusinessType data// Define the type for BusinessType data
interface BusinessTypeData {
    Business_Type: string; // Updated to match API response
}

// Define the initial state for the slice
interface BusinessTypeState {
    businessTypes: BusinessTypeData[];
    loading: boolean;
    error: string | null;
}

const initialState: BusinessTypeState = {
    businessTypes: [] as BusinessTypeData[],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Async thunk to fetch all BusinessType records
export const fetchBusinessTypes = createAsyncThunk('businessType/fetchBusinessTypes', async () => {
    //console.log('inside fetchBusinessTypes thunk');
    const response = await axios.get(`${BASE_URL}/api/businessType/all`);

    //console.log('after fetchBusinessTypes thunk, Response data:', response.data)

    if (response.status >= 200 && response.status < 300) {
       // console.log('fetchBusinessTypes thunk, response data:', response.data);

        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching business types: ${response.statusText}`);
    }
});

// Async thunk to create a new BusinessType record
export const createBusinessType = createAsyncThunk(
    'businessType/createBusinessType', 
    async (businessType: string) => {
        //console.log('Creating a new business type record:', businessType);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/businessType/create`, 
                { Business_Type: businessType },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error responses
                throw new Error(error.response.data.message || 'Failed to create business type');
            }
            throw new Error('Network error or other issue');
        }
});

// Async thunk to fetch a single BusinessType record by Business_Type
// export const fetchBusinessTypeById = createAsyncThunk('businessType/fetchBusinessTypeById', async (Business_Type: string) => {
//     const response = await axios.get(`${BASE_URL}/api/businessType/${Business_Type}`);
//     return response.data;
// });

// Async thunk to update a BusinessType record
export const updateBusinessType = createAsyncThunk(
    'businessType/updateBusinessType',
    async ({ Business_Type, data }: { Business_Type: string; data: BusinessTypeData }) => {
        const response = await axios.put(`${BASE_URL}/api/businessType/${Business_Type}`, data);
        return response.data;
    }
);

// Async thunk to delete a BusinessType record
export const deleteBusinessType = createAsyncThunk(
    'businessType/deleteBusinessType',
    async (Business_Type: string) => {
        const response = await axios.delete(`${BASE_URL}/api/businessType/${Business_Type}`);
        return response.data;
    }
);

// Create the slice
const businessTypeSlice = createSlice({
    name: 'businessType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusinessTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
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
                state.error = null;
            })
            .addCase(createBusinessType.fulfilled, (state, action) => {
                state.loading = false;

                console.log('Before push, businessTypes:', state.businessTypes);

                if (action.payload.success) {
                    if (!Array.isArray(state.businessTypes)) {
                        console.warn('Resetting businessTypes to an empty array');
                        state.businessTypes = [];
                    }
                    state.businessTypes.push({ Business_Type: action.payload.message });
                    //console.log('After push, businessTypes:', state.businessTypes);
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(createBusinessType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create Business Type';
            })
            // .addCase(fetchBusinessTypeById.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(fetchBusinessTypeById.fulfilled, (state) => {
            //     state.loading = false;
            //     // Handle the fetched single Business Type as needed
            //     state.error = null;
            // })
            // .addCase(fetchBusinessTypeById.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message || 'Failed to fetch Business Type';
            // })
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
                state.error = null;
            })
            .addCase(deleteBusinessType.fulfilled, (state, action) => {
                console.log('Current electoralAreas before delete:', state.businessTypes);
                if (!Array.isArray(state.businessTypes)) {
                    console.warn('businessTypes is not an array, resetting to empty array');
                    state.businessTypes = [];
                }
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