export interface StorePhotoResult {
    message: string;
    result: string;
    photoUrl: string;
}
export interface StorePhotoErrorPayload {
    error: string;
}
export interface PhotoData {
    photo: ArrayBuffer;
    officer_no: string;
}
export interface StorePhotoArgs {
    officer_no: string;
    photo: File;
}
export interface Photo {
    officer_no: string;
    photo: Buffer;
}
export interface PhotosState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    message: string | null;
    photos: Photo[];
    error: string | null;
    photoUrl: string | null;
}
export declare const storePhotoAsync: import("@reduxjs/toolkit").AsyncThunk<StorePhotoResult, {
    photo: File;
    officer_no: string;
}, {
    rejectValue: StorePhotoErrorPayload;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const getPhotoAsync: import("@reduxjs/toolkit").AsyncThunk<Buffer, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const getAllPhotosAsync: import("@reduxjs/toolkit").AsyncThunk<{
    officer_no: string;
    photo: string;
}[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const deletePhotoAsync: import("@reduxjs/toolkit").AsyncThunk<{
    message: string;
    result: string;
}, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<PhotosState>;
export default _default;
