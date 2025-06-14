import {createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder, SerializedError  } from '@reduxjs/toolkit';
import axios from 'axios';
import  {OperatorPermissionData} from './OperatorPermissionData';

// // Define the type for OperatorPermission data
// export interface OperatorPermissionData {
//     OperatorID: string;
//     Menus: string;
//     Reports: string;
//     databasesx: string;
//     password: string;
// }

// Define the initial state for the slice
export interface OperatorPermissionState {
    operatorPermissions: OperatorPermissionData[];
    loading: boolean;
    error: string | null;
}

export const initialState: OperatorPermissionState = {
    operatorPermissions: [],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL ||
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Function to get authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
};

// Async thunk to fetch all operator permissions
export const fetchOperatorPermissionsThunk = createAsyncThunk('operatorPermission/fetchOperatorPermissions', async () => {
    const response = await axios.get(`${BASE_URL}/api/operatorPermissions/all`, getAuthHeaders());
    
    if (response.status !== 200) {
        throw new Error('Failed to fetch operators');
    }

    console.log('API Response:', response.data); // Log the response data
    return response.data.data; // Access data from the Axios response
});

// Async thunk to fetch a single operator permission by OperatorID
export const fetchOperatorPermissionById = createAsyncThunk('operatorPermission/fetchOperatorPermissionById', async (OperatorID: string) => {
    const response = await axios.get(`${BASE_URL}/api/operatorPermissions/${OperatorID}`, getAuthHeaders());
    return response.data;
});

// Async thunk to create a new operator permission
export const createOperatorPermission = createAsyncThunk(
    'operatorPermission/createOperatorPermission',
    async (operatorPermissionData: OperatorPermissionData) => {
        console.log('in createOperatorPermission thunk')
      
        try {
            const response = await axios.post(`${BASE_URL}/api/operatorPermissions/create`, operatorPermissionData, getAuthHeaders());
            return response.data; // Return the whole response object
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Unknown error occurred';
                throw new Error(message);
              } else {
                throw error;
              }
           
        }
    }
);

// Async thunk to update an operator permission
export const updateOperatorPermission = createAsyncThunk('operatorPermission/updateOperatorPermission', async (
    { OperatorID, operatorPermissionData }: { OperatorID: string; operatorPermissionData: OperatorPermissionData }
) => {
    const response = await axios.put(`${BASE_URL}/api/operatorPermissions/${OperatorID}`, operatorPermissionData, getAuthHeaders());

    return response.data;
});

// Async thunk to delete an operator permission
export const deleteOperatorPermission = createAsyncThunk('operatorPermission/deleteOperatorPermission', async (operatorID: string) => {
    const response = await axios.delete(`${BASE_URL}/api/operatorPermissions/${operatorID}`, getAuthHeaders());
    return response.data;
});

// Create the slice
const operatorPermissionSlice = createSlice({
    name: 'operatorPermission',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<OperatorPermissionState>) => {
        builder
            .addCase(fetchOperatorPermissionsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOperatorPermissionsThunk.fulfilled, (state: OperatorPermissionState, action: PayloadAction<OperatorPermissionData[]>) => {
                state.loading = false;
                state.operatorPermissions = action.payload;
                state.error = null;
            })
            .addCase(fetchOperatorPermissionsThunk.rejected, (state: OperatorPermissionState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operator permissions';
            })
            .addCase(fetchOperatorPermissionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOperatorPermissionById.fulfilled, (state: OperatorPermissionState, action: PayloadAction<OperatorPermissionData> ) => {
                state.loading = false;
                // Handle the fetched operator permission data if needed
                state.operatorPermissions.push(action.payload);
                state.error = null;
            })
            .addCase(fetchOperatorPermissionById.rejected, (state: OperatorPermissionState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch operator permission';
            })
            .addCase(createOperatorPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOperatorPermission.fulfilled, (state: OperatorPermissionState, action: PayloadAction<OperatorPermissionData> ) => {
                state.loading = false;
                // Assuming the action.payload contains the message
                state.error = null; // Clear error on successful creation
                // Optionally, you can log or handle the success message
                console.log(action.payload.message); // Success message from the API
                // If you want to fetch the updated list of permissions after creation, you could do that here
            })
            .addCase(createOperatorPermission.rejected, (state: OperatorPermissionState, action: PayloadAction<unknown, string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create operator permission';
            })
            .addCase(updateOperatorPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOperatorPermission.fulfilled, (state: OperatorPermissionState, action: PayloadAction<OperatorPermissionData> ) => {
                state.loading = false;
                const index = state.operatorPermissions.findIndex(permission => permission.operatorid === action.payload.operatorid);
                if (index !== -1) {
                    state.operatorPermissions[index] = action.payload; // Update the operator permission
                }
                state.error = null;
            })
            .addCase(updateOperatorPermission.rejected, (state: OperatorPermissionState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update operator permission';
            })
            .addCase(deleteOperatorPermission.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteOperatorPermission.fulfilled, (state: OperatorPermissionState, action: PayloadAction<OperatorPermissionData> ) => {
                state.loading = false;
                state.operatorPermissions = state.operatorPermissions.filter(permission => permission.operatorid !== action.payload.operatorid);
                state.error = null;
            })            
            .addCase(deleteOperatorPermission.rejected, (state: OperatorPermissionState, action: PayloadAction<unknown,  string, unknown, SerializedError>) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete operator permission';
            });
    },
});

