import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../utilities/apiClient';
import axios from 'axios';

// Define the types for the state based on OfficerAssessment
export interface OfficerAssessment {
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
    
    totalValue: number; // Add this line
}

// Define the combined state type
export interface PaymentsState {
    officerAssessment: OfficerAssessment | null;
    loading: boolean;
    error: string | null;
    januaryAmount: number | null; // For January amount specifically
    februaryAmount: number | null; // For February amount specifically
    marchAmount: number | null; // For March amount specifically
    aprilAmount: number | null; // For April amount specifically
    mayAmount: number | null; // For May amount specifically
    juneAmount: number | null; // For June amount specifically
    julyAmount: number | null; // For July amount specifically
    augustAmount: number | null; // For August amount specifically
    septemberAmount: number | null; // For September amount specifically
    octoberAmount: number | null; // For October amount specifically
    novemberAmount: number | null; // For November amount specifically
    decemberAmount: number | null; // For December amount specifically
    fiscalYears: FiscalYear[]; // Add this line
}

export interface CreateClientsServedParams {
    officerNo: string;
    fiscalYear: number;
    noOfClientsServed: number;
    valueOfBillsDistributed: number;
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
    totalReceiptToDate: number;
    balance: number;
    remarks: number;
}

export interface FiscalYear {
    fiscal_year: number; // Define as an object with a 'fiscal_year' property
}


// Initial state
export const initialState: PaymentsState = {
    officerAssessment: null,
    loading: false,
    error: null,
    januaryAmount: null,
    februaryAmount: null,
    marchAmount: null,
    aprilAmount: null,
    mayAmount: null,
    juneAmount: null,
    julyAmount: null,
    augustAmount: null,
    septemberAmount: null,
    octoberAmount: null,
    novemberAmount: null,
    decemberAmount: null,
    fiscalYears: [], // Initialize as an empty array
};

// Base URL setup
const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

const token = localStorage.getItem('token');

// Async thunk to create clients served
export const createClientsServed = createAsyncThunk<number, CreateClientsServedParams>(
    'officerAssessment/createClientsServed',
    async (params: CreateClientsServedParams): Promise<number> => {
        //console.clear();
        console.log('in createClientsServed thunk', params)

        const response = await apiClient.post(`${BASE_URL}/api/officerAssessment/create`, params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('createClientsServed response', response.data)
       
        return response.data; // Adjust based on your API response
    }
);

// function isNumber(value: any): value is number {
//     return typeof value === 'number' && !isNaN(value);
// }

// Async thunk to fetch the number of clients served
export const fetchClientsServed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'officerAssessment/fetchClientsServed',
    async ({ officerNo, fiscalYear }): Promise<number> => {

        console.log('fetchClientsServed thunk called');

        console.log(`Fetching clients served for Officer No: ${officerNo}, Fiscal Year: ${fiscalYear}`);

        if (!officerNo) {
            throw new Error('Invalid officerNo: must be a string');
        }

        // Check if fiscalYear is a number
        if (typeof fiscalYear !== 'number' || isNaN(fiscalYear)) {
            throw new Error('Invalid fiscalYear: must be a number');
        }

        console.log('about to call endpoint')
        const response = await axios.get(`${BASE_URL}/api/officerAssessment/fetchClientsServed/${officerNo}/${fiscalYear}`);
        console.log('fetchClientsServed response', response.data)
        return response.data;
    }
);

// Async thunk to fetch the value of bills distributed
export const fetchBillsDistributed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'officerAssessment/fetchBillsDistributed',
    async ({ officerNo, fiscalYear }): Promise<number> => {
        const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/billsDistributed/${officerNo}/${fiscalYear}`);
        return response.data;
    }
);

// Async thunk to fetch fiscal years    
export const fetchFiscalYears = createAsyncThunk<FiscalYear[], void>(
    'officerAssessment/fetchFiscalYears',
    async (): Promise<FiscalYear[]> => {
        const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/fiscalyears`);
        return response.data; // Ensure this is an array
    }
);

