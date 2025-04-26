export interface GradeRateData {
    grade: string;
    minValuex: number;
    maxValuex: number;
    rate: number;
}
export interface GradeRateState {
    gradeRates: GradeRateData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: GradeRateState;
export declare const fetchGradeRates: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createGradeRate: import("@reduxjs/toolkit").AsyncThunk<any, GradeRateData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchGradeRateById: import("@reduxjs/toolkit").AsyncThunk<any, {
    grade: string;
    minValuex: number;
    maxValuex: number;
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
export declare const updateGradeRate: import("@reduxjs/toolkit").AsyncThunk<any, {
    grade: string;
    minValuex: number;
    maxValuex: number;
    data: GradeRateData;
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
export declare const deleteGradeRate: import("@reduxjs/toolkit").AsyncThunk<any, {
    grade: string;
    minValuex: number;
    maxValuex: number;
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
export declare const setGradeRates: import("@reduxjs/toolkit").ActionCreatorWithPayload<GradeRateData[], "gradeRate/setGradeRates">, clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"gradeRate/clearError">;
declare const _default: import("redux").Reducer<GradeRateState>;
export default _default;
