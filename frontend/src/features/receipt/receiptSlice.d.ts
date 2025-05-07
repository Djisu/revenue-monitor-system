export interface ReceiptData {
    buss_no: string;
    receiptno: string;
    description: string;
    transdate: Date;
    amount: number;
    buss_name: string;
}
export interface ReceiptState {
    receipts: ReceiptData[];
    loading: boolean;
    error: string | null;
}
export declare const initialState: ReceiptState;
export declare const fetchReceipts: import("@reduxjs/toolkit").AsyncThunk<ReceiptData, void, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const fetchReceiptById: import("@reduxjs/toolkit").AsyncThunk<ReceiptData, {
    buss_no: string;
    receiptno: string;
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
export declare const createReceipt: import("@reduxjs/toolkit").AsyncThunk<ReceiptData, ReceiptData, {
    state?: unknown;
    dispatch?: import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const updateReceipt: import("@reduxjs/toolkit").AsyncThunk<ReceiptData, {
    buss_no: string;
    receiptno: string;
    receiptData: ReceiptData;
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
export declare const deleteReceipt: import("@reduxjs/toolkit").AsyncThunk<ReceiptData, {
    buss_no: string;
    receiptno: string;
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
declare const _default: import("redux").Reducer<ReceiptState>;
export default _default;