// Create the thunk for fetching January amount
export const fetchJanuaryAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchJanuaryAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchJanuaryAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/January/${officerNo}/${fiscalYear}`);
            const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
             if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }          
        }
    }
);

// Create the thunk for fetching February amount
export const fetchFebruaryAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchFebruaryAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchFebruaryAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/February/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching March amount
export const fetchMarchAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchMarchAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchMarchAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/March/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching April amount
export const fetchAprilAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchAprilAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchAprilAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/April/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching May amount
export const fetchMayAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchMayAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchMayAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/May/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching June amount
export const fetchJuneAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchJuneAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchJuneAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/June/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching July amount
export const fetchJulyAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchJulyAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchJulyAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/July/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching August amount
export const fetchAugustAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchAugustAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchAugustAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/August/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching September amount
export const fetchSeptemberAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchSeptemberAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchSeptemberAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/September/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching October amount
export const fetchOctoberAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchOctoberAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchOctoberAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/October/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching November amount
export const fetchNovemberAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchNovemberAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchNovemberAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/November/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
              if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Create the thunk for fetching December amount
export const fetchDecemberAmount = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
    'payments/fetchDecemberAmount',
    async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
        console.log('in fetchDecemberAmount')
        try {
            const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/December/${officerNo}/${fiscalYear}`);
             const totsum = Number(response.data.totsum); // Convert to number

            console.log('totsum', totsum)
            
            // Check if the conversion was successful
            if (isNaN(totsum)) {
                throw new Error('Received an invalid number for totsum');
            }

            return totsum; // Now returning a number
        } catch (error: unknown) {
             if (error instanceof Error){
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue("Unknown error");
            }  
        }
    }
);

