export interface GradeFeesData {
    buss_type: string;
    grade: string;
    description: string;
    fees: number;
}
export interface GradeFeesState {
    gradeFees: GradeFeesData[];
    loading: boolean;
    successMessage: string;
    error: null | string;
}
export declare const initialState: GradeFeesState;
export declare const fetchGradeFees: import("@reduxjs/toolkit").AsyncThunk<GradeFeesData[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createGradeFee: import("@reduxjs/toolkit").AsyncThunk<GradeFeesData, GradeFeesData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateGradeFee: import("@reduxjs/toolkit").AsyncThunk<{
    buss_type: string;
    grade: string;
    data: GradeFeesData;
}, {
    buss_type: string;
    grade: string;
    data: GradeFeesData;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const deleteGradeFee: import("@reduxjs/toolkit").AsyncThunk<{
    buss_type: string;
    grade: string;
}, {
    buss_type: string;
    grade: string;
}, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const setGradeFees: import("@reduxjs/toolkit").ActionCreatorWithPayload<GradeFeesData[], "gradeFees/setGradeFees">, addGradeFee: import("@reduxjs/toolkit").ActionCreatorWithPayload<GradeFeesData, "gradeFees/addGradeFee">, setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "gradeFees/setLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "gradeFees/setError">;
declare const _default: import("redux").Reducer<GradeFeesState>;
export default _default;
