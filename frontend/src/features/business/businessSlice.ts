// src/features/business/businessSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for Business data
export interface BusinessData {
    buss_no: number;
    buss_name?: string;
    buss_address?: string;
    buss_type?: string;
    buss_town?: string;
    buss_permitNo?: string;
    street_name?: string;
    landmark?: string;
    electroral_area?: string;
    property_class?: string;
    tot_grade?: string;
    ceo?: string;
    telno?: string;
    strategiclocation?: number;
    productvariety?: number;
    businesspopularity?: number;
    businessenvironment?: number;
    sizeofbusiness?: number;
    numberofworkingdays?: number;
    businessoperatingperiod?: number;
    competitorsavailable?: number;
    assessmentby?: string;
    transdate?: Date;
    balance?: number;
    status?: string;
    current_rate?: number;
    property_rate?: number;
    totalmarks?: number;
    emailaddress?: string;  
    noofemployees?: number;
    noofbranches?: number;
    BALANCENEW?: number;
    gps_address?: string; 
    serialNo?: number;
    buss_location?: string;
}

// Define the initial state for the slice
export interface BusinessState {
    businesses: BusinessData[];
    loading: boolean;
    successMessage: string;
    error: string | null;
    message: string
}

export const initialState: BusinessState = {
    businesses: [] as BusinessData[],
    loading: false,
    successMessage: '',
    error: null,
    message: ''
};


const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');


