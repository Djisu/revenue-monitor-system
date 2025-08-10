// src/features/receipt/receiptSlice.ts
import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder, SerializedError  } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Receipt data
export interface ReceiptData {
    buss_no: string;
    receiptno: string;
    description: string;
    transdate: Date; // Adjust based on your date format
    amount: number;
    buss_name: string;
}

// Define the initial state for the slice
export interface ReceiptState {
    receipts: ReceiptData[];
    loading: boolean;
    error: string | null;
}

export const initialState: ReceiptState = {
    receipts: [],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;


// Async thunk to fetch all receipts
export const fetchReceipts = createAsyncThunk('receipt/fetchReceipts', async () => {
    const response = await axios.get(`${BASE_URL}/api/receipt`);
    return response.data;
});

// Async thunk to fetch a single receipt by buss_no and receiptno
export const fetchReceiptById = createAsyncThunk('receipt/fetchReceiptById', 
    async ({ buss_no, receiptno }: { buss_no: string; receiptno: string }) => {
    console.log('in fetchReceiptById: ', { buss_no, receiptno })

    const response = await axios.get(`${BASE_URL}/api/receipt/${buss_no}/${receiptno}`);   

    console.log('response.data: ', response.data) 
    return response.data;
});

// Async thunk to create a new receipt
export const createReceipt = createAsyncThunk('receipt/createReceipt', async (receiptData: ReceiptData) => {
    const response = await axios.post(`${BASE_URL}/api/receipt`, receiptData);
    return response.data;
});

// Async thunk to update a receipt
export const updateReceipt = createAsyncThunk('receipt/updateReceipt', async ({ buss_no, receiptno, receiptData }: { buss_no: string; receiptno: string; receiptData: ReceiptData }) => {
    const response = await axios.put(`${BASE_URL}/api/receipt/${buss_no}/${receiptno}`, receiptData);
    return response.data;
});

// Async thunk to delete a receipt
export const deleteReceipt = createAsyncThunk('receipt/deleteReceipt', async ({ buss_no, receiptno }: { buss_no: string; receiptno: string }) => {
    const response = await axios.delete(`${BASE_URL}/api/receipt/${buss_no}/${receiptno}`);
    return response.data;
});

// Create the slice
const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<ReceiptState>) => {
        builder
            .addCase(fetchReceipts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReceipts.fulfilled, (state: ReceiptState, action: PayloadAction<ReceiptData[]>) => {
                state.loading = false;
                state.receipts = action.payload;
                state.error = null;
            })
            .addCase(fetchReceipts.rejected, (state: ReceiptState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch receipts';
            })
            .addCase(fetchReceiptById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReceiptById.fulfilled, (state: ReceiptState, action: PayloadAction<ReceiptData[]>) => {
                state.loading = false;
                // Optionally handle the fetched receipt data
                state.receipts = action.payload
                state.error = null;
            })
            .addCase(fetchReceiptById.rejected, (state: ReceiptState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch receipt';
            })
            .addCase(createReceipt.pending, (state) => {
                state.loading = true;
            })
            .addCase(createReceipt.fulfilled, (state: ReceiptState, action: PayloadAction<ReceiptData[]>) => {
                state.loading = false;
                state.receipts = action.payload; // Add the new receipt
                state.error = null;
            })
            .addCase(createReceipt.rejected, (state: ReceiptState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create receipt';
            })
            .addCase(updateReceipt.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateReceipt.fulfilled, (state: ReceiptState, action: PayloadAction<ReceiptData>) => {
                state.loading = false;
                const index = state.receipts.findIndex(receipt => receipt.receiptno === action.payload.receiptno && receipt.buss_no === action.payload.buss_no);
                if (index !== -1) {
                    state.receipts[index] = action.payload; // Update the receipt
                }
                state.error = null;
            })
            .addCase(updateReceipt.rejected, (state: ReceiptState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {   
                state.loading = false;
                state.error = action.error.message || 'Failed to update receipt';
            })
            .addCase(deleteReceipt.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteReceipt.fulfilled, (state: ReceiptState, action: PayloadAction<ReceiptData>) => {
                state.loading = false;
                state.receipts = state.receipts.filter(receipt => !(receipt.receiptno === action.payload.receiptno && receipt.buss_no === action.payload.buss_no));
                state.error = null;
            })
            .addCase(deleteReceipt.rejected, (state: ReceiptState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete receipt';
            });
    },
});

// Export the reducer
export default receiptSlice.reducer;
