// src/features/budgetAssess/budgetAssessSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for BudgetAssess data
interface BudgetAssessData {
    month: string;
    budget: number;
    amount: number;
    variance: number;
    fiscalyear: string;
    assessmentby: string;
}

// Define the initial state for the slice
interface BudgetAssessState {
    budgetAssessRecords: BudgetAssessData[];
    loading: boolean;
    error: string | null;
}

const initialState: BudgetAssessState = {
    budgetAssessRecords: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all BudgetAssess records
export const fetchBudgetAssessRecords = createAsyncThunk('budgetAssess/fetchRecords', async () => {
    const response = await axios.get('/api/budgetAssess');
    return response.data;
});

// Async thunk to create a new BudgetAssess record
export const createBudgetAssessRecord = createAsyncThunk('budgetAssess/createRecord', async (data: BudgetAssessData) => {
    const response = await axios.post('/api/budgetAssess', data);
    return response.data;
});

// Async thunk to fetch a single BudgetAssess record by month and fiscal year
export const fetchBudgetAssessRecordById = createAsyncThunk(
    'budgetAssess/fetchRecordById',
    async ({ month, fiscalyear }: { month: string; fiscalyear: string }) => {
        const response = await axios.get(`/api/budgetAssess/${month}/${fiscalyear}`);
        return response.data;
    }
);

// Async thunk to update a BudgetAssess record
export const updateBudgetAssessRecord = createAsyncThunk(
    'budgetAssess/updateRecord',
    async ({ month, fiscalyear, data }: { month: string; fiscalyear: string; data: BudgetAssessData }) => {
        const response = await axios.put(`/api/budgetAssess/${month}/${fiscalyear}`, data);
        return response.data;
    }
);

// Async thunk to delete a BudgetAssess record
export const deleteBudgetAssessRecord = createAsyncThunk(
    'budgetAssess/deleteRecord',
    async ({ month, fiscalyear }: { month: string; fiscalyear: string }) => {
        const response = await axios.delete(`/api/budgetAssess/${month}/${fiscalyear}`);
        return response.data;
    }
);

// Create the slice
const budgetAssessSlice = createSlice({
    name: 'budgetAssess',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudgetAssessRecords.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgetAssessRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.budgetAssessRecords = action.payload;
                state.error = null;
            })
            .addCase(fetchBudgetAssessRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch budget assessments';
            })
            .addCase(createBudgetAssessRecord.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBudgetAssessRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.budgetAssessRecords.push(action.payload); // Add the new record
                state.error = null;
            })
            .addCase(createBudgetAssessRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create budget assessment';
            })
            .addCase(fetchBudgetAssessRecordById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgetAssessRecordById.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched single record as needed
                state.error = null;
            })
            .addCase(fetchBudgetAssessRecordById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch budget assessment';
            })
            .addCase(updateBudgetAssessRecord.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBudgetAssessRecord.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.budgetAssessRecords.findIndex(record => 
                    record.month === action.payload.month && record.fiscalyear === action.payload.fiscalyear
                );
                if (index !== -1) {
                    state.budgetAssessRecords[index] = action.payload; // Update the existing record
                }
                state.error = null;
            })
            .addCase(updateBudgetAssessRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update budget assessment';
            })
            .addCase(deleteBudgetAssessRecord.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBudgetAssessRecord.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted record from the state
                state.budgetAssessRecords = state.budgetAssessRecords.filter(record => 
                    !(record.month === action.meta.arg.month && record.fiscalyear === action.meta.arg.fiscalyear)
                );
                state.error = null;
            })
            .addCase(deleteBudgetAssessRecord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete budget assessment';
            });
    },
});

// Export the actions if needed
export const {} = budgetAssessSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default budgetAssessSlice.reducer;