// src/features/operator/operatorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Define the type for Operator data
export interface OperatorData {
    operatorid: string;
    operatorname: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
}

// Define the initial state for the slice
export interface OperatorState {
    operators: OperatorData[];
    loading: boolean;
    error: string | null;
}

export interface ApiResponse {
    message: string;
}


export const initialState: OperatorState = {
    operators: [],
    loading: false,
    error: null
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Function to get headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Async thunk to fetch all operators
export const fetchOperators = createAsyncThunk('operator/fetchOperators', async () => {
    const response = await axios.get(`${BASE_URL}/api/operatorDefinition/all`, getAuthHeaders());
    if (response.status !== 200) {
        throw new Error('Failed to fetch operators');
    }
    return Array.isArray(response.data) ? response.data : [response.data];
});

// Async thunk to fetch a single operator by OperatorID
export const fetchOperatorById = createAsyncThunk('operator/fetchOperatorById', async (OperatorID: string) => {
    const response = await axios.get(`${BASE_URL}/api/operatorDefinition/${OperatorID}`, getAuthHeaders());
    return response.data;
});

// Async thunk to create a new operator
export const createOperator = createAsyncThunk<string, OperatorData>(
    'operator/createOperator',
    async (operatorData: OperatorData) => {
        console.log('in createOperator slice')

        const response: AxiosResponse<ApiResponse> = await axios.post(
            `${BASE_URL}/api/operatorDefinition/create`,
            operatorData,
            getAuthHeaders()
        );
        return response.data.message; // Return only the message from the response
    }
);

// Async thunk to update an operator
export const updateOperator = createAsyncThunk('operator/updateOperator', async (
    { OperatorID, operatorData }: { OperatorID: string; operatorData: OperatorData }
) => {
    const response = await axios.put(`${BASE_URL}/api/operatorDefinition/${OperatorID}`, operatorData, getAuthHeaders());
    return response;
});

// Async thunk to delete an operator
export const deleteOperator = createAsyncThunk('operator/deleteOperator', async (OperatorID: string) => {
    const response = await axios.delete(`${BASE_URL}/api/operatorDefinition/${OperatorID}`, getAuthHeaders());
    return response;
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
            .addCase(fetchOperatorById.fulfilled, (state, action) => {
                state.loading = false;
                state.operators.push(action.payload);
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
                // Handle the message returned from the API
                console.log(action.payload); // Log success message
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
                const index = state.operators.findIndex(operator => operator.operatorid === action.payload.data.operatorid);
                if (index !== -1) {
                    state.operators[index] = action.payload.data; // Update the operator
                }
                console.log(action.payload.data.message); // Log success message
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
                state.operators = state.operators.filter(operator => operator.operatorid !== action.meta.arg);
                state.error = null;
                console.log(action.payload.data.message); // Log success message
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


























// // src/features/operator/operatorSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Define the type for Operator data
// interface OperatorData {
//     OperatorID: string;
//     OperatorName: string;
//     password: string;
//     firstname: string;
//     lastname: string;
// }

// // Define the initial state for the slice
// interface OperatorState {
//     operators: OperatorData[];
//     loading: boolean;
//     error: string | null;
// }

// const initialState: OperatorState = {
//     operators: [],
//     loading: false,
//     error: null,
// };


// const BASE_URL = import.meta.env.VITE_BASE_URL || 
// (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// // Async thunk to fetch all operators
// export const fetchOperators = createAsyncThunk('operator/fetchOperators', async () => {

//     console.log('in fetchOperators slice');
//     const response = await axios.get(`${BASE_URL}/api/operatorDefinition/all`);

//     if (response.status!== 200){
//         throw new Error('Failed to fetch operators');
//     }

//     const data = Array.isArray(response.data) ? response.data : [response.data];
//     return data;
// });

// // Async thunk to fetch a single operator by OperatorID
// export const fetchOperatorById = createAsyncThunk('operator/fetchOperatorById', async (OperatorID: string) => {
//     const response = await axios.get(`${BASE_URL}/api/operatorDefinition/${OperatorID}`);

//     console.log(response.data);
//     return response.data;
// });

// // Async thunk to create a new operator
// export const createOperator = createAsyncThunk('operator/createOperator', async (operatorData: OperatorData) => {
//     const response = await axios.post(`${BASE_URL}/api/operatorDefinition`, operatorData);
//     return response.data;
// });

// // Async thunk to update an operator
// export const updateOperator = createAsyncThunk('operator/updateOperator', async (
//       { OperatorID, operatorData }: { OperatorID: string; operatorData: OperatorData }
//     ) => {
//     const response = await axios.put(`${BASE_URL}/api/operatorDefinition/${OperatorID}`, operatorData);
//     return response.data;
// });

// // Async thunk to delete an operator
// export const deleteOperator = createAsyncThunk('operator/deleteOperator', async (OperatorID: string) => {
//     const response = await axios.delete(`${BASE_URL}/api/operatorDefinition/${OperatorID}`);
//     return response.data;
// });

// // Create the slice
// const operatorDefinitionSlice = createSlice({
//     name: 'operator',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchOperators.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperators.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operators = action.payload;
//                 state.error = null;
//             })
//             .addCase(fetchOperators.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operators';
//             })
//             .addCase(fetchOperatorById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperatorById.fulfilled, (state, action) => {
//                 state.loading = false;
//                 // Handle the fetched operator data if needed
//                 state.operators.push(action.payload); // Add the new operator
//                 state.error = null;
//             })
//             .addCase(fetchOperatorById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operator';
//             })
//             .addCase(createOperator.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createOperator.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operators.push(action.payload); // Add the new operator
//                 state.error = null;
//             })
//             .addCase(createOperator.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create operator';
//             })
//             .addCase(updateOperator.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(updateOperator.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.operators.findIndex(operator => operator.OperatorID === action.payload.OperatorID);
//                 if (index !== -1) {
//                     state.operators[index] = action.payload; // Update the operator
//                 }
//                 state.error = null;
//             })
//             .addCase(updateOperator.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to update operator';
//             })
//             .addCase(deleteOperator.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deleteOperator.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operators = state.operators.filter(operator => operator.OperatorID !== action.meta.arg);
//                 state.error = null;
//             })
//             .addCase(deleteOperator.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to delete operator';
//             });
//     },
// });

// // Export the actions if needed
// export const {} = operatorDefinitionSlice.actions; // Add any synchronous actions if required

// // Export the reducer
// export default operatorDefinitionSlice.reducer;