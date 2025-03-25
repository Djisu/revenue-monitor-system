import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the interface for the bus type summary report
export interface BusTypeSummaryReport {
    buss_type: string;
    amountdue: number;
    amountpaid: number;
    balance: number;
    electoral_area: string;
}

// Define the initial state type
interface ReportsState {
    reports: BusTypeSummaryReport[];
    loading: boolean;
    error: string | null;
}

// Define the initial state
const initialState: ReportsState = {
    reports: [],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL ||
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Create async thunk for fetching reports
export const fetchBusTypeSummaryReports = createAsyncThunk(
    'reports/fetchBusTypeSummaryReports',
    async ({
        firstDate,
        lastDate,
        zone = '',         // Default to empty string if not provided
        bussType = '',     // Default to empty string if not provided
    }: {
        firstDate: string;
        lastDate: string;
        zone?: string;     // Mark as optional
        bussType?: string; // Mark as optional
    }) => {
        const response = await axios.get(`/create/${firstDate}/${lastDate}/${zone || ''}/${bussType || ''}`);
        return response.data; // Assuming the response data is an array of BusTypeSummaryReport
    }
);

// Create the slice
const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusTypeSummaryReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusTypeSummaryReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload; // Update reports with the new data
                state.error = null;
            })
            .addCase(fetchBusTypeSummaryReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch reports';
            });
    },
});

// Export actions and reducer
export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;