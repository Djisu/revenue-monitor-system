export interface PropertyCollectorElectoralareaData {
    officer_no: string;
    electoralarea: string;
}
export interface PropertyCollectorElectoralareaState {
    records: PropertyCollectorElectoralareaData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: PropertyCollectorElectoralareaState;
export declare const fetchPropertyCollectorElectoralAreas: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchPropertyCollectorElectoralAreaById: import("@reduxjs/toolkit").AsyncThunk<any, {
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
export declare const createPropertyCollectorElectoralArea: import("@reduxjs/toolkit").AsyncThunk<any, PropertyCollectorElectoralareaData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updatePropertyCollectorElectoralArea: import("@reduxjs/toolkit").AsyncThunk<any, {
    officer_no: string;
    electoralarea: string;
    propertyCollectorData: PropertyCollectorElectoralareaData;
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
export declare const deletePropertyCollectorElectoralArea: import("@reduxjs/toolkit").AsyncThunk<any, {
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
declare const _default: import("redux").Reducer<PropertyCollectorElectoralareaState>;
export default _default;
