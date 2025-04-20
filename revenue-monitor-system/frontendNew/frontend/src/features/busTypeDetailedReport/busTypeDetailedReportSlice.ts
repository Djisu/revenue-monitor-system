import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the parameters for the fetchReportsByCriteria thunk
interface FetchReportsParams {
    zone: string;
    businessType: string;
    fiscalYear: string;
}

// interface BusTypeDetaileditem {
//     electoral_area: string;
//     buss_no: number;
//     buss_name: string;
//     buss_type: string;
//     amountdue: number;
//     amountpaid: number;
//     balance: number;
//     tot_grade: string;
//   }
  


// Define the interface for BusTypeDetailedReport
export interface BusTypeDetailedReport {
    electoral_area: string;
    buss_no: number;
    buss_name: string;
    buss_type: string;
    amountdue: number;
    amountpaid: number;
    balance: number;
    tot_grade: string;
}



// Define the initial state type
interface ReportsState {
    reports: BusTypeDetailedReport[];
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


// Create async thunks for CRUD operations
export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
    const response = await axios.get(`${BASE_URL}/api/bustypeDetailedReport`   ); // Adjust the endpoint as necessary
    return response.data;
});

export const createReport = createAsyncThunk('reports/createReport', async (report: BusTypeDetailedReport) => {
    const response = await axios.post(`${BASE_URL}/api/bustypeDetailedReport`, report); // Adjust the endpoint as necessary
    return response.data;
});

export const updateReport = createAsyncThunk('reports/updateReport', async ({ buss_no, report }: { buss_no: number; report: BusTypeDetailedReport }) => {
    const response = await axios.put(`${BASE_URL}/api/bustypeDetailedReport/${buss_no}`, report); // Adjust the endpoint as necessary
    return response.data;
});

export const deleteReport = createAsyncThunk('reports/deleteReport', async (buss_no: number) => {
    await axios.delete(`${BASE_URL}api/bustypeDetailedReport/${buss_no}`); // Adjust the endpoint as necessary
    return buss_no; // Return the buss_no to update the state
});

// Create async thunk for fetching reports based on criteria  export const fetchReportsByCriteria = createAsyncThunk<BusTypeDetailedReport[], FetchReportsParams>(
export const fetchReportsByCriteria = createAsyncThunk(
    'reports/fetchReportsByCriteria',
    async ({ zone = '', businessType = '', fiscalYear }: {zone: string, businessType: string, fiscalYear: string} ) => {
        const newFiscalYear: number = parseInt(fiscalYear, 10)

        console.log('in fetchReportsByCriteria thunk')
        console.log('zone: ', zone)
        console.log('businessType: ', businessType)
        console.log('fiscalYear: ', fiscalYear)

        const response = await axios.get(`${BASE_URL}/api/bustypeDetailedReport/${zone}/${businessType}/${newFiscalYear}`); // Adjust the endpoint as necessary
        
        if (response.status >= 200 && response.status < 300) {
            console.log('fetchReportsByCriteria fulfilled::: ', response.data);
            // Ensure response.data is an array
            return Array.isArray(response.data.data) ? response.data.data : []; 
        } else {
            throw new Error(`Error fetching grade fees. Status: ${response.status} - Error: ${response.statusText}`);
        }
});

export const fetchAllRecords = createAsyncThunk('reports/fetchAllRecords', async () => {
    // Call the API to fetch all businesses
    console.log('in fetchAllRecords slice, Fetching all Records')

    const response = await axios.get(`${BASE_URL}/api/bustypeDetailedReport/all`);

    if (response.status >= 200 && response.status < 300) {
        console.log('fetchAllRecords fulfilled::: ', response.data);
        // Ensure response.data is an array
        return Array.isArray(response.data) ? response.data : []; //
        // return data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching fetchAllRecords. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Create the async thunk
export const fetchDetailedReports = createAsyncThunk<BusTypeDetailedReport[], FetchReportsParams, { rejectValue: string }>(
    'reports/fetchDetailedReports',
    async ({ zone, businessType, fiscalYear }: FetchReportsParams, { rejectWithValue }) => {

        console.log('in fetchDetailedReports thunk');

        try {
            const response = await axios.get(`${BASE_URL}/api/bustypeDetailedReport/${zone}/${businessType}/${fiscalYear}`);
            
            console.log('response.data.data XXXXXXX: ', response.data.data);

            // Check for successful response
            if (response.data.message === 'BusTypeDetailedReport fetched') {
                console.log('')
                return response.data.data; // Return the array of reports && response.data.message === 'No businesses found'
            } else if (response.status === 404 ) {
                // Handle the case where no businesses are found
                console.warn('No businesses found');
                return rejectWithValue('No businesses found');
            } else {
                // Handle unexpected message
                console.warn('Unexpected response message: ', response.data.message);
                return rejectWithValue('Unexpected response structure');
            }
        } catch (error) {
            // Custom error handling
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unexpected error occurred');
        }
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
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
                state.error = null;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch reports';
            })

            .addCase(fetchReportsByCriteria.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReportsByCriteria.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
                state.error = null;
            })
            .addCase(fetchReportsByCriteria.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch reports';
            })
            
            .addCase(fetchDetailedReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDetailedReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
                state.error = null;
            })
            .addCase(fetchDetailedReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch reports';
            })
            .addCase(createReport.fulfilled, (state, action) => {
                state.reports.push(action.payload);
                state.error = null;
            })
            .addCase(updateReport.fulfilled, (state, action) => {
                const index = state.reports.findIndex(report => report.buss_no === action.payload.buss_no);
                if (index !== -1) {
                    state.reports[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.reports = state.reports.filter(report => report.buss_no !== action.payload);
                state.error = null;
            });
    },
});

// Export actions and reducer
export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;