// Async thunk to fetch the officer assessment
export const fetchOfficerAssessment = createAsyncThunk<OfficerAssessment, { officerNo: string; fiscalYear: number }>(
    'officerAssessment/fetchOfficerAssessment',
    async ({ officerNo, fiscalYear }): Promise<OfficerAssessment> => {

        console.log('in fetchOfficerAssessment thunk: ',  officerNo, fiscalYear )

        const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/${officerNo}/${fiscalYear}`);
        console.log('fetchOfficerAssessment response.data.data', response.data.data)

        return response.data.data; // Ensure this matches OfficerAssessment structure
    }
);

// Create slice
const officerAssessmentSlice = createSlice({
    name: 'officerAssessment',
    initialState,
    reducers: {
        resetData: (state) => {
            state.officerAssessment = null;
            state.fiscalYears = [];
            state.loading = false;
            state.error = null;
            state.januaryAmount = null;
            state.februaryAmount = null;
            state.marchAmount = null;
            state.aprilAmount = null;
            state.mayAmount = null;
            state.juneAmount = null;
            state.julyAmount = null;
            state.augustAmount = null;
            state.septemberAmount = null;
            state.octoberAmount = null;
            state.novemberAmount = null;
            state.decemberAmount = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClientsServed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientsServed.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                if (state.officerAssessment) {
                    state.officerAssessment.Noofclientsserved = action.payload;
                } else {
                    console.warn('officerAssessment is null, cannot set Noofclientsserved');
                }
            })
            .addCase(fetchClientsServed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch clients served';
            })
            .addCase(fetchBillsDistributed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBillsDistributed.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                if (state.officerAssessment) {
                    state.officerAssessment.valueofbillsdistributed = action.payload;
                } else {
                    console.warn('officerAssessment is null, cannot set valueofbillsdistributed');
                }
            })
            .addCase(fetchBillsDistributed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch bills distributed';
            })
            .addCase(fetchFiscalYears.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFiscalYears.fulfilled, (state, action: PayloadAction<FiscalYear[]>) => {
                state.loading = false
                state.fiscalYears = action.payload; // This will now be an array of FiscalYear objects
            })
            .addCase(fetchFiscalYears.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch fiscal years';
            })
            .addCase(fetchOfficerAssessment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOfficerAssessment.fulfilled, (state, action: PayloadAction<OfficerAssessment>) => {
                state.loading = false;
                state.officerAssessment = action.payload;
            })
            .addCase(fetchOfficerAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch officer assessment';
            })
            .addCase(fetchJanuaryAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJanuaryAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.januaryAmount = action.payload; // Set January amount
            })
            .addCase(fetchJanuaryAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch January amount';
            })
            .addCase(fetchFebruaryAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFebruaryAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.februaryAmount = action.payload; // Set februaryAmount amount
            })
            .addCase(fetchFebruaryAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch February amount';
            })
            .addCase(fetchMarchAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarchAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.marchAmount = action.payload; // Set marchAmount amount
            })
            .addCase(fetchMarchAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch March amount';
            })
            .addCase(fetchAprilAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAprilAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.aprilAmount = action.payload; // Set aprilAmount amount
            })
            .addCase(fetchAprilAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch April amount';
            })
            .addCase(fetchMayAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMayAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.mayAmount = action.payload; // Set mayAmount amount
            })
            .addCase(fetchMayAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch May amount';
            })
            .addCase(fetchJuneAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJuneAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.juneAmount = action.payload; // Set juneAmount amount
            })
            .addCase(fetchJuneAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch June amount';
            })
            .addCase(fetchJulyAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJulyAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.julyAmount = action.payload; // Set julyAmount amount
            })
            .addCase(fetchJulyAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch July amount';
            })
            .addCase(fetchAugustAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAugustAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.augustAmount = action.payload; // Set augustAmount amount
            })
            .addCase(fetchAugustAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch August amount';
            })
            .addCase(fetchSeptemberAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSeptemberAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.septemberAmount = action.payload; // Set septemberAmount amount
            })
            .addCase(fetchSeptemberAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch September amount';
            })
            .addCase(fetchOctoberAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOctoberAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.octoberAmount = action.payload; // Set octoberAmount amount
            })
            .addCase(fetchOctoberAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch October amount';
            })
            .addCase(fetchNovemberAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNovemberAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.novemberAmount = action.payload; // Set novemberAmount amount
            })
            .addCase(fetchNovemberAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch November amount';
            })
            .addCase(fetchDecemberAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDecemberAmount.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.decemberAmount = action.payload; // Set decemberAmount amount
            })
            .addCase(fetchDecemberAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch December amount';
            })
            .addCase(createClientsServed.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new request
            })
            .addCase(createClientsServed.fulfilled, (state) => {
                state.loading = false;
                // Update relevant fields in officerAssessment if needed
            })
            .addCase(createClientsServed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create clients served'; // Capture error message
            });
    },
});

// Exporting the reset action and the reducer
export const { resetData } = officerAssessmentSlice.actions;
export default officerAssessmentSlice.reducer;

















// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import apiClient from '../../utilities/apiClient';

// // Define the types for the state based on OfficerAssessment
// export interface OfficerAssessment {
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

// // Define the types for the state
// interface DataState {
//     officerAssessment: OfficerAssessment | null;
//     loading: boolean;
//     error: string | null;
// }

// // Define the types for thunk parameters
// export interface { officerNo: string; fiscalYear: number } {
//     officerNo: string;
//     fiscalYear: number;
// }

// export interface CreateClientsServedParams {
//     officerNo: string;
//     fiscalYear: number;
//     noOfClientsServed: number;
//     valueOfBillsDistributed: number;
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
//     totalReceiptToDate: number;
//     balance: number;
//     remarks: string;
// }

// interface FiscalYear {
//     FiscalYear: number;
// }

// interface FetchJanuaryAmountParams {
//     officerNo: string;
//     fiscalYear: number;
// }

// // Define the response type based on your API response structure
// interface JanuaryAmountResponse {
//     // Define the fields you expect to receive from the API
//     amount: number; // Adjust based on actual API response
// }


// interface PaymentsState {
//     januaryAmount: JanuaryAmountResponse | null;
//     loading: boolean;
//     error: string | null;
// }

// // Base URL setup
// const BASE_URL = import.meta.env.VITE_BASE_URL || 
// (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// const token = localStorage.getItem('token');

// // Async thunk to create clients served
// export const createClientsServed = createAsyncThunk<number, CreateClientsServedParams>(
//     'officerAssessment/createClientsServed',
//     async (params: CreateClientsServedParams): Promise<number> => {
//         const response = await apiClient.post(`${BASE_URL}/api/officerAssessment/create`, params, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });
//         return response.data.totalClientsServed; // Adjust based on your API response
//     }
// );

// // Async thunk to fetch the number of clients served
// export const fetchClientsServed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchClientsServed',
//     async ({ officerNo, fiscalYear }): Promise<number> => {
//         console.log('in fetchClientsServed thunk')

//         const response = await apiClient.get(`${BASE_URL}/api/buspayments/fetchClientsServed/${officerNo}/${fiscalYear}`);

//         console.log('fetchClientsServed response: ', response)
//         return response.data
//     }
// );

// // Async thunk to fetch the value of bills distributed
// export const fetchBillsDistributed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchBillsDistributed',
//     async ({ officerNo, fiscalYear }): Promise<number> => {

//         console.log('in fetchBillsDistributed thunk')
        
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/billsDistributed/${officerNo}/${fiscalYear}`);
//         return response.data;
//     }
// );

// // Async thunk to fetch fiscal years    
// export const fetchFiscalYears = createAsyncThunk<FiscalYear[], void>(
//     'officerAssessment/fetchFiscalYears',
//     async (): Promise<FiscalYear[]> => {
//         console.log('in fetchFiscalYears thunk')
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/fiscalyears`); 

//         console.log('fetchFiscalYears thunk response: ', response)
//         return response.data; // Ensure this is an array
//     }
// );

// /////////////////////////////////////////////////////////////////////////////
// // Define the parameters for the thunk


// // Create the thunk for fetching January amount
// export const fetchJanuaryAmount = createAsyncThunk<JanuaryAmountResponse, FetchJanuaryAmountParams>(
//     'payments/fetchJanuaryAmount',
//     async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/January/${officerNo}/${fiscalYear}`);
//             return response.data; // Ensure this matches the JanuaryAmountResponse structure
//         } catch (error: any) {
//             return rejectWithValue(error.message);
//         }
//     }
// );


