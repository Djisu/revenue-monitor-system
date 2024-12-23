// src/features/officer/officerSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Officer data
interface OfficerData {
    officer_no: string;
    officer_name: string;
    photo: string; // Assuming photo is a URL or base64 string
}

// Define the initial state for the slice
interface OfficerState {
    officers: OfficerData[];
    loading: boolean;
    error: string | null;
}

const initialState: OfficerState = {
    officers: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all officers
export const fetchOfficers = createAsyncThunk('officer/fetchOfficers', async () => {
    const response = await axios.get('/api/officer');
    return response.data;
});

// Async thunk to fetch a single officer by officer_no
export const fetchOfficerById = createAsyncThunk('officer/fetchOfficerById', async (officer_no: string) => {
    const response = await axios.get(`/api/officer/${officer_no}`);
    return response.data;
});

// Async thunk to create a new officer
export const createOfficer = createAsyncThunk('officer/createOfficer', async (officerData: OfficerData) => {
    const response = await axios.post('/api/officer', officerData);
    return response.data;
});

// Async thunk to update an officer
export const updateOfficer = createAsyncThunk('officer/updateOfficer', async ({ officer_no, officerData }: { officer_no: string; officerData: OfficerData }) => {
    const response = await axios.put(`/api/officer/${officer_no}`, officerData);
    return response.data;
});

// Async thunk to delete an officer
export const deleteOfficer = createAsyncThunk('officer/deleteOfficer', async (officer_no: string) => {
    const response = await axios.delete(`/api/officer/${officer_no}`);
    return response.data;
});

// Create the slice
const officerSlice = createSlice({
    name: 'officer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfficers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOfficers.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = action.payload;
                state.error = null;
            })
            .addCase(fetchOfficers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch officers';
            })
            .addCase(fetchOfficerById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOfficerById.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched officer data as needed
                state.error = null;
            })
            .addCase(fetchOfficerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch officer';
            })
            .addCase(createOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOfficer.fulfilled, (state, action) => {
                state.loading = false;
                state.officers.push(action.payload); // Add the new officer
                state.error = null;
            })
            .addCase(createOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create officer';
            })
            .addCase(updateOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOfficer.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.officers.findIndex(officer => officer.officer_no === action.payload.officer_no);
                if (index !== -1) {
                    state.officers[index] = action.payload; // Update the officer
                }
                state.error = null;
            })
            .addCase(updateOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update officer';
            })
            .addCase(deleteOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOfficer.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = state.officers.filter(officer => officer.officer_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete officer';
            });
    },
});

// Export the actions if needed
export const {} = officerSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default officerSlice.reducer;