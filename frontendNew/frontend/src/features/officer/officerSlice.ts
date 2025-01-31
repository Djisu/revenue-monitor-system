// src/features/officer/officerSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Officer data
interface OfficerData {
    officer_no: string;
    officer_name: string;
    photo: string; // Assuming photo is a URL or base64 string
}

// Define the initial state for the slice
interface OfficerState {
    officers: OfficerData[];
    loading: boolean;
    error: string | null;
}

const initialState: OfficerState = {
    officers: [],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// console.log('in authSlice.ts')

// console.log('BASE_URL:', BASE_URL);

// console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
// console.log('BASE_URL: ', BASE_URL)

// Async thunk to fetch all officers
export const fetchOfficers = createAsyncThunk('officer/fetchOfficers', async () => {
    console.log('officeSlicer.ts: fetching officers');

    const response = await axios.get(`${BASE_URL}/api/officer/retrieve`);

     if (response.status >= 200 && response.status < 300) {
        console.log('officeSlicer.ts: officers fetched successfully');
        console.log('response.data:', response.data);
        console.log('response.data.officers:', response.data.officers);
        return response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching officers: ${response.statusText}`);
    }
});

// Async thunk to fetch a single officer by officer_no
export const fetchOfficerById = createAsyncThunk('officer/fetchOfficerById', async (officer_no: string) => {
    console.log('fetching officer by id:', officer_no);
    const response = await axios.get(`${BASE_URL}/api/officer/retrieve/${officer_no}`);

    return response.data;
});

// Async thunk to create a new officer
export const createOfficer = createAsyncThunk('officer/createOfficer', async (officerData: OfficerData) => {
    console.log('creating officer:', officerData);

    try {
        const response = await axios.post(
            `${BASE_URL}/api/officer/create`,
            officerData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data; // Assuming this is your success response
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to create officer');
        }
        throw new Error('Network error or other issue');
    }
});

// Async thunk to update an officer
export const updateOfficer = createAsyncThunk('officer/updateOfficer', async ({ officer_no, officerData }: { officer_no: string; officerData: OfficerData }) => {
    console.log('updating officer:', officer_no, officerData);

    try {
        const response = await axios.put(`${BASE_URL}/api/officer/update/${officer_no}`, officerData);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to update officer');
        }
        throw new Error('Network error or other issue');
    }
});

// Async thunk to delete an officer
export const deleteOfficer = createAsyncThunk('officer/deleteOfficer', async (officer_no: string) => {
    console.log('deleting officer:', officer_no);

    const response = await axios.delete(`${BASE_URL}/api/officer/delete/${officer_no}`);
    return response.data;
});

// Create the slice
const officerSlice = createSlice({
    name: 'officer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOfficers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOfficers.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = action.payload;
                state.error = null;
            })
            .addCase(fetchOfficers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch officers';
            })
            .addCase(fetchOfficerById.pending, (state) => {
                state.loading = true;
                state
            })
            .addCase(fetchOfficerById.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = action.payload;
                state.error = null;
            })
            .addCase(fetchOfficerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch officer';
            })
            .addCase(createOfficer.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOfficer.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message === 'Officer record created successfully') {
                    state.officers.push(action.meta.arg); // Add the officer data from the request
                } else {
                    state.error = action.payload.message;
                }
            })            
            .addCase(createOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create officer';
            })
            .addCase(updateOfficer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOfficer.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.message === 'Officer record updated successfully') {
                    const index = state.officers.findIndex(officer => officer.officer_no === action.meta.arg.officer_no);
                    if (index !== -1) {
                        state.officers[index] = action.meta.arg.officerData; // Update the officer data using the request data
                    }
                } else {
                    state.error = action.payload.message;
                }
            })           
            .addCase(updateOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update officer';
            })
            .addCase(deleteOfficer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOfficer.fulfilled, (state, action) => {
                state.loading = false;
                state.officers = state.officers.filter(officer => officer.officer_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete officer';
            });
    },
});

// Export the actions if needed
export const {} = officerSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default officerSlice.reducer;