// ////////////////////////////////////////////////////////////////////////




// // Async thunk to fetch the officer assessment
// export const fetchOfficerAssessment = createAsyncThunk<OfficerAssessment, { officerNo: string; fiscalYear: number }>(
//     'officerAssessment/fetchOfficerAssessment',
//     async ({ officerNo, fiscalYear }): Promise<OfficerAssessment> => {
//         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/${officerNo}/${fiscalYear}`);
//         return response.data; // Ensure this matches OfficerAssessment structure
//     }
// );

// // Create slice
// const officerAssessmentSlice = createSlice({
//     name: 'officerAssessment',
//     initialState: {
//         officerAssessment: null,
//         loading: false,
//         error: null,
//     } as DataState,
//     reducers: {
//         resetData: (state) => {
//             state.officerAssessment = null;
//             state.loading = false;
//             state.error = null;
//         },
//         //////////////////////////////////
//         // Define any synchronous actions if needed
//         resetJanuaryAmount: (state) => {
//             state.januaryAmount = null;
//             state.loading = false;
//             state.error = null;
//         },

//         //////////////////////////////////
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchClientsServed.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchClientsServed.fulfilled, (state, action: PayloadAction<number>) => {
//                 state.loading = false;
//                 if (state.officerAssessment) { // Check if officerAssessment is not null
//                     state.officerAssessment.Noofclientsserved = action.payload;
//                 } else {
//                     console.warn('officerAssessment is null, cannot set Noofclientsserved');
//                 }        
//             })
//             .addCase(fetchClientsServed.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch clients served';
//             })
                        
//             // Handle fetchBillsDistributed actions
//             .addCase(fetchBillsDistributed.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchBillsDistributed.fulfilled, (state, action: PayloadAction<number>) => {
//                 state.loading = false;              
//                 if (state.officerAssessment) { // Check if officerAssessment is not null
//                     state.officerAssessment.valueofbillsdistributed = action.payload;
//                 } else {
//                     console.warn('officerAssessment is null, cannot set valueofbillsdistributed');
//                 }      
//             })
//             .addCase(fetchBillsDistributed.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch bills distributed';
//             })
//                         // Handle fetchFiscalYears actions
//             .addCase(fetchFiscalYears.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchFiscalYears.fulfilled, (state, action: PayloadAction<FiscalYear[]>) => {
//                 state.loading = false;
               
//                 if (state.officerAssessment) { // Check if officerAssessment is not null
//                     state.officerAssessment.bus_year = action.payload[0].FiscalYear;
//                 } else {
//                     console.warn('officerAssessment is null, cannot set bus_year');
//                     console.warn('officerAssessment is null, cannot set valueofbillsdistributed');
//                 }      
//             })
//             .addCase(fetchFiscalYears.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch fiscal years';
//             })








//             .addCase(fetchOfficerAssessment.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchOfficerAssessment.fulfilled, (state, action: PayloadAction<OfficerAssessment>) => {
//                 state.loading = false;
//                 state.officerAssessment = action.payload;
//             })
//             .addCase(fetchOfficerAssessment.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch officer assessment';
//             })
//             // Handle createClientsServed actions
//             .addCase(createClientsServed.pending, (state) => {
//                 state.loading = true;
//                 state.error = null; // Reset error on new request
//             })
//             .addCase(createClientsServed.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // Update relevant fields in officerAssessment if needed
//                 // This would require you to fetch the updated assessment again or handle this logic accordingly
//             })
//             .addCase(createClientsServed.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create clients served'; // Capture error message
//             });
//     },
// });

// // Exporting the reset action and the reducer
// export const { resetData } = officerAssessmentSlice.actions;
// export default officerAssessmentSlice.reducer;







































// // import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// // import apiClient from '../../utilities/apiClient';

// // // Define the types for the state
// // interface DataState {
// //     clientsServed: number | null;
// //     billsDistributed: number | null;

// //     JanuaryAmount: number;
// //     FebruaryAmount: number;
// //     MarchAmount: number;
// //     AprilAmount: number;
// //     MayAmount: number;
// //     JuneAmount: number;
// //     JulyAmount: number;
// //     AugustAmount: number;
// //     SeptemberAmount: number;
// //     OctoberAmount: number;
// //     NovemberAmount: number;
// //     DecemberAmount: number;

// //     fiscalYears: FiscalYear[];  
// //     loading: boolean;
// //     error: string | null;
// // }

// // // Define the types for thunk parameters
// // export interface { officerNo: string; fiscalYear: number } {
// //     officerNo: string;
// //     fiscalYear: number;
// // }

// // interface FetchBillsDistributedParams {
// //     officerNo: string;
// //     fiscalYear: number;
// // }

// // interface FetchDecemberAmountParams {
// //     month: string;
// //     officerNo: string;
// //     fiscalYear: number;
// // }

// // export interface FiscalYear {
// //     fiscal_year: number;
// // }


// // interface PaymentsState {
    

// //     loading: boolean;
// //     error: string | null;
// // }

// // const initialState: PaymentsState = {
// //     JanuaryAmount: 0,
// //     FebruaryAmount: 0,
// //     MarchAmount: 0,
// //     AprilAmount: 0,
// //     MayAmount: 0,
// //     JuneAmount: 0,
// //     JulyAmount: 0,
// //     AugustAmount: 0,
// //     SeptemberAmount: 0,
// //     OctoberAmount: 0,
// //     NovemberAmount: 0,
// //     DecemberAmount: 0,

// //     loading: false,
// //     error: null,
// // };

// // interface CreateClientsServedParams {
// //     officerNo: string;
// //     fiscalYear: number;
// //     noOfClientsServed: number;
// //     valueOfBillsDistributed: number;
// //     JanuaryAmount: number;
// //     FebruaryAmount: number;
// //     MarchAmount: number;
// //     AprilAmount: number;
// //     MayAmount: number;
// //     JuneAmount: number;
// //     JulyAmount: number;
// //     AugustAmount: number;
// //     SeptemberAmount: number;
// //     OctoberAmount: number;
// //     NovemberAmount: number;
// //     DecemberAmount: number;
// //     totalReceiptToDate: number;
// //     balance: number;
// //     remarks: number;
// // }

// // const BASE_URL = import.meta.env.VITE_BASE_URL || 
// // (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// // const token = localStorage.getItem('token');

// // // Async thunk to create clients served
// // export const createClientsServed = createAsyncThunk<number, CreateClientsServedParams>(
// //     'officerAssessment/createClientsServed',
// //     async (params: CreateClientsServedParams): Promise<number> => {

// //         console.log('in createClientsServed thunk')
// //         const response = await apiClient.post(`${BASE_URL}/api/officerAssessment/create`, params, {
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${token}`,
// //             },
// //         });
// //         return response.data.totalClientsServed; // Adjust based on your API response
// //     }
// // );

// // // Async thunk to fetch the number of clients served
// // export const fetchClientsServed = createAsyncThunk<number, { officerNo: string; fiscalYear: number }>(
// //     'officerAssessment/fetchClientsServed',
// //     async ({ officerNo, fiscalYear }): Promise<number> => {
// //         console.log('in fetchClientsServed thunk')

// //         const response = await apiClient.get(`${BASE_URL}/api/buspayments/fetchClientsServed/${officerNo}/${fiscalYear}`);

// //         console.log('fetchClientsServed response: ', response)
// //         return response.data
// //     }
// // );

// // // Async thunk to fetch the value of bills distributed
// // export const fetchBillsDistributed = createAsyncThunk<number, FetchBillsDistributedParams>(
// //     'officerAssessment/fetchBillsDistributed',
// //     async ({ officerNo, fiscalYear }): Promise<number> => {

// //         console.log('in fetchBillsDistributed thunk')
        
// //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/billsDistributed/${officerNo}/${fiscalYear}`);
// //         return response.data;
// //     }
// // );



