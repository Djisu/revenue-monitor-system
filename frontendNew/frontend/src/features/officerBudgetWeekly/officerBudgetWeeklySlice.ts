// src/features/officerBudgetWeekly/officerBudgetWeeklySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for OfficerBudgetWeekly data
interface OfficerBudgetWeeklyData {
    officer_no: string;
    officer_name: string;
    fiscal_year: number;
    annual_budget: number;
    weekly_budget: number;
    January_budget_WEEK1: number;
    January_budget_WEEK2: number;
    January_budget_WEEK3: number;
    January_budget_WEEK4: number;
    January_Actual_WEEK1: number;
    January_Actual_WEEK2: number;
    January_Actual_WEEK3: number;
    January_Actual_WEEK4: number;
    February_budget_WEEK1: number;
    February_budget_WEEK2: number;
    February_budget_WEEK3: number;
    February_budget_WEEK4: number;
    February_Actual_WEEK1: number;
    February_Actual_WEEK2: number;
    February_Actual_WEEK3: number;
    February_Actual_WEEK4: number;
    March_budget_WEEK1: number;
    March_budget_WEEK2: number;
    March_budget_WEEK3: number;
    March_budget_WEEK4: number;
    March_Actual_WEEK1: number;
    March_Actual_WEEK2: number;
    March_Actual_WEEK3: number;
    March_Actual_WEEK4: number;
    April_budget_WEEK1: number;
    April_budget_WEEK2: number;
    April_budget_WEEK3: number;
    April_budget_WEEK4: number;
    April_Actual_WEEK1: number;
    April_Actual_WEEK2: number;
    April_Actual_WEEK3: number;
    April_Actual_WEEK4: number;
    May_budget_WEEK1: number;
    May_budget_WEEK2: number;
    May_budget_WEEK3: number;
    May_budget_WEEK4: number;
    May_Actual_WEEK1: number;
    May_Actual_WEEK2: number;
    May_Actual_WEEK3: number;
    May_Actual_WEEK4: number;
    June_budget_WEEK1: number;
    June_budget_WEEK2: number;
    June_budget_WEEK3: number;
    June_budget_WEEK4: number;
    June_Actual_WEEK1: number;
    June_Actual_WEEK2: number;
    June_Actual_WEEK3: number;
    June_Actual_WEEK4: number;
    July_budget_WEEK1: number;
    July_budget_WEEK2: number;
    July_budget_WEEK3: number;
    July_budget_WEEK4: number;
    July_Actual_WEEK1: number;
    July_Actual_WEEK2: number;
    July_Actual_WEEK3: number;
    July_Actual_WEEK4: number;
    August_budget_WEEK1: number;
    August_budget_WEEK2: number;
    August_budget_WEEK3: number;
    August_budget_WEEK4: number;
    August_Actual_WEEK1: number;
    August_Actual_WEEK2: number;
    August_Actual_WEEK3: number;
    August_Actual_WEEK4: number;
    September_budget_WEEK1: number;
    September_budget_WEEK2: number;
    September_budget_WEEK3: number;
    September_budget_WEEK4: number;
    September_Actual_WEEK1: number;
    September_Actual_WEEK2: number;
    September_Actual_WEEK3: number;
    September_Actual_WEEK4: number;
    October_budget_WEEK1: number;
    October_budget_WEEK2: number;
    October_budget_WEEK3: number;
    October_budget_WEEK4: number;
    October_Actual_WEEK1: number;
    October_Actual_WEEK2: number;
    October_Actual_WEEK3: number;
    October_Actual_WEEK4: number;
    November_budget_WEEK1: number;
    November_budget_WEEK2: number;
    November_budget_WEEK3: number;
    November_budget_WEEK4: number;
    November_Actual_WEEK1: number;
    November_Actual_WEEK2: number;
    November_Actual_WEEK3: number;
    November_Actual_WEEK4: number;
    December_budget_WEEK1: number;
    December_budget_WEEK2: number;
    December_budget_WEEK3: number;
    December_budget_WEEK4: number;
    December_Actual_WEEK1: number;
    December_Actual_WEEK2: number;
    December_Actual_WEEK3: number;
    December_Actual_WEEK4: number;
    Actual_total: number;
    outstanding: number;
    electoral_area: string;
}

