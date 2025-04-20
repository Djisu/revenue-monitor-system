// src/features/busMobi/busMobiSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for BusMobi data
interface BusMobiData {
    buss_no: string;
    fiscal_year: string;
    dateofbilling: string;
    buss_type: string;
    balancebf: number;
    currentPayable: number;
    totalAmount: number;
    firstD: string;
    secondE: string;
    outstanding: number;
    firstPaymentDate: string;
    secondPaymentDate: string;
    firstreceiptno: string;
    secondreceiptno: string;
    remarks: string;
    officer_no: string;
}

// Define the initial state for the slice
interface BusMobiState {
    busMobis: BusMobiData[];
    loading: boolean;
    error: string | null;
}

const initialState: BusMobiState = {
    busMobis: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all BusMobi records
export const fetchBusMobis = createAsyncThunk('busMobi/fetchBusMobis', async () => {
    const response = await axios.get('/api/busMobi');
    return response.data;
});

// Async thunk to create a new BusMobi record
export const createBusMobi = createAsyncThunk('busMobi/createBusMobi', async (data: BusMobiData) => {
    const response = await axios.post('/api/busMobi', data);
    return response.data;
});

// Async thunk to fetch a single BusMobi record by buss_no
export const fetchBusMobiById = createAsyncThunk('busMobi/fetchBusMobiById', async (buss_no: string) => {
    const response = await axios.get(`/api/busMobi/${buss_no}`);
    return response.data;
});

// Async thunk to update a BusMobi record
export const updateBusMobi = createAsyncThunk(
    'busMobi/updateBusMobi',
    async ({ buss_no, data }: { buss_no: string; data: BusMobiData }) => {
        const response = await axios.put(`/api/busMobi/${buss_no}`, data);
        return response.data;
    }
);

// Async thunk to delete a BusMobi record
export const deleteBusMobi = createAsyncThunk('busMobi/deleteBusMobi', async (buss_no: string) => {
    const response = await axios.delete(`/api/busMobi/${buss_no}`);
    return response.data;
});

// Create the slice
const busMobiSlice = createSlice({
    name: 'busMobi',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusMobis.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusMobis.fulfilled, (state, action) => {
                state.loading = false;
                state.busMobis = action.payload;
                state.error = null;
            })
            .addCase(fetchBusMobis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusMobi records';
            })
            .addCase(createBusMobi.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBusMobi.fulfilled, (state, action) => {
                state.loading = false;
                state.busMobis.push(action.payload); // Add the new BusMobi record
                state.error = null;
            })
            .addCase(createBusMobi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create BusMobi record';
            })
            .addCase(fetchBusMobiById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusMobiById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single BusMobi as needed
                state.error = null;
            })
            .addCase(fetchBusMobiById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusMobi record';
            })
            .addCase(updateBusMobi.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBusMobi.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.busMobis.findIndex(busMobi => busMobi.buss_no === action.payload.buss_no);
                if (index !== -1) {
                    state.busMobis[index] = action.payload; // Update the existing BusMobi record
                }
                state.error = null;
            })
            .addCase(updateBusMobi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update BusMobi record';
            })
            .addCase(deleteBusMobi.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBusMobi.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted BusMobi record from the state
                state.busMobis = state.busMobis.filter(busMobi => busMobi.buss_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteBusMobi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete BusMobi record';
            });
    },
});

// Export the actions if needed
export const {} = busMobiSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default busMobiSlice.reducer;