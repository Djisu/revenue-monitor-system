// src/store/gradeFeesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the GradeFees data interface
export interface GradeFeesData {
    buss_type: string;
    grade: string;
    description: string;
    fees: number;
}

// Define the state interface
interface GradeFeesState {
    gradeFees: GradeFeesData[];
    loading: boolean;
    successMessage: string;
    error: null | string;
}

// Initial state as GradeFeesData[]
const initialState: GradeFeesState = {
    gradeFees: [] as GradeFeesData[],
    loading: false,
    successMessage: '',  
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Async thunk to fetch all grade fees
export const fetchGradeFees = createAsyncThunk('gradeFees/fetchgradeFees', async () => {
   // console.log('fetchGradeFees slice called')

    const response = await axios.get(`${BASE_URL}/api/gradeFees/all`);

    console.log(`after axios.get, response.data: ${JSON.stringify(response.data)}`);

    console.log('in gradeFeesSlice  response: ', response)

    if (response.status >= 200 && response.status < 300) {
        //console.log('fetchGradeFees fulfilled::: ', response.data);
        // Ensure response.data is an array
        return Array.isArray(response.data) ? response.data : []; //
        // return data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching grade fees. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

export const createGradeFee = createAsyncThunk('gradeFees/createGradeFee', async (gradeFeesData: GradeFeesData) => {
    try {

        console.log('createGradeFee slice called')

        const response = await axios.post(
            `${BASE_URL}/api/gradeFees/create`,
            gradeFeesData,
             {
                headers: { 'Content-Type': 'application/json' },
        });

        console.log(`after axios.post, response.data: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to create property class');
        }
        throw new Error('Network error or other issue');
    }
});

export const updateGradeFee = createAsyncThunk('gradeFees/updateGradeFee', 
async (params: { buss_type: string; grade: string; data: GradeFeesData }) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/api/gradeFees/update/${params.buss_type}/${params.grade}`,
            params.data,
            {
                headers: { 'Content-Type': 'application/json' },
        });

        console.log(`after axios.put, response.data: ${JSON.stringify(response.data)}`);

        return { buss_type: params.buss_type, grade: params.grade, data: params.data };
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to create property class');
        }
        throw new Error('Network error or other issue');
    }
});

export const deleteGradeFee = createAsyncThunk('gradeFees/deleteGradeFee', async (params: { buss_type: string; grade: string }) => {
    const response = await axios.delete(`${BASE_URL}/api/gradeFees/${params.buss_type}/${params.grade}`);
    console.log(`after axios.delete, response.data: ${JSON.stringify(response.data)}`);
    return { buss_type: params.buss_type, grade: params.grade };
});

// Create the slice
const gradeFeesSlice = createSlice({
    name: 'gradeFees',
    initialState: initialState,
    reducers: {
        setGradeFees: (state, action: PayloadAction<GradeFeesData[]>) => {
            state.gradeFees = action.payload;
        },
        addGradeFee: (state, action: PayloadAction<GradeFeesData>) => {
            state.gradeFees.push(action.payload);
        },
      
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchGradeFees.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchGradeFees.fulfilled, (state, action) => {
            state.loading = false;
            state.gradeFees = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        })
        .addCase(fetchGradeFees.rejected, (state) => {
            state.loading = false;

            if (state.error !== null) {
                // Handle the case where state.error is a string
                state.error =  state.error  && 'Failed to fetch grade fees' 
            } else {
                // Handle the case where state.error is null
                state.error = null;
            }
        })
        .addCase(createGradeFee.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createGradeFee.fulfilled, (state, action) => {
            state.loading = false;
                state.gradeFees.push(action.payload); // Add the new GradeRate record
                state.error = null;
            // state.loading = false;

            // console.log('Before push, propertyClasses:', state.gradeFees);

            // if (action.payload.success) {               
            //     const newGradeFees: GradeFeesData = {                  
            //         buss_type: action.payload.message.buss_type,
            //         grade: action.payload.message.grade,
            //         description: action.payload.message.description,
            //         fees: action.payload.message.fees                   
            //     }

            //     state.gradeFees.push(newGradeFees);
            //     console.log('After push, gradeFees:', state.gradeFees);
            // } else {
            //     state.error = action.payload.message;
            // };
        })
        .addCase(createGradeFee.rejected, (state, action) => {
            state.loading = false;
            if (action.error.message === "GradeRate record already exists") {
                state.error = "GradeRate record already exists";
            } else {
                state.error = action.error.message || 'Failed to create GradeRate record';
            }
            // state.loading = false;
            // if (state.error !== null) {
            //     // Handle the case where state.error is a string
            //     state.error =  state.error  && 'Failed to fetch grade fees' 
            // } else {
            //     // Handle the case where state.error is null
            //     state.error = null;
            // }
        })
        .addCase(updateGradeFee.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateGradeFee.fulfilled, (state: any, action) => {
            const index = state.gradeFees.findIndex(
                (fee: GradeFeesData) => fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade
            );
            if (index !== -1) {
                state.gradeFees[index] = action.payload.data ; // No type assertion needed if types are correct
                state.successMessage = 'Grade fee updated successfully' ;
            } else {
                console.warn(`Could not find grade fee with buss_type ${action.payload.buss_type} and grade ${action.payload.grade} to update`);
                state.error = `Could not find grade fee with buss_type ${action.payload.buss_type} and grade ${action.payload.grade} to update`;
            }
        })
        .addCase(updateGradeFee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update GradeRate record';
            // if (state.error !== null) {
            //     // Handle the case where state.error is a string
            //     state.error =  state.error  && 'Failed to fetch grade fees' 
            // } else {
            //     // Handle the case where state.error is null
            //     state.error = null;
            // };
        })
        .addCase(deleteGradeFee.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteGradeFee.fulfilled, (state, action) => {
            state.gradeFees = state.gradeFees.filter(
                (fee: any) => !(fee.buss_type === action.payload.buss_type && fee.grade === action.payload.grade)
            );
        })
        .addCase(deleteGradeFee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete GradeRate record';
            // if (state.error !== null) {
            //     // Handle the case where state.error is a string
            //     state.error =  state.error  && 'Failed to delete grade fee' 
            // } else {
            //     // Handle the case where state.error is null
            //     state.error = null;
            // }
        });
    },
});

// Export the async actions
export const { setGradeFees, addGradeFee, setLoading, setError } = gradeFeesSlice.actions;

// Export the reducer
export default gradeFeesSlice.reducer;