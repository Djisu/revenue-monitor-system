// src/features/electoralArea/electoralAreaSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the initial state
interface ElectoralArea {
    electoral_area: string;
}

interface ElectoralAreaState {
    electoralAreas: ElectoralArea[];
    loading: boolean;
    error: string | null;
}

const initialState: ElectoralAreaState = {
    electoralAreas: [],
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

console.log('in authSlice.ts')

console.log('BASE_URL:', BASE_URL);

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('BASE_URL: ', BASE_URL)


// Async thunks for API calls
export const fetchElectoralAreas = createAsyncThunk('electoralArea/fetchElectoralAreas', async () => {
    
    const response = await axios.get(`${BASE_URL}/api/electoralArea/all`);

    if (response.status >= 200 && response.status < 300) {
        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching electoral areas: ${response.statusText}`);
    }
});

export const createElectoralArea = createAsyncThunk(
    'electoralArea/createElectoralArea',
    async (electoralArea: string) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/electoralArea/create`,
                { electoral_area: electoralArea },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data; // Assuming this is your success response
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error responses
                throw new Error(error.response.data.message || 'Failed to create electoral area');
            }
            throw new Error('Network error or other issue');
        }
    }
);

export const updateElectoralArea = createAsyncThunk('electoralArea/updateElectoralArea', async ({ electoral_area, data }: { electoral_area: string; data: ElectoralArea }) => {
    console.log('in updateElectoralArea slice')
    console.log('electoral_area: ', electoral_area)
    console.log('data: ', data)
    try {
        const response = await axios.put(`${BASE_URL}/api/electoralArea/update/${electoral_area}`, data);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to delete electoral area');
        }
        throw new Error('Network error or other issue');
    }
});

export const deleteElectoralArea = createAsyncThunk('electoralArea/deleteElectoralArea', async (electoral_area: string) => {
    console.log('in deleteElectoralArea slice')
    console.log('electoral_area: ', electoral_area)

    const response = await axios.delete(`${BASE_URL}/api/electoralArea/delete/${electoral_area}`);
    return response.data;
});

// Create the slice
const electoralAreaSlice = createSlice({
    name: 'electoralArea',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchElectoralAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchElectoralAreas.fulfilled, (state, action) => {
                state.loading = false;
                state.electoralAreas = action.payload;
            })
            .addCase(fetchElectoralAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch electoral areas';
            })
            .addCase(createElectoralArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createElectoralArea.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Before push, electoralAreas:', state.electoralAreas);
                if (action.payload.success) {
                    if (!Array.isArray(state.electoralAreas)) {
                        console.warn('Resetting electoralAreas to an empty array');
                        state.electoralAreas = [];
                    }
                    state.electoralAreas.push({ electoral_area: action.payload.message });
                    console.log('After push, electoralAreas:', state.electoralAreas);
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(createElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create electoral area';
            })
            .addCase(updateElectoralArea.fulfilled, (state, action) => {
                const index = state.electoralAreas.findIndex(area => area.electoral_area === action.meta.arg.electoral_area);
                if (index !== -1) {
                    state.electoralAreas[index] = action.payload;
                }
            })
            .addCase(deleteElectoralArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteElectoralArea.fulfilled, (state, action) => {
                console.log('Current electoralAreas before delete:', state.electoralAreas);
                if (!Array.isArray(state.electoralAreas)) {
                    console.warn('electoralAreas is not an array, resetting to empty array');
                    state.electoralAreas = [];
                }
                state.electoralAreas = state.electoralAreas.filter(area => area.electoral_area !== action.meta.arg);
                console.log('electoralAreas after delete:', state.electoralAreas);
            })
            .addCase(deleteElectoralArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete electoral area';
            })
    },
});

// Export the async actions
//export { fetchElectoralAreas, createElectoralArea, updateElectoralArea, deleteElectoralArea };

// Export the reducer
export default electoralAreaSlice.reducer;