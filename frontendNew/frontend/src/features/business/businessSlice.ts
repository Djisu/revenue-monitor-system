// src/features/business/businessSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Business data
interface BusinessData {
    buss_no: string;
    buss_name: string;
    buss_address: string;
    buss_type: string;
    BUSS_TOWN: string;
    buss_permitNo: string;
    street_name: string;
    landmark: string;
    electroral_area: string;
    property_class: string;
    Tot_grade: string;
    ceo: string;
    telno: string;
    strategiclocation: string;
    productvariety: string;
    businesspopularity: string;
    businessenvironment: string;
    sizeofbusiness: string;
    numberofworkingdays: string;
    businessoperatingperiod: string;
    competitorsavailable: string;
    assessmentby: string;
    transdate: string;
    balance: string;
    status: string;
    serialno: string;
    current_rate: string;
    property_rate: string;
    totalmarks: string;
    meterid: string;
    metercategory: string;
    emailaddress: string;
    FloorRoomNo: string;
    suburb: string;
    postaladdress: string;
    irsno: string;
    vatno: string;
    blocklayout: string;
    blockdivision: string;
    noofemployees: string;
    noofbranches: string;
    detailsofbranches: string;
    contactperson: string;
    contacttelno: string;
    BALANCENEW: string;
}

// Define the initial state for the slice
interface BusinessState {
    businesses: BusinessData[];
    loading: boolean;
    error: string | null;
}

const initialState: BusinessState = {
    businesses: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all businesses
export const fetchBusinesses = createAsyncThunk('business/fetchBusinesses', async () => {
    const response = await axios.get('/api/business');
    return response.data;
});

// Async thunk to create a new business
export const createBusiness = createAsyncThunk('business/createBusiness', async (data: BusinessData) => {
    const response = await axios.post('/api/business', data);
    return response.data;
});

// Async thunk to fetch a single business by buss_no
export const fetchBusinessById = createAsyncThunk('business/fetchBusinessById', async (buss_no: string) => {
    const response = await axios.get(`/api/business/${buss_no}`);
    return response.data;
});

// Async thunk to update a business
export const updateBusiness = createAsyncThunk(
    'business/updateBusiness',
    async ({ buss_no, data }: { buss_no: string; data: BusinessData }) => {
        const response = await axios.put(`/api/business/${buss_no}`, data);
        return response.data;
    }
);

// Async thunk to delete a business
export const deleteBusiness = createAsyncThunk('business/deleteBusiness', async (buss_no: string) => {
    const response = await axios.delete(`/api/business/${buss_no}`);
    return response.data;
});

// Create the slice
const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusinesses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusinesses.fulfilled, (state, action) => {
                state.loading = false;
                state.businesses = action.payload;
                state.error = null;
            })
            .addCase(fetchBusinesses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch businesses';
            })
            .addCase(createBusiness.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBusiness.fulfilled, (state, action) => {
                state.loading = false;
                state.businesses.push(action.payload); // Add the new business
                state.error = null;
            })
            .addCase(createBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create business';
            })
            .addCase(fetchBusinessById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusinessById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched single business as needed
                state.error = null;
            })
            .addCase(fetchBusinessById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch business';
            })
            .addCase(updateBusiness.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBusiness.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.businesses.findIndex(business => business.buss_no === action.payload.buss_no);
                if (index !== -1) {
                    state.businesses[index] = action.payload; // Update the existing business
                }
                state.error = null;
            })
            .addCase(updateBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update business';
            })
            .addCase(deleteBusiness.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBusiness.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted business from the state
                state.businesses = state.businesses.filter(business => business.buss_no !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete business';
            });
    },
});

// Export the actions if needed
export const {} = businessSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default businessSlice.reducer;