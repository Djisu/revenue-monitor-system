// src/features/propertyClass/propertyClassSlice.ts
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the type for PropertyClass data
export interface PropertyClassData {
    property_class: string;
    description: string;
    frequency: string;
    rate: number;
    assessed: string;
}

// Define the initial state for the slice
export interface PropertyClassState {
    propertyClasses: PropertyClassData[];
    propertyClassDescriptions: string[]; // new
    loading: boolean;
    error: string | null;
}

export const initialState: PropertyClassState = {
    propertyClasses: [],
    propertyClassDescriptions: [], // new
    loading: false,
    error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://revenue-monitor-system.onrender.com');

// Async thunk to fetch all property descriptions
export const fetchPropertyClassDescriptions = createAsyncThunk('propertyClass/fetchPropertyClassDescriptions', async () => {
    try {
        console.log('in fetchPropertyClassDescriptions')

        const response = await axios.get(`${BASE_URL}/api/propertyClass/descriptions/all`);

        console.log('propertyClassDescriptions response:', response);

        if (response.status >= 200 && response.status < 300) {

            console.log('propertyClassDescriptions response:', response.data.data);

            return response.data.data; // This should be the structure you expect
        } else {
            throw new Error(`Error fetching property classes: ${response.statusText}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error or other issue');
        }
    }
});

// Async thunk to fetch all property classes
export const fetchRate = createAsyncThunk('propertyClass/fetchRate', async (arg: { propertyAssessed: string, propertyClassDesc: string }) => {
    const { propertyAssessed, propertyClassDesc } = arg;
    try {
        console.log('in fetchRate: ', propertyAssessed, propertyClassDesc);

        const response = await axios.get(`${BASE_URL}/api/propertyClass/findrate/${propertyAssessed}/${propertyClassDesc}`);

        console.log('fetchRate response:', response);

        if (response.status >= 200 && response.status < 300) {
            // handle successful response
            return response.data.data; // or whatever you need to return
        } else {
            // handle other successful status codes if necessary
            throw new Error(`Error fetching rate: ${response.statusText}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error or other issue');
        }
    }
});

// Async thunk to fetch by description
export const fetchDescription = createAsyncThunk('property/fetchDescription', async (assessed: string) => {
    try {
        console.log('fetchDescription called with assessed: ', assessed);

        const response = await axios.get(`${BASE_URL}/api/propertyClass/finddescription/${assessed}`);

        console.log('fetchDescription response:', response.data.data)

        if (response.status === 200) {
            return response.data.data;
        }
        return null;
    } catch (error: unknown) {
        console.error('Error fetching property classes:', error);
        // You can also throw the error if you want the calling function to handle it
        // throw error;
        if (error instanceof Error){
            console.error(error.message);
        }
        return null;
    }
});

// Async thunk to fetch all property classes
export const fetchPropertyClasses = createAsyncThunk('propertyClass/fetchPropertyClasses', async () => {
    try {
        console.log('in fetchPropertyClasses')

        const response = await axios.get(`${BASE_URL}/api/propertyClass/all`);

        console.log('fetchPropertyClasses response:', response);

        if (response.status >= 200 && response.status < 300) {

            console.log('fetchPropertyClasses response:', response.data.data);

            return response.data.data; // This should be the structure you expect
        } else {
            throw new Error(`Error fetching property classes: ${response.statusText}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error or other issue');
        }
    }
});

export const fetchPropertyClassesDistinct = createAsyncThunk('propertyClass/fetchPropertyClasses', async () => {
    try {
        console.log('in fetchPropertyClasses')
        
        const response = await axios.get(`${BASE_URL}/api/propertyClass/distinct`);

        console.log('fetchPropertyClasses response:', response);

        if (response.status >= 200 && response.status < 300) {

            console.log('fetchPropertyClasses response:', response.data.data);

            return response.data.data; // This should be the structure you expect
        } else {
            throw new Error(`Error fetching property classes: ${response.statusText}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Network error or other issue');
        }
    }
});

// Async thunk to fetch by description
export const fetchPropertyClassesByDescription = createAsyncThunk('property/fetchPropertyClassesByDescription', async (desc: string) => {
    try {
        console.log('fetchPropertyClasses called with description: ', desc);

        const response = await axios.get(`${BASE_URL}/api/property/findpropertyclasses/${desc}`);

        if (response.status === 200) {
            return response.data.data;
        }
        return null;
    } catch (error: unknown) {
        console.error('Error fetching property classes:', error);
        // You can also throw the error if you want the calling function to handle it
        // throw error;
        if (error instanceof Error){
            console.error(error.message);
        }
        return null;
    }
});


// Async thunk to fetch a single property class by property_class
export const fetchPropertyClassById = createAsyncThunk('propertyClass/fetchPropertyClassById', async (property_class: string) => {
    const response = await axios.get(`${BASE_URL}/api/propertyClass/${property_class}`);

     if (response.status >= 200 && response.status < 300) {
        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching property class by id    : ${response.statusText}`);
    }
});

// Async thunk to fetch a single property class by property_class
export const fetchPropertyClassByAssessed = createAsyncThunk('propertyClass/fetchPropertyClassById', async (assessed: string) => {
    const response = await axios.get(`${BASE_URL}/api/propertyClass/${assessed}`);

     if (response.status >= 200 && response.status < 300) {
        return await response.data; // This data will be available as `action.payload`
    } else {
        throw new Error(`Error fetching property class by id    : ${response.statusText}`);
    }
});

// Async thunk to create a new property class
export const createPropertyClass = createAsyncThunk('propertyClass/createPropertyClass', async (propertyClassData: PropertyClassData) => {
    console.log('in createPropertyClass')

    try {
        const response = await axios.post(
            `${BASE_URL}/api/propertyClass/create`,
             propertyClassData,
             {
                headers: { 'Content-Type': 'application/json' },
        });

        console.log(`after axios.post, response.data: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to create property class');
        }
        throw new Error('Network error or other issue');
    }
   
});

// Async thunk to update a property class
export const updatePropertyClass = createAsyncThunk('propertyClass/updatePropertyClass', async ({ property_class, propertyClassData }: { property_class: string; propertyClassData: PropertyClassData }) => {
    console.log('in updatePropertyClass')

    try {
        const response = await axios.put(`${BASE_URL}/api/propertyClass/update/${property_class}`, propertyClassData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific error responses
            throw new Error(error.response.data.message || 'Failed to delete electoral area');
        }
        throw new Error('Network error or other issue');
    }
    
});

// Async thunk to delete a property class
export const deletePropertyClass = createAsyncThunk('propertyClass/deletePropertyClass', async (property_class: string) => {
    console.log('in deletePropertyClass')

    const response = await axios.delete(`${BASE_URL}/api/propertyClass/delete/${property_class}`);
    return response.data;
});

// Create the slice
const propertyClassSlice = createSlice({
    name: 'propertyClass',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<PropertyClassState>) => {
        builder
            .addCase(fetchPropertyClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyClasses.fulfilled, (state: PropertyClassState, action) => {
                state.loading = false;
                state.propertyClasses = action.payload;
                state.error = null;
            })
            .addCase(fetchPropertyClasses.rejected, (state: PropertyClassState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property classes';
            })
            .addCase(fetchPropertyClassById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyClassById.fulfilled, (state) => {
                state.loading = false;
                // Handle the fetched property class data if needed //fetchPropertyClassDescriptions
                state.error = null;
            })
            .addCase(fetchPropertyClassById.rejected, (state: PropertyClassState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property class';
            })


            .addCase(fetchPropertyClassDescriptions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPropertyClassDescriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyClassDescriptions = action.payload.map((item: { description: string }) => item.description);
                state.error = null;
            })
            .addCase(fetchPropertyClassDescriptions.rejected, (state: PropertyClassState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch property class';
            })

            .addCase(createPropertyClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPropertyClass.fulfilled, (state: PropertyClassState, action) => {
                state.loading = false;

                console.log('Before push, propertyClasses:', state.propertyClasses);

                if (action.payload.success) {
                    if (!Array.isArray(state.propertyClasses)) {
                        console.warn('Resetting propertyClasses to an empty array');
                        state.propertyClasses = [];
                    }

                    // Ensure the payload includes a rate, or provide a default value
                    const newPropertyClass: PropertyClassData = {
                        property_class: action.payload.message,
                        description: action.payload.description,
                        frequency: action.payload.frequency,
                        rate: action.payload.rate !== undefined ? action.payload.rate : 0, // Provide a default rate value if necessary
                        assessed: action.payload.assessed,
                    };

                    state.propertyClasses.push(newPropertyClass);
                    console.log('After push, propertyClasses:', state.propertyClasses);
                } else {
                    state.error = action.payload.message;
                }
            })
            .addCase(createPropertyClass.rejected, (state: PropertyClassState, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred while creating the property class';
            })
            .addCase(updatePropertyClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePropertyClass.fulfilled, (state: PropertyClassState, action) => {
                state.loading = false;
                const index = state.propertyClasses.findIndex(cls => cls.property_class === action.payload.property_class);
                if (index !== -1) {
                    state.propertyClasses[index] = action.payload; // Update the property class
                }
                state.error = null;
            })
            .addCase(updatePropertyClass.rejected, (state: PropertyClassState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update property class';
            })
            .addCase(deletePropertyClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePropertyClass.fulfilled, (state: PropertyClassState, action) => {
                state.loading = false;
                
                // Add logging to check the type of state.propertyClasses
                console.log('Before filter, state.propertyClasses:', state.propertyClasses);
                console.log('Type of state.propertyClasses:', Array.isArray(state.propertyClasses) ? 'array' : 'not array');
                
                if (!Array.isArray(state.propertyClasses)) {
                    console.error('state.propertyClasses is not an array:', state.propertyClasses);
                    state.propertyClasses = []; // Reset to an empty array if it's not an array
                } else {
                    state.propertyClasses = state.propertyClasses.filter(cls => cls.property_class !== action.meta.arg);
                }
                
                state.error = null;
            })
            .addCase(deletePropertyClass.rejected, (state: PropertyClassState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete property class';
            });
    },
});

// Export the reducer
export default propertyClassSlice.reducer;