// Define the initial state for the slice
interface OfficerBudgetWeeklyState {
    budgets: OfficerBudgetWeeklyData[];
    loading: boolean;
    error: string | null;
}

const initialState: OfficerBudgetWeeklyState = {
    budgets: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all OfficerBudgetWeekly records
export const fetchOfficerBudgetWeeklies = createAsyncThunk('officerBudgetWeekly/fetchOfficerBudgetWeeklies', async () => {
    const response = await axios.get('/api/officerBudgetWeekly');
    return response.data;
});

// Async thunk to create a new OfficerBudgetWeekly record
export const createOfficerBudgetWeekly = createAsyncThunk('officerBudgetWeekly/createOfficerBudgetWeekly', async (data: OfficerBudgetWeeklyData) => {
    const response = await axios.post('/api/officerBudgetWeekly', data);
    return response.data;
});

// Async thunk to fetch a single OfficerBudgetWeekly record by id and fiscal year
export const fetchOfficerBudgetWeeklyById = createAsyncThunk('officerBudgetWeekly/fetchOfficerBudgetWeeklyById', async ({ id, fiscal_year }: { id: string; fiscal_year: number }) => {
    const response = await axios.get(`/api/officerBudgetWeekly/${id}/${fiscal_year}`);
    return response.data;
});

// Async thunk to update an OfficerBudgetWeekly record
export const updateOfficerBudgetWeekly = createAsyncThunk(
    'officerBudgetWeekly/updateOfficerBudgetWeekly',
    async ({ id, fiscal_year, data }: { id: string; fiscal_year: number; data: OfficerBudgetWeeklyData }) => {
        const response = await axios.put(`/api/officerBudgetWeekly/${id}/${fiscal_year}`, data);
        return response.data;
    }
);

// Async thunk to delete an OfficerBudgetWeekly record
export const deleteOfficerBudgetWeekly = createAsyncThunk('officerBudgetWeekly/deleteOfficerBudgetWeekly', async ({ id, fiscal_year }: { id: string; fiscal_year: number }) => {
    const response = await axios.delete(`/api/officerBudgetWeekly/${id}/${fiscal_year}`);
    return response.data;
});

// Create the slice
const officerBudgetWeeklySlice = createSlice({
    name: 'officerBudgetWeekly',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfficerBudgetWeeklies.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOfficerBudgetWeeklies.fulfilled, (state, action) => {
                state.loading = false;
                state.budgets = action.payload;
                state.error = null;
            })
            .addCase(fetchOfficerBudgetWeeklies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch Officer Budget Weekly records';
            })
            .addCase(createOfficerBudgetWeekly.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOfficerBudgetWeekly.fulfilled, (state, action) => {
                state.loading = false;
                state.budgets.push(action.payload); // Add the new Officer Budget Weekly record
                state.error = null;
            })
            .addCase(createOfficerBudgetWeekly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create Officer Budget Weekly record';
            })
            .addCase(fetchOfficerBudgetWeeklyById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOfficerBudgetWeeklyById.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched single Officer Budget Weekly record as needed
                state.error = null;
            })
            .addCase(fetchOfficerBudgetWeeklyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch Officer Budget Weekly record';
            })
            .addCase(updateOfficerBudgetWeekly.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOfficerBudgetWeekly.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.budgets.findIndex(budget => budget.officer_no === action.payload.officer_no && budget.fiscal_year === action.payload.fiscal_year);
                if (index !== -1) {
                    state.budgets[index] = action.payload; // Update the existing Officer Budget Weekly record
                }
                state.error = null;
            })
            .addCase(updateOfficerBudgetWeekly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update Officer Budget Weekly record';
            })
            .addCase(deleteOfficerBudgetWeekly.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOfficerBudgetWeekly.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted Officer Budget Weekly record from the state
                state.budgets = state.budgets.filter(budget => !(budget.officer_no === action.meta.arg.id && budget.fiscal_year === action.meta.arg.fiscal_year));
                state.error = null;
            })
            .addCase(deleteOfficerBudgetWeekly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete Officer Budget Weekly record';
            });
    },
});

// Export the actions if needed
export const {} = officerBudgetWeeklySlice.actions; // Add any synchronous actions if required

// Export the reducer
export default officerBudgetWeeklySlice.reducer;