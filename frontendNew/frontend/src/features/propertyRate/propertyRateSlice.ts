// src/features/propertyRate/propertyRateSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyRate data
interface PropertyRateData {
    property_class: string;
    fiscalyear: number;
    rate: number;
    registrationrate: number;
}

// Define the initial state for the slice
interface PropertyRateState {
    rates: PropertyRateData[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertyRateState = {
    rates: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property rates
export const fetchPropertyRates = createAsyncThunk('propertyRate/fetchPropertyRates', async () => {
    const response = await axios.get('/api/propertyRate');
    return response.data;
});

// Async thunk to fetch a single property rate by property_Class and fiscalyear
export const fetchPropertyRateByPropertyClassAndFiscalyear = createAsyncThunk('propertyRate/fetchPropertyRateByPropertyClassAndFiscalyear', 
      async ({ property_Class, fiscalyear }: { property_Class: string; fiscalyear: number }) => {
      console.log(`fetchPropertyRateByPropertyClassAndFiscalyear: ${property_Class}, fiscalyear: ${fiscalyear}`);

      const response = await axios.get(`/api/propertyRate/${property_Class}/${fiscalyear}`);
      return response.data;
});

// Async thunk to create a new property rate
export const createPropertyRate = createAsyncThunk('propertyRate/createPropertyRate', 
   async (propertyRateData: PropertyRateData) => {

    console.log('createPropertyRate action called with ', propertyRateData);

    const response = await axios.post('/api/propertyRate/create', propertyRateData);

    console.log(`after axios.post, response.data: ${JSON.stringify(response.data)}`);
    return response.data;
});

// Async thunk to update a property rate
export const updatePropertyRate = createAsyncThunk('propertyRate/updatePropertyRate', 
    async ({ property_Class, fiscalyear, propertyRateData }: 
                { property_Class: string; fiscalyear: number; propertyRateData: PropertyRateData }) => {
    
    const response = await axios.put(`/api/propertyRate/update${property_Class}/${fiscalyear}`, propertyRateData);
    return response.data;
});

// Async thunk to delete a property rate
export const deletePropertyRate = createAsyncThunk('propertyRate/deletePropertyRate', 
    async ({ property_Class, fiscalyear }: { property_Class: string; fiscalyear: number }) => {

    const response = await axios.delete(`/api/propertyRate/${property_Class}/${fiscalyear}`);

    return response.data;
});

// Create the slice
const propertyRateSlice = createSlice({
    name: 'propertyRate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyRates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyRates.fulfilled, (state, action) => {
                state.loading = false;
                state.rates = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyRates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property rates';
            })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.fulfilled, (state, action) => {
                state.loading = false;
                state.rates = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyRateByPropertyClassAndFiscalyear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property rate';
            })
            .addCase(createPropertyRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyRate.fulfilled, (state, action) => {
                state.loading = false;
                state.rates.push(action.payload); // Add the new property rate
                state.error = null;
            })
            .addCase(createPropertyRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property rate';
            })
            .addCase(updatePropertyRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyRate.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.rates.findIndex(rate => rate.property_class === action.payload.property_class && rate.fiscalyear === action.payload.fiscalyear);
                if (index !== -1) {
                    state.rates[index] = action.payload; // Update the property rate
                }
                state.error = null;
            })
            .addCase(updatePropertyRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property rate';
            })
            .addCase(deletePropertyRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyRate.fulfilled, (state, action) => {
                state.loading = false;
                state.rates = state.rates.filter(rate => !(rate.property_class === action.meta.arg.property_Class && rate.fiscalyear === action.meta.arg.fiscalyear));
                state.error = null;
            })
            .addCase(deletePropertyRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property rate';
            });
    },
});

// Export the reducer
export default propertyRateSlice.reducer;