export interface OfficerData {
    officer_no: string;
    officer_name: string;
    photo: string;
}
export interface CreateOfficerSuccess {
    message: string;
}
export interface CreateOfficerError {
    message: string;
}
export type CreateOfficerReturnType = CreateOfficerSuccess | CreateOfficerError;
export interface OfficerState {
    officers: OfficerData[];
    loading: boolean;
    error: string | null;
    currentOfficer: OfficerData | null;
    message: string | null;
}
export declare const initialState: OfficerState;
export declare const fetchOfficers: import("@reduxjs/toolkit").AsyncThunk<OfficerData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchOfficerById: import("@reduxjs/toolkit").AsyncThunk<OfficerData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createOfficer: import("@reduxjs/toolkit").AsyncThunk<CreateOfficerReturnType, OfficerData, {
    rejectValue: CreateOfficerError;
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction> | undefined;
    extra?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateOfficer: import("@reduxjs/toolkit").AsyncThunk<OfficerData, {
    officer_no: string;
    officerData: OfficerData;
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
export declare const deleteOfficer: import("@reduxjs/toolkit").AsyncThunk<OfficerData, string, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
declare const _default: import("redux").Reducer<OfficerState>;
export default _default;
