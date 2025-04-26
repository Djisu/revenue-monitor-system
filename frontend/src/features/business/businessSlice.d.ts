export interface BusinessData {
    buss_no: number;
    buss_name?: string;
    buss_address?: string;
    buss_type?: string;
    buss_town?: string;
    buss_permitNo?: string;
    street_name?: string;
    landmark?: string;
    electroral_area?: string;
    property_class?: string;
    tot_grade?: string;
    ceo?: string;
    telno?: string;
    strategiclocation?: number;
    productvariety?: number;
    businesspopularity?: number;
    businessenvironment?: number;
    sizeofbusiness?: number;
    numberofworkingdays?: number;
    businessoperatingperiod?: number;
    competitorsavailable?: number;
    assessmentby?: string;
    transdate?: Date;
    balance?: number;
    status?: string;
    current_rate?: number;
    property_rate?: number;
    totalmarks?: number;
    emailaddress?: string;
    noofemployees?: number;
    noofbranches?: number;
    BALANCENEW?: number;
    gps_address?: string;
    serialNo?: number;
    buss_location?: string;
}
export interface BusinessState {
    businesses: BusinessData[];
    loading: boolean;
    successMessage: string;
    error: string | null;
    message: string;
}
export declare const initialState: BusinessState;
export declare const fetchBusinesses: import("@reduxjs/toolkit").AsyncThunk<any[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchLastBussNo: import("@reduxjs/toolkit").AsyncThunk<any, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const processOperatingPermits: import("@reduxjs/toolkit").AsyncThunk<any, {
    electoralArea: string;
    fiscalYear: number;
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
export declare const createBusiness: import("@reduxjs/toolkit").AsyncThunk<any[], BusinessData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusinessById: import("@reduxjs/toolkit").AsyncThunk<any, number, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchBusinessByName: import("@reduxjs/toolkit").AsyncThunk<any[], string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateBusiness: import("@reduxjs/toolkit").AsyncThunk<any, {
    buss_no: number;
    data: BusinessData;
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
export declare const deleteBusiness: import("@reduxjs/toolkit").AsyncThunk<any, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const setGradeFees: import("@reduxjs/toolkit").ActionCreatorWithPayload<BusinessData[], "business/setGradeFees">, addGradeFee: import("@reduxjs/toolkit").ActionCreatorWithPayload<BusinessData, "business/addGradeFee">, setLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "business/setLoading">, setError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "business/setError">;
declare const _default: import("redux").Reducer<BusinessState>;
export default _default;
