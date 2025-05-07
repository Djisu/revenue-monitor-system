import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the Balance interface
export interface Balance {
    buss_no: number;
    buss_name: string;
    billamount: number;
    paidamount: number;
    balance: number;
    electroral_area: string;
    street_name: string;
}

// Define the initial state
export interface BalanceState {
    balances: Balance[];
    loading: boolean;
    error: string | null;
    data: Balance[] | null;
}

export const initialState: BalanceState = {
    balances: [],
    loading: false,
    error: null,
    data: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Create an async thunk for fetching balances
export const fetchBalances = createAsyncThunk<Balance[], void>(
    'balance/fetchBalances',
    async () => {
        console.log('in fetchBalances thunk')

        const response = await axios.get(`${BASE_URL}/api/balance/all`); // Replace with your actual API
        // Directly return response.data
        // if (!Array.isArray(response.data)) {
        //     throw new Error('Failed to fetch balances');
        // }
        console.log('response', response)
        return response.data.data as Balance[]; // Return the array of balances
    }
);




// Create the slice
const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        addBalance(state, action: PayloadAction<Balance>) {
            state.balances.push(action.payload);
        },
        updateBalance(state, action: PayloadAction<Balance>) {
            const index = state.balances.findIndex(balance => balance.buss_no === action.payload.buss_no);
            if (index !== -1) {
                state.balances[index] = action.payload;
            }
        },
        removeBalance(state, action: PayloadAction<number>) {
            state.balances = state.balances.filter(balance => balance.buss_no !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBalances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBalances.fulfilled, (state, action: PayloadAction<Balance[]>) => {
                state.loading = false;
                state.balances = action.payload;
                state.error = null;
            })
            .addCase(fetchBalances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch balances';
            });
    },
});

// Export actions
export const { addBalance, updateBalance, removeBalance } = balanceSlice.actions;

// Export reducer
export default balanceSlice.reducer;
