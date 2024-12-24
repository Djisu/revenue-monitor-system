// src/features/busPayments/busPaymentsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for BusPayments data
interface BusPaymentsData {
    buss_no: string;
    officer_no: string;
    amount: number;
    monthpaid: string;
    transdate: string;
    userid: string;
    fiscal_year: string;
    ReceiptNo: string;
}

// Define the initial state for the slice
interface BusPaymentsState {
    busPayments: BusPaymentsData[];
    loading: boolean;
    error: string | null;
}

const initialState: BusPaymentsState = {
    busPayments: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all BusPayments records
export const fetchBusPayments = createAsyncThunk('busPayments/fetchBusPayments', async () => {
    const response = await axios.get('/api/busPayments');
    return response.data;
});

// Async thunk to create a new BusPayments record
export const createBusPayment = createAsyncThunk('busPayments/createBusPayment', async (data: BusPaymentsData) => {
    const response = await axios.post('/api/busPayments', data);
    return response.data;
});

// Async thunk to fetch a single BusPayments record by buss_no
export const fetchBusPaymentById = createAsyncThunk('busPayments/fetchBusPaymentById', async (buss_no: string) => {
    const response = await axios.get(`/api/busPayments/${buss_no}`);
    return response.data;
});

// Async thunk to update a BusPayments record
export const updateBusPayment = createAsyncThunk(
    'busPayments/updateBusPayment',
    async ({ buss_no, data }: { buss_no: string; data: BusPaymentsData }) => {
        const response = await axios.put(`/api/busPayments/${buss_no}`, data);
        return response.data;
    }
);

// Async thunk to delete a BusPayments record
export const deleteBusPayment = createAsyncThunk('busPayments/deleteBusPayment', async (buss_no: string) => {
    const response = await axios.delete(`/api/busPayments/${buss_no}`);
    return response.data;
});

// Create the slice
const busPaymentsSlice = createSlice({
    name: 'busPayments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusPayments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments = action.payload;
                state.error = null;
            })
            .addCase(fetchBusPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments records';
            })
            .addCase(createBusPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBusPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments.push(action.payload); // Add the new BusPayments record
                state.error = null;
            })
            .addCase(createBusPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create BusPayments record';
            })
            .addCase(fetchBusPaymentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusPaymentById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single BusPayments record as needed
                state.error = null;
            })
            .addCase(fetchBusPaymentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments record';
            })
            .addCase(updateBusPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBusPayment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.busPayments.findIndex(busPayment => busPayment.buss_no === action.payload.buss_no);
                if (index !== -1) {
                    state.busPayments[index] = action.payload; // Update the existing BusPayments record
                }
                state.error = null;
            })
            .addCase(updateBusPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update BusPayments record';
            })
            .addCase(deleteBusPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBusPayment.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted BusPayments record from the state
                state.busPayments = state.busPayments.filter(busPayment => busPayment.buss_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteBusPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete BusPayments record';
            });
    },
});

// Export the actions if needed
export const {} = busPaymentsSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default busPaymentsSlice.reducer;