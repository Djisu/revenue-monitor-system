// src/store/gradeFeesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the GradeFees data interface
export interface GradeFeesData {
    buss_type: string;
    grade: string;
    description: string;
    fees: number;
}

// Define the state interface
interface GradeFeesState {
    gradeFees: GradeFeesData[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: GradeFeesState = {
    gradeFees: [],
    loading: false,
    error: null,
};

// Define async thunks
export const fetchGradeFees = createAsyncThunk('gradeFees/fetchGradeFees', async () => {
    const response = await axios.get('/api/gradeFees');
    return response.data;
});

export const fetchGradeFee = createAsyncThunk('gradeFees/fetchGradeFee', async (params: { buss_type: string; grade: string }) => {
    const response = await axios.get(`/api/gradeFees/${params.buss_type}/${params.grade}`);
    return response.data;
});

export const createGradeFee = createAsyncThunk('gradeFees/createGradeFee', async (gradeFeesData: GradeFeesData) => {
    const response = await axios.post('/api/gradeFees', gradeFeesData);
    return response.data;
});

export const updateGradeFee = createAsyncThunk('gradeFees/updateGradeFee', async (params: { buss_type: string; grade: string; data: GradeFeesData }) => {
    await axios.put(`/api/gradeFees/${params.buss_type}/${params.grade}`, params.data);
    return { buss_type: params.buss_type, grade: params.grade, data: params.data };
});

export const deleteGradeFee = createAsyncThunk('gradeFees/deleteGradeFee', async (params: { buss_type: string; grade: string }) => {
    await axios.delete(`/api/gradeFees/${params.buss_type}/${params.grade}`);
    return { buss_type: params.buss_type, grade: params.grade };
});

// Create the slice
const gradeFeesSlice = createSlice({
    name: 'gradeFees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGradeFees.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGradeFees.fulfilled, (state, action) => {
                state.loading = false;
                state.gradeFees = action.payload;
                state.error = null;
            })
            .addCase(fetchGradeFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch grade fees';
            })
            .addCase(fetchGradeFee.fulfilled, (state, action) => {
                const index = state.gradeFees.findIndex(
                    (fee) => fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade
                );
                if (index !== -1) {
                    state.gradeFees[index] = action.payload;
                }
            })
            .addCase(createGradeFee.fulfilled, (state, action) => {
                state.gradeFees.push(action.payload);
            })
            .addCase(updateGradeFee.fulfilled, (state, action) => {
                const index = state.gradeFees.findIndex(
                    (fee) => fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade
                );
                if (index !== -1) {
                    state.gradeFees[index] = action.payload.data;
                }
            })
            .addCase(deleteGradeFee.fulfilled, (state, action) => {
                state.gradeFees = state.gradeFees.filter(
                    (fee) => !(fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade)
                );
            });
    },
});

// Export the async actions
export const { } = gradeFeesSlice.actions;

// Export the reducer
export default gradeFeesSlice.reducer;