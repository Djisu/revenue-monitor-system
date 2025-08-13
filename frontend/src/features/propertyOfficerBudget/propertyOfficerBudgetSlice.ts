// // src/features/propertyOfficerBudget/propertyOfficerBudgetSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Define the type for PropertyOfficerBudget data
// export interface PropertyOfficerBudgetData {
//     officer_no: string;
//     officer_name: string;
//     fiscal_year: number;
//     annual_budget: number;
//     monthly_budget: number;
//     January_budget: number;
//     January_Actual: number;
//     February_budget: number;
//     February_Actual: number;
//     March_budget: number;
//     March_Actual: number;
//     April_budget: number;
//     April_Actual: number;
//     May_budget: number;
//     May_Actual: number;
//     June_budget: number;
//     June_Actual: number;
//     July_budget: number;
//     July_Actual: number;
//     August_budget: number;
//     August_Actual: number;
//     September_budget: number;
//     September_Actual: number;
//     October_budget: number;
//     October_Actual: number;
//     November_budget: number;
//     November_Actual: number;
//     December_budget: number;
//     December_Actual: number;
//     Actual_total: number;
//     outstanding: number;
//     electoral_area: string;
// }

// // Define the initial state for the slice
// export interface PropertyOfficerBudgetState {
//     records: PropertyOfficerBudgetData[];
//     loading: boolean;
//     error: string | null;
// }

// export const initialState: PropertyOfficerBudgetState = {
//     records: [],
//     loading: false,
//     error: null,
// };

// // Async thunk to fetch all property officer budgets
// export const fetchPropertyOfficerBudgets = createAsyncThunk('propertyOfficerBudget/fetchPropertyOfficerBudgets', async () => {
//     const response = await axios.get('/api/propertyOfficerBudget');
//     return response.data;
// });

// // Async thunk to fetch a single property officer budget by officer_no and fiscal_year
// export const fetchPropertyOfficerBudgetById = createAsyncThunk('propertyOfficerBudget/fetchPropertyOfficerBudgetById', async ({ officer_no, fiscal_year }: { officer_no: string; fiscal_year: number }) => {
//     const response = await axios.get(`/api/propertyOfficerBudget/${officer_no}/${fiscal_year}`);
//     return response.data;
// });

// // Async thunk to create a new property officer budget
// export const createPropertyOfficerBudget = createAsyncThunk('propertyOfficerBudget/createPropertyOfficerBudget', async (propertyOfficerBudgetData: PropertyOfficerBudgetData) => {
//     const response = await axios.post('/api/propertyOfficerBudget', propertyOfficerBudgetData);
//     return response.data;
// });

// // Async thunk to update a property officer budget
// export const updatePropertyOfficerBudget = createAsyncThunk('propertyOfficerBudget/updatePropertyOfficerBudget', async ({ officer_no, fiscal_year, propertyOfficerBudgetData }: { officer_no: string; fiscal_year: number; propertyOfficerBudgetData: PropertyOfficerBudgetData }) => {
//     const response = await axios.put(`/api/propertyOfficerBudget/${officer_no}/${fiscal_year}`, propertyOfficerBudgetData);
//     return response.data;
// });

// // Async thunk to delete a property officer budget
// export const deletePropertyOfficerBudget = createAsyncThunk('propertyOfficerBudget/deletePropertyOfficerBudget', async ({ officer_no, fiscal_year }: { officer_no: string; fiscal_year: number }) => {
//     const response = await axios.delete(`/api/propertyOfficerBudget/${officer_no}/${fiscal_year}`);
//     return response.data;
// });

// // Create the slice
// const propertyOfficerBudgetSlice = createSlice({
//     name: 'propertyOfficerBudget',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchPropertyOfficerBudgets.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchPropertyOfficerBudgets.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.records = action.payload;
//                 state.error = null;
//             })
//             .addCase(fetchPropertyOfficerBudgets.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch property officer budgets';
//             })
//             .addCase(fetchPropertyOfficerBudgetById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchPropertyOfficerBudgetById.fulfilled, (state) => {
//                 state.loading = false;
//                 // Handle the fetched property officer budget data if needed
//                 state.error = null;
//             })
//             .addCase(fetchPropertyOfficerBudgetById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch property officer budget';
//             })
//             .addCase(createPropertyOfficerBudget.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createPropertyOfficerBudget.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.records.push(action.payload); // Add the new property officer budget
//                 state.error = null;
//             })
//             .addCase(createPropertyOfficerBudget.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create property officer budget';
//             })
//             .addCase(updatePropertyOfficerBudget.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(updatePropertyOfficerBudget.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.records.findIndex(record => record.officer_no === action.payload.officer_no && record.fiscal_year === action.payload.fiscal_year);
//                 if (index !== -1) {
//                     state.records[index] = action.payload; // Update the property officer budget
//                 }
//                 state.error = null;
//             })
//             .addCase(updatePropertyOfficerBudget.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to update property officer budget';
//             })
//             .addCase(deletePropertyOfficerBudget.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deletePropertyOfficerBudget.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.records = state.records.filter(record => !(record.officer_no === action.meta.arg.officer_no && record.fiscal_year === action.meta.arg.fiscal_year));
//                 state.error = null;
//             })
//             .addCase(deletePropertyOfficerBudget.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to delete property officer budget';
//             });
//     },
// });

// // Export the reducer
// export default propertyOfficerBudgetSlice.reducer;