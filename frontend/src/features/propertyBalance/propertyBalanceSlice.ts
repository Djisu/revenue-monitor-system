// src/features/propertyBalance/propertyBalanceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyBalance data
export interface PropertyBalanceData {
    house_no: string;
    billamount: number;
    paidamount: number;
    balance: number;
}

// Define the initial state for the slice
export interface PropertyBalanceState {
    propertyBalances: PropertyBalanceData[];
    loading: boolean;
    error: string | null;
}

export const initialState: PropertyBalanceState = {
    propertyBalances: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all property balances
export const fetchPropertyBalances = createAsyncThunk('propertyBalance/fetchPropertyBalances', async () => {
    const response = await axios.get('/api/propertyBalance');
    return response.data;
});

// Async thunk to fetch a single property balance by house_no
export const fetchPropertyBalanceById = createAsyncThunk('propertyBalance/fetchPropertyBalanceById', async (house_no: string) => {
    const response = await axios.get(`/api/propertyBalance/${house_no}`);
    return response.data;
});

// Async thunk to create a new property balance
export const createPropertyBalance = createAsyncThunk('propertyBalance/createPropertyBalance', async (propertyBalanceData: PropertyBalanceData) => {
    const response = await axios.post('/api/propertyBalance', propertyBalanceData);
    return response.data;
});

// Async thunk to update a property balance
export const updatePropertyBalance = createAsyncThunk('propertyBalance/updatePropertyBalance', async ({ house_no, propertyBalanceData }: { house_no: string; propertyBalanceData: PropertyBalanceData }) => {
    const response = await axios.put(`/api/propertyBalance/${house_no}`, propertyBalanceData);
    return response.data;
});

// Async thunk to delete a property balance
export const deletePropertyBalance = createAsyncThunk('propertyBalance/deletePropertyBalance', async (house_no: string) => {
    const response = await axios.delete(`/api/propertyBalance/${house_no}`);
    return response.data;
});

// Create the slice
const propertyBalanceSlice = createSlice({
    name: 'propertyBalance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyBalances.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyBalances.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyBalances = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyBalances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property balances';
            })
            .addCase(fetchPropertyBalanceById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyBalanceById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched property balance data if needed
                state.error = null;
            })
            .addCase(fetchPropertyBalanceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property balance';
            })
            .addCase(createPropertyBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPropertyBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyBalances.push(action.payload); // Add the new property balance
                state.error = null;
            })
            .addCase(createPropertyBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create property balance';
            })
            .addCase(updatePropertyBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePropertyBalance.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.propertyBalances.findIndex(balance => balance.house_no === action.payload.house_no);
                if (index !== -1) {
                    state.propertyBalances[index] = action.payload; // Update the property balance
                }
                state.error = null;
            })
            .addCase(updatePropertyBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property balance';
            })
            .addCase(deletePropertyBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePropertyBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyBalances = state.propertyBalances.filter(balance => balance.house_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deletePropertyBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property balance';
            });
    },
});

// Export the reducer
export default propertyBalanceSlice.reducer;