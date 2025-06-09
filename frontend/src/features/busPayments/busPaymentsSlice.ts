// src/features/busPayments/busPaymentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';

// Define the type for BusPayments data
export interface BusPaymentsData {
    buss_no: string;
    officer_no: string;
    paidAmount: number;
    paidamount?: number;
    monthpaid: string;
    transdate: string;
    fiscal_year: string;
    ReceiptNo: string;
    email: string;
    electroral_area: string;
}

// Define the initial state for the slice
export interface BusPaymentsState {
    busPayments: BusPaymentsData[];
    loading: boolean;
    error: string | null;
    billedAmount: number;
    receiptValidationMessage?: string; // Add this new property
}

export interface BillData {
    bussNo: number;
    amount: number;
  }

export const initialState: BusPaymentsState = {
    busPayments: []  as BusPaymentsData[],
    loading: false,
    error: null,
    billedAmount: 0,
    receiptValidationMessage: undefined // Initialize it
};

export interface FetchDailyPaymentsArgs {
    firstDate: Date;
    lastDate: Date;
    electoralarea: string;
    bussType: string;
}

interface FetchParams {
    fiscalyear: string;
    receiptno: string;
    batchno: string;
}


const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://revenue-monitor-system.onrender.com');

export const selectBusPayments = (state: RootState) => state.busPayments.busPayments;

