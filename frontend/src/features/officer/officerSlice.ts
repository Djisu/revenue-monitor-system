// src/features/officer/officerSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Officer data
export interface OfficerData {
    officer_no: string;
    officer_name: string;
    photo: string; // Assuming photo is a URL or base64 string
}

export interface CreateOfficerSuccess {
    message: string;
}

export interface CreateOfficerError {
    message: string;
}

export type CreateOfficerReturnType = CreateOfficerSuccess | CreateOfficerError;

// Define the initial state for the slice
export interface OfficerState {
    officers: OfficerData[];
    loading: boolean;
    error: string | null;
    currentOfficer: OfficerData | null;
    message: string | null;
}

export const initialState: OfficerState = {
    officers: [],
    loading: false,
    error: null,
    currentOfficer: null,
    message: null,
};

console.log('import.meta.env.VITE_BASE_URL: ', import.meta.env.VITE_BASE_URL)
console.log('import.meta.env.MODE: ', import.meta.env.MODE)
console.log('import.meta.env: ', import.meta.env)
console.log('import.meta.env.PROD: ', import.meta.env.PROD)
console.log('import.meta.env.DEV: ', import.meta.env.DEV)
console.log('import.meta.env.SSR: ', import.meta.env.SSR)   
console.log('import.meta.env.BASE_URL: ', import.meta.env.BASE_URL)

// Determine the base URL based on the environment
const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://revenue-monitor-system.onrender.com');

console.log('BASE_URL: ', BASE_URL)

// Async thunk to fetch all officers
export const fetchOfficers = createAsyncThunk('officer/fetchOfficers', async () => {
    console.log('in fetchOfficers thunk');



    console.log('BASE_URL: ', BASE_URL)

    const response = await axios.get(`${BASE_URL}/api/officer/all`, {
        responseType: 'json' // Ensure we expect JSON response
    });

    if (response.status >= 200 && response.status < 300) {
        console.log('officeSlicer.ts: officers fetched successfully');
        console.log('response.data:', response.data);

        // Each officer already includes the photoUrl and photo Blob
        return response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching officers: ${response.statusText}`);
    }
});

// Async thunk to fetch a single officer by officer_no
export const fetchOfficerById = createAsyncThunk('officer/fetchOfficerById', async (officer_no: string) => {
    console.log('Fetching officer by id:', officer_no);
    
    // Fetch the officer details
    const officerResponse = await axios.get(`${BASE_URL}/api/officer/retrieve/${officer_no}`);

    // Fetch the officer's photo as a Blob
    const photoResponse = await axios.get(`${BASE_URL}/api/photos/retrieve/${officer_no}`, {
        responseType: 'blob', // Ensure we get the photo as a Blob
    });

    // Create a URL for the Blob
    const photoUrl = URL.createObjectURL(photoResponse.data);

    // Return officer data along with the photo URL
    return {
        ...officerResponse.data,
        photoUrl: photoUrl,
    };
});

// Async thunk to create a new officer
export const createOfficer = createAsyncThunk<CreateOfficerReturnType, OfficerData, { rejectValue: CreateOfficerError }>(
    'officers/create',
    async (officerData, { rejectWithValue }) => {
   // console.log('creating officer:', officerData);

    try {
        const response = await axios.post(
            `${BASE_URL}/api/officer/create`,
            officerData,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return { message: response.data.message } as CreateOfficerSuccess;  // Ensure this is cast correctly
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue({ message: error.response.data.message || 'Failed to create officer' });
        }
        return rejectWithValue({ message: 'Failed to create officer' });
    }
});

// Async thunk to update an officer
export const updateOfficer = createAsyncThunk('officer/updateOfficer', async ({ officer_no, officerData }: { officer_no: string; officerData: OfficerData }) => {
    //console.log('updating officer:', officer_no, officerData);

    try {
        const response = await axios.put(`${BASE_URL}/api/officer/update/${officer_no}`, officerData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to update officer');
        }
        throw new Error('Network error or other issue');
    }
});

// Async thunk to delete an officer
export const deleteOfficer = createAsyncThunk('officer/deleteOfficer', async (officer_no: string) => {
    //console.log('deleting officer:', officer_no);

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
            })
            .addCase(fetchOfficerById.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming you want to store a single officer in state
                state.currentOfficer = action.payload; // Store the fetched officer data
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
                if ('message' in action.payload) {
                    if (action.payload.message === 'Officer record created successfully') {
                        state.officers.push(action.meta.arg); // Add the officer data from the request
                    } else {
                        state.error = action.payload.message;
                    }
                }
            })
            .addCase(createOfficer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create officer'; // Safely access message
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
export const object = officerSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default officerSlice.reducer;