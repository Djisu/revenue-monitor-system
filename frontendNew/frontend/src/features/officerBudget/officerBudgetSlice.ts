import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utilities/apiClient';
import axios from 'axios';

// Define the initial state
export interface OfficerBudgetState {
    data: any[] | null;
    loading: boolean;
    error: string | null;
    exists: boolean;
}

const initialState: OfficerBudgetState = {
    data: [],
    loading: false,
    error: null,
    exists: false,
};



interface AddBudgetPayload {
    officer_no: string;
    fiscal_year: number;
}


const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Async thunk to fetch officer budget data
export const fetchOfficerBudget = createAsyncThunk(
    'officerBudget/fetchOfficerBudget',
    async ({ officer_no, fiscal_year }: { officer_no: string; fiscal_year: number; }) => {

        console.log('in fetchOfficerBudget thunk')

        const response = await apiClient.get(`${BASE_URL}/api/officerbudget/${officer_no}/${fiscal_year}`);

        console.log('response data: ', response.data)

        if (response.status!== 200){
            throw new Error('Failed to fetch officer budget');
        }
        return {
            exists: response.data.exists, // Include exists from the API response
            data: response.data.data,      // Include only the data part
            status: response.status,
            statusText: response.statusText,
        };
    }
);
// Async thunk to fetch officer budget data
export const fetchOfficerBudgetAll = createAsyncThunk(
    'officerBudget/fetchOfficerBudgetAll',
    async (_, thunkAPI) => {
        try {
            console.log('in fetchOfficerBudgetAll thunk');
             const response = await apiClient.get(`${BASE_URL}/api/OfficerBudget/all`);
            // response = await axios.get(`${BASE_URL}/api/OfficerBudget/all`);

            if (response.status !== 200) {
                throw new Error('Failed to fetch officer budgets');
            }
            return response.data; // Return the data from the response
        } catch (error: any) {
            console.error('Error fetching officer budgets:', error);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to add a budget record
export const addBudget = createAsyncThunk(
    'budget/addBudget',
    async (budgetData: AddBudgetPayload) => {
        console.log('in addBudget thunk');

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Define headers with Authorization
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        };

        // Make the POST request with headers
        const response = await axios.post(`${BASE_URL}/api/officerbudget/addBudget`, budgetData, { headers });

        if (response.status !== 200) {
            throw new Error('Failed to add budget');
        }
        
        return response.data.data; // Access the new data structure
    }
);
// // Async thunk to update a budget record
// export const updateBudget = createAsyncThunk(
//     'budget/updateBudget',
//     async (budgetData: any) => {
//         const response = await axios.put(`${BASE_URL}/api/updateBudget`, budgetData);

//         if (response.status!== 200) {
//             throw new Error('Failed to add budget');
//         }

//         return response.data; // Assuming the server returns a success message
//     }
// );

// Create the budget slice
const officerBudgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        resetBudgetState: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.exists = false;
        },
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBudget.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    if (state.data) {
                        state.data.push(action.payload); // Add the new budget to the state
                    } else {
                        state.data = [action.payload]; // Initialize the array if it's null
                    }
                }
            })
            .addCase(addBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add budget';
            })
            .addCase(fetchOfficerBudgetAll.pending, (state) => {
                state.error = null; // Reset error on new fetch
            })
            .addCase(fetchOfficerBudgetAll.fulfilled, (state, action) => {
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchOfficerBudgetAll.rejected, (state, action) => {
                state.error = action.error.message ?? 'Failed to fetch officer budget';
            });

            // .addCase(updateBudget.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(updateBudget.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.data = action.payload.data || null; // Set data to the response data
            //     state.exists = action.payload.exists; // Set exists based on the response
            //     // Update the existing budget in the state
            //     // if (state.data) {
            //     //     const index = state.data.findIndex(b => b.officer_no === action.payload.officer_no && b.fiscal_year === action.payload.fiscal_year);
            //     //     if (index !== -1) {
            //     //         state.data[index] = { ...state.data[index], ...action.payload };
            //     //     }
            //     // }
                
            // })
            // .addCase(updateBudget.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message || 'Failed to fetch officer budget';
            //     state.exists = false; // Set exists to false on error
            // });
    },
});

// Export actions and reducer
export const { resetError, resetBudgetState } = officerBudgetSlice.actions;
export default officerBudgetSlice.reducer;