export interface BusinessTypeData {
    Business_Type: string;
}
export interface BusinessTypeState {
    businessTypes: BusinessTypeData[];
    loading: boolean;
    error: string | null;
    bussTypesData: BusinessTypeData;
}
export declare const initialState: BusinessTypeState;
export declare const fetchBusinessTypes: import("@reduxjs/toolkit").AsyncThunk<BusinessTypeData[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createBusinessType: import("@reduxjs/toolkit").AsyncThunk<BusinessTypeData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateBusinessType: import("@reduxjs/toolkit").AsyncThunk<BusinessTypeData, {
    Business_Type: string;
    data: BusinessTypeData;
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
export declare const deleteBusinessType: import("@reduxjs/toolkit").AsyncThunk<BusinessTypeData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<BusinessTypeState>;
export default _default;