// Async thunk to fetch all businesses
export const fetchBusinesses = createAsyncThunk('business/fetchBusinesses', async () => {
    // Call the API to fetch all businesses
    console.log('in fetchBusinesses slice, Fetching all businesses')

    const response = await axios.get(`${BASE_URL}/api/business/all`);

    if (response.status >= 200 && response.status < 300) {
        console.log('fetchGradeFees fulfilled::: ', response.data);
        // Ensure response.data is an array
        return Array.isArray(response.data) ? response.data : []; //
        // return data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching grade fees. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Async thunk to fetch the last buss_no
export const fetchLastBussNo = createAsyncThunk('business/fetchLastBussNo', async () => {
    console.log('in fetchLastBussNo thunk, Fetching last buss_no');

    const response = await axios.get(`${BASE_URL}/api/business/last`);

    if (response.status >= 200 && response.status < 300) {
        console.log('fetchLastBussNo fulfilled: ', response.data);
        // Return the new buss_no from the response
        return response.data.newBussNo;
    } else {
        throw new Error(`Error fetching last buss_no. Status: ${response.status} - Error: ${response.statusText}`);
    }
});

// Async thunk to process operating permits electoralArea, fiscalYear
export const processOperatingPermits = createAsyncThunk(
    'business/processOperatingPermits',
    async ({ electoralArea, fiscalYear }: 
        { electoralArea: string, fiscalYear: number }) => {
        console.log(
            'in processOperatingPermits slice, Processing Operating Permits for electoral_area: ',
            electoralArea,
            'and fiscal_year: ',
            fiscalYear
        );

        // Prepare the data object to send in the request
        const data = {
            electoralArea,
            fiscalYear
        };

        // Call the API to create a new business
        try {
            const response = await axios.post(
                `${BASE_URL}/api/business/processOperatingPermits/${electoralArea}/${fiscalYear}`,
                data,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log('response data', response.data.message);

            if (response.status >= 200 && response.status < 300) {
                console.log(response.data.message);
                // Ensure response.data is an array
                return response.data.message   
            } else {
                throw new Error(`Error fetching business client. Status: ${response.status} - Error: ${response.statusText}`);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to create business');
            }
            throw new Error('Network error or other issue');
        }
    }
);


// Async thunk to create a new business
export const createBusiness = createAsyncThunk('business/createBusiness', async (data: BusinessData) => {
    console.log('in createBusiness slice, Creating a new business')

    // Call the API to create a new business
    try {
        const response = await axios.post(
            `${BASE_URL}/api/business/create`,
            data,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        console.log('response data', response.data);

        if (response.status >= 200 && response.status < 300) {
            console.log('fetchGradeFees fulfilled::: ', response.data);
            // Ensure response.data is an array
            return Array.isArray(response.data) ? response.data : []; //
            // return data; // This data will be available as `action.payload`
        } else {
            throw new Error(`Error fetching business client. Status: ${response.status} - Error: ${response.statusText}`);
        }           
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to create business');
        }
        throw new Error('Network error or other issue');
    }
});

// Async thunk to fetch a single business by buss_no 
export const fetchBusinessById = createAsyncThunk('business/fetchBusinessById', async (buss_no: number) => {

    console.log('in fetchBusinessById slice, Fetching a business by buss_no: ')

    const response = await axios.get(`${BASE_URL}/api/business/${buss_no}`);
    
    if (response.status >= 200 && response.status < 300) {
        console.log('response.data::: ', response.data);
        // Ensure response.data is an array
        //return Array.isArray(response.data) ? response.data : []; //
        return response.data; // This data will be available as `action.payload`
    } else {
    throw new Error(`Error fetching business client. Status: ${response.status} - Error: ${response.statusText}`);
    }    
});

export const fetchBusinessByName = createAsyncThunk('business/fetchBusinessById', async (buss_name: string) => {
    const response = await axios.get(`${BASE_URL}/api/business/${buss_name}`);
    
    if (response.status >= 200 && response.status < 300) {
        console.log('fetchGradeFees fulfilled::: ', response.data);
        // Ensure response.data is an array
        return Array.isArray(response.data) ? response.data : []; //
        // return data; // This data will be available as `action.payload`
    } else {
    throw new Error(`Error fetching business client. Status: ${response.status} - Error: ${response.statusText}`);
    }    
});

// Async thunk to update a business
export const updateBusiness = createAsyncThunk(
    'business/updateBusiness',
    async ({ buss_no, data }: { buss_no: number; data: BusinessData }) => {
       console.log('in updateBusiness slice, Updating a business: ', data)

        const response = await axios.put(
            `${BASE_URL}/api/business/${buss_no}`,
            data,
            {
                headers: { 'Content-Type': 'application/json' },
        });

        console.log(`after axios.put, response.data: ${JSON.stringify(response.data)}`);
        return response.data;
    }
);

// Async thunk to delete a business
export const deleteBusiness = createAsyncThunk('business/deleteBusiness', async (buss_no: string) => {
    const response = await axios.delete(`${BASE_URL}/api/business/${buss_no}`);
    return response.data;
});

// Create the slice 
const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        setGradeFees: (state, action: PayloadAction<BusinessData[]>) => {
            state.businesses = action.payload;
        },
        addGradeFee: (state, action: PayloadAction<BusinessData>) => {
            state.businesses.push(action.payload);
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
            .addCase(processOperatingPermits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(processOperatingPermits.fulfilled, (state, action) => {
                state.loading = false;
                // You may want to store the message in a specific part of your state
                state.successMessage = JSON.stringify(action.payload); // Assuming payload contains the message
                //state.businesses.push(...payload.businesses); // Adjust if necessary
                state.error = null;
            })
            .addCase(processOperatingPermits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create business';
            })
            .addCase(fetchBusinesses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusinesses.fulfilled, (state, action: PayloadAction<BusinessData[]>) => {
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
                state.error = null;
            })
            .addCase(createBusiness.fulfilled, (state, action) => {
                state.loading = false;
                state.businesses.push(...action.payload); // Add the new business
                state.error = null;
            })
            .addCase(createBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create business';
            })
            .addCase(fetchBusinessById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBusinessById.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched single business as needed
               // state.businesses.push(...action.payload); // Add the new business
               if (action.payload && action.payload.data) {
                  state.businesses = action.payload.data;
               }
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
                state.businesses = state.businesses.filter(business => (business.buss_no).toString() !== action.meta.arg);
                state.error = null;
            })
            .addCase(deleteBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete business';
            });
    },
});

// Export the actions if needed
export const { setGradeFees, addGradeFee, setLoading, setError }   = businessSlice.actions; // Add any synchronous actions if required

// Export the reducer
export default businessSlice.reducer;