// // // Async thunk to fetch fiscal years    
// // export const fetchFiscalYears = createAsyncThunk<FiscalYear[], void>(
// //     'officerAssessment/fetchFiscalYears',
// //     async (): Promise<FiscalYear[]> => {
// //         console.log('in fetchFiscalYears thunk')
// //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/fiscalyears`); 

// //         console.log('fetchFiscalYears thunk response: ', response)
// //         return response.data; // Ensure this is an array
// //     }
// // );

// // // Async thunk to fetch fiscal years    
// // export const fetchOfficerAssessments = createAsyncThunk<FiscalYear[], void>(
// //     'officerAssessment/fetchOfficerAssessments',
// //     async (): Promise<FiscalYear[]> => {
// //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/all`); 
// //         return response.data.fiscalYears; // Ensure this is an array
// //     }
// // );

// // // // Async thunk to fetch amounts for each month
// // // export const fetchMonthlyAmount = createAsyncThunk<number, FetchMonthlyAmountParams>(
// // //     'officerAssessment/fetchMonthlyAmount',
// // //     async ({ month, officerNo, fiscalYear }): Promise<number> => {
// // //         console.log('in fetchMonthlyAmount thunk')
// // //         const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/monthlyAmount/${month}/${officerNo}/${fiscalYear}`);
// // //         return response.data.totalAmount;
// // //     }
// // // );

