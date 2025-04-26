export interface PropertyRateData {
    property_class: string;
    fiscalyear: number;
    rate: number;
    registrationrate: number;
}
export interface PropertyRateState {
    rates: PropertyRateData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: PropertyRateState;
export declare const fetchPropertyRates: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchPropertyRateByPropertyClassAndFiscalyear: import("@reduxjs/toolkit").AsyncThunk<any, {
    property_Class: string;
    fiscalyear: number;
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
export declare const createPropertyRate: import("@reduxjs/toolkit").AsyncThunk<any, PropertyRateData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updatePropertyRate: import("@reduxjs/toolkit").AsyncThunk<any, {
    property_Class: string;
    fiscalyear: number;
    propertyRateData: PropertyRateData;
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
export declare const deletePropertyRate: import("@reduxjs/toolkit").AsyncThunk<any, {
    property_Class: string;
    fiscalyear: number;
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
declare const _default: import("redux").Reducer<PropertyRateState>;
export default _default;
