// src/features/accReceipt/accReceiptSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for AccReceipt data
export interface AccReceiptData {
    fiscalyear: number;
    batchno: string;
    firstno: number;
    lastno: number;
}

// Define the initial state for the slice
interface AccReceiptState {
    accReceipts: AccReceiptData[];
    loading: boolean;
    error: string | null;
}

const initialState: AccReceiptState = {
    accReceipts: [],
    loading: false,
    error: null,
};


const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');



// Async thunk to fetch all AccReceipts
export const fetchAccReceipts = createAsyncThunk('accReceipts/fetchAccReceipts', async () => {
    console.log('in fetchAccReceipts')

    const response = await axios.get(`${BASE_URL}/api/accReceipts/all`);

    console.log('in fetchAccReceipts after response: ', response.data.data)

    console.log(response.data)
    return response.data
});

// Async thunk to create a new AccReceipt
export const createAccReceipt = createAsyncThunk('accReceipts/createAccReceipt', async (data: AccReceiptData) => {
    try {
        console.log('in createAccReceipt')
        const response = await axios.post(`${BASE_URL}/api/accReceipts/create`, data); 

        console.log('in createAccReceipt after response: ', response.data.data)
        return response.data.data;
    } catch (error) {
        console.log('in createAccReceipt error: ', error)
        throw error; // Rethrow the error to be caught in the slice
    }
   
});

// Async thunk to fetch a single AccReceipt
export const fetchAccReceiptById = createAsyncThunk('accReceipts/fetchAccReceiptById', async ({ batchno, fiscalyear }: { batchno: string; fiscalyear: string; }) => {
    const response = await axios.get(`${BASE_URL}/api/accReceipts/${batchno}/${fiscalyear}`);
    return response.data.data;
});

// Async thunk to update an AccReceipt
export const updateAccReceipt = createAsyncThunk('accReceipts/updateAccReceipt', async ({ batchno, data }: { batchno: string; data: AccReceiptData }) => {
    const response = await axios.put(`${BASE_URL}/api/accReceipts/${batchno}`, data);
    return response.data.data;
});

// Async thunk to delete an AccReceipt
export const deleteAccReceipt = createAsyncThunk('accReceipts/deleteAccReceipt', async ({ batchno, fiscalyear }: { batchno: string; fiscalyear: number }) => {
    const response = await axios.delete(`${BASE_URL}/api/accReceipts/${batchno}/${fiscalyear}`);
    return response.data;
});

// Create the slice
const accReceiptSlice = createSlice({
    name: 'accReceipts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccReceipts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAccReceipts.fulfilled, (state, action) => {
                state.loading = false;
                state.accReceipts = action.payload;
                state.error = null;
            })
            .addCase(fetchAccReceipts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch AccReceipts';
            })
            .addCase(createAccReceipt.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAccReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.accReceipts = action.payload; // Add the new receipt to the list
                state.error = null;
            })
            .addCase(createAccReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create AccReceipt';
            })
            .addCase(fetchAccReceiptById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAccReceiptById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single receipt as needed
                state.error = null;
            })
            .addCase(fetchAccReceiptById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch AccReceipt';
            })
            .addCase(updateAccReceipt.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAccReceipt.fulfilled, (state, action) => {
                state.loading = false;
                // Update the receipt in the state
                const index = state.accReceipts.findIndex(receipt => receipt.batchno === action.payload.batchno);
                if (index !== -1) {
                    state.accReceipts[index] = action.payload; // Replace with updated data
                }
                state.error = null;
            })
            .addCase(updateAccReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update AccReceipt';
            })
            .addCase(deleteAccReceipt.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAccReceipt.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted receipt from the state
                state.accReceipts = state.accReceipts.filter(receipt => 
                    !(receipt.batchno === action.meta.arg.batchno && receipt.fiscalyear === action.meta.arg.fiscalyear)
                );
                state.error = null;
            })
            .addCase(deleteAccReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete AccReceipt';
            });
    },
});

// Export the actions if needed
export const {
    // You can add any synchronous actions here if required
} = accReceiptSlice.actions;

// Export the reducer
export default accReceiptSlice.reducer;