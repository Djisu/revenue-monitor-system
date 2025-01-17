// src/features/operator/operatorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Operator data
interface OperatorData {
    OperatorID: string;
    OperatorName: string;
    password: string;
    firstname: string;
    lastname: string;
}

// Define the initial state for the slice
interface OperatorState {
    operators: OperatorData[];
    loading: boolean;
    error: string | null;
}

const initialState: OperatorState = {
    operators: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all operators
export const fetchOperators = createAsyncThunk('operator/fetchOperators', async () => {
    const response = await axios.get('/api/operator');
    return response.data;
});

// Async thunk to fetch a single operator by OperatorID
export const fetchOperatorById = createAsyncThunk('operator/fetchOperatorById', async (OperatorID: string) => {
    const response = await axios.get(`/api/operator/${OperatorID}`);
    return response.data;
});

// Async thunk to create a new operator
export const createOperator = createAsyncThunk('operator/createOperator', async (operatorData: OperatorData) => {
    const response = await axios.post('/api/operator', operatorData);
    return response.data;
});

// Async thunk to update an operator
export const updateOperator = createAsyncThunk('operator/updateOperator', async ({ OperatorID, operatorData }: { OperatorID: string; operatorData: OperatorData }) => {
    const response = await axios.put(`/api/operator/${OperatorID}`, operatorData);
    return response.data;
});

// Async thunk to delete an operator
export const deleteOperator = createAsyncThunk('operator/deleteOperator', async (OperatorID: string) => {
    const response = await axios.delete(`/api/operator/${OperatorID}`);
    return response.data;
});

// Create the slice
const operatorDefinitionSlice = createSlice({
    name: 'operator',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOperators.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOperators.fulfilled, (state, action) => {
                state.loading = false;
                state.operators = action.payload;
                state.error = null;
            })
            .addCase(fetchOperators.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operators';
            })
            .addCase(fetchOperatorById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOperatorById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched operator data if needed
                state.error = null;
            })
            .addCase(fetchOperatorById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operator';
            })
            .addCase(createOperator.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOperator.fulfilled, (state, action) => {
                state.loading = false;
                state.operators.push(action.payload); // Add the new operator
                state.error = null;
            })
            .addCase(createOperator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create operator';
            })
            .addCase(updateOperator.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOperator.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.operators.findIndex(operator => operator.OperatorID === action.payload.OperatorID);
                if (index !== -1) {
                    state.operators[index] = action.payload; // Update the operator
                }
                state.error = null;
            })
            .addCase(updateOperator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update operator';
            })
            .addCase(deleteOperator.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOperator.fulfilled, (state, action) => {
                state.loading = false;
                state.operators = state.operators.filter(operator => operator.OperatorID !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteOperator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete operator';
            });
    },
});

// Export the actions if needed
export const {} = operatorDefinitionSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default operatorDefinitionSlice.reducer;