// // // December
// // // Async thunk for fetching December amount
// // export const fetchDecemberAmount = createAsyncThunk<number, FetchDecemberAmountParams>(
// //     'payments/fetchDecemberAmount',
// //     async ({ officerNo, fiscalYear }, { rejectWithValue }) => {
// //         try {
// //             const response = await apiClient.get(`${BASE_URL}/api/officerAssessment/December/${officerNo}/${fiscalYear}`);

// //             return response.data;
// //         } catch (error: any) {
// //             return rejectWithValue(error.message);
// //         }
// //     }
// // );

// // // Create slice
// // const dataSlice = createSlice({
// //     name: 'data',
// //     initialState: {
// //         clientsServed: null,
// //         billsDistributed: null,
// //         monthlyAmount: null,
// //         fiscalYears: [],
// //         loading: false,
// //         error: null,
// //     } as DataState,
// //     reducers: {
// //         resetData: (state) => {
// //             state.clientsServed = null;
// //             state.billsDistributed = null;
// //             state.monthlyAmount = null;
// //             state.fiscalYears = [];
// //             state.error = null;
// //         },
// //     },
// //     extraReducers: (builder) => {
// //         // Handle fetchClientsServed actions
// //         builder
// //             .addCase(fetchClientsServed.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchClientsServed.fulfilled, (state, action: PayloadAction<number>) => {
// //                 state.loading = false;
// //                 state.clientsServed = action.payload;
// //             })
// //             .addCase(fetchClientsServed.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch clients served';
// //             })
            
// //             // Handle fetchBillsDistributed actions
// //             .addCase(fetchBillsDistributed.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchBillsDistributed.fulfilled, (state, action: PayloadAction<number>) => {
// //                 state.loading = false;
// //                 state.billsDistributed = action.payload;
// //             })
// //             .addCase(fetchBillsDistributed.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch bills distributed';
// //             })
            
// //             // Handle fetchMonthlyAmount actions
// //             .addCase(fetchDecemberAmount.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchDecemberAmount.fulfilled, (state, action: PayloadAction<number>) => {
// //                 state.loading = false;
// //                 state.DecemberAmount = action.payload;
// //             })
// //             .addCase(fetchDecemberAmount.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch monthly amount';
// //             })
            
// //             // Handle fetchFiscalYears actions
// //             .addCase(fetchFiscalYears.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null;
// //             })
// //             .addCase(fetchFiscalYears.fulfilled, (state, action: PayloadAction<FiscalYear[]>) => {
// //                 state.loading = false;
// //                 state.fiscalYears = action.payload;
// //             })
// //             .addCase(fetchFiscalYears.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to fetch fiscal years';
// //             })
            
// //             // Handle createClientsServed actions
// //             .addCase(createClientsServed.pending, (state) => {
// //                 state.loading = true;
// //                 state.error = null; // Reset error on new request
// //             })
// //             .addCase(createClientsServed.fulfilled, (state, action) => {
// //                 state.loading = false;
// //                 state.clientsServed = action.payload; // Update state with the number of clients served
// //             })
// //             .addCase(createClientsServed.rejected, (state, action) => {
// //                 state.loading = false;
// //                 state.error = action.error.message || 'Failed to create clients served'; // Capture error message
// //             });
// //     },
// // });

// // // Exporting the reset action and the reducer
// // export const { resetData } = dataSlice.actions;
// // export default dataSlice.reducer;