// Export the actions if needed
export const objectActions = operatorPermissionSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default operatorPermissionSlice.reducer;
















// // src/features/operatorPermission/operatorPermissionSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Define the type for OperatorPermission data
// interface OperatorPermissionData {
//     OperatorID: string;
//     Menus: string;
//     Reports: string;
//     databasesx: string;
//     password: string;
// }

// // Define the initial state for the slice
// interface OperatorPermissionState {
//     operatorPermissions: OperatorPermissionData[];
//     loading: boolean;
//     error: string | null;
// }

// const initialState: OperatorPermissionState = {
//     operatorPermissions: [],
//     loading: false,
//     error: null,
// };

// const BASE_URL = import.meta.env.VITE_BASE_URL || 
// (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');


// // Async thunk to fetch all operator permissions
// export const fetchOperatorPermissions = createAsyncThunk('operatorPermission/fetchOperatorPermissions', async () => {
//     const response = await axios.get(`${BASE_URL}/api/operatorPermission`);
//     return response.data;
// });

// // Async thunk to fetch a single operator permission by OperatorID
// export const fetchOperatorPermissionById = createAsyncThunk('operatorPermission/fetchOperatorPermissionById', async (OperatorID: string) => {
//     const response = await axios.get(`${BASE_URL}/api/operatorPermission/${OperatorID}`);   
//     return response.data;
// });

// // Async thunk to create a new operator permission
// export const createOperatorPermission = createAsyncThunk('operatorPermission/createOperatorPermission', async (operatorPermissionData: OperatorPermissionData) => {
//     const response = await axios.post(`${BASE_URL}/api/operatorPermission`, operatorPermissionData);
//     return response.data;
// });

// // Async thunk to update an operator permission
// export const updateOperatorPermission = createAsyncThunk('operatorPermission/updateOperatorPermission', async ({ OperatorID, operatorPermissionData }: { OperatorID: string; operatorPermissionData: OperatorPermissionData }) => {
//     const response = await axios.put(`${BASE_URL}/api/operatorPermission/${OperatorID}`, operatorPermissionData);
//     return response.data;
// });

// // Async thunk to delete an operator permission
// export const deleteOperatorPermission = createAsyncThunk('operatorPermission/deleteOperatorPermission', async (OperatorID: string) => {
//     const response = await axios.delete(`${BASE_URL}/api/operatorPermission/${OperatorID}`);
//     return response.data;
// });

// // Create the slice
// const operatorPermissionSlice = createSlice({
//     name: 'operatorPermission',
//     initialstate: OperatorPermissionState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchOperatorPermissions.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperatorPermissions.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operatorPermissions = action.payload;
//                 state.error = null;
//             })
//             .addCase(fetchOperatorPermissions.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operator permissions';
//             })
//             .addCase(fetchOperatorPermissionById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchOperatorPermissionById.fulfilled, (state) => {
//                 state.loading = false;
//                 // Handle the fetched operator permission data if needed
//                 state.error = null;
//             })
//             .addCase(fetchOperatorPermissionById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to fetch operator permission';
//             })
//             .addCase(createOperatorPermission.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(createOperatorPermission.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operatorPermissions.push(action.payload); // Add the new operator permission
//                 state.error = null;
//             })
//             .addCase(createOperatorPermission.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to create operator permission';
//             })
//             .addCase(updateOperatorPermission.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(updateOperatorPermission.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.operatorPermissions.findIndex(permission => permission.OperatorID === action.payload.OperatorID);
//                 if (index !== -1) {
//                     state.operatorPermissions[index] = action.payload; // Update the operator permission
//                 }
//                 state.error = null;
//             })
//             .addCase(updateOperatorPermission.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to update operator permission';
//             })
//             .addCase(deleteOperatorPermission.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(deleteOperatorPermission.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.operatorPermissions = state.operatorPermissions.filter(permission => permission.OperatorID !== action.meta.arg);
//                 state.error = null;
//             })
//             .addCase(deleteOperatorPermission.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || 'Failed to delete operator permission';
//             });
//     },
// });

// // Export the actions if needed
// export const {} = operatorPermissionSlice.actions; // Add any synchronous actions if required

// // Export the reducer
// export default operatorPermissionSlice.reducer;
