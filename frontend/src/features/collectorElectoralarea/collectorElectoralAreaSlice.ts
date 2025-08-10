import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CollectorElectoralArea {
    officer_no: string;
    electoralarea: string;
}

export interface CollectorElectoralAreaState {
    areas: CollectorElectoralArea[];
    loading: boolean;
    error: string | null;
}

export const initialState: CollectorElectoralAreaState = {
    areas: [],
    loading: false,
    error: null,
};



const BASE_URL = import.meta.env.VITE_BASE_URL;


// Thunks
export const fetchCollectorElectoralAreas = createAsyncThunk(
    'collectorElectoralArea/fetchAll',
    async () => {
        const response = await axios.get(`${BASE_URL}/api/CollectorElectoralArea/all`);

        console.log('response: ', response)
        return response.data;
    }
);

export const createCollectorElectoralArea = createAsyncThunk(
    'collectorElectoralArea/create',
    async (newArea: CollectorElectoralArea) => {

        console.log('in createCollectorElectoralArea thunk: ', newArea)

        const response = await axios.post(`${BASE_URL}/api/CollectorElectoralArea/create`, newArea);
        console.log('after await axios.postresponse: ', response)

        return response.data; // Assuming it returns the created area
    }
);

export const updateCollectorElectoralArea = createAsyncThunk(
    'collectorElectoralArea/update',
    async ({ officer_no, electoralarea }: { officer_no: string; electoralarea: string }) => {
        const response = await axios.put(`${BASE_URL}/api/CollectorElectoralArea/update/${officer_no}`, { electoralarea });
        return response.data; // Assuming it returns the updated area
    }
);

export const deleteCollectorElectoralArea = createAsyncThunk(
    'collectorElectoralArea/delete',
    async (officer_no: string) => {
        await axios.delete(`${BASE_URL}/api/CollectorElectoralArea/delete/${officer_no}`);
        return officer_no; // Return officer_no for the reducer to use
    }
);

// Slice
const collectorElectoralAreaSlice = createSlice({
    name: 'collectorElectoralArea',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollectorElectoralAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCollectorElectoralAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.areas = action.payload;
            })
            .addCase(fetchCollectorElectoralAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch areas.';
            })
            .addCase(createCollectorElectoralArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCollectorElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                state.areas.push(action.payload);
            })
            .addCase(createCollectorElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create area.';
            })
            .addCase(updateCollectorElectoralArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCollectorElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.areas.findIndex(area => area.officer_no === action.payload.officer_no);
                if (index !== -1) {
                    state.areas[index] = action.payload;
                }
            })
            .addCase(updateCollectorElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update area.';
            })
            .addCase(deleteCollectorElectoralArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCollectorElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                state.areas = state.areas.filter(area => area.officer_no !== action.payload);
            })
            .addCase(deleteCollectorElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete area.';
            });
    },
});

// Export the async thunks and reducer
export const {
    reducer: collectorElectoralAreaReducer,
} = collectorElectoralAreaSlice;
