// src/features/gradeRate/gradeRateSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for GradeRate data
interface GradeRateData {
    grade: string;
    minValuex: number;
    maxValuex: number;
    rate: number;
}

// Define the initial state for the slice
interface GradeRateState {
    gradeRates: GradeRateData[];
    loading: boolean;
    error: string | null;
}

const initialState: GradeRateState = {
    gradeRates: [],
    loading: false,
    error: null,
};
// Set the base URL for the API calls
const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');


// Async thunk to fetch all GradeRate records
export const fetchGradeRates = createAsyncThunk('gradeRate/fetchGradeRates', async () => {
    const response = await axios.get(`${BASE_URL}/api/gradeRate/all`);

    if (response.status >= 200 && response.status < 300) {
        return await response.data.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching property classes : ${response.statusText}`);
    }
    
});

// Async thunk to create a new GradeRate record
export const createGradeRate = createAsyncThunk('gradeRate/createGradeRate', async (data: GradeRateData) => {
    try {

        console.log(`in createGradeRate, before axios.post, data: ${JSON.stringify(data)}`)
        const response = await axios.post(
            `${BASE_URL}/api/gradeRate/create`,
             data,
             {
                headers: { 'Content-Type': 'application/json' },
        });

        console.log(`in createGradeRate, after axios.post, response.data: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to create property class');
        }
        throw new Error('Network error or other issue');
    }
});

// Async thunk to fetch a single GradeRate record by grade, minValuex, and maxValuex
export const fetchGradeRateById = createAsyncThunk('gradeRate/fetchGradeRateById', async ({ grade, minValuex, maxValuex }: 
    { grade: string; minValuex: number; maxValuex: number }) => {
    const response = await axios.get(
        `${BASE_URL}/api/gradeRate/${grade}/${minValuex}/${maxValuex}`
    );

    if (response.status >= 200 && response.status < 300) {
        return await response.data.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching property class : ${response.statusText}`);
    }

});

// Async thunk to update a GradeRate record
export const updateGradeRate = createAsyncThunk(
    'gradeRate/updateGradeRate',
    async ({ grade, minValuex, maxValuex, data }: { grade: string; minValuex: number; maxValuex: number; data: GradeRateData }) => {
        try {
            // Construct the URL with route parameters
            const url = `${BASE_URL}/api/propertyClass/update/${grade}/${minValuex}/${maxValuex}`;

            // Perform the PUT request with the data in the body
            const response = await axios.put(url, data);

            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error responses
                throw new Error(error.response.data.message || 'Failed to update GradeRate record');
            }
            throw new Error('Network error or other issue');
        }
    }
);


// Async thunk to delete a GradeRate record
export const deleteGradeRate = createAsyncThunk('gradeRate/deleteGradeRate', async ({ grade, minValuex, maxValuex }: { grade: string; minValuex: number; maxValuex: number }) => {
    const response = await axios.delete(`${BASE_URL}/api/gradeRate/${grade}/${minValuex}/${maxValuex}`);
    return response.data;
});

// Create the slice
const gradeRateSlice = createSlice({
    name: 'gradeRate',
    initialState,
    reducers: {
        setGradeRates: (state, action: PayloadAction<GradeRateData[]>) => {
            state.gradeRates = action.payload;
          },
          clearError: (state) => {
              state.error = null;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGradeRates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGradeRates.fulfilled, (state, action) => {
                state.loading = false;
                state.gradeRates = action.payload;
                state.error = null;
            })
            .addCase(fetchGradeRates.rejected, (state, action) => {
                state.loading = false;
                if (action.error.message === "GradeRate record already exists") {
                    state.error = "GradeRate record already exists";
                } else {
                    state.error = action.error.message || 'Failed to fetch GradeRate records';
                }
            })
            .addCase(createGradeRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(createGradeRate.fulfilled, (state, action) => {
                state.loading = false;
                state.gradeRates.push(action.payload); // Add the new GradeRate record
                state.error = null;
            })
            .addCase(createGradeRate.rejected, (state, action) => {
                state.loading = false;
                if (action.error.message === "GradeRate record already exists") {
                    state.error = "GradeRate record already exists";
                } else {
                    state.error = action.error.message || 'Failed to create GradeRate record';
                }
            })
            .addCase(fetchGradeRateById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGradeRateById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single GradeRate record as needed
                state.error = null;
            })
            .addCase(fetchGradeRateById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch GradeRate record';
            })
            .addCase(updateGradeRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateGradeRate.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.gradeRates.findIndex(rate => 
                    rate.grade === action.payload.grade && 
                    rate.minValuex === action.payload.data.minValuex && 
                    rate.maxValuex === action.payload.data.maxValuex
                );
                if (index !== -1) {
                    state.gradeRates[index] = action.payload.data; // Update the existing GradeRate record
                }
                state.error = null;
            })
            .addCase(updateGradeRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update GradeRate record';
            })
            .addCase(deleteGradeRate.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGradeRate.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted GradeRate record from the state
                state.gradeRates = state.gradeRates.filter(rate => 
                    !(rate.grade === action.meta.arg.grade && 
                    rate.minValuex === action.meta.arg.minValuex && 
                    rate.maxValuex === action.meta.arg.maxValuex)
                );
                state.error = null;
            })
            .addCase(deleteGradeRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete GradeRate record';
            });
    },
});

// Export the actions if needed
export const { setGradeRates, clearError } = gradeRateSlice.actions;
 // Add any synchronous actions if required

// Export the reducer
export default gradeRateSlice.reducer;
