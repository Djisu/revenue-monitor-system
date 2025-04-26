// src/features/offBudgetAssessment/offBudgetAssessmentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for OffBudgetAssessment data
export interface OffBudgetAssessmentData {
    officer_name: string;
    JanuaryAmount: number;
    JanuaryBudget: number;
    FebruaryAmount: number;
    FebruaryBudget: number;
    MarchAmount: number;
    MarchBudget: number;
    AprilAmount: number;
    AprilBudget: number;
    MayAmount: number;
    MayBudget: number;
    JuneAmount: number;
    JuneBudget: number;
    JulyAmount: number;
    JulyBudget: number;
    AugustAmount: number;
    AugustBudget: number;
    SeptemberAmount: number;
    SeptemberBudget: number;
    OctoberAmount: number;
    OctoberBudget: number;
    NovemberAmount: number;
    NovemberBudget: number;
    DecemberAmount: number;
    DecemberBudget: number;
}



// Define the type for the response of the amountByOfficerAndMonth API
export interface AmountByOfficerAndMonthResponse {
    totsum: number | null;
}



// Define the initial state for the slice
export interface OffBudgetAssessmentState {
    assessments: OffBudgetAssessmentData[];
    loading: boolean;
    error: string | null;
    amountByOfficerAndMonth: AmountByOfficerAndMonthResponse | null;
}

export const initialState: OffBudgetAssessmentState = {
    assessments: [],
    loading: false,
    error: null,
    amountByOfficerAndMonth: null,
};


const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');



// Async thunk to fetch all OffBudgetAssessment records
export const fetchOffBudgetAssessments = createAsyncThunk('offBudgetAssessment/fetchOffBudgetAssessments', async () => {
    const response = await axios.get(`${BASE_URL}/api/offBudgetAssessment`);
    return response.data;
});

// Async thunk to create a new OffBudgetAssessment record
export const createOffBudgetAssessment = createAsyncThunk('offBudgetAssessment/createOffBudgetAssessment', async (data: OffBudgetAssessmentData) => {
    const response = await axios.post(`${BASE_URL}/api/offBudgetAssessment`, data);
    return response.data;
});

// Async thunk to fetch a single OffBudgetAssessment record by officer_name
export const fetchOffBudgetAssessmentByOfficer = createAsyncThunk('offBudgetAssessment/fetchOffBudgetAssessmentByOfficer', async (officer_name: string) => {
    const response = await axios.get(`${BASE_URL}/api/offBudgetAssessment/${officer_name}`);
    return response.data;
});

// Async thunk to update an OffBudgetAssessment record
export const updateOffBudgetAssessment = createAsyncThunk(
    'offBudgetAssessment/updateOffBudgetAssessment',
    async ({ officer_name, data }: { officer_name: string; data: OffBudgetAssessmentData }) => {
        const response = await axios.put(`${BASE_URL}/api/offBudgetAssessment/${officer_name}`, data);  
        return response.data;
    }
);

// Async thunk to delete an OffBudgetAssessment record
export const deleteOffBudgetAssessment = createAsyncThunk('offBudgetAssessment/deleteOffBudgetAssessment', async (officer_name: string) => {
    const response = await axios.delete(`${BASE_URL}/api/offBudgetAssessment/${officer_name}`);
    return response.data;
});

// Async thunk to fetch amount by officer and month
export const fetchAmountByOfficerAndMonth = createAsyncThunk(
    'offBudgetAssessment/fetchAmountByOfficerAndMonth',
    async ({ officerNo, fiscalYear, monthPaid }: { officerNo: string; fiscalYear: string; monthPaid: string }) => {

        console.log('in fetchAmountByOfficerAndMonth')

        const response = await axios.get<{ totsum: number | null }>(`${BASE_URL}/api/offBudgetAssessment`, {
            params: { officerNo, fiscalYear, monthPaid }
        });
        return response.data;
    }
);

// Async thunk to fetch amount by officer and month
export const fetchDataByOfficerAndFiscalYear = createAsyncThunk<OffBudgetAssessmentData[], { officerNo: string; fiscalYear: number }>(
    'offBudgetAssessment/fetchDataByOfficerAndFiscalYear',
    async ({ officerNo, fiscalYear }): Promise<OffBudgetAssessmentData[]> => {

        const response = await axios.get(`${BASE_URL}/api/offBudgetAssessment/${officerNo}/${fiscalYear}`);
        return response.data;

        
    }
);

// // Async thunk to fetch the officer assessment
// export const fetchOfficerAssessment = createAsyncThunk<OfficerAssessment, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchOfficerAssessment',
//     async ({ officerNo, fiscalYear }): Promise<OfficerAssessment> => {

//         console.log('in fetchOfficerAssessment: ',  officerNo, fiscalYear )

//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/${officerNo}/${fiscalYear}`);
//         console.log('fetchOfficerAssessment response', response.data)

//         return response.data; // Ensure this matches OfficerAssessment structure
//     }
// );

// Create the slice
const offBudgetAssessmentSlice = createSlice({
    name: 'offBudgetAssessment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOffBudgetAssessments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOffBudgetAssessments.fulfilled, (state, action) => {
                state.loading = false;
                state.assessments = action.payload;
                state.error = null;
            })
            .addCase(fetchOffBudgetAssessments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch OffBudgetAssessment records';
            })
            .addCase(createOffBudgetAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOffBudgetAssessment.fulfilled, (state, action) => {
                state.loading = false;
                state.assessments.push(action.payload); // Add the new OffBudgetAssessment record
                state.error = null;
            })
            .addCase(createOffBudgetAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create OffBudgetAssessment record';
            })
            .addCase(fetchOffBudgetAssessmentByOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOffBudgetAssessmentByOfficer.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single OffBudgetAssessment record as needed
                state.error = null;
            })
            .addCase(fetchOffBudgetAssessmentByOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch OffBudgetAssessment record';
            })
            .addCase(updateOffBudgetAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOffBudgetAssessment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.assessments.findIndex(assessment => assessment.officer_name === action.payload.officer_name);
                if (index !== -1) {
                    state.assessments[index] = action.payload; // Update the existing OffBudgetAssessment record
                }
                state.error = null;
            })
            .addCase(updateOffBudgetAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update OffBudgetAssessment record';
            })
            .addCase(deleteOffBudgetAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOffBudgetAssessment.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted OffBudgetAssessment record from the state
                state.assessments = state.assessments.filter(assessment => assessment.officer_name !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteOffBudgetAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete OffBudgetAssessment record';
            })
            .addCase(fetchAmountByOfficerAndMonth.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAmountByOfficerAndMonth.fulfilled, (state, action) => {
                state.loading = false;
                state.amountByOfficerAndMonth = action.payload; // Update the amountByOfficerAndMonth state
                state.error = null;
            })
            .addCase(fetchAmountByOfficerAndMonth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch amount by officer and month';
            })
            .addCase(fetchDataByOfficerAndFiscalYear.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDataByOfficerAndFiscalYear.fulfilled, (state, action) => {
                state.loading = false;
                state.assessments = action.payload; // Update the amountByOfficerAndYear state 
                state.error = null;
            })
            .addCase(fetchDataByOfficerAndFiscalYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch amount by officer and month';
            });
    },
    },
);

// Export the actions if needed
export const {} = offBudgetAssessmentSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default offBudgetAssessmentSlice.reducer;
