export interface CollectorElectoralArea {
    officer_no: string;
    electoralarea: string;
}
export interface CollectorElectoralAreaState {
    areas: CollectorElectoralArea[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: CollectorElectoralAreaState;
export declare const fetchCollectorElectoralAreas: import("@reduxjs/toolkit").AsyncThunk<CollectorElectoralArea, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createCollectorElectoralArea: import("@reduxjs/toolkit").AsyncThunk<CollectorElectoralArea, CollectorElectoralArea, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateCollectorElectoralArea: import("@reduxjs/toolkit").AsyncThunk<CollectorElectoralArea, {
    officer_no: string;
    electoralarea: string;
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
export declare const deleteCollectorElectoralArea: import("@reduxjs/toolkit").AsyncThunk<string, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const collectorElectoralAreaReducer: import("redux").Reducer<CollectorElectoralAreaState>;
