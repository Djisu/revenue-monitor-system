// src/features/transSavings/transSavingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder, SerializedError } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Transaction Savings data
export interface TransSavingsData {
    buss_no: string;
    transdate: string; // Adjust based on your date format
    details: string;
    debit: number;
    credit: number;
    balance: number;
    userid: string;
    yearx: number;
    term: string;
}

// Define the initial state for the slice
export interface TransSavingsState {
    transactions: TransSavingsData[];
    loading: boolean;
    error: string | null;
}

export const initialState: TransSavingsState = {
    transactions: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all transaction savings
export const fetchTransSavings = createAsyncThunk('transSavings/fetchTransSavings', async () => {
    const response = await axios.get('/api/transSavings');
    return response.data;
});

// Async thunk to fetch a single transaction savings by buss_no and transdate
export const fetchTransSavingsById = createAsyncThunk('transSavings/fetchTransSavingsById', async ({ buss_no, transdate }: { buss_no: string; transdate: string }) => {
    const response = await axios.get(`/api/transSavings/${buss_no}/${transdate}`);
    return response.data;
});

// Async thunk to create a new transaction savings
export const createTransSavings = createAsyncThunk('transSavings/createTransSavings', async (transSavingsData: TransSavingsData) => {
    const response = await axios.post('/api/transSavings', transSavingsData);
    return response.data;
});

// Async thunk to update a transaction savings
export const updateTransSavings = createAsyncThunk('transSavings/updateTransSavings', async ({ buss_no, transdate, transSavingsData }: { buss_no: string; transdate: string; transSavingsData: TransSavingsData }) => {
    const response = await axios.put(`/api/transSavings/${buss_no}/${transdate}`, transSavingsData);
    return response.data;
});

// Async thunk to delete a transaction savings
export const deleteTransSavings = createAsyncThunk('transSavings/deleteTransSavings', async ({ buss_no, transdate }: { buss_no: string; transdate: string }) => {
    const response = await axios.delete(`/api/transSavings/${buss_no}/${transdate}`);
    return response.data;
});

// Create the slice
const transSavingsSlice = createSlice({
    name: 'transSavings',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<TransSavingsState>) => {
        builder
            .addCase(fetchTransSavings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransSavings.fulfilled, (state: TransSavingsState, action: PayloadAction<TransSavingsData[]>) => {
                state.loading = false;
                state.transactions = action.payload;
                state.error = null;
            })
            .addCase(fetchTransSavings.rejected, (state: TransSavingsState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch transaction savings';
            })
            .addCase(fetchTransSavingsById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransSavingsById.fulfilled, (state) => {
                state.loading = false;
                // Optionally handle the fetched transaction savings data
                state.error = null;
            })
            .addCase(fetchTransSavingsById.rejected, (state: TransSavingsState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch transaction savings';
            })
            .addCase(createTransSavings.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTransSavings.fulfilled, (state: TransSavingsState, action: PayloadAction<TransSavingsData[]>) => {
                state.loading = false;
                state.transactions = action.payload; // Add the new transaction savings
                state.error = null;
            })
            .addCase(createTransSavings.rejected, (state: TransSavingsState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create transaction savings';
            })
            .addCase(updateTransSavings.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTransSavings.fulfilled, (state: TransSavingsState, action: PayloadAction<TransSavingsData>) => {
                state.loading = false;
                const index = state.transactions.findIndex(transaction => transaction.buss_no === action.payload.buss_no && transaction.transdate === action.payload.transdate);
                if (index !== -1) {
                    state.transactions[index] = action.payload; // Update the transaction savings
                }
                state.error = null;
            })
            .addCase(updateTransSavings.rejected, (state: TransSavingsState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update transaction savings';
            })
            .addCase(deleteTransSavings.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTransSavings.fulfilled, (state: TransSavingsState, action: PayloadAction<TransSavingsData>) => {
                state.loading = false;
                state.transactions = state.transactions.filter(transaction => !(transaction.buss_no === action.payload.buss_no && transaction.transdate === action.payload.transdate));
                state.error = null;
            })
            .addCase(deleteTransSavings.rejected, (state: TransSavingsState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete transaction savings';
            });
    },
});

// Export the reducer
export default transSavingsSlice.reducer;
