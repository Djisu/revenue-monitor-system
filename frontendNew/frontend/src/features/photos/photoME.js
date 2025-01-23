import { createSlice } from '@reduxjs/toolkit';
var initialState = {
    status: 'idle',
    message: null,
    photos: [],
    error: null,
};
var photosSlice = createSlice({
    name: 'photos',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(storePhotoAsync.pending, function (state) {
            state.status = 'loading';
            state.error = null;
        })
            .addCase(storePhotoAsync.fulfilled, function (state, action) {
            state.status = 'succeeded';
            state.message = action.payload.result;
            state.error = null;
        })
            .addCase(storePhotoAsync.rejected, function (state, action) {
            var _a;
            state.status = 'failed';
            state.error = ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.error) || 'Error storing photo';
        })
            .addCase(getAllPhotosAsync.pending, function (state) {
            state.status = 'loading';
            state.error = null;
        })
            .addCase(getAllPhotosAsync.fulfilled, function (state, action) {
            state.status = 'succeeded';
            state.photos = action.payload;
            state.error = null;
        });
    },
});
export default photosSlice.reducer;
