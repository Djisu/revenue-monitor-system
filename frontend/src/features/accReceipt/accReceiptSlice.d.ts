export interface AccReceiptData {
    fiscalyear: number;
    batchno: string;
    firstno: number;
    lastno: number;
}
export interface AccReceiptState {
    accReceipts: AccReceiptData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: AccReceiptState;
export declare const fetchAccReceipts: import("@reduxjs/toolkit").AsyncThunk<AccReceiptData[], void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const createAccReceipt: import("@reduxjs/toolkit").AsyncThunk<AccReceiptData, AccReceiptData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchAccReceiptById: import("@reduxjs/toolkit").AsyncThunk<AccReceiptData, {
    batchno: string;
    fiscalyear: string;
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
export declare const updateAccReceipt: import("@reduxjs/toolkit").AsyncThunk<AccReceiptData, {
    batchno: string;
    data: AccReceiptData;
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
export declare const deleteAccReceipt: import("@reduxjs/toolkit").AsyncThunk<AccReceiptData, {
    batchno: string;
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
declare const _default: import("redux").Reducer<AccReceiptState>;
export default _default;
