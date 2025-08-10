// src/features/propertyRate/propertyRateSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';

// In propertyRateSlice.ts or propertyRateSlice.tsx
// interface UpdatePropertyRatePayload {
//     propertyClass: string;
//     fiscalyear: number;
//     propertyRateData: PropertyRateData;
//   }
  
//   interface DeletePropertyRatePayload {
//     propertyClass: string;
//     fiscalyear: number;
//   }

// Define the type for PropertyRate data
export interface PropertyRateData {
    property_class: string;
    fiscalyear: number;
    rate: number;
    registrationrate: number;
}

// Define the initial state for the slice
export interface PropertyRateState {
    rates: PropertyRateData[];
    loading: boolean;
    error: string | null;
}

export const initialState: PropertyRateState = {
    rates: [],
    loading: false,
    error: null,
};


const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper function to get the token from local storage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Async thunk to fetch all property rates
export const fetchPropertyRates = createAsyncThunk('propertyRate/fetchPropertyRates', async () => {
    const response = await axios.get(`${BASE_URL}/api/propertyRate`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
    return response.data;
});

// Async thunk to fetch a single property rate by property_Class and fiscalyear
export const fetchPropertyRateByPropertyClassAndFiscalyear = createAsyncThunk('propertyRate/fetchPropertyRateByPropertyClassAndFiscalyear', 
    async ({ property_Class, fiscalyear }: { property_Class: string; fiscalyear: number }) => {
        console.log(`fetchPropertyRateByPropertyClassAndFiscalyear: ${property_Class}, fiscalyear: ${fiscalyear}`);

        const response = await axios.get(`${BASE_URL}/api/propertyRate/${property_Class}/${fiscalyear}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    }
);

// Async thunk to create a new property rate
export const createPropertyRate = createAsyncThunk('propertyRate/createPropertyRate', 
    async (propertyRateData: PropertyRateData) => {
        console.log('createPropertyRate action called with ', propertyRateData);

        const response = await axios.post(`${BASE_URL}/api/propertyRate/create`, propertyRateData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        console.log(`after axios.post, response.data: ${JSON.stringify(response.data)}`);
        return response.data;
    }
);

// Async thunk to update a property rate
export const updatePropertyRate = createAsyncThunk('propertyRate/updatePropertyRate', 
    async ({ property_Class, fiscalyear, propertyRateData }: 
            { property_Class: string; fiscalyear: number; propertyRateData: PropertyRateData }) => {
        
        const response = await axios.put(`${BASE_URL}/api/propertyRate/update/${property_Class}/${fiscalyear}`, propertyRateData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    }
);

// Async thunk to delete a property rate
export const deletePropertyRate = createAsyncThunk('propertyRate/deletePropertyRate', 
    async ({ property_Class, fiscalyear }: { property_Class: string; fiscalyear: number }) => {
        const response = await axios.delete(`${BASE_URL}/api/propertyRate/${property_Class}/${fiscalyear}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        return response.data;
    }
);

// Create the slice
const propertyRateSlice = createSlice({
    name: 'propertyRate',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<PropertyRateState>) => {
        builder
            .addCase(fetchPropertyRates.pending, (state: PropertyRateState) => {
                state.loading = true;
            })
            .addCase(fetchPropertyRates.fulfilled, (state: PropertyRateState, action: PayloadAction<PropertyRateData[]>) => {  
                state.loading = false;
                state.rates = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyRates.rejected, (state: PropertyRateState, action: PayloadAction<unknown, string, unknown, SerializedError> ) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property rates';
            })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.fulfilled, (state: PropertyRateState, action: PayloadAction<PropertyRateData>) => {
                state.loading = false;
                state.rates = [action.payload]; // Add the new property rate
                state.error = null;
            })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.rejected, (state: PropertyRateState, action: PayloadAction<unknown, string, unknown, SerializedError> ) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property rate';
            })
            .addCase(createPropertyRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyRate.fulfilled, (state: PropertyRateState, action: PayloadAction<PropertyRateData>) => {
                state.loading = false;
                state.rates.push(action.payload); // Add the new property rate
                state.error = null;
            })
            .addCase(createPropertyRate.rejected, (state: PropertyRateState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property rate';
            })
            .addCase(updatePropertyRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyRate.fulfilled, (state: PropertyRateState, action) => {
                state.loading = false;
                const index = state.rates.findIndex(rate => rate.property_class === action.payload.property_class && rate.fiscalyear === action.payload.fiscalyear);
                if (index !== -1) {
                    state.rates[index] = action.payload; // Update the property rate
                }
                state.error = null;
            })
            .addCase(updatePropertyRate.rejected, (state: PropertyRateState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property rate';
            })
            .addCase(deletePropertyRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyRate.fulfilled, (state: PropertyRateState, action) => {
                state.loading = false;
                state.rates = state.rates.filter(rate => !(rate.property_class === action.meta.arg.property_Class && rate.fiscalyear === action.meta.arg.fiscalyear));
                state.error = null;
            })
            .addCase(deletePropertyRate.rejected, (state: PropertyRateState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property rate';
            });
    },
});

// Export the reducer
export default propertyRateSlice.reducer;