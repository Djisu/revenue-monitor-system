// // src/features/propertyOfficerAssessment/propertyOfficerAssessmentSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Define the type for PropertyOfficerAssessment data
// export interface PropertyOfficerAssessmentData {
//     officer_no: string;
//     officer_name: string;
//     Noofclientsserved: number;
//     valueofbillsdistributed: number;
//     bus_year: number;
//     JanuaryAmount: number;
//     FebruaryAmount: number;
//     MarchAmount: number;
//     AprilAmount: number;
//     MayAmount: number;
//     JuneAmount: number;
//     JulyAmount: number;
//     AugustAmount: number;
//     SeptemberAmount: number;
//     OctoberAmount: number;
//     NovemberAmount: number;
//     DecemberAmount: number;
//     totalReceiptTodate: number;
//     balance: number;
//     remarks: string;
// }

// // Define the initial state for the slice
// export interface PropertyOfficerAssessmentState {
//     records: PropertyOfficerAssessmentData[];
//     loading: boolean;
//     error: string | null;
// }

// export const initialState: PropertyOfficerAssessmentState = {
//     records: [],
//     loading: false,
//     error: null,
// };

// // Async thunk to fetch all property officer assessments
// export const fetchPropertyOfficerAssessments = createAsyncThunk('propertyOfficerAssessment/fetchPropertyOfficerAssessments', async () => {
//     const response = await axios.get('/api/propertyOfficerAssessment');
//     return response.data;
// });

// // Async thunk to fetch a single property officer assessment by officer_no and bus_year
// export const fetchPropertyOfficerAssessmentById = createAsyncThunk('propertyOfficerAssessment/fetchPropertyOfficerAssessmentById', async ({ officer_no, bus_year }: { officer_no: string; bus_year: number }) => {
//     const response = await axios.get(`/api/propertyOfficerAssessment/${officer_no}/${bus_year}`);
//     return response.data;
// });

// // Async thunk to create a new property officer assessment
// export const createPropertyOfficerAssessment = createAsyncThunk('propertyOfficerAssessment/createPropertyOfficerAssessment', async (propertyOfficerAssessmentData: PropertyOfficerAssessmentData) => {
//     const response = await axios.post('/api/propertyOfficerAssessment', propertyOfficerAssessmentData);
//     return response.data;
// });

// // Async thunk to update a property officer assessment
// export const updatePropertyOfficerAssessment = createAsyncThunk('propertyOfficerAssessment/updatePropertyOfficerAssessment', async ({ officer_no, bus_year, propertyOfficerAssessmentData }: { officer_no: string; bus_year: number; propertyOfficerAssessmentData: PropertyOfficerAssessmentData }) => {
//     const response = await axios.put(`/api/propertyOfficerAssessment/${officer_no}/${bus_year}`, propertyOfficerAssessmentData);
//     return response.data;
// });

// // Async thunk to delete a property officer assessment
// export const deletePropertyOfficerAssessment = createAsyncThunk('propertyOfficerAssessment/deletePropertyOfficerAssessment', async ({ officer_no, bus_year }: { officer_no: string; bus_year: number }) => {
//     const response = await axios.delete(`/api/propertyOfficerAssessment/${officer_no}/${bus_year}`);
//     return response.data;
// });

// // Create the slice
// const propertyOfficerAssessmentSlice = createSlice({
//     name: 'propertyOfficerAssessment',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchPropertyOfficerAssessments.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchPropertyOfficerAssessments.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.records = action.payload;
//                 state.error = null;
//             })
//             .addCase(fetchPropertyOfficerAssessments.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch property officer assessments';
//             })
//             .addCase(fetchPropertyOfficerAssessmentById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchPropertyOfficerAssessmentById.fulfilled, (state) => {
//                 state.loading = false;
//                 // Handle the fetched property officer assessment data if needed
//                 state.error = null;
//             })
//             .addCase(fetchPropertyOfficerAssessmentById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch property officer assessment';
//             })
//             .addCase(createPropertyOfficerAssessment.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createPropertyOfficerAssessment.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.records.push(action.payload); // Add the new property officer assessment
//                 state.error = null;
//             })
//             .addCase(createPropertyOfficerAssessment.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create property officer assessment';
//             })
//             .addCase(updatePropertyOfficerAssessment.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(updatePropertyOfficerAssessment.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.records.findIndex(record => record.officer_no === action.payload.officer_no && record.bus_year === action.payload.bus_year);
//                 if (index !== -1) {
//                     state.records[index] = action.payload; // Update the property officer assessment
//                 }
//                 state.error = null;
//             })
//             .addCase(updatePropertyOfficerAssessment.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to update property officer assessment';
//             })
//             .addCase(deletePropertyOfficerAssessment.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deletePropertyOfficerAssessment.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.records = state.records.filter(record => !(record.officer_no === action.meta.arg.officer_no && record.bus_year === action.meta.arg.bus_year));
//                 state.error = null;
//             })
//             .addCase(deletePropertyOfficerAssessment.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to delete property officer assessment';
//             });
//     },
// });

// // Export the reducer
// export default propertyOfficerAssessmentSlice.reducer;