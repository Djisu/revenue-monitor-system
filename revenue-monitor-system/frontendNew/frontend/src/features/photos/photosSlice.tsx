import { createAsyncThunk, createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';

// Interfaces
export interface StorePhotoResult {
    message: string;
    result: any;
    photoUrl: string; // Add a field for photoUrl
}

interface StorePhotoErrorPayload {
    error: string;
}

// Assuming the server returns an array of photo buffers
interface PhotoData {
    photo: ArrayBuffer;
    officer_no: string;
}

export interface StorePhotoArgs {
    officer_no: string;
    photo: File;
}

interface Photo {
    officer_no: string;
    photo: Buffer;
}

// Define the payload type for rejected action
// interface RejectedPayload {
//     error: string;
// }

interface PhotosState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    message: string | null;
    photos: Photo[];
    error: string | null;
    photoUrl: string | null; // Add a field for photoUrl
}

// Function to convert a File to Base64
const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]); // Remove the data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 
(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');

// Define the thunk for storing a photo
export const storePhotoAsync = createAsyncThunk<
    StorePhotoResult,
    { photo: File; officer_no: string },
    {
        rejectValue: StorePhotoErrorPayload;
    }
>(
    'photos/store',
    async ({ photo, officer_no }, { rejectWithValue }) => {
        try {
            console.log('in storePhotoAsync thunk');

            console.log('photo.name:', photo.name);
            console.log('officer_no:', officer_no);

            if (!photo || !photo.name || !officer_no) {
                throw new Error('Invalid photo or officer number');
            }

            const base64Photo = await fileToBase64(photo);

            const response = await axios.post(`${BASE_URL}/api/photos/store`, {
                officer_no,
                photo: base64Photo,
                photo_name: photo.name,
                photo_type: photo.type,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('after axios.post response:', response.data  )  //photoUrl);

            return response.data;
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                const errorMessage = err.response?.data?.message || 'Photo already exists';
                return rejectWithValue({ error: errorMessage });
            }
            const errorMessage = err.response?.data?.message || 'Failed to store photo';
            return rejectWithValue({ error: errorMessage });
        }
    }
);

// Define the thunk for retrieving a photo
export const getPhotoAsync = createAsyncThunk<
    Buffer,  // Return type
    string   // Argument type (officer_no)
>(
    'photos/get',
    async (officer_no, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<ArrayBuffer> = await axios.get(`${BASE_URL}/photos/retrieve/${officer_no}`, {
                responseType: 'arraybuffer'
            });

            return Buffer.from(response.data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to get photo' });
        }
    }
);

// Define the thunk for retrieving all photos
export const getAllPhotosAsync = createAsyncThunk<
    { officer_no: string; photo: Buffer }[],  // Return type: array of objects with officer_no and photo as Buffer
    void                                     // Argument type: no arguments needed
>(
    'photos/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<PhotoData[]> = await axios.get(`${BASE_URL}/photos/retrieve`, {
                responseType: 'json'
            });

            // Convert each photo ArrayBuffer to Buffer
            return response.data.map(photoData => ({
                officer_no: photoData.officer_no,
                photo: Buffer.from(photoData.photo)
            }));
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to get photos' });
        }
    }
);

// Define the thunk for deleting a photo
export const deletePhotoAsync = createAsyncThunk<
    { message: string; result: any },  // Return type
    string   // Argument type (officer_no)
>(
    'photos/delete',
    async (officer_no, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<{ message: string; result: any }> = await axios.delete(`${BASE_URL}/photos/delete/${officer_no}`);

            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to delete photo' });
        }
    }
);

// Initial State
const initialState: PhotosState = {
    status: 'idle',
    message: null,
    photos: [],
    error: null,
    photoUrl: null // Add a field for photoUrl
};

// Slice
const photosSlice: Slice<PhotosState> = createSlice({
    name: 'photos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(storePhotoAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.photoUrl = null; // Reset the photoUrl
                state.message = null;
            })
            .addCase(storePhotoAsync.fulfilled, (state, action: PayloadAction<StorePhotoResult>) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
                state.error = null;
                state.photoUrl = action.payload.photoUrl; // Set the photoUrl
            })
            .addCase(storePhotoAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.message = null;
                state.error = action.payload?.error || 'Failed to store photo';
                state.photoUrl = null; // Clear the photoUrl on failure

                 // Optionally, you can add a specific case for 409
                 if (action.payload?.error.includes('Photo already exists')) {
                    state.error = 'Photo already exists';
                }
            })
            .addCase(getPhotoAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPhotoAsync.fulfilled, (state, action: PayloadAction<Buffer>) => {
                state.status = 'succeeded';
                state.message = 'Photo retrieved successfully';
                state.error = null;
                state.photos = [{ officer_no: '', photo: action.payload }]; // Update photos array
            })
            .addCase(getPhotoAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Failed to get photo';
            })
            .addCase(getAllPhotosAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllPhotosAsync.fulfilled, (state, action: PayloadAction<{ officer_no: string; photo: Buffer }[]>) => {
                state.status = 'succeeded';
                state.photos = action.payload;
                state.error = null;
            })
            .addCase(getAllPhotosAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Failed to get photos';
            })
            .addCase(deletePhotoAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deletePhotoAsync.fulfilled, (state, action: PayloadAction<{ message: string; result: any }>) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(deletePhotoAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error?.message || 'Error deleting photo';
            });
    },
});

export default photosSlice.reducer;
