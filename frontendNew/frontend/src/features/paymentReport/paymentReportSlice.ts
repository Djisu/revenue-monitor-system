// src/features/paymentReport/paymentReportSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PaymentReport data
interface PaymentReportData {
    transdate: string; // Adjust the type based on your actual date format
    buss_name: string;
    amount: number;
    receiptno: string;
    fiscalyear: number;
    officer_no: string;
    buss_no: string;
}

// Define the initial state for the slice
interface PaymentReportState {
    paymentReports: PaymentReportData[];
    loading: boolean;
    error: string | null;
}

const initialState: PaymentReportState = {
    paymentReports: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all payment reports
export const fetchPaymentReports = createAsyncThunk('paymentReport/fetchPaymentReports', async () => {
    const response = await axios.get('/api/paymentReport');
    return response.data;
});

// Async thunk to fetch a single payment report by buss_no and fiscalyear
export const fetchPaymentReportById = createAsyncThunk('paymentReport/fetchPaymentReportById', async ({ buss_no, fiscalyear }: { buss_no: string; fiscalyear: number }) => {
    const response = await axios.get(`/api/paymentReport/${buss_no}/${fiscalyear}`);
    return response.data;
});

// Async thunk to create a new payment report
export const createPaymentReport = createAsyncThunk('paymentReport/createPaymentReport', async (paymentReportData: PaymentReportData) => {
    const response = await axios.post('/api/paymentReport', paymentReportData);
    return response.data;
});

// Async thunk to update a payment report
export const updatePaymentReport = createAsyncThunk('paymentReport/updatePaymentReport', async ({ buss_no, fiscalyear, paymentReportData }: { buss_no: string; fiscalyear: number; paymentReportData: PaymentReportData }) => {
    const response = await axios.put(`/api/paymentReport/${buss_no}/${fiscalyear}`, paymentReportData);
    return response.data;
});

// Async thunk to delete a payment report
export const deletePaymentReport = createAsyncThunk('paymentReport/deletePaymentReport', async ({ buss_no, fiscalyear }: { buss_no: string; fiscalyear: number }) => {
    const response = await axios.delete(`/api/paymentReport/${buss_no}/${fiscalyear}`);
    return response.data;
});

// Create the slice
const paymentReportSlice = createSlice({
    name: 'paymentReport',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPaymentReports.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentReports = action.payload;
                state.error = null;
            })
            .addCase(fetchPaymentReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch payment reports';
            })
            .addCase(fetchPaymentReportById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPaymentReportById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched payment report data if needed
                state.error = null;
            })
            .addCase(fetchPaymentReportById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch payment report';
            })
            .addCase(createPaymentReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentReport.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentReports.push(action.payload); // Add the new payment report
                state.error = null;
            })
            .addCase(createPaymentReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create payment report';
            })
            .addCase(updatePaymentReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePaymentReport.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.paymentReports.findIndex(report => report.buss_no === action.payload.buss_no && report.fiscalyear === action.payload.fiscalyear);
                if (index !== -1) {
                    state.paymentReports[index] = action.payload; // Update the payment report
                }
                state.error = null;
            })
            .addCase(updatePaymentReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update payment report';
            })
            .addCase(deletePaymentReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePaymentReport.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentReports = state.paymentReports.filter(report => !(report.buss_no === action.meta.arg.buss_no && report.fiscalyear === action.meta.arg.fiscalyear));
                state.error = null;
            })
            .addCase(deletePaymentReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete payment report';
            });
    },
});

// Export the actions if needed
export const {} = paymentReportSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default paymentReportSlice.reducer;