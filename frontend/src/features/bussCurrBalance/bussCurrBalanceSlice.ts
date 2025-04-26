// src/features/bussCurrBalance/bussCurrBalanceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for BussCurrBalance data
export interface BussCurrBalanceData {
    buss_no: string;
    fiscalyear: string;
    balancebf: number;
    current_balance: number;
    totalAmountDue: number;
    transdate: string;
    electoralarea: string;
}

// Define the initial state for the slice
export interface BussCurrBalanceState {
    bussCurrBalances: BussCurrBalanceData[];
    loading: boolean;
    error: string | null;
}

export const initialState: BussCurrBalanceState = {
    bussCurrBalances: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all BussCurrBalance records
export const fetchBussCurrBalances = createAsyncThunk('bussCurrBalance/fetchBussCurrBalances', async () => {
    const response = await axios.get('/api/bussCurrBalance');
    return response.data;
});

// Async thunk to create a new BussCurrBalance record
export const createBussCurrBalance = createAsyncThunk('bussCurrBalance/createBussCurrBalance', async (data: BussCurrBalanceData) => {
    const response = await axios.post('/api/bussCurrBalance', data);
    return response.data;
});

// Async thunk to fetch a single BussCurrBalance record by buss_no and fiscalyear
export const fetchBussCurrBalanceById = createAsyncThunk('bussCurrBalance/fetchBussCurrBalanceById', async ({ buss_no, fiscalyear }: { buss_no: string; fiscalyear: string }) => {
    const response = await axios.get(`/api/bussCurrBalance/${buss_no}/${fiscalyear}`);
    return response.data;
});

// Async thunk to update a BussCurrBalance record
export const updateBussCurrBalance = createAsyncThunk(
    'bussCurrBalance/updateBussCurrBalance',
    async ({ buss_no, fiscalyear, data }: { buss_no: string; fiscalyear: string; data: BussCurrBalanceData }) => {
        const response = await axios.put(`/api/bussCurrBalance/${buss_no}/${fiscalyear}`, data);
        return response.data;
    }
);

// Async thunk to delete a BussCurrBalance record
export const deleteBussCurrBalance = createAsyncThunk('bussCurrBalance/deleteBussCurrBalance', async ({ buss_no, fiscalyear }: { buss_no: string; fiscalyear: string }) => {
    const response = await axios.delete(`/api/bussCurrBalance/${buss_no}/${fiscalyear}`);
    return response.data;
});

// Create the slice
const bussCurrBalanceSlice = createSlice({
    name: 'bussCurrBalance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBussCurrBalances.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBussCurrBalances.fulfilled, (state, action) => {
                state.loading = false;
                state.bussCurrBalances = action.payload;
                state.error = null;
            })
            .addCase(fetchBussCurrBalances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BussCurrBalance records';
            })
            .addCase(createBussCurrBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBussCurrBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.bussCurrBalances.push(action.payload); // Add the new BussCurrBalance record
                state.error = null;
            })
            .addCase(createBussCurrBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create BussCurrBalance record';
            })
            .addCase(fetchBussCurrBalanceById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBussCurrBalanceById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single BussCurrBalance record as needed
                state.error = null;
            })
            .addCase(fetchBussCurrBalanceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BussCurrBalance record';
            })
            .addCase(updateBussCurrBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBussCurrBalance.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bussCurrBalances.findIndex(balance => balance.buss_no === action.payload.buss_no && balance.fiscalyear === action.payload.fiscalyear);
                if (index !== -1) {
                    state.bussCurrBalances[index] = action.payload; // Update the existing BussCurrBalance record
                }
                state.error = null;
            })
            .addCase(updateBussCurrBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update BussCurrBalance record';
            })
            .addCase(deleteBussCurrBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBussCurrBalance.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted BussCurrBalance record from the state
                state.bussCurrBalances = state.bussCurrBalances.filter(balance => !(balance.buss_no === action.meta.arg.buss_no && balance.fiscalyear === action.meta.arg.fiscalyear));
                state.error = null;
            })
            .addCase(deleteBussCurrBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete BussCurrBalance record';
            });
    },
});

// Export the actions if needed
export const {} = bussCurrBalanceSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default bussCurrBalanceSlice.reducer;