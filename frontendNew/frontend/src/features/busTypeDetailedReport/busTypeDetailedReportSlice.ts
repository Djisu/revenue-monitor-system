import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the parameters for the fetchReportsByCriteria thunk
interface FetchReportsParams {
    zone: string;
    businessType: string;
    fiscalYear: string;
}

// interface FetchDetailedReportsParams {
//     electoral_area: string;
//     buss_no: string;
// }
    


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

// Create async thunk for fetching reports based on criteria
export const fetchReportsByCriteria = createAsyncThunk<BusTypeDetailedReport[], FetchReportsParams>(
    'reports/fetchReportsByCriteria',
    async ({ zone, businessType, fiscalYear }: FetchReportsParams) => {

        console.log('in fetchReportsByCriteria thunk')

        const response = await axios.get(`${BASE_URL}/api/bustypeDetailedReport/${zone}/${businessType}/${fiscalYear}`); // Adjust the endpoint as necessary
        
        if (response.status >= 200 && response.status < 300) {
            console.log('fetchReportsByCriteria fulfilled::: ', response.data.data);
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

  try {
    const response = await axios.get<BusTypeDetailedReport[]>(`${BASE_URL}/api/bustypeDetailedReport/${zone}/${businessType}/${fiscalYear}`);

    console.log('response: ', response)

    return Array.isArray(response.data) ? response.data : []; 

    // return response.data.map(report => ({
    //     electoral_area: report.electoral_area,
    //     buss_no: report.buss_no,
    //     buss_name: report.buss_name,
    //     buss_type: report.buss_type,
    //     amountdue: report.amountdue,
    //     amountpaid: report.amountpaid,
    //     balance: report.balance,
    //     tot_grade: report.tot_grade,
    // }));
  } catch (error) {
    // You can customize the error handling here
    if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});


   

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