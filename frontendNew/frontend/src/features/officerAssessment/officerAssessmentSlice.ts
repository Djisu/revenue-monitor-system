// src/features/officerAssessment/officerAssessmentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for OfficerAssessment data
interface OfficerAssessmentData {
    officer_no: string;
    officer_name: string;
    Noofclientsserved: number;
    valueofbillsdistributed: number;
    bus_year: number;
    JanuaryAmount: number;
    FebruaryAmount: number;
    MarchAmount: number;
    AprilAmount: number;
    MayAmount: number;
    JuneAmount: number;
    JulyAmount: number;
    AugustAmount: number;
    SeptemberAmount: number;
    OctoberAmount: number;
    NovemberAmount: number;
    DecemberAmount: number;
    totalReceiptTodate: number;
    balance: number;
    remarks: string;
}

// Define the initial state for the slice
interface OfficerAssessmentState {
    assessments: OfficerAssessmentData[];
    loading: boolean;
    error: string | null;
}

const initialState: OfficerAssessmentState = {
    assessments: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all OfficerAssessment records
export const fetchOfficerAssessments = createAsyncThunk('officerAssessment/fetchOfficerAssessments', async () => {
    const response = await axios.get('/api/officerAssessment');
    return response.data;
});

// Async thunk to create a new OfficerAssessment record
export const createOfficerAssessment = createAsyncThunk('officerAssessment/createOfficerAssessment', async (data: OfficerAssessmentData) => {
    const response = await axios.post('/api/officerAssessment', data);
    return response.data;
});

// Async thunk to fetch a single OfficerAssessment record by officer_no and bus_year
export const fetchOfficerAssessmentById = createAsyncThunk('officerAssessment/fetchOfficerAssessmentById', async ({ officer_no, bus_year }: { officer_no: string; bus_year: number }) => {
    const response = await axios.get(`/api/officerAssessment/${officer_no}/${bus_year}`);
    return response.data;
});

// Async thunk to update an OfficerAssessment record
export const updateOfficerAssessment = createAsyncThunk(
    'officerAssessment/updateOfficerAssessment',
    async ({ officer_no, bus_year, data }: { officer_no: string; bus_year: number; data: OfficerAssessmentData }) => {
        const response = await axios.put(`/api/officerAssessment/${officer_no}/${bus_year}`, data);
        return response.data;
    }
);

// Async thunk to delete an OfficerAssessment record
export const deleteOfficerAssessment = createAsyncThunk('officerAssessment/deleteOfficerAssessment', async ({ officer_no, bus_year }: { officer_no: string; bus_year: number }) => {
    const response = await axios.delete(`/api/officerAssessment/${officer_no}/${bus_year}`);
    return response.data;
});

// Create the slice
const officerAssessmentSlice = createSlice({
    name: 'officerAssessment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfficerAssessments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOfficerAssessments.fulfilled, (state, action) => {
                state.loading = false;
                state.assessments = action.payload;
                state.error = null;
            })
            .addCase(fetchOfficerAssessments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch OfficerAssessment records';
            })
            .addCase(createOfficerAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOfficerAssessment.fulfilled, (state, action) => {
                state.loading = false;
                state.assessments.push(action.payload); // Add the new OfficerAssessment record
                state.error = null;
            })
            .addCase(createOfficerAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create OfficerAssessment record';
            })
            .addCase(fetchOfficerAssessmentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOfficerAssessmentById.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched single OfficerAssessment record as needed
                state.error = null;
            })
            .addCase(fetchOfficerAssessmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch OfficerAssessment record';
            })
            .addCase(updateOfficerAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOfficerAssessment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.assessments.findIndex(assessment => assessment.officer_no === action.payload.officer_no && assessment.bus_year === action.payload.bus_year);
                if (index !== -1) {
                    state.assessments[index] = action.payload; // Update the existing OfficerAssessment record
                }
                state.error = null;
            })
            .addCase(updateOfficerAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update OfficerAssessment record';
            })
            .addCase(deleteOfficerAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOfficerAssessment.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted OfficerAssessment record from the state
                state.assessments = state.assessments.filter(assessment => !(assessment.officer_no === action.meta.arg.officer_no && assessment.bus_year === action.meta.arg.bus_year));
                state.error = null;
            })
            .addCase(deleteOfficerAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete OfficerAssessment record';
            });
    },
});

// Export the actions if needed
export const {} = officerAssessmentSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default officerAssessmentSlice.reducer;