// Async thunk to fetch all BusPayments records
export const fetchPaymentDefaulters = createAsyncThunk('busPayments/fetchPaymentDefaulters', async (electoralarea: string) => {
    console.log('in fetchPaymentDefaulters slice', electoralarea)

    const response = await axios.get(`${BASE_URL}/api/busPayments/defaulters/${electoralarea}`);
    
    if (response.status >= 200 && response.status < 300) {
        console.log('fetchPaymentDefaulters fulfilled::: ', response.data.data);
        return response.data; // Return the correct data
    } else {
        throw new Error(`Error fetching bus payment. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Async thunk to fetch all BusPayments records
export const fetchBusPayments = createAsyncThunk('busPayments/fetchBusPayments', async () => {
    const response = await axios.get(`${BASE_URL}/api/busPayments`);
    return response.data;
});

export const fetchTransSavings = createAsyncThunk('busPayments/fetchBusPayments', async () => {
    const response = await axios.get(`${BASE_URL}/api/busPayments/transsavings`);
    
    console.log('response data', response.data);

    if (response.status >= 200 && response.status < 300) {
        console.log('fetchBusPayments fulfilled::: ', response.data.data);
        return response.data.data; // Return the correct data
    } else {
        throw new Error(`Error fetching bus payment. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Async thunk to create a new BusPayments record
export const createBusPayment = createAsyncThunk('busPayments/createBusPayment', async (data: BusPaymentsData) => {
    console.log('createBusPayment slice', data);

     // Call the API to create a new business
     try {
        const response = await axios.post(
            `${BASE_URL}/api/busPayments/create`,
            data,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        console.log('AFTER APIresponse data', response.data.message);

        if (response.status >= 200 && response.status < 300) {
            console.log('response.data: ', response.data);
            // Ensure response.data is an array
            //return Array.isArray(response.data) ? response.data : []; //
            return response.data // This data will be available as `action.payload`
        } else {
            throw new Error(`Error fetching business client payment. Status: ${response.status} - Error: ${response.statusText}`);
        }           
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to create business');
        }
        throw new Error('Network error or other issue');
    }
});


// Async thunk to fetch a single BusPayments record by buss_no
export const fetchBilledAmount = createAsyncThunk('busPayments/fetchBilledAmount', async (buss_no: string) => {
    console.log('in fetchBilledAmount slice', buss_no);

    const bussNo = parseInt(buss_no)
    
    const response = await axios.get(`${BASE_URL}/api/busPayments/billedAmount/${bussNo}`);
    console.log('response data', response.data);

    if (response.status >= 200 && response.status < 300) {
        console.log('busPayments fulfilled::: ', response.data.billedAmount)    ;
       
        return response.data.billedAmount || 0;   
    }else {
        throw new Error(`Error fetching bus payment. Status: ${response.status} - Error: ${response.statusText}`);
    }    
});

// Async thunk to fetch a single BusPayments record by buss_no
export const fetchBusPaymentByBussNo = createAsyncThunk('busPayments/fetchBusPaymentByBussNo', 
async (buss_no: string) => {
   
    const response = await axios.get(`${BASE_URL}/api/busPayments/${buss_no}`);

    if (response.status >= 200 && response.status < 300) {
        console.log('busPayments fulfilled::: ', response.data);
        // Ensure response.data is an array
        return Array.isArray(response.data) ? response.data : []; //        
    } else {
        throw new Error(`Error fetching bus payment. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Async thunk to fetch a single BusPayments record by buss_no
export const fetchBusPaymentByElectoralArea = createAsyncThunk('busPayments/fetchBusPaymentByElectoralArea', async (electoralArea: string) => {
    console.log('in fetchBusPaymentByElectoralArea: ', electoralArea)

    console.log('BASE_URL: ', BASE_URL)

    const response = await axios.post(`${BASE_URL}/api/busPayments/${electoralArea}`);

    // Check if data found
    if (response.data.data.length > 0){
        console.log('Data found: ', response.data.data)
    }else{
        console.log('No data fetched')
    }

    if (Array.isArray(response.data.data)) {
        console.log('fetchBusPaymentByElectoralArea fulfilled::: ', response.data.data);
        // Ensure response.data is an array 
        return Array.isArray(response.data.data) ? response.data.data : []; //
    }
});

// Async thunk to fetch a single BusPayments record by buss_no
export const fetchBusPaymentByPaymentDate = createAsyncThunk('busPayments/fetchBusPaymentByPaymentDate', async (payment_date: Date) => {
    const response = await axios.get(`${BASE_URL}/api/busPayments/${payment_date}`);
    return response.data;
});

export const fetchBusPaymentByTwoDates = createAsyncThunk('busPayments/fetchBusPaymentByTwoDates', 
   async ({ bussNo, startDate, endDate }: { bussNo: string; startDate: Date; endDate: Date }) => {

    console.log('in fetchBusPaymentByTwoDates slice', bussNo, startDate, endDate)

    // You can format the dates as strings or pass them in a way your API expects
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const response = await axios.get(`${BASE_URL}/api/busPayments/getpayments/${bussNo}/${formattedStartDate}/${formattedEndDate}`);

    console.log('response data', response.data);
    if (response.status >= 200 && response.status < 300) {
        console.log('busPayments fulfilled::: ', response.data.data);
        return response.data.data; // Return the correct data
    } else {
        throw new Error(`Error fetching bus payment. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Async thunk to update a BusPayments record
export const updateBusPayment = createAsyncThunk(
    'busPayments/updateBusPayment',
    async ({ buss_no, data }: { buss_no: string; data: BusPaymentsData }) => {
        const response = await axios.put(`${BASE_URL}/api/busPayments/${buss_no}`, data);
        return response.data;
    }
);

// Async thunk to delete a BusPayments record
export const deleteBusPayment = createAsyncThunk('busPayments/deleteBusPayment', async (buss_no: string) => {
    const response = await axios.delete(`${BASE_URL}/api/busPayments/${buss_no}`);
    return response.data;
});

// Newly added actions
// Async thunk to fetch all BusinessType records
export const billAllBusinesses = createAsyncThunk(
    'businessType/billAllBusinesses',
    async (_, { rejectWithValue }) => {
        console.log('inside billAllBusinesses thunk');
        
        try {
            const response = await axios.post(`${BASE_URL}/api/busPayments/billallbusinesses`);
            
            console.log('after billallbusinesses thunk, Response data:', response.data);
            
            if (response.status >= 200 && response.status < 300) {
                console.log('billallbusinesses thunk, response data:', response.data);
                return response.data; // This data will be available as `action.payload`
            } else {
                return rejectWithValue(`Error fetching business types: ${response.statusText}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error){
               console.error('Error in billAllBusinesses thunk:', error);
               return rejectWithValue(`Error fetching business types: ${error.message}`);
            }
            console.error('Unknown error in billAllBusinesses thunk:', error);
            return rejectWithValue('Unknown error');
        }
    }
);


export const billOneBusiness = createAsyncThunk('businessType/billoneBusiness', async (bussNo: number) => {
    console.log('inside billOneBusiness thunk');

    const response = await axios.post(
        `${BASE_URL}/api/busPayments/billonebusiness/${bussNo}`,
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );

    console.log('after billonebusiness thunk, Response data:', response.data)

    if (response.status >= 200 && response.status < 300) {
        console.log('billonebusiness thunk, response data:', response.data);

        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error billing one business types: ${response.statusText}`);
    }
});

export const fetchDailyPayments = createAsyncThunk('businessType/dailypayments', async (args: FetchDailyPaymentsArgs) => {
    console.log('inside fetchDailyPayments thunk');

    const { firstDate, lastDate, electoralarea, bussType } = args;

    // Format the dates to YYYY-MM-DD
    const formattedFirstDate = new Date(firstDate).toISOString().split('T')[0];
    const formattedLastDate = new Date(lastDate).toISOString().split('T')[0];

    console.log('formattedFirstDate:', formattedFirstDate, 'formattedLastDate:', formattedLastDate);

    try {
        const response = await axios.get(
            `${BASE_URL}/api/busPayments/dailypayments/${formattedFirstDate}/${formattedLastDate}/${electoralarea}/${bussType}`,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        console.log('after fetchDailyPayments thunk, Response data:', response.data);

        if (response.status >= 200 && response.status < 300) {
            console.log('fetchDailyPayments thunk, response data.data:', response.data.data);
            return response.data.data; 
        } else {
            throw new Error(`Error fetching one business types: ${response.statusText}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message.toUpperCase()); // ✅ Safe
        }
    }
});

export const fetchFiscalyearReceiptno = createAsyncThunk(
    'businessType/fetchFiscalyearReceiptno',
    async ({ fiscalyear, receiptno, batchno }: FetchParams) => {
        try {
            console.log('inside fetchFiscalyearReceiptno thunk');

            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
            
            console.log('fiscalyear: ', fiscalyear);
            console.log('receiptno: ', receiptno)
        
            if (!batchno){
                console.log('No batch found')
            }
            console.log('batchno: ', batchno)

            // get year from system date
            const year = fiscalyear.split('-')[0];
            fiscalyear = year;

            console.log('fiscalyear: ', fiscalyear)

            const response = await axios.get(
                `${BASE_URL}/api/busPayments/${fiscalyear}/${receiptno}/${batchno}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            console.log('response text:', response.data.message);

            if (response.status >= 200 && response.status < 300) {
                console.log('fetchFiscalyearReceiptno thunk:', response.data.message);
                return response.data.message;
            } else {
                throw new Error(`Error fetching receipt validation: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error in fetchFiscalyearReceiptno thunk:', error);
            throw error;
        }
    }
);

// Create the slice 
const busPaymentsSlice = createSlice({
    name: 'busPayments',
    initialState,
    reducers: {
        setBusPayments: (state, action: PayloadAction<BusPaymentsData[]>) => {
            state.busPayments = action.payload;
        },
        addBusPayment: (state, action: PayloadAction<BusPaymentsData>) => {
            state.busPayments.push(action.payload);
        },
      
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setBilledAmount: (state, action) => {
            state.billedAmount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(billAllBusinesses.pending, (state) => {
                state.loading = true;
            })
            .addCase(billAllBusinesses.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments.push(...action.payload); // Add the new business
                state.error = null;
            })
            .addCase(billAllBusinesses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create BusPayments record';
            })
            .addCase(fetchBilledAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBilledAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.billedAmount = action.payload;
                state.error = null;
            })
            .addCase(fetchBilledAmount.rejected, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchBusPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments = action.payload;
                state.error = null;
            })
            .addCase(fetchBusPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments records';
            })
            .addCase(createBusPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBusPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments.push(action.payload); // Add the new business
                state.error = null;
            })
            .addCase(createBusPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create BusPayments record';
            })
            .addCase(fetchBusPaymentByBussNo.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusPaymentByBussNo.fulfilled, (state, action) => {
                state.loading = false;
                action.payload.forEach(payment => state.busPayments.push(payment)); // Add each BusPayments record
                state.error = null;
            })
            .addCase(fetchBusPaymentByBussNo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments record';
            })
            .addCase(fetchBusPaymentByElectoralArea.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusPaymentByElectoralArea.fulfilled, (state, action) => {     
                state.loading = false;
                if (action.payload && Array.isArray(action.payload)) {
                    state.busPayments.push(...action.payload); // Use spread operator if payload is an array
                }
                state.error = null;
            })
            .addCase(fetchBusPaymentByElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments record';
            })
            .addCase(fetchBusPaymentByPaymentDate.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusPaymentByPaymentDate.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments.push(action.payload); // Add the new BusPayments record
                state.error = null;
            })
            .addCase(fetchBusPaymentByPaymentDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments record';
            })
            .addCase(fetchBusPaymentByTwoDates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusPaymentByTwoDates.fulfilled, (state, action) => {
                state.loading = false;
                state.busPayments.push(...action.payload); // Add the new BusPayments record
                state.error = null;
            })
            .addCase(fetchBusPaymentByTwoDates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments record';
            })
            .addCase(updateBusPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBusPayment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.busPayments.findIndex(busPayment => busPayment.buss_no === action.payload.buss_no);
                if (index !== -1) {
                    state.busPayments[index] = action.payload; // Update the existing BusPayments record
                }
                state.error = null;
            })
            .addCase(updateBusPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update BusPayments record';
            })
            .addCase(deleteBusPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBusPayment.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted BusPayments record from the state   
                state.busPayments = state.busPayments.filter(busPayment => busPayment.buss_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteBusPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete BusPayments record';
            })
            .addCase(fetchFiscalyearReceiptno.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFiscalyearReceiptno.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                // Don't push the string to busPayments array
                // Instead, we can store it in a new state property or just use it in the component
                state.error = null;
                // If you need to store the message somewhere, add a new property to your state interface
                // and store it there, for example:
                 // Store the message in a new state property if needed
                 state.receiptValidationMessage = action.payload;
            })
            .addCase(fetchFiscalyearReceiptno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch BusPayments record';
            })
    },
});

// Export the actions if needed
export const { setBusPayments, addBusPayment, setLoading, setError } = busPaymentsSlice.actions;
export default busPaymentsSlice